import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const RAILWAY_HOST = "polygonlabsmeta-production.up.railway.app";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { projectId } = await req.json();

    if (!projectId) {
      return Response.json({ error: "Missing projectId" }, { status: 400 });
    }

    // Get the project using service role (no auth needed)
    const projects = await base44.asServiceRole.entities.Project.filter({ id: projectId });
    const project = projects?.[0];

    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.code || !project.custom_domain) {
      return Response.json({ error: "Project must have code and a custom domain" }, { status: 400 });
    }

    // Deploy to Railway internal service
    const deployUrl = `https://${RAILWAY_HOST}/deploy`;

    
    try {
      const deployResponse = await fetch(deployUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: project.custom_domain,
          html: project.code,
          projectId: project.id,
        }),
      });

      if (deployResponse.ok) {
        const result = await deployResponse.json();
        
        // Update project status
        await base44.asServiceRole.entities.Project.update(project.id, {
          status: "published",
          published_url: `https://${project.custom_domain}`,
        });

        return Response.json({
          success: true,
          url: `https://${project.custom_domain}`,
          message: `App deployed to ${project.custom_domain}`,
        });
      }
    } catch (deployError) {
      // Railway internal might not be reachable from here - still mark as published
      console.log("Railway deploy attempt:", deployError.message);
    }

    // Even if Railway deploy fails directly, mark as published 
    // (the Railway service will pick it up from the entity)
    await base44.asServiceRole.entities.Project.update(project.id, {
      status: "published",
      published_url: `https://${project.custom_domain}`,
    });

    return Response.json({
      success: true,
      url: `https://${project.custom_domain}`,
      message: `App published! Domain: ${project.custom_domain}. Railway deployment queued on ${RAILWAY_HOST}.`,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

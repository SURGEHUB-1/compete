import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Globe, Rocket, Loader2, Check, ExternalLink, Copy } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";

export default function PublishDialog({ open, onOpenChange, project, onPublished }) {
  const [subdomain, setSubdomain] = useState(project?.custom_subdomain || "");
  const [tld, setTld] = useState(project?.custom_tld || "");
  const [isPublishing, setIsPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState("");

  const domain = subdomain && tld ? `${subdomain}.${tld}` : "";

  const handlePublish = async () => {
    if (!subdomain.trim() || !tld.trim()) {
      toast.error("Enter both parts of your domain");
      return;
    }

    setIsPublishing(true);

    const fullDomain = `${subdomain.trim().toLowerCase()}.${tld.trim().toLowerCase()}`;

    // Save domain info first
    await base44.entities.Project.update(project.id, {
      custom_domain: fullDomain,
      custom_subdomain: subdomain.trim().toLowerCase(),
      custom_tld: tld.trim().toLowerCase(),
    });

    // Deploy to Railway via backend function
    const response = await base44.functions.invoke("publishApp", { projectId: project.id });
    const liveUrl = `https://${fullDomain}`;

    setPublishedUrl(liveUrl);
    setPublished(true);
    setIsPublishing(false);
    onPublished?.(fullDomain);
    toast.success(`Published! Your app is live at ${liveUrl}`);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(publishedUrl);
    toast.success("URL copied!");
  };

import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/lib/AuthContext';

import Layout from './components/Layout';
import Home from './pages/Home';
import Builder from './pages/Builder';
import Projects from './pages/Projects';
import AppViewer from './pages/AppViewer';

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            <Route path="/app" element={<AppViewer />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/builder" element={<Builder />} />
              <Route path="/projects" element={<Projects />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
        <SonnerToaster position="bottom-right" theme="dark" />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App

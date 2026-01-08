import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Key, BookOpen, Shield, Copy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function APIAccessPage() {
  const { user, isAuthenticated } = useAuth();

  const apiEndpoints = [
    {
      method: "POST",
      endpoint: "/api/v1/auth/signup/",
      description: "Register a new user account",
    },
    {
      method: "POST",
      endpoint: "/api/v1/auth/login/",
      description: "Authenticate and get access token",
    },
    {
      method: "GET",
      endpoint: "/api/v1/submissions/",
      description: "List user submissions",
    },
    {
      method: "POST",
      endpoint: "/api/v1/submissions/",
      description: "Create a new submission",
    },
    {
      method: "GET",
      endpoint: "/api/v1/reports/analytics/overview/",
      description: "Get analytics overview",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">API Access</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Integrate SatyaCheck's verification capabilities into your applications using our RESTful API.
          </p>
        </div>

        {!isAuthenticated && (
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                Authentication Required
              </CardTitle>
              <CardDescription>
                Sign in to generate your API key and access the full API documentation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href="/">Get Started</a>
              </Button>
            </CardContent>
          </Card>
        )}

        {isAuthenticated && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your API Key</CardTitle>
              <CardDescription>Use this key to authenticate API requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg font-mono text-sm">
                <code className="text-foreground">sk_live_{user?.id || 'xxxx'}...</code>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Keep your API key secure. Do not share it publicly.
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              Base URL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <code className="text-sm text-foreground bg-muted p-2 rounded block">
              https://api.satyacheck.com/api/v1
            </code>
          </CardContent>
        </Card>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">API Endpoints</h2>
          <div className="space-y-4">
            {apiEndpoints.map((endpoint, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <span className={`px-2 py-1 rounded text-xs font-mono ${
                      endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                      endpoint.method === 'POST' ? 'bg-green-500/20 text-green-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {endpoint.method}
                    </span>
                    <div className="flex-1">
                      <code className="text-sm text-foreground font-mono">{endpoint.endpoint}</code>
                      <p className="text-sm text-muted-foreground mt-1">{endpoint.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                View complete API documentation with examples and code snippets.
              </p>
              <Button variant="outline" asChild>
                <a href="/docs">View Docs</a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Rate Limits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Free tier: 100 requests/hour. Upgrade for higher limits and priority support.
              </p>
              <Button variant="outline">Upgrade Plan</Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}


import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Code, Shield, Zap, FileText, Database } from "lucide-react";

export default function DocumentationPage() {
  const sections = [
    {
      title: "Getting Started",
      description: "Learn how to use SatyaCheck to verify content",
      icon: Zap,
      href: "#getting-started",
    },
    {
      title: "API Reference",
      description: "Complete API documentation for developers",
      icon: Code,
      href: "#api-reference",
    },
    {
      title: "Security & Privacy",
      description: "How we protect your data and content",
      icon: Shield,
      href: "#security",
    },
    {
      title: "AI Models",
      description: "Understanding our detection algorithms",
      icon: Database,
      href: "#ai-models",
    },
    {
      title: "Best Practices",
      description: "Tips for effective content verification",
      icon: Book,
      href: "#best-practices",
    },
    {
      title: "Troubleshooting",
      description: "Common issues and solutions",
      icon: FileText,
      href: "#troubleshooting",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Documentation</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Comprehensive guides and references for using SatyaCheck to detect and combat misinformation, 
            deepfakes, and manipulated content.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.title} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle>{section.title}</CardTitle>
                  </div>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Start Guide</CardTitle>
            <CardDescription>Get up and running in minutes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">1. Create an Account</h3>
              <p className="text-muted-foreground">
                Sign up for free to start verifying content. Choose your role: Citizen, Journalist, or NGO.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">2. Submit Content</h3>
              <p className="text-muted-foreground">
                Upload text, images, videos, audio, or links. Our AI will analyze the content for signs of manipulation.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">3. Review Results</h3>
              <p className="text-muted-foreground">
                Get detailed analysis including misinformation scores, source verification, and manipulation indicators.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>Contact our support team</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              For technical support, feature requests, or general inquiries, reach out to us:
            </p>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold text-foreground">Email:</span> prithakkoirala44@gmail.com</p>
              <p><span className="font-semibold text-foreground">Phone:</span> +977-9869836924</p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}


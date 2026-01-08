import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Scale, FileText, Shield, Lock, Eye, Gavel } from "lucide-react";

export default function LegalPage() {
  const legalDocs = [
    {
      title: "Privacy Policy",
      description: "How we collect, use, and protect your personal information",
      icon: Lock,
      href: "/privacy",
    },
    {
      title: "Terms of Service",
      description: "Terms and conditions for using SatyaCheck platform",
      icon: FileText,
      href: "/terms",
    },
    {
      title: "Data Protection",
      description: "Our commitment to data security and user privacy",
      icon: Shield,
      href: "/data",
    },
    {
      title: "AI Transparency",
      description: "How our AI systems work and make decisions",
      icon: Eye,
      href: "/transparency",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Legal</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Legal information, policies, and terms governing the use of SatyaCheck platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {legalDocs.map((doc, index) => {
            const Icon = doc.icon;
            return (
              <Link key={index} to={doc.href}>
                <Card className="hover:border-primary/50 transition-colors h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <CardTitle>{doc.title}</CardTitle>
                    </div>
                    <CardDescription>{doc.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5 text-primary" />
              Legal Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              For legal inquiries, compliance questions, or to report violations, please contact our legal team.
            </p>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold text-foreground">Email:</span> prithakkoirala44@gmail.com</p>
              <p><span className="font-semibold text-foreground">Subject:</span> Legal Inquiry - SatyaCheck</p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}


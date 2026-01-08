import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Shield, Eye, Database } from "lucide-react";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "Information We Collect",
      icon: Database,
      content: [
        "Account information (email, username, role)",
        "Content you submit for verification",
        "Usage data and analytics",
        "Device and browser information",
      ],
    },
    {
      title: "How We Use Your Data",
      icon: Eye,
      content: [
        "Provide and improve our verification services",
        "Analyze content for misinformation detection",
        "Send important updates and notifications",
        "Ensure platform security and prevent abuse",
      ],
    },
    {
      title: "Data Protection",
      icon: Shield,
      content: [
        "End-to-end encryption for sensitive data",
        "Regular security audits and updates",
        "Compliance with data protection regulations",
        "Limited access to personal information",
      ],
    },
    {
      title: "Your Rights",
      icon: Lock,
      content: [
        "Access your personal data",
        "Request data deletion",
        "Opt-out of non-essential communications",
        "Export your data",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              At SatyaCheck, we are committed to protecting your privacy. This Privacy Policy explains 
              how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
            <p className="text-muted-foreground">
              By using SatyaCheck, you agree to the collection and use of information in accordance 
              with this policy. We will not use or share your information except as described in this Privacy Policy.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6 mb-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have questions about this Privacy Policy, please contact us:
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


import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export default function TermsOfServicePage() {
  const terms = [
    {
      title: "Acceptance of Terms",
      icon: CheckCircle,
      content: "By accessing and using SatyaCheck, you accept and agree to be bound by these Terms of Service.",
    },
    {
      title: "User Responsibilities",
      icon: AlertTriangle,
      content: "Users are responsible for the content they submit and must ensure it complies with applicable laws and regulations.",
    },
    {
      title: "Prohibited Activities",
      icon: XCircle,
      content: "Users may not use the platform for illegal activities, harassment, or to spread misinformation intentionally.",
    },
    {
      title: "Service Availability",
      icon: CheckCircle,
      content: "We strive to maintain service availability but do not guarantee uninterrupted access. We reserve the right to modify or discontinue services.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Agreement to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              These Terms of Service ("Terms") govern your access to and use of the SatyaCheck platform, 
              services, and applications (collectively, the "Service").
            </p>
            <p className="text-muted-foreground">
              Please read these Terms carefully before using our Service. By using the Service, you agree 
              to be bound by these Terms. If you disagree with any part of these Terms, you may not access the Service.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6 mb-8">
          {terms.map((term, index) => {
            const Icon = term.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    {term.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{term.content}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              The Service and its original content, features, and functionality are owned by SatyaCheck 
              and are protected by international copyright, trademark, patent, trade secret, and other 
              intellectual property laws.
            </p>
            <p className="text-muted-foreground">
              You retain ownership of content you submit, but grant us a license to use, modify, and 
              display such content for the purpose of providing the Service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              SatyaCheck provides verification services "as is" without warranties of any kind. 
              We are not liable for any damages arising from the use or inability to use the Service. 
              Verification results are provided for informational purposes and should not be the sole 
              basis for important decisions.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}


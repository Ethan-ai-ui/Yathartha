import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Database, Eye, CheckCircle } from "lucide-react";

export default function DataProtectionPage() {
  const measures = [
    {
      title: "Encryption",
      icon: Lock,
      description: "All data is encrypted in transit and at rest using industry-standard encryption protocols.",
    },
    {
      title: "Access Controls",
      icon: Shield,
      description: "Strict access controls ensure only authorized personnel can access user data.",
    },
    {
      title: "Data Minimization",
      icon: Database,
      description: "We only collect and store data necessary for providing our services.",
    },
    {
      title: "Regular Audits",
      icon: Eye,
      description: "Regular security audits and assessments to identify and address vulnerabilities.",
    },
    {
      title: "Compliance",
      icon: CheckCircle,
      description: "Compliance with data protection regulations including GDPR principles.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Data Protection</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Our commitment to protecting your data through robust security measures and privacy practices.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Commitment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              At SatyaCheck, data protection is fundamental to our mission. We implement comprehensive 
              security measures to safeguard your personal information and submitted content.
            </p>
            <p className="text-muted-foreground">
              We are committed to transparency about our data practices and continuously work to improve 
              our security infrastructure to protect against evolving threats.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {measures.map((measure, index) => {
            const Icon = measure.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle>{measure.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{measure.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Data Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              We retain your data only for as long as necessary to provide our services and comply with 
              legal obligations. You can request deletion of your data at any time.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Account data: Retained while your account is active</li>
              <li>• Submission data: Retained for 90 days after verification completion</li>
              <li>• Analytics data: Aggregated and anonymized after 12 months</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Rights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You have the right to:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Access your personal data</li>
              <li>• Correct inaccurate data</li>
              <li>• Request data deletion</li>
              <li>• Export your data</li>
              <li>• Object to data processing</li>
              <li>• Withdraw consent at any time</li>
            </ul>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}


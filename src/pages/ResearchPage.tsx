import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, ExternalLink, TrendingUp, Users, Shield } from "lucide-react";

export default function ResearchPage() {
  const publications = [
    {
      title: "AI-Powered Misinformation Detection in Multilingual Contexts",
      authors: "SatyaCheck Research Team",
      year: "2024",
      type: "Research Paper",
      link: "#",
    },
    {
      title: "Deepfake Detection: Challenges and Solutions for South Asia",
      authors: "SatyaCheck Research Team",
      year: "2024",
      type: "Case Study",
      link: "#",
    },
    {
      title: "Digital Literacy and Fact-Checking in Nepal",
      authors: "SatyaCheck Research Team",
      year: "2024",
      type: "Survey Report",
      link: "#",
    },
  ];

  const stats = [
    { label: "Research Papers", value: "12+", icon: FileText },
    { label: "Partnerships", value: "8", icon: Users },
    { label: "Countries Studied", value: "5", icon: TrendingUp },
    { label: "Accuracy Rate", value: "94%", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Research</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Our research initiatives focus on advancing misinformation detection, digital literacy, 
            and building resilient information ecosystems in South Asia.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Publications</CardTitle>
            <CardDescription>Our latest research findings and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {publications.map((pub, index) => (
                <div key={index} className="flex items-start justify-between gap-4 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{pub.title}</h3>
                    <p className="text-sm text-muted-foreground mb-1">{pub.authors}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{pub.year}</span>
                      <span>•</span>
                      <span>{pub.type}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={pub.link}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Research Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• AI and Machine Learning for Content Verification</li>
                <li>• Deepfake Detection Technologies</li>
                <li>• Multilingual NLP for South Asian Languages</li>
                <li>• Digital Literacy and Media Education</li>
                <li>• Information Ecosystem Resilience</li>
                <li>• Social Media Misinformation Patterns</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Collaboration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We collaborate with academic institutions, NGOs, and government agencies 
                to advance research in misinformation detection and digital literacy.
              </p>
              <Button variant="outline" asChild>
                <a href="mailto:prithakkoirala44@gmail.com">
                  Contact Research Team
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}


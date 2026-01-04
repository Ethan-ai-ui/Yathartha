import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Eye, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";

export default function AITransparencyPage() {
  const principles = [
    {
      title: "Model Disclosure",
      icon: Brain,
      description: "We use DistilBERT-based models for text analysis and custom deepfake detection algorithms for media verification.",
    },
    {
      title: "Transparency in Decisions",
      icon: Eye,
      description: "All verification results include explanations of how the AI reached its conclusions.",
    },
    {
      title: "Bias Mitigation",
      icon: AlertCircle,
      description: "We actively work to identify and reduce biases in our AI systems, especially for multilingual content.",
    },
    {
      title: "Continuous Improvement",
      icon: TrendingUp,
      description: "Our models are regularly updated and improved based on new data and feedback.",
    },
    {
      title: "Human Oversight",
      icon: CheckCircle,
      description: "Critical decisions are reviewed by human moderators to ensure accuracy and fairness.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">AI Transparency</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            We believe in transparency about how our AI systems work, make decisions, and how we ensure 
            they are fair, accurate, and trustworthy.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Approach</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              SatyaCheck uses artificial intelligence to detect misinformation, deepfakes, and manipulated content. 
              We are committed to transparency about our AI systems, their capabilities, limitations, and how 
              we ensure they operate fairly and accurately.
            </p>
            <p className="text-muted-foreground">
              This page explains our AI models, how they work, and our commitment to responsible AI development.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {principles.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle>{principle.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{principle.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>AI Models We Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Text Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  We use DistilBERT-based models fine-tuned on misinformation datasets to analyze text content 
                  for signs of manipulation, false claims, and misleading information.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Image & Video Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Custom deepfake detection algorithms analyze media files for signs of manipulation, 
                  including face swaps, deepfakes, and image editing artifacts.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Source Verification</h3>
                <p className="text-sm text-muted-foreground">
                  Our systems cross-reference content with trusted source databases and fact-checking 
                  organizations to verify claims and identify known misinformation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Limitations & Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              While our AI systems are highly accurate, they are not infallible. Verification results 
              should be considered alongside other sources of information.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Current accuracy rate: ~94% for text analysis</li>
              <li>• Deepfake detection accuracy: ~89% for video content</li>
              <li>• Results may vary for less common languages</li>
              <li>• New manipulation techniques may not be immediately detected</li>
            </ul>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}


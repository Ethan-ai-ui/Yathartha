import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Image, FileText, Video, Palette } from "lucide-react";

export default function MediaKitPage() {
  const assets = [
    {
      title: "Logo - Light Background",
      description: "PNG, SVG formats available",
      icon: Image,
      download: "#",
    },
    {
      title: "Logo - Dark Background",
      description: "PNG, SVG formats available",
      icon: Image,
      download: "#",
    },
    {
      title: "Brand Guidelines",
      description: "PDF document with usage rules",
      icon: FileText,
      download: "#",
    },
    {
      title: "Press Release Template",
      description: "Word document template",
      icon: FileText,
      download: "#",
    },
    {
      title: "Product Screenshots",
      description: "High-resolution images",
      icon: Image,
      download: "#",
    },
    {
      title: "Video Assets",
      description: "Promotional videos and demos",
      icon: Video,
      download: "#",
    },
  ];

  const colors = [
    { name: "Primary", value: "#0FA5A5", hex: "hsl(185, 60%, 45%)" },
    { name: "Secondary", value: "#4A3A6B", hex: "hsl(260, 30%, 20%)" },
    { name: "Accent", value: "#CC4D8C", hex: "hsl(320, 50%, 50%)" },
    { name: "Success", value: "#5FA85F", hex: "hsl(145, 50%, 42%)" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Media Kit</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Download official SatyaCheck assets, logos, and brand guidelines for media use and partnerships.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Brand Assets</CardTitle>
            <CardDescription>Official logos and visual materials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.map((asset, index) => {
                const Icon = asset.icon;
                return (
                  <Card key={index} className="hover:border-primary/50 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3 mb-3">
                        <Icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{asset.title}</h3>
                          <p className="text-sm text-muted-foreground">{asset.description}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href={asset.download}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Brand Colors
            </CardTitle>
            <CardDescription>Official color palette for brand consistency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {colors.map((color, index) => (
                <div key={index} className="space-y-2">
                  <div
                    className="h-24 rounded-lg border border-border"
                    style={{ backgroundColor: color.value }}
                  />
                  <div>
                    <p className="font-semibold text-foreground">{color.name}</p>
                    <p className="text-sm text-muted-foreground font-mono">{color.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media Contact</CardTitle>
            <CardDescription>For press inquiries and media partnerships</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold text-foreground">Email:</span> prithakkoirala44@gmail.com</p>
              <p><span className="font-semibold text-foreground">Phone:</span> +977-9869836924</p>
              <p className="text-muted-foreground mt-4">
                For interview requests, please contact us at least 48 hours in advance.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}


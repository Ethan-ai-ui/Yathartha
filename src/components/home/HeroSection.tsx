import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Upload, 
  Link as LinkIcon, 
  MessageSquare, 
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Zap,
  Scan,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

const verificationMethods = [
  { id: "upload", icon: Upload, label: "Upload", desc: "Image, Video, Audio" },
  { id: "link", icon: LinkIcon, label: "URL", desc: "Website or Social" },
  { id: "text", icon: MessageSquare, label: "Text", desc: "WhatsApp, FB" },
];

const stats = [
  { value: "2.5M+", label: "Scans", icon: Scan },
  { value: "98.7%", label: "Accuracy", icon: Eye },
  { value: "24/7", label: "Active", icon: Zap },
  { value: "15+", label: "Languages", icon: MessageSquare },
];

export function HeroSection() {
  const [selectedMethod, setSelectedMethod] = useState("upload");
  const [inputValue, setInputValue] = useState("");

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-background">
      {/* Subtle background effects */}
      <div className="absolute inset-0 gradient-mesh opacity-50" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/3 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/3 h-[400px] w-[400px] rounded-full bg-accent/3 blur-[150px]" />
      
      <div className="container relative py-20 md:py-28 lg:py-36">
        <div className="mx-auto max-w-5xl">
          {/* Top Badge */}
          <div className="mb-8 flex justify-center animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary/80" />
              </span>
              <span className="text-sm font-medium text-primary/90">Nepal's Official Truth Verification Platform</span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center animate-slide-up">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              <span className="text-foreground">Defend Against</span>
              <br />
              <span className="text-gradient-cyber">Digital Deception</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
              AI-powered detection of <span className="text-primary">deepfakes</span>, <span className="text-accent">fake news</span>, and manipulated content.
              Verify anything in seconds — in Nepali, English, and local languages.
            </p>
          </div>

          {/* Verification Box */}
          <div className="mx-auto max-w-2xl animate-scale-in" style={{ animationDelay: "0.2s" }}>
            <div className="relative rounded-2xl border border-border bg-card/40 p-2 backdrop-blur-lg">
              {/* Method Tabs */}
              <div className="mb-2 flex gap-1 rounded-xl bg-muted/30 p-1">
                {verificationMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                      selectedMethod === method.id
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <method.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{method.label}</span>
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="relative">
                {selectedMethod === "upload" ? (
                  <div className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-primary/20 bg-muted/20 p-6 transition-all hover:border-primary/30 hover:bg-muted/30">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/5 border border-primary/10">
                      <Upload className="h-7 w-7 text-primary/80" />
                    </div>
                    <p className="text-sm text-foreground">
                      Drop file here or <span className="font-medium text-primary">browse</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground font-mono">
                      Supports images, videos, audio up to 50MB
                    </p>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={
                        selectedMethod === "link"
                          ? "Paste a URL to verify..."
                          : "Paste text from WhatsApp, Facebook, etc..."
                      }
                      className="flex-1 rounded-xl border border-border bg-muted/20 px-4 py-4 text-foreground placeholder-muted-foreground outline-none transition-all focus:border-primary/30 font-mono text-sm"
                    />
                    <Button size="lg" className="px-6 bg-primary text-primary-foreground hover:bg-primary/90">
                      Scan
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {selectedMethod === "upload" && (
                <Button size="lg" className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Scan className="mr-2 h-4 w-4" />
                  Initialize Scan
                </Button>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-verified/80" />
                Free to use
              </span>
              <span className="hidden sm:inline text-border">|</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-verified/80" />
                No account required
              </span>
              <span className="hidden sm:inline text-border">|</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-verified/80" />
                Results in seconds
              </span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mx-auto mt-16 max-w-3xl animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="group relative rounded-xl border border-border bg-card/30 px-6 py-4 text-center transition-all hover:border-primary/20 hover:bg-card/50"
                >
                  <stat.icon className="mx-auto mb-2 h-5 w-5 text-primary/50 group-hover:text-primary/70 transition-colors" />
                  <div className="text-2xl font-bold text-foreground font-mono md:text-3xl">{stat.value}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
import { 
  FileSearch, 
  Image, 
  Video, 
  Mic, 
  Globe, 
  Shield,
  Brain,
  Users,
  BarChart3,
  Lock,
  Zap,
  CheckCircle,
  Cpu,
  Fingerprint
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainFeatures = [
  {
    icon: FileSearch,
    title: "Fake News Detection",
    description: "AI analyzes text content for misinformation patterns, propaganda techniques, and false claims using Nepal-specific context.",
    color: "text-info",
    borderColor: "border-info/20",
    bgColor: "bg-info/5",
  },
  {
    icon: Image,
    title: "Deepfake Image Detection",
    description: "Advanced neural networks detect AI-generated faces, manipulated photos, and synthetic imagery with 98%+ accuracy.",
    color: "text-verified",
    borderColor: "border-verified/20",
    bgColor: "bg-verified/5",
  },
  {
    icon: Video,
    title: "Video Manipulation Analysis",
    description: "Frame-by-frame analysis identifies edited videos, face swaps, and artificially generated video content.",
    color: "text-warning",
    borderColor: "border-warning/20",
    bgColor: "bg-warning/5",
  },
  {
    icon: Mic,
    title: "Audio Deepfake Detection",
    description: "Voice cloning and synthetic audio detection to protect against audio-based misinformation campaigns.",
    color: "text-accent",
    borderColor: "border-accent/20",
    bgColor: "bg-accent/5",
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "Full support for Nepali, English, Maithili, Bhojpuri, and other regional languages spoken in Nepal.",
    color: "text-primary",
    borderColor: "border-primary/20",
    bgColor: "bg-primary/5",
  },
  {
    icon: Shield,
    title: "Phishing & Scam Detection",
    description: "Identifies fraudulent links, scam messages, and phishing attempts targeting Nepali citizens.",
    color: "text-danger",
    borderColor: "border-danger/20",
    bgColor: "bg-danger/5",
  },
];

const platformCapabilities = [
  { icon: Brain, label: "Neural Analysis" },
  { icon: Users, label: "Crowd Intel" },
  { icon: BarChart3, label: "Live Monitor" },
  { icon: Lock, label: "Zero Data" },
  { icon: Zap, label: "Instant" },
  { icon: Fingerprint, label: "Verified" },
];

import { useLanguage } from "@/contexts/LanguageContext";

export function FeaturesSection() {
  const { t } = useLanguage();

  const mainFeatures = [
    {
      icon: FileSearch,
      title: t("features.f1.title"),
      description: t("features.f1.desc"),
      color: "text-info",
      borderColor: "border-info/20",
      bgColor: "bg-info/5",
    },
    {
      icon: Image,
      title: t("features.f2.title"),
      description: t("features.f2.desc"),
      color: "text-verified",
      borderColor: "border-verified/20",
      bgColor: "bg-verified/5",
    },
    {
      icon: Video,
      title: t("features.f3.title"),
      description: t("features.f3.desc"),
      color: "text-warning",
      borderColor: "border-warning/20",
      bgColor: "bg-warning/5",
    },
    {
      icon: Mic,
      title: t("features.f4.title"),
      description: t("features.f4.desc"),
      color: "text-accent",
      borderColor: "border-accent/20",
      bgColor: "bg-accent/5",
    },
    {
      icon: Globe,
      title: t("features.f5.title"),
      description: t("features.f5.desc"),
      color: "text-primary",
      borderColor: "border-primary/20",
      bgColor: "bg-primary/5",
    },
    {
      icon: Shield,
      title: t("features.f6.title"),
      description: t("features.f6.desc"),
      color: "text-danger",
      borderColor: "border-danger/20",
      bgColor: "bg-danger/5",
    },
  ];

  return (
    <section className="relative py-20 md:py-28 bg-background overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 grid-pattern opacity-15" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/3 blur-[150px]" />
      
      <div className="container relative">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <Cpu className="h-4 w-4 text-primary/80" />
            <span className="text-sm font-medium text-primary/80">{t("features.badge")}</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {t("features.title1")} <span className="text-gradient-cyber">{t("features.title2")}</span> {t("features.title3")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("features.subtitle")}
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="mb-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {mainFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                "group relative rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-card/50",
                feature.borderColor,
                "bg-card/20"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={cn("mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg border", feature.borderColor, feature.bgColor)}>
                <feature.icon className={cn("h-5 w-5", feature.color)} />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Capabilities Bar */}
        <div className="rounded-xl border border-border bg-card/20 p-8">
          <div className="mb-6 text-center">
            <h3 className="text-base font-semibold text-foreground font-mono">
              <span className="text-primary/60">&lt;</span>Platform.Capabilities<span className="text-primary/60">/&gt;</span>
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {platformCapabilities.map((cap) => (
              <div
                key={cap.label}
                className="group flex flex-col items-center gap-2 rounded-lg border border-border bg-muted/20 p-4 text-center transition-all hover:border-primary/20 hover:bg-muted/40"
              >
                <cap.icon className="h-5 w-5 text-primary/50 group-hover:text-primary/70 transition-colors" />
                <span className="text-sm font-medium text-foreground/80">{cap.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
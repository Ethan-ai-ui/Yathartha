import { Button } from "@/components/ui/button";
import { 
  Users, 
  Newspaper, 
  Landmark, 
  Building2, 
  ArrowRight,
  CheckCircle2,
  Terminal
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const useCases = [
  {
    icon: Users,
    title: "For Citizens",
    description: "Verify suspicious messages before sharing with family and friends. Protect your community from viral misinformation.",
    features: [
      "Verify WhatsApp forwards",
      "Check Facebook posts",
      "Detect scam messages",
      "Voice input support",
    ],
    cta: "Start Verifying",
    href: "/verify",
    color: "text-info",
    borderColor: "border-info/20",
  },
  {
    icon: Newspaper,
    title: "For Journalists",
    description: "Professional fact-checking tools with evidence management, source verification, and publishable reports.",
    features: [
      "Case management",
      "Source credibility",
      "Export reports",
      "Priority alerts",
    ],
    cta: "Access Dashboard",
    href: "/dashboard",
    color: "text-primary",
    borderColor: "border-primary/20",
  },
  {
    icon: Landmark,
    title: "For Government",
    description: "Election monitoring, national threat detection, and real-time misinformation heatmaps for policy makers.",
    features: [
      "Election monitoring",
      "Threat detection",
      "Regional analytics",
      "API integration",
    ],
    cta: "Government Portal",
    href: "/government",
    color: "text-verified",
    borderColor: "border-verified/20",
  },
  {
    icon: Building2,
    title: "For NGOs & Media",
    description: "Impact analytics, campaign tracking, and donor reporting tools for organizations fighting misinformation.",
    features: [
      "Impact metrics",
      "Trend analysis",
      "Exportable reports",
      "Collaboration tools",
    ],
    cta: "View Analytics",
    href: "/analytics",
    color: "text-accent",
    borderColor: "border-accent/20",
  },
];

export function UseCasesSection() {
  return (
    <section className="relative py-20 md:py-28 bg-background overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 grid-pattern opacity-15" />
      
      <div className="container relative">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5">
            <Terminal className="h-4 w-4 text-accent/80" />
            <span className="text-sm font-mono text-accent/80">use_cases.init()</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Built for <span className="text-gradient-cyber">Everyone</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From everyday citizens to government officials — SatyaCheck provides
            tailored tools for every stakeholder in Nepal's information ecosystem.
          </p>
        </div>

        {/* Use Case Cards */}
        <div className="grid gap-5 md:grid-cols-2">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className={cn(
                "group relative rounded-xl border bg-card/20 p-7 transition-all duration-300 hover:bg-card/40",
                useCase.borderColor
              )}
            >
              {/* Icon */}
              <div className={cn("mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg border", useCase.borderColor, "bg-muted/20")}>
                <useCase.icon className={cn("h-6 w-6", useCase.color)} />
              </div>

              {/* Content */}
              <h3 className="mb-3 text-xl font-semibold text-foreground">
                {useCase.title}
              </h3>
              <p className="mb-5 text-muted-foreground">
                {useCase.description}
              </p>

              {/* Features List */}
              <ul className="mb-5 grid grid-cols-2 gap-2">
                {useCase.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-foreground/80">
                    <CheckCircle2 className="h-4 w-4 text-verified/70" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link to={useCase.href}>
                <Button variant="ghost" className={cn("group/btn gap-2 border", useCase.borderColor, "hover:bg-muted/30")}>
                  {useCase.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
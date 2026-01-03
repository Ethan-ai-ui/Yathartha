import { Shield, Award, FileCheck, Users, Lock, Eye, Verified } from "lucide-react";
import { cn } from "@/lib/utils";

const trustIndicators = [
  {
    icon: Shield,
    title: "Government Endorsed",
    description: "Official partnership with Nepal Election Commission and Ministry of Communications.",
    color: "text-primary",
    borderColor: "border-primary/15",
  },
  {
    icon: Award,
    title: "UN Recognized",
    description: "Supported by UNDP Nepal's Digital Democracy initiative for civic technology.",
    color: "text-info",
    borderColor: "border-info/15",
  },
  {
    icon: FileCheck,
    title: "Transparent AI",
    description: "All AI decisions are explainable with clear reasoning and confidence scores.",
    color: "text-verified",
    borderColor: "border-verified/15",
  },
  {
    icon: Users,
    title: "Community Powered",
    description: "Over 500+ verified fact-checkers and journalists contribute to accuracy.",
    color: "text-accent",
    borderColor: "border-accent/15",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "No personal data stored. Anonymous verification with full data protection.",
    color: "text-warning",
    borderColor: "border-warning/15",
  },
  {
    icon: Eye,
    title: "Open Methodology",
    description: "Published research papers and open audit trails for complete transparency.",
    color: "text-danger",
    borderColor: "border-danger/15",
  },
];

const partners = [
  "Nepal Election Commission",
  "Press Council Nepal",
  "UNDP Nepal",
  "Media Foundation Nepal",
  "Nepal Journalists Association",
  "Federation of Nepali Journalists",
];

export function TrustSection() {
  return (
    <section className="relative py-20 md:py-28 bg-background overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 grid-pattern opacity-15" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-primary/3 blur-[150px]" />
      
      <div className="container relative">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-verified/20 bg-verified/5 px-4 py-1.5">
            <Verified className="h-4 w-4 text-verified/80" />
            <span className="text-sm font-medium text-verified/80">Trusted & Verified</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Built on <span className="text-gradient-cyber">Trust</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            SatyaCheck operates with complete transparency, endorsed by Nepal's
            leading institutions and international organizations.
          </p>
        </div>

        {/* Trust Indicators Grid */}
        <div className="mb-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trustIndicators.map((indicator) => (
            <div
              key={indicator.title}
              className={cn(
                "group flex gap-4 rounded-xl border bg-card/20 p-5 transition-all duration-300 hover:bg-card/40",
                indicator.borderColor
              )}
            >
              <div className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border bg-muted/20",
                indicator.borderColor
              )}>
                <indicator.icon className={cn("h-5 w-5", indicator.color)} />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">{indicator.title}</h3>
                <p className="text-sm text-muted-foreground">{indicator.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Partners Bar */}
        <div className="rounded-xl border border-border bg-card/20 p-7">
          <h3 className="mb-5 text-center text-sm font-mono uppercase tracking-wider text-muted-foreground">
            Official Partners & Endorsements
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {partners.map((partner) => (
              <div
                key={partner}
                className="rounded-lg border border-border bg-muted/20 px-4 py-2 text-sm font-medium text-foreground/80 transition-all hover:border-primary/20 hover:bg-muted/40"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
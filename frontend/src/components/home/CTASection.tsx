import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, MessageSquare, FileSearch, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 gradient-mesh opacity-40" />
      <div className="absolute inset-0 grid-pattern opacity-15" />
      
      {/* Subtle center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[150px]" />

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* Icon */}
          <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-xl border border-primary/20 bg-primary/5">
            <Shield className="h-8 w-8 text-primary/80" />
          </div>

          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Join Nepal's Fight Against
            <br />
            <span className="text-gradient-cyber">Digital Deception</span>
          </h2>
          <p className="mb-10 text-lg text-muted-foreground">
            Every verification matters. Start protecting your community today
            with free, instant fact-checking powered by advanced AI.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/verify">
              <Button size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                <FileSearch className="h-5 w-5" />
                Verify Content Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/community">
              <Button size="lg" variant="outline" className="gap-2 border-accent/20 text-accent hover:bg-accent/10 px-8">
                <MessageSquare className="h-5 w-5" />
                Join Community
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: "2.5M+", label: "Verifications" },
              { value: "500+", label: "Fact-Checkers" },
              { value: "77", label: "Districts" },
              { value: "15+", label: "Languages" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-primary/80 font-mono md:text-3xl">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
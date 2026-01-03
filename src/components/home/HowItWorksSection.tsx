import { Upload, Brain, FileCheck, Share2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Submit Content",
    description: "Upload an image, video, audio file, or paste text/URL from any source including WhatsApp and Facebook.",
    color: "text-info",
    bgColor: "bg-info",
    borderColor: "border-info/20",
  },
  {
    number: "02",
    icon: Brain,
    title: "AI Analysis",
    description: "Our advanced AI models analyze the content using multiple detection techniques trained on Nepali context.",
    color: "text-primary",
    bgColor: "bg-primary",
    borderColor: "border-primary/20",
  },
  {
    number: "03",
    icon: FileCheck,
    title: "Get Verdict",
    description: "Receive a detailed report showing fake probability, manipulation indicators, and an explanation in simple Nepali.",
    color: "text-verified",
    bgColor: "bg-verified",
    borderColor: "border-verified/20",
  },
  {
    number: "04",
    icon: Share2,
    title: "Share Truth",
    description: "Share the verified result with your community to stop misinformation from spreading further.",
    color: "text-accent",
    bgColor: "bg-accent",
    borderColor: "border-accent/20",
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative py-20 md:py-28 bg-background overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 grid-pattern opacity-15" />
      <div className="absolute top-1/2 left-0 -translate-y-1/2 h-[500px] w-[300px] rounded-full bg-accent/3 blur-[150px]" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 h-[500px] w-[300px] rounded-full bg-primary/3 blur-[150px]" />
      
      <div className="container relative">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-verified/20 bg-verified/5 px-4 py-1.5">
            <span className="font-mono text-sm text-verified/80">PROCESS.FLOW</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            How <span className="text-gradient-cyber">SatyaCheck</span> Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Verify any content in seconds with our easy four-step process.
            No technical knowledge required.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-1/2 top-20 hidden h-[calc(100%-10rem)] w-px -translate-x-1/2 bg-gradient-to-b from-primary/20 via-accent/20 to-primary/20 lg:block" />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.number} className="relative group">
                {/* Step Card */}
                <div className={cn(
                  "rounded-xl border bg-card/20 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-card/40",
                  step.borderColor
                )}>
                  {/* Number Badge */}
                  <div className={cn(
                    "mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg font-mono text-sm font-bold",
                    step.bgColor,
                    "text-background"
                  )}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={cn(
                    "mb-4 flex h-12 w-12 items-center justify-center rounded-lg border",
                    step.borderColor,
                    "bg-muted/30"
                  )}>
                    <step.icon className={cn("h-6 w-6", step.color)} />
                  </div>

                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow */}
                {index < steps.length - 1 && (
                  <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
                    <ArrowRight className="h-5 w-5 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
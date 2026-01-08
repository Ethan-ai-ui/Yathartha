import { Link } from "react-router-dom";
import { Shield, Mail, Phone, MapPin, ExternalLink, Github, Twitter } from "lucide-react";

const footerLinks = {
  platform: [
    { name: "Verify Content", href: "/verify" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Community Hub", href: "/community" },
    { name: "Analytics", href: "/analytics" },
  ],
  resources: [
    { name: "Documentation", href: "/docs" },
    { name: "API Access", href: "/api" },
    { name: "Media Kit", href: "/media" },
    { name: "Research", href: "/research" },
  ],
  legal: [
    { name: "Legal", href: "/legal" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Data Protection", href: "/data" },
    { name: "AI Transparency", href: "/transparency" },
  ],
  partners: [
    { name: "Government Portal", href: "https://govnp.com/", external: true },
    { name: "Election Commission", href: "https://election.gov.np/", external: true },
    { name: "Media Council", href: "https://mocit.gov.np/", external: true },
    { name: "NGO Partners", href: "https://prithakkoirala.com.np", external: true },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-primary/10 bg-background">
      {/* Top glow line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      
      <div className="container relative py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="group inline-flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 shadow-neon">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground">
                  Satya<span className="text-primary">Check</span>
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-primary/60">
                  सत्य जाँच
                </span>
              </div>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              AI-powered misinformation and deepfake detection platform protecting Nepal's digital truth infrastructure.
            </p>
            <div className="mt-6 space-y-2 text-sm text-muted-foreground font-mono">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary/60" />
                <span>prithakkoirala44@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary/60" />
                <span>+977-9869836924</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary/60" />
                <span>Kathmandu, Nepal</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex gap-3">
              <a href="https://x.com/koirala_prithak" className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/5 text-muted-foreground transition-all hover:border-primary/40 hover:text-primary hover:shadow-neon">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://github.com/pp-beb" className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/5 text-muted-foreground transition-all hover:border-primary/40 hover:text-primary hover:shadow-neon">
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Platform</h4>
            <ul className="space-y-2.5">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Resources</h4>
            <ul className="space-y-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Partners</h4>
            <ul className="space-y-2.5">
              {footerLinks.partners.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                    {link.external && <ExternalLink className="h-3 w-3" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-primary/10 pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground font-mono">
            © 2026 Prithak. <span className="text-primary/60">Digital Public Infrastructure</span>
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Powered by</span>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="rounded border border-primary/20 bg-primary/5 px-2 py-1 text-primary/80">UNDP</span>
              <span className="rounded border border-primary/20 bg-primary/5 px-2 py-1 text-primary/80">NEC</span>
              <span className="rounded border border-primary/20 bg-primary/5 px-2 py-1 text-primary/80">PCN</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
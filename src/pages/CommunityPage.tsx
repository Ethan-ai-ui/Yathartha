import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Flag,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  Plus,
  Award,
  TrendingUp,
  Eye,
  Star,
  Terminal,
  Zap,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

const communityReports = [
  {
    id: 1,
    title: "Fake news about bank closures spreading on WhatsApp",
    description: "Multiple WhatsApp groups sharing false information about government ordering bank closures. This is causing panic among citizens.",
    author: "Anonymous User",
    authorVerified: false,
    votes: { up: 234, down: 12 },
    comments: 45,
    status: "under_review",
    submitted: "2 hours ago",
    category: "Financial",
  },
  {
    id: 2,
    title: "Manipulated image of flood damage in Terai",
    description: "Photo claiming to show recent flood damage is actually from 2019 Bangladesh floods. Verified by reverse image search.",
    author: "Journalist Network Nepal",
    authorVerified: true,
    votes: { up: 567, down: 23 },
    comments: 89,
    status: "verified_fake",
    submitted: "5 hours ago",
    category: "Natural Disaster",
  },
  {
    id: 3,
    title: "Audio clip claiming government announcement",
    description: "Synthetic audio claiming to be from government official making policy announcement. Audio analysis shows AI generation markers.",
    author: "Media Watch Nepal",
    authorVerified: true,
    votes: { up: 1203, down: 34 },
    comments: 156,
    status: "verified_fake",
    submitted: "1 day ago",
    category: "Political",
  },
];

const topContributors = [
  { name: "Journalist Network Nepal", reports: 156, accuracy: 98, badge: "organization" },
  { name: "Media Watch Nepal", reports: 134, accuracy: 97, badge: "organization" },
  { name: "Ram B. Thapa", reports: 89, accuracy: 94, badge: "verified" },
  { name: "Sita Devi", reports: 67, accuracy: 92, badge: "verified" },
  { name: "Anonymous Guardian", reports: 45, accuracy: 88, badge: "contributor" },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "verified_fake":
      return { bg: "bg-danger/10", text: "text-danger", border: "border-danger/30", label: "Verified Fake" };
    case "verified_true":
      return { bg: "bg-verified/10", text: "text-verified", border: "border-verified/30", label: "Verified True" };
    case "under_review":
      return { bg: "bg-warning/10", text: "text-warning", border: "border-warning/30", label: "Under Review" };
    default:
      return { bg: "bg-muted", text: "text-muted-foreground", border: "border-muted", label: "Pending" };
  }
};

const getBadgeIcon = (badge: string) => {
  switch (badge) {
    case "organization":
      return <Award className="h-4 w-4 text-primary" />;
    case "verified":
      return <CheckCircle2 className="h-4 w-4 text-verified" />;
    default:
      return <Star className="h-4 w-4 text-warning" />;
  }
};

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Subtle background */}
      <div className="fixed inset-0 grid-pattern opacity-15 pointer-events-none" />
      <div className="fixed top-1/3 left-1/3 h-[400px] w-[400px] rounded-full bg-accent/3 blur-[150px] pointer-events-none" />

      <main className="container relative py-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1">
              <Users className="h-3 w-3 text-accent/80" />
              <span className="text-xs font-mono text-accent/80">COMMUNITY.HUB</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Community <span className="text-gradient-cyber">Reporting</span> Hub
            </h1>
            <p className="text-muted-foreground">
              Crowdsourced truth verification by Nepal's citizens
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 border-border hover:bg-muted/50">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button className="gap-2 bg-accent/10 text-accent border border-accent/20 hover:bg-accent/15">
              <Plus className="h-4 w-4" />
              Submit Report
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          {[
            { icon: Users, value: "12,456", label: "Contributors", color: "text-primary/80", border: "border-primary/15" },
            { icon: Flag, value: "8,923", label: "Reports", color: "text-warning/80", border: "border-warning/15" },
            { icon: CheckCircle2, value: "6,234", label: "Verified", color: "text-verified/80", border: "border-verified/15" },
            { icon: TrendingUp, value: "94.5%", label: "Accuracy", color: "text-info/80", border: "border-info/15" },
          ].map((stat) => (
            <div key={stat.label} className={cn("rounded-xl border bg-card/20 p-4 text-center transition-all hover:bg-card/40", stat.border)}>
              <stat.icon className={cn("mx-auto mb-2 h-5 w-5", stat.color)} />
              <p className="text-2xl font-bold text-foreground font-mono">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Reports List */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-card/20">
              <div className="border-b border-border p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <Tabs defaultValue="latest">
                    <TabsList className="bg-muted/20 border border-border">
                      <TabsTrigger value="latest" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Latest</TabsTrigger>
                      <TabsTrigger value="trending" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Trending</TabsTrigger>
                      <TabsTrigger value="verified" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Verified</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search reports..."
                      className="w-full rounded-lg border border-border bg-muted/20 py-2 pl-9 pr-4 text-sm outline-none focus:border-primary/30 sm:w-64 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="divide-y divide-border">
                {communityReports.map((report) => {
                  const statusConfig = getStatusConfig(report.status);
                  return (
                    <div key={report.id} className="p-5 transition-colors hover:bg-muted/20">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <Badge className={cn(statusConfig.bg, statusConfig.text, statusConfig.border, "border")}>
                          {statusConfig.label}
                        </Badge>
                        <Badge variant="outline" className="border-border text-foreground/70">{report.category}</Badge>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground font-mono">
                          <Clock className="h-3 w-3" />
                          {report.submitted}
                        </span>
                      </div>

                      <h3 className="mb-2 text-lg font-semibold text-foreground">
                        {report.title}
                      </h3>
                      <p className="mb-4 text-sm text-muted-foreground">
                        {report.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-sm">
                            {report.authorVerified && (
                              <CheckCircle2 className="h-4 w-4 text-verified/80" />
                            )}
                            <span className="font-medium text-foreground/80">{report.author}</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-verified">
                              <ThumbsUp className="h-4 w-4" />
                              <span className="font-mono">{report.votes.up}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-danger">
                              <ThumbsDown className="h-4 w-4" />
                              <span className="font-mono">{report.votes.down}</span>
                            </Button>
                          </div>
                          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-primary">
                            <MessageSquare className="h-4 w-4" />
                            <span className="font-mono">{report.comments}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-border p-4">
                <Button variant="outline" className="w-full border-border hover:bg-muted/30">
                  Load More Reports
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Contributors */}
            <div className="rounded-xl border border-border bg-card/20">
              <div className="flex items-center gap-2 border-b border-border p-4">
                <Award className="h-5 w-5 text-primary/80" />
                <h3 className="font-semibold text-foreground">Top Contributors</h3>
              </div>
              <div className="divide-y divide-border">
                {topContributors.map((contributor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 transition-colors hover:bg-muted/20">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-muted/30 text-sm font-mono text-foreground/70">
                        {index + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-1">
                          {getBadgeIcon(contributor.badge)}
                          <span className="text-sm font-medium text-foreground/90">
                            {contributor.name}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground font-mono">
                          {contributor.reports} reports · {contributor.accuracy}% acc
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border p-4">
                <Button variant="ghost" className="w-full text-primary/80 hover:bg-muted/30" size="sm">
                  View Leaderboard
                </Button>
              </div>
            </div>

            {/* Become a Contributor */}
            <div className="rounded-xl border border-accent/20 bg-accent/5 p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-accent/20 bg-accent/10">
                <Shield className="h-5 w-5 text-accent/80" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">
                Become a Verified Contributor
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Join our network of trusted fact-checkers and help protect Nepal from misinformation.
              </p>
              <Button className="w-full gap-2 bg-accent/10 text-accent border border-accent/20 hover:bg-accent/15">
                <Zap className="h-4 w-4" />
                Apply for Verification
              </Button>
            </div>

            {/* Reporting Guidelines */}
            <div className="rounded-xl border border-border bg-card/20 p-5">
              <h3 className="mb-4 font-semibold text-foreground flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary/70" />
                Guidelines
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[
                  "Include the original source or screenshot",
                  "Describe why you believe it's false",
                  "Add context about where it's spreading",
                  "Link to trusted counter-sources if available",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-verified/70" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
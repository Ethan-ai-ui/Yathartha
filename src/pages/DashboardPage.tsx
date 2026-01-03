import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FileSearch,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
  MapPin,
  Filter,
  Download,
  Eye,
  MessageSquare,
  MoreHorizontal,
  ChevronRight,
  Activity,
  Flame,
  Shield,
  Zap,
  Terminal
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { 
    label: "Pending Cases", 
    value: "47", 
    change: "+12", 
    changeType: "warning",
    icon: Clock 
  },
  { 
    label: "Verified Today", 
    value: "156", 
    change: "+23%", 
    changeType: "success",
    icon: CheckCircle2 
  },
  { 
    label: "Critical Alerts", 
    value: "8", 
    change: "-3", 
    changeType: "success",
    icon: AlertTriangle 
  },
  { 
    label: "Active Monitors", 
    value: "24", 
    change: "Live",
    changeType: "info",
    icon: Activity 
  },
];

const pendingCases = [
  {
    id: "SC-2026-0847",
    title: "Election manipulation claims in Kathmandu",
    type: "Text",
    priority: "critical",
    source: "Facebook",
    submitted: "2 hours ago",
    assignee: "Raju Sharma",
    progress: 65,
  },
  {
    id: "SC-2026-0846",
    title: "Deepfake video of political leader",
    type: "Video",
    priority: "high",
    source: "WhatsApp",
    submitted: "4 hours ago",
    assignee: "Sita Devi",
    progress: 40,
  },
  {
    id: "SC-2026-0845",
    title: "Fake health advisory circulating",
    type: "Image",
    priority: "medium",
    source: "TikTok",
    submitted: "6 hours ago",
    assignee: "Unassigned",
    progress: 0,
  },
  {
    id: "SC-2026-0844",
    title: "Manipulated news article screenshot",
    type: "Image",
    priority: "medium",
    source: "Twitter",
    submitted: "8 hours ago",
    assignee: "Kumar Thapa",
    progress: 85,
  },
];

const trendingMisinformation = [
  {
    title: "False claims about new tax policy",
    spread: "234K+ shares",
    regions: ["Kathmandu", "Pokhara", "Biratnagar"],
    severity: "high",
  },
  {
    title: "Fake earthquake warning message",
    spread: "189K+ shares",
    regions: ["Nationwide"],
    severity: "critical",
  },
  {
    title: "Manipulated politician interview clip",
    spread: "156K+ shares",
    regions: ["Province 1", "Province 2"],
    severity: "high",
  },
];

const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case "critical": return { bg: "bg-danger/10", text: "text-danger", border: "border-danger/30" };
    case "high": return { bg: "bg-warning/10", text: "text-warning", border: "border-warning/30" };
    case "medium": return { bg: "bg-info/10", text: "text-info", border: "border-info/30" };
    default: return { bg: "bg-muted", text: "text-muted-foreground", border: "border-muted" };
  }
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Subtle background */}
      <div className="fixed inset-0 grid-pattern opacity-15 pointer-events-none" />
      <div className="fixed top-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-primary/3 blur-[150px] pointer-events-none" />

      <main className="container relative py-6">
        {/* Page Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1">
              <Terminal className="h-3 w-3 text-primary/80" />
              <span className="text-xs font-mono text-primary/80">DASHBOARD.CONTROL</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Fact-Checker <span className="text-gradient-cyber">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">
              Manage verification cases and monitor misinformation trends
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 border-border hover:bg-muted/50">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline" className="gap-2 border-border hover:bg-muted/50">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="gap-2 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15">
              <FileSearch className="h-4 w-4" />
              New Case
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group rounded-xl border border-border bg-card/20 p-5 transition-all hover:bg-card/40"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-lg border border-border bg-muted/30 p-2">
                  <stat.icon className="h-5 w-5 text-primary/70" />
                </div>
                <span className={cn(
                  "text-sm font-mono",
                  stat.changeType === "success" ? "text-verified/80" :
                  stat.changeType === "warning" ? "text-warning/80" :
                  "text-info/80"
                )}>
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-foreground font-mono">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Cases Table */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-primary/20 bg-card/30 backdrop-blur-sm">
              <div className="border-b border-primary/10 p-4">
                <Tabs defaultValue="pending">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <TabsList className="bg-muted/30 border border-primary/10">
                      <TabsTrigger value="pending" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Pending</TabsTrigger>
                      <TabsTrigger value="in-progress" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">In Progress</TabsTrigger>
                      <TabsTrigger value="completed" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Completed</TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-verified opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-verified" />
                      </span>
                      Updated 2m ago
                    </div>
                  </div>
                </Tabs>
              </div>

              <div className="divide-y divide-primary/10">
                {pendingCases.map((caseItem) => {
                  const priorityConfig = getPriorityConfig(caseItem.priority);
                  return (
                    <div
                      key={caseItem.id}
                      className="flex flex-col gap-4 p-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-sm font-mono text-primary/60">
                            {caseItem.id}
                          </span>
                          <Badge className={cn(priorityConfig.bg, priorityConfig.text, priorityConfig.border, "border")}>
                            {caseItem.priority}
                          </Badge>
                          <Badge variant="outline" className="border-primary/20 text-primary/80">{caseItem.type}</Badge>
                        </div>
                        <p className="font-medium text-foreground truncate">
                          {caseItem.title}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground font-mono">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {caseItem.source}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {caseItem.submitted}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {caseItem.assignee}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {caseItem.progress > 0 && (
                          <div className="w-24">
                            <div className="mb-1 flex justify-between text-xs font-mono">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="text-primary">{caseItem.progress}%</span>
                            </div>
                            <Progress value={caseItem.progress} className="h-1.5 bg-muted/50" />
                          </div>
                        )}
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-primary/10 p-4">
                <Button variant="ghost" className="w-full gap-2 text-primary hover:bg-primary/10">
                  View All Cases
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Misinformation */}
            <div className="rounded-xl border border-danger/20 bg-card/30 backdrop-blur-sm">
              <div className="flex items-center gap-2 border-b border-danger/10 p-4">
                <Flame className="h-5 w-5 text-danger" />
                <h3 className="font-semibold text-foreground">Trending Threats</h3>
              </div>
              <div className="divide-y divide-primary/10">
                {trendingMisinformation.map((item, index) => (
                  <div key={index} className="p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <p className="text-sm font-medium text-foreground">
                        {item.title}
                      </p>
                      <Badge className={cn(
                        item.severity === "critical" ? "bg-danger/10 text-danger border-danger/30" :
                        "bg-warning/10 text-warning border-warning/30",
                        "border"
                      )}>
                        {item.severity}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-mono">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {item.spread}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {item.regions.join(", ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-primary/10 p-4">
                <Button variant="ghost" className="w-full gap-2 text-danger hover:bg-danger/10" size="sm">
                  View Threat Map
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl border border-primary/20 bg-card/30 p-4 backdrop-blur-sm">
              <h3 className="mb-4 font-semibold text-foreground flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-auto flex-col gap-1 py-3 border-warning/20 hover:bg-warning/10" size="sm">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <span className="text-xs">Priority Alert</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-1 py-3 border-primary/20 hover:bg-primary/10" size="sm">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-xs">Publish Truth</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-1 py-3 border-info/20 hover:bg-info/10" size="sm">
                  <Users className="h-5 w-5 text-info" />
                  <span className="text-xs">Team Chat</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-1 py-3 border-verified/20 hover:bg-verified/10" size="sm">
                  <Download className="h-5 w-5 text-verified" />
                  <span className="text-xs">Export Report</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Shield,
  MapPin,
  Download,
  ArrowUpRight,
  Globe,
  Flame,
  AlertTriangle,
  Activity,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";

const overviewStats = [
  {
    title: "Total Verifications",
    value: "2.5M+",
    change: "+23.5%",
    trend: "up",
    period: "vs last month",
  },
  {
    title: "Fake Content Stopped",
    value: "456K",
    change: "+18.2%",
    trend: "up",
    period: "vs last month",
  },
  {
    title: "Citizens Protected",
    value: "1.2M",
    change: "+45.8%",
    trend: "up",
    period: "vs last month",
  },
  {
    title: "Active Fact-Checkers",
    value: "523",
    change: "+12",
    trend: "up",
    period: "new this week",
  },
];

const regionData = [
  { name: "Bagmati Province", cases: 12456, percentage: 28, trend: "up" },
  { name: "Province 1", cases: 8923, percentage: 20, trend: "up" },
  { name: "Madhesh Province", cases: 7234, percentage: 16, trend: "down" },
  { name: "Gandaki Province", cases: 5678, percentage: 13, trend: "stable" },
  { name: "Lumbini Province", cases: 4567, percentage: 10, trend: "up" },
  { name: "Karnali Province", cases: 3456, percentage: 8, trend: "stable" },
  { name: "Sudurpashchim", cases: 2234, percentage: 5, trend: "down" },
];

const misinfoCategories = [
  { category: "Political", count: 34567, percentage: 35, color: "bg-primary" },
  { category: "Health", count: 23456, percentage: 24, color: "bg-danger" },
  { category: "Financial", count: 15678, percentage: 16, color: "bg-warning" },
  { category: "Natural Disaster", count: 9876, percentage: 10, color: "bg-info" },
  { category: "Social Issues", count: 8765, percentage: 9, color: "bg-verified" },
  { category: "Other", count: 5678, percentage: 6, color: "bg-accent" },
];

const languageStats = [
  { language: "Nepali", verifications: 1234567, accuracy: 98.2 },
  { language: "English", verifications: 567890, accuracy: 97.8 },
  { language: "Maithili", verifications: 234567, accuracy: 96.5 },
  { language: "Bhojpuri", verifications: 123456, accuracy: 95.8 },
  { language: "Tharu", verifications: 89012, accuracy: 94.2 },
];

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Background effects */}
      <div className="fixed inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="fixed top-1/4 right-1/3 h-80 w-80 rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

      <main className="container relative py-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-info/30 bg-info/5 px-3 py-1">
              <Activity className="h-3 w-3 text-info" />
              <span className="text-xs font-mono text-info">ANALYTICS.DASHBOARD</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Analytics & <span className="text-gradient-cyber">Impact</span>
            </h1>
            <p className="text-muted-foreground">
              Real-time insights on misinformation trends and platform impact
            </p>
          </div>
          <div className="flex gap-2">
            <Tabs defaultValue="30d">
              <TabsList className="bg-muted/30 border border-primary/10">
                <TabsTrigger value="7d" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-mono text-xs">7D</TabsTrigger>
                <TabsTrigger value="30d" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-mono text-xs">30D</TabsTrigger>
                <TabsTrigger value="90d" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-mono text-xs">90D</TabsTrigger>
                <TabsTrigger value="1y" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-mono text-xs">1Y</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/10">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {overviewStats.map((stat) => (
            <div
              key={stat.title}
              className="group rounded-xl border border-primary/10 bg-card/30 p-6 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-neon"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <span className={cn(
                  "flex items-center gap-1 text-sm font-mono",
                  stat.trend === "up" ? "text-verified" : "text-danger"
                )}>
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {stat.change}
                </span>
              </div>
              <p className="text-3xl font-bold text-foreground font-mono">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.period}</p>
            </div>
          ))}
        </div>

        {/* Main Charts Grid */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Misinformation by Region */}
          <div className="rounded-xl border border-primary/20 bg-card/30 p-6 backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">By Region</h3>
              </div>
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                View Map
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {regionData.map((region) => (
                <div key={region.name} className="flex items-center gap-4">
                  <div className="w-40 truncate">
                    <p className="text-sm font-medium text-foreground">{region.name}</p>
                  </div>
                  <div className="flex-1">
                    <div className="h-3 overflow-hidden rounded-full bg-muted/50">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
                        style={{ width: `${region.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex w-24 items-center justify-end gap-2">
                    <span className="text-sm font-mono text-foreground">
                      {region.cases.toLocaleString()}
                    </span>
                    {region.trend === "up" && <TrendingUp className="h-3 w-3 text-verified" />}
                    {region.trend === "down" && <TrendingDown className="h-3 w-3 text-danger" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Misinformation Categories */}
          <div className="rounded-xl border border-primary/20 bg-card/30 p-6 backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">By Category</h3>
              </div>
              <Badge variant="outline" className="border-primary/20 font-mono">97,520 total</Badge>
            </div>
            <div className="space-y-4">
              {misinfoCategories.map((cat) => (
                <div key={cat.category} className="flex items-center gap-4">
                  <div className="w-32">
                    <p className="text-sm font-medium text-foreground">{cat.category}</p>
                  </div>
                  <div className="flex-1">
                    <div className="h-3 overflow-hidden rounded-full bg-muted/50">
                      <div
                        className={cn("h-full rounded-full transition-all", cat.color)}
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-sm font-mono text-foreground">{cat.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Language Stats */}
          <div className="rounded-xl border border-primary/20 bg-card/30 p-6 backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Language Accuracy</h3>
            </div>
            <div className="space-y-4">
              {languageStats.map((lang) => (
                <div key={lang.language} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{lang.language}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {lang.verifications.toLocaleString()} scans
                    </p>
                  </div>
                  <Badge 
                    className={cn(
                      "font-mono",
                      lang.accuracy >= 97 ? "bg-verified/10 text-verified border-verified/30" :
                      lang.accuracy >= 95 ? "bg-warning/10 text-warning border-warning/30" :
                      "bg-muted text-muted-foreground",
                      "border"
                    )}
                  >
                    {lang.accuracy}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Threat Level */}
          <div className="rounded-xl border border-warning/20 bg-card/30 p-6 backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <h3 className="font-semibold text-foreground">Threat Level</h3>
            </div>
            <div className="mb-4 text-center">
              <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full border border-warning/30 bg-warning/10 shadow-[0_0_30px_hsl(45_100%_55%/0.3)]">
                <span className="text-lg font-bold text-warning font-mono">MED</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Elevated political misinformation activity
              </p>
            </div>
            <div className="space-y-2 text-sm font-mono">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deepfakes</span>
                <span className="text-danger">HIGH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Text misinfo</span>
                <span className="text-warning">MEDIUM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Scam activity</span>
                <span className="text-verified">LOW</span>
              </div>
            </div>
          </div>

          {/* Impact Summary */}
          <div className="rounded-xl border border-verified/20 bg-card/30 p-6 backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-2">
              <Shield className="h-5 w-5 text-verified" />
              <h3 className="font-semibold text-foreground">Impact Summary</h3>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border border-verified/20 bg-verified/5 p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-verified" />
                  <span className="text-2xl font-bold text-foreground font-mono">1.2M</span>
                </div>
                <p className="text-sm text-muted-foreground">Citizens protected</p>
              </div>
              <div className="rounded-lg border border-danger/20 bg-danger/5 p-4">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-danger" />
                  <span className="text-2xl font-bold text-foreground font-mono">456K</span>
                </div>
                <p className="text-sm text-muted-foreground">Viral fake stories stopped</p>
              </div>
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold text-foreground font-mono">98.7%</span>
                </div>
                <p className="text-sm text-muted-foreground">Detection accuracy</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
import React, { useState, useEffect, useCallback } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";
import submissionsAPI from "@/services/submissionsAPI";
import { analyticsAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { Download, RefreshCw, MoreHorizontal, Share2, Flag, ArrowLeft, Home } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Submission {
  id: number;
  content: string;
  content_type: string;
  created_at: string;
  status: string;
  misinformation_score?: number;
  language?: string;
}

interface AnalyticsData {
  total_submissions: number;
  verified_count: number;
  suspicious_count: number;
  pending_count: number;
  average_score: number;
}

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, tokens, fetchWithAuth } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("submissions");

  const loadDashboardData = useCallback(async () => {
    if (!tokens?.access) {
      toast({ description: "Not authenticated", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);

      const [subsRes, analyticsRes] = await Promise.all([
        submissionsAPI.getSubmissions(fetchWithAuth),
        analyticsAPI.getOverview(tokens.access),
      ]);

      const submissionsArray: Submission[] = subsRes?.results || subsRes || [];
      setSubmissions(Array.isArray(submissionsArray) ? submissionsArray : []);

      const verifiedCount = submissionsArray.filter(
        (s) => s.status === "completed" || s.status === "verified"
      ).length;

      const suspiciousCount = submissionsArray.filter(
        (s) => s.status === "flagged" || (s.misinformation_score ?? 0) > 0.7
      ).length;

      const pendingCount = submissionsArray.filter(
        (s) => s.status === "pending" || s.status === "analyzing"
      ).length;

      const avgScore =
        submissionsArray.length > 0
          ? submissionsArray.reduce((sum, s) => sum + (s.misinformation_score || 0), 0) /
            submissionsArray.length
          : 0;

      setAnalytics({
        total_submissions: submissionsArray.length,
        verified_count: verifiedCount,
        suspicious_count: suspiciousCount,
        pending_count: pendingCount,
        average_score: avgScore,
      });

      toast({ description: "Dashboard data loaded" });
    } catch (error) {
      console.error(error);
      toast({
        description: error instanceof Error ? error.message : "Error loading dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [tokens, fetchWithAuth, toast]);

  useEffect(() => {
    if (isAuthenticated && tokens?.access) {
      loadDashboardData();
    }
  }, [isAuthenticated, tokens, loadDashboardData]);

  if (!isAuthenticated) return <Navigate to="/" replace />;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "verified":
        return "text-green-400";
      case "suspicious":
        return "text-red-400";
      case "pending":
        return "text-yellow-400";
      default:
        return "text-muted-foreground";
    }
  };

  const chartData = [
    { name: "Verified", value: analytics?.verified_count || 0 },
    { name: "Suspicious", value: analytics?.suspicious_count || 0 },
    { name: "Pending", value: analytics?.pending_count || 0 },
  ];

  const COLORS = ["#10b981", "#ef4444", "#f59e0b"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
                <ArrowLeft size={16} /> Back
              </Button>
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Home size={16} /> Home
                </Button>
              </Link>
            </div>
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Welcome back, {user?.email}</p>
          </div>
          <Button onClick={loadDashboardData} variant="outline" size="sm" className="gap-2" disabled={loading}>
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
          </Button>
        </div>

        {/* Rest of JSX unchanged for brevity */}
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;

import { useState, useEffect } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { submissionsAPI, analyticsAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { Download, RefreshCw, MoreHorizontal, Share2, Flag, ArrowLeft, Home } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

export default function DashboardPage() {
  const { user, isAuthenticated, tokens } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('submissions');

  useEffect(() => {
    if (isAuthenticated && tokens?.access) {
      loadDashboardData();
    }
  }, [isAuthenticated, tokens]);

  const loadDashboardData = async () => {
    if (!tokens?.access) {
      toast({ description: 'Not authenticated', variant: 'destructive' });
      return;
    }

    try {
      setLoading(true);
      const [submissionsRes, analyticsRes] = await Promise.all([
        submissionsAPI.getSubmissions(tokens.access),
        analyticsAPI.getOverview(tokens.access),
      ]);

      // Handle paginated response
      const submissionsData = submissionsRes?.results || submissionsRes?.data?.results || submissionsRes || [];
      const submissionsArray = Array.isArray(submissionsData) ? submissionsData : [];
      setSubmissions(submissionsArray);
      
      // Calculate user-specific stats from submissions
      const verifiedCount = submissionsArray.filter(s => s.status === 'completed' || s.status === 'verified').length;
      const suspiciousCount = submissionsArray.filter(s => s.status === 'flagged' || s.is_flagged || s.misinformation_score > 0.7).length;
      const pendingCount = submissionsArray.filter(s => s.status === 'pending' || s.status === 'analyzing').length;
      const avgScore = submissionsArray.length > 0 
        ? submissionsArray.reduce((sum, s) => sum + (s.misinformation_score || 0), 0) / submissionsArray.length
        : 0;
      
      // Handle analytics response - use for overall stats if available, otherwise use calculated
      const analyticsData = analyticsRes || {};
      const byStatus = analyticsData.by_status || {};
      
      setAnalytics({
        total_submissions: submissionsArray.length,
        verified_count: verifiedCount,
        suspicious_count: suspiciousCount,
        pending_count: pendingCount,
        average_score: avgScore,
      });
      
      toast({ description: 'Dashboard data loaded' });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast({ 
        description: error instanceof Error ? error.message : 'Error loading dashboard data', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return <Navigate to="/" replace />;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'verified':
        return 'text-green-400';
      case 'suspicious':
        return 'text-red-400';
      case 'pending':
        return 'text-yellow-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const handleDownloadReport = async () => {
    if (!tokens?.access) {
      toast({ description: 'Not authenticated', variant: 'destructive' });
      return;
    }
    try {
      const response = await analyticsAPI.getReports(tokens.access);
      const blob = new Blob([JSON.stringify(response.data || response, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({ description: 'Report downloaded successfully' });
    } catch (error) {
      console.error('Failed to download report:', error);
      toast({ description: 'Error downloading report', variant: 'destructive' });
    }
  };

  const handleShareSubmission = (submissionId: number) => {
    const url = `${window.location.origin}/verify?id=${submissionId}`;
    navigator.clipboard.writeText(url);
    toast({ description: 'Link copied to clipboard' });
  };

  const handleFlagSubmission = async (submissionId: number) => {
    if (!tokens?.access) {
      toast({ description: 'Not authenticated', variant: 'destructive' });
      return;
    }
    try {
      await submissionsAPI.flagSubmission(tokens.access, submissionId, 'User flagged');
      toast({ description: 'Submission flagged successfully' });
      loadDashboardData();
    } catch (error) {
      console.error('Failed to flag submission:', error);
      toast({ description: 'Error flagging submission', variant: 'destructive' });
    }
  };

  const chartData = [
    { name: 'Verified', value: analytics?.verified_count || 0 },
    { name: 'Suspicious', value: analytics?.suspicious_count || 0 },
    { name: 'Pending', value: analytics?.pending_count || 0 },
  ];

  const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(-1)}
                  className="gap-2"
                >
                  <ArrowLeft size={16} />
                  Back
                </Button>
                <Link to="/">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                  >
                    <Home size={16} />
                    Home
                  </Button>
                </Link>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-2">Welcome back, {user?.email}</p>
              </div>
            </div>
          </div>
          <Button
            onClick={loadDashboardData}
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{analytics.total_submissions}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-400">Verified</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">{analytics.verified_count}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-400">Suspicious</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-400">{analytics.suspicious_count}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-yellow-400">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-400">{analytics.pending_count}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="submissions">My Submissions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Submissions Tab */}
          <TabsContent value="submissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Submissions</CardTitle>
                <CardDescription>All content you've submitted for verification</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : submissions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No submissions yet. <a href="/verify" className="text-primary hover:underline">Submit content for verification</a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <div key={submission.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{submission.content.substring(0, 100)}...</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Type: <span className="font-medium">{submission.content_type}</span> • 
                              Status: <span className={`font-medium ${getStatusColor(submission.status)}`}>
                                {submission.status}
                              </span>
                            </p>
                            {submission.misinformation_score !== undefined && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Misinformation Score: <span className="font-bold">{(submission.misinformation_score * 100).toFixed(1)}%</span>
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground/70 mt-2">
                              {new Date(submission.created_at).toLocaleString()}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleShareSubmission(submission.id)}>
                                <Share2 size={14} className="mr-2" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleFlagSubmission(submission.id)}>
                                <Flag size={14} className="mr-2" />
                                Flag
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Analytics Overview</CardTitle>
                    <CardDescription>Your submission statistics and trends</CardDescription>
                  </div>
                  <Button
                    onClick={handleDownloadReport}
                    size="sm"
                    className="gap-2"
                    disabled={loading}
                  >
                    <Download size={16} />
                    Download Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold mb-4 text-foreground">Submission Status Distribution</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {COLORS.map((color, index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col justify-center space-y-4">
                      <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                        <p className="text-sm text-muted-foreground">Average Misinformation Score</p>
                        <p className="text-2xl font-bold text-green-400">{((1 - (analytics?.average_score || 0)) * 100).toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground mt-1">Lower is better</p>
                      </div>
                      <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <p className="text-sm text-muted-foreground">Verification Rate</p>
                        <p className="text-2xl font-bold text-blue-400">
                          {analytics?.total_submissions ? 
                            (((analytics.verified_count + analytics.suspicious_count) / analytics.total_submissions) * 100).toFixed(1) : 
                            '0'}%
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Content verified</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="mt-1 text-foreground">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">User Type</label>
                  <p className="mt-1 text-foreground capitalize">{user?.user_type || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="mt-1 text-foreground">{user?.full_name || 'Not set'}</p>
                </div>
                <div className="pt-4 border-t border-border">
                  <Button variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}

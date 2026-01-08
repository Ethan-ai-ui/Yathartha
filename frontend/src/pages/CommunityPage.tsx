import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { communityAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Shield,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'verified_fake':
      return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', label: 'Verified Fake' };
    case 'verified_true':
      return { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', label: 'Verified True' };
    case 'under_review':
      return { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200', label: 'Under Review' };
    default:
      return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', label: 'Pending' };
  }
};

export default function CommunityPage() {
  const { tokens, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('latest');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [newReport, setNewReport] = useState({ title: '', description: '', category: 'General' });
  const [applyData, setApplyData] = useState({ reason: '', experience: '' });

  const { data: reportsData, isLoading } = useQuery({
    queryKey: ['community-reports', activeTab, filterCategory],
    queryFn: () => communityAPI.getReports(1, activeTab === 'latest' ? '-created_at' : '-votes_total'),
  });

  const commentMutation = useMutation({
    mutationFn: ({ id, content }: { id: number; content: string }) => 
      communityAPI.addComment(tokens?.access || '', id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-reports'] });
      toast({ title: "Comment Posted", description: "Your comment has been added to the discussion." });
      setCommentText('');
      setSelectedReportId(null);
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Comment Failed", description: error.message || "Could not post comment." });
    }
  });

  const applyMutation = useMutation({
    mutationFn: (data: any) => communityAPI.applyForContributor(tokens?.access || '', data),
    onSuccess: () => {
      toast({ title: "Application Submitted", description: "We've received your application to become a contributor." });
      setIsApplyModalOpen(false);
      setApplyData({ reason: '', experience: '' });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Application Failed", description: error.message || "Could not submit application." });
    }
  });

  const submitMutation = useMutation({
    mutationFn: (data: any) => communityAPI.createReport(tokens?.access || '', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-reports'] });
      toast({ title: "Report Submitted", description: "Your report has been successfully submitted for community verification." });
      setIsSubmitModalOpen(false);
      setNewReport({ title: '', description: '', category: 'General' });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Submission Failed", description: error.message || "Could not submit your report. Please try again." });
    }
  });

  const voteMutation = useMutation({
    mutationFn: ({ id, voteType }: { id: number; voteType: 'up' | 'down' }) => 
      communityAPI.voteOnReport(tokens?.access || '', id, voteType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-reports'] });
      toast({ title: "Vote Cast", description: "Your vote has been recorded." });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Voting Failed", description: error.message || "Could not record your vote." });
    }
  });

  const reports = reportsData?.results || [];

  const filteredReports = reports.filter((r: any) => 
    filterCategory === 'all' || r.category === filterCategory
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Authentication Required", description: "Please log in to submit a report." });
      return;
    }
    submitMutation.mutate(newReport);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container relative py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Community Reports</h1>
            <p className="text-muted-foreground mt-2">Crowdsourced truth verification by Nepal's citizens</p>
          </div>
          <div className="flex gap-2">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Financial">Financial</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Political">Political</SelectItem>
                <SelectItem value="Natural Disaster">Natural Disaster</SelectItem>
              </SelectContent>
            </Select>

            <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Report
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>Submit New Report</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title</Label>
                      <Input 
                        id="title" 
                        value={newReport.title}
                        onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                        placeholder="What needs verifying?" 
                        required 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={newReport.category} 
                        onValueChange={(val) => setNewReport({ ...newReport, category: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Financial">Financial</SelectItem>
                          <SelectItem value="Health">Health</SelectItem>
                          <SelectItem value="Political">Political</SelectItem>
                          <SelectItem value="Natural Disaster">Natural Disaster</SelectItem>
                          <SelectItem value="General">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        value={newReport.description}
                        onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                        placeholder="Provide more details, context, or links..." 
                        className="min-h-[100px]"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={submitMutation.isPending}>
                      {submitMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Submit for Verification
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-border bg-card">
              <div className="border-b border-border p-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="latest">Latest</TabsTrigger>
                    <TabsTrigger value="trending">Trending</TabsTrigger>
                    <TabsTrigger value="verified">Verified</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="divide-y divide-border">
                {isLoading ? (
                  <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p>Fetching community reports...</p>
                  </div>
                ) : filteredReports.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No reports found for this filter.
                  </div>
                ) : (
                  filteredReports.map((report: any) => {
                    const statusConfig = getStatusConfig(report.status);
                    return (
                      <div key={report.id} className="p-5 hover:bg-muted/50 transition">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <Badge className={cn(statusConfig.bg, statusConfig.text)}>
                            {statusConfig.label}
                          </Badge>
                          <Badge variant="outline">{report.category}</Badge>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(report.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {report.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {report.description}
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            {report.author_verified && (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            )}
                            <span className="font-medium text-foreground/80">{report.author_name || 'Anonymous'}</span>
                          </div>

                          <div className="flex items-center gap-4">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="gap-1 hover:text-green-600"
                              onClick={() => voteMutation.mutate({ id: report.id, voteType: 'up' })}
                              disabled={voteMutation.isPending}
                            >
                              <ThumbsUp className="h-4 w-4" />
                              {report.upvotes || 0}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="gap-1 hover:text-red-600"
                              onClick={() => voteMutation.mutate({ id: report.id, voteType: 'down' })}
                              disabled={voteMutation.isPending}
                            >
                              <ThumbsDown className="h-4 w-4" />
                              {report.downvotes || 0}
                            </Button>
                            <Dialog open={selectedReportId === report.id} onOpenChange={(open) => !open && setSelectedReportId(null)}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="gap-1"
                                  onClick={() => setSelectedReportId(report.id)}
                                >
                                  <MessageSquare className="h-4 w-4" />
                                  {report.comment_count || 0}
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Add a Comment</DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                  <Textarea 
                                    placeholder="Share your insights or evidence..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    className="min-h-[100px]"
                                  />
                                </div>
                                <DialogFooter>
                                  <Button 
                                    onClick={() => commentMutation.mutate({ id: report.id, content: commentText })}
                                    disabled={commentMutation.isPending || !commentText.trim()}
                                  >
                                    {commentMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Post Comment
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="border-t border-border p-4">
                <Button variant="outline" className="w-full">
                  Load More Reports
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <Award className="h-5 w-5" />
                Top Contributors
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Journalist Network', reports: 156, accuracy: 98 },
                  { name: 'Media Watch Nepal', reports: 134, accuracy: 97 },
                  { name: 'Ram B. Thapa', reports: 89, accuracy: 94 },
                ].map((contributor, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{contributor.name}</span>
                    <span className="text-muted-foreground">{contributor.accuracy}% acc</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <h3 className="font-semibold mb-2">Become a Contributor</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Join our network of trusted fact-checkers
              </p>
              <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-primary text-white">
                    Apply Now
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Apply to be a Contributor</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Why do you want to join?</Label>
                      <Textarea 
                        placeholder="Tell us about your motivation..."
                        value={applyData.reason}
                        onChange={(e) => setApplyData({ ...applyData, reason: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Relevant Experience</Label>
                      <Textarea 
                        placeholder="Journalism, fact-checking, or domain expertise..."
                        value={applyData.experience}
                        onChange={(e) => setApplyData({ ...applyData, experience: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={() => applyMutation.mutate(applyData)}
                      disabled={applyMutation.isPending || !applyData.reason.trim() || !applyData.experience.trim()}
                    >
                      {applyMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Submit Application
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

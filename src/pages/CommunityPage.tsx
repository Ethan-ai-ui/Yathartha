import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mockReports = [
  {
    id: 1,
    title: 'Fake news about bank closures',
    description: 'Multiple WhatsApp groups sharing false information about government ordering bank closures.',
    author: 'Anonymous User',
    authorVerified: false,
    votes: { up: 234, down: 12 },
    comments: 45,
    status: 'under_review',
    submitted: '2 hours ago',
    category: 'Financial',
  },
  {
    id: 2,
    title: 'Manipulated image of flood damage',
    description: 'Photo claiming to show recent flood damage is actually from 2019 Bangladesh floods.',
    author: 'Journalist Network Nepal',
    authorVerified: true,
    votes: { up: 567, down: 23 },
    comments: 89,
    status: 'verified_fake',
    submitted: '5 hours ago',
    category: 'Natural Disaster',
  },
];

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
  const [reports] = useState(mockReports);

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
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-primary text-white">
              <Plus className="h-4 w-4 mr-2" />
              Submit Report
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-border bg-card">
              <div className="border-b border-border p-4">
                <Tabs defaultValue="latest">
                  <TabsList>
                    <TabsTrigger value="latest">Latest</TabsTrigger>
                    <TabsTrigger value="trending">Trending</TabsTrigger>
                    <TabsTrigger value="verified">Verified</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="divide-y divide-border">
                {reports.map((report) => {
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
                          {report.submitted}
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
                          {report.authorVerified && (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          )}
                          <span className="font-medium text-foreground/80">{report.author}</span>
                        </div>

                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            {report.votes.up}
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <ThumbsDown className="h-4 w-4" />
                            {report.votes.down}
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {report.comments}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
              <Button className="w-full bg-primary text-white">
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Upload, 
  Link as LinkIcon, 
  MessageSquare, 
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Share2,
  Flag,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { submissionsAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

type ContentType = "text" | "image" | "video" | "audio" | "link";

export default function VerifyPage() {
  const { user, tokens } = useAuth();
  const { toast } = useToast();
  const [contentType, setContentType] = useState<ContentType>("text");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<"en" | "ne" | "hi">("en");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  if (!user || !tokens) {
    return <Navigate to="/" />;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setContent("");
    }
  };

  const handleSubmit = async () => {
    if (!content && !file) {
      toast({
        title: "Error",
        description: "Please enter content or select a file",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await submissionsAPI.submit(tokens.access, {
        content_type: contentType,
        content: content || file?.name || "",
        language,
        file,
      });

      // Get results
      const analysisResults = await submissionsAPI.getResults(tokens.access, result.id);
      setResults(analysisResults);

      toast({
        title: "Success",
        description: "Content submitted for analysis",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit content",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Verify Content</h1>
            <p className="text-muted-foreground">
              Submit content to check for misinformation, deepfakes, and manipulation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Submit Form */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Submit Content</CardTitle>
                <CardDescription>Choose the type of content you want to verify</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Content Type Tabs */}
                <Tabs value={contentType} onValueChange={(val) => setContentType(val as ContentType)}>
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="text">Text</TabsTrigger>
                    <TabsTrigger value="image">Image</TabsTrigger>
                    <TabsTrigger value="video">Video</TabsTrigger>
                    <TabsTrigger value="audio">Audio</TabsTrigger>
                    <TabsTrigger value="link">Link</TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="space-y-4">
                    <Textarea
                      placeholder="Paste text content here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={6}
                    />
                  </TabsContent>

                  <TabsContent value="image" className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="image-input"
                      />
                      <label htmlFor="image-input">
                        <Button asChild variant="outline">
                          <span>Click to upload image</span>
                        </Button>
                      </label>
                      {file && <p className="text-sm text-muted-foreground mt-2">{file.name}</p>}
                    </div>
                  </TabsContent>

                  <TabsContent value="video" className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="video-input"
                      />
                      <label htmlFor="video-input">
                        <Button asChild variant="outline">
                          <span>Click to upload video</span>
                        </Button>
                      </label>
                      {file && <p className="text-sm text-muted-foreground mt-2">{file.name}</p>}
                    </div>
                  </TabsContent>

                  <TabsContent value="audio" className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <Input
                        type="file"
                        accept="audio/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="audio-input"
                      />
                      <label htmlFor="audio-input">
                        <Button asChild variant="outline">
                          <span>Click to upload audio</span>
                        </Button>
                      </label>
                      {file && <p className="text-sm text-muted-foreground mt-2">{file.name}</p>}
                    </div>
                  </TabsContent>

                  <TabsContent value="link" className="space-y-4">
                    <Input
                      placeholder="Paste URL here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      type="url"
                    />
                  </TabsContent>
                </Tabs>

                {/* Language Selection */}
                <div>
                  <label className="text-sm font-medium">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as "en" | "ne" | "hi")}
                    className="w-full mt-2 px-3 py-2 border rounded-md"
                  >
                    <option value="en">English</option>
                    <option value="ne">नेपाली (Nepali)</option>
                    <option value="hi">हिंदी (Hindi)</option>
                  </select>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || (!content && !file)}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Content"
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">For Text</h4>
                  <p className="text-sm text-muted-foreground">
                    Copy and paste the text you want to verify
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">For Images</h4>
                  <p className="text-sm text-muted-foreground">
                    Upload to detect deepfakes and manipulation
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">For URLs</h4>
                  <p className="text-sm text-muted-foreground">
                    We'll check the source credibility
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          {results && (
            <div className="mt-8 space-y-6">
              <Card className={results.misinformation_score > 0.7 ? "border-red-200" : "border-green-200"}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {results.misinformation_score > 0.7 ? (
                      <>
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        Likely Misinformation
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        Appears Reliable
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Misinformation Score</p>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          results.misinformation_score > 0.7
                            ? "bg-red-600"
                            : results.misinformation_score > 0.4
                            ? "bg-yellow-600"
                            : "bg-green-600"
                        }`}
                        style={{ width: `${results.misinformation_score * 100}%` }}
                      />
                    </div>
                    <p className="text-sm mt-2">{Math.round(results.misinformation_score * 100)}%</p>
                  </div>

                  {results.explanation && (
                    <div>
                      <h4 className="font-medium mb-2">Analysis</h4>
                      <p className="text-sm text-muted-foreground">{results.explanation}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      <Flag className="h-4 w-4 mr-2" />
                      Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

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
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Share2,
  Flag,
} from "lucide-react";
import { useAuth } from "@/contexts/useAuth";
import submissionsAPI from "@/services/submissionsAPI";
import { useToast } from "@/hooks/use-toast";

type SubmissionType = "text" | "image" | "video" | "audio" | "link";

interface AnalysisResult {
  misinformation_score: number;
  explanation?: string;
  verdict?: "reliable" | "uncertain" | "misinformation";
}

export default function VerifyPage() {
  const { user, tokens, fetchWithAuth } = useAuth();
  const { toast } = useToast();

  const [submissionType, setSubmissionType] = useState<SubmissionType>("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<"en" | "ne" | "hi">("en");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);

  if (!user || !tokens) {
    return <Navigate to="/" />;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setContent(""); // clear text if uploading file
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }
    if (!content && !file && submissionType !== "link") {
      toast({
        title: "Error",
        description: "Please enter content or select a file",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("submission_type", submissionType);
      formData.append("language", language);
      // Add correct content field based on type
      if (submissionType === "text") {
        formData.append("text_content", content);
      } else if (submissionType === "link") {
        formData.append("source_url", content);
      } else if (file) {
        formData.append("file", file);
      }

      const result = await submissionsAPI.submit(fetchWithAuth, formData);

      toast({
        title: "Success",
        description: "Content submitted for analysis",
      });

      setContent("");
      setFile(null);
      setTitle("");
    } catch (error) {
      console.error(error);
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
                {/* Title input */}
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="Enter a title or headline for your submission"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <Tabs value={submissionType} onValueChange={(val) => setSubmissionType(val as SubmissionType)}>
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

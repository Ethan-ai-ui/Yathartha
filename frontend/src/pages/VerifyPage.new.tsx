// import { useState } from "react";
// import { Header } from "@/components/layout/Header";
// import { Footer } from "@/components/layout/Footer";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { 
//   Upload, 
//   Link as LinkIcon, 
//   MessageSquare, 
//   Mic,
//   FileImage,
//   FileVideo,
//   FileAudio,
//   X,
//   Loader2,
//   AlertTriangle,
//   CheckCircle2,
//   HelpCircle,
//   Share2,
//   Flag,
//   ExternalLink,
//   Info,
//   Scan,
//   Shield,
//   Brain,
//   Zap
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Progress } from "@/components/ui/progress";

// type VerificationStatus = "idle" | "uploading" | "analyzing" | "complete";
// type VerdictType = "verified" | "suspicious" | "fake" | "uncertain";

// interface VerificationResult {
//   verdict: VerdictType;
//   fakeScore: number;
//   deepfakeScore: number;
//   manipulationIndicators: string[];
//   explanation: string;
//   explanationNepali: string;
//   sources: { title: string; url: string; credibility: string }[];
// }

// const mockResult: VerificationResult = {
//   verdict: "suspicious",
//   fakeScore: 73,
//   deepfakeScore: 45,
//   manipulationIndicators: [
//     "Image metadata inconsistencies detected",
//     "Facial features show signs of AI manipulation",
//     "Lighting patterns don't match claimed source",
//     "Timestamp conflicts with claimed event date",
//   ],
//   explanation: "This content shows multiple signs of manipulation. The image appears to have been digitally altered, with facial features showing characteristics of AI generation. The claimed source and date do not match the metadata.",
//   explanationNepali: "यो सामग्रीमा हेरफेरका धेरै संकेतहरू देखिन्छन्। छविमा डिजिटल परिवर्तन गरिएको देखिन्छ, अनुहारका विशेषताहरूमा AI उत्पादनका विशेषताहरू देखिन्छन्।",
//   sources: [
//     { title: "Original Image Source", url: "#", credibility: "High" },
//     { title: "Fact Check: Similar Claims Debunked", url: "#", credibility: "Verified" },
//     { title: "Press Council Nepal Statement", url: "#", credibility: "Official" },
//   ],
// };

// export default function VerifyPage() {
//   const [status, setStatus] = useState<VerificationStatus>("idle");
//   const [activeTab, setActiveTab] = useState("upload");
//   const [uploadedFile, setUploadedFile] = useState<File | null>(null);
//   const [textInput, setTextInput] = useState("");
//   const [urlInput, setUrlInput] = useState("");
//   const [progress, setProgress] = useState(0);
//   const [result, setResult] = useState<VerificationResult | null>(null);

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setUploadedFile(file);
//     }
//   };

//   const handleStartVerification = () => {
//     setStatus("uploading");
//     setProgress(0);

//     const uploadInterval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 30) {
//           clearInterval(uploadInterval);
//           setStatus("analyzing");
//           startAnalysis();
//           return 30;
//         }
//         return prev + 5;
//       });
//     }, 100);
//   };

//   const startAnalysis = () => {
//     const analysisInterval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 100) {
//           clearInterval(analysisInterval);
//           setStatus("complete");
//           setResult(mockResult);
//           return 100;
//         }
//         return prev + 3;
//       });
//     }, 100);
//   };

//   const getVerdictConfig = (verdict: VerdictType) => {
//     switch (verdict) {
//       case "verified": return { 
//         color: "text-verified", 
//         bg: "bg-verified/10", 
//         border: "border-verified/30",
//         glow: "shadow-[0_0_40px_hsl(145_100%_50%/0.3)]"
//       };
//       case "suspicious": return { 
//         color: "text-warning", 
//         bg: "bg-warning/10", 
//         border: "border-warning/30",
//         glow: "shadow-[0_0_40px_hsl(45_100%_55%/0.3)]"
//       };
//       case "fake": return { 
//         color: "text-danger", 
//         bg: "bg-danger/10", 
//         border: "border-danger/30",
//         glow: "shadow-[0_0_40px_hsl(0_100%_60%/0.3)]"
//       };
//       case "uncertain": return { 
//         color: "text-info", 
//         bg: "bg-info/10", 
//         border: "border-info/30",
//         glow: "shadow-[0_0_40px_hsl(200_100%_60%/0.3)]"
//       };
//     }
//   };

//   const getVerdictIcon = (verdict: VerdictType) => {
//     switch (verdict) {
//       case "verified": return CheckCircle2;
//       case "suspicious": return AlertTriangle;
//       case "fake": return X;
//       case "uncertain": return HelpCircle;
//     }
//   };

//   const resetVerification = () => {
//     setStatus("idle");
//     setUploadedFile(null);
//     setTextInput("");
//     setUrlInput("");
//     setProgress(0);
//     setResult(null);
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Header />
      
//       {/* Subtle background */}
//       <div className="fixed inset-0 grid-pattern opacity-15 pointer-events-none" />
//       <div className="fixed top-1/4 left-1/4 h-[400px] w-[400px] rounded-full bg-primary/3 blur-[150px] pointer-events-none" />
      
//       <main className="container relative py-8 md:py-12">
//         {/* Page Header */}
//         <div className="mb-8 text-center">
//           <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
//             <Scan className="h-4 w-4 text-primary/80" />
//             <span className="text-sm font-mono text-primary/80">VERIFICATION.MODULE</span>
//           </div>
//           <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
//             Content <span className="text-gradient-cyber">Verification</span>
//           </h1>
//           <p className="text-muted-foreground">
//             Upload or paste content to scan for misinformation and deepfakes
//           </p>
//         </div>

//         <div className="mx-auto max-w-4xl">
//           {status === "idle" && (
//             <div className="rounded-xl border border-border bg-card/30 p-6 md:p-8">
//               <Tabs value={activeTab} onValueChange={setActiveTab}>
//                 <TabsList className="mb-6 grid w-full grid-cols-4 bg-muted/20 border border-border">
//                   <TabsTrigger value="upload" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
//                     <Upload className="h-4 w-4" />
//                     <span className="hidden sm:inline">Upload</span>
//                   </TabsTrigger>
//                   <TabsTrigger value="url" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
//                     <LinkIcon className="h-4 w-4" />
//                     <span className="hidden sm:inline">URL</span>
//                   </TabsTrigger>
//                   <TabsTrigger value="text" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
//                     <MessageSquare className="h-4 w-4" />
//                     <span className="hidden sm:inline">Text</span>
//                   </TabsTrigger>
//                   <TabsTrigger value="voice" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
//                     <Mic className="h-4 w-4" />
//                     <span className="hidden sm:inline">Voice</span>
//                   </TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="upload" className="space-y-4">
//                   <label className="block">
//                     <div className={cn(
//                       "flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all",
//                       uploadedFile 
//                         ? "border-primary/30 bg-primary/5" 
//                         : "border-border hover:border-primary/20 hover:bg-muted/20"
//                     )}>
//                       {uploadedFile ? (
//                         <div className="flex flex-col items-center gap-2 p-6">
//                           {uploadedFile.type.startsWith("image/") && <FileImage className="h-12 w-12 text-primary" />}
//                           {uploadedFile.type.startsWith("video/") && <FileVideo className="h-12 w-12 text-primary" />}
//                           {uploadedFile.type.startsWith("audio/") && <FileAudio className="h-12 w-12 text-primary" />}
//                           <p className="font-medium text-foreground">{uploadedFile.name}</p>
//                           <p className="text-sm text-muted-foreground font-mono">
//                             {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
//                           </p>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={(e) => {
//                               e.preventDefault();
//                               setUploadedFile(null);
//                             }}
//                             className="mt-2 text-muted-foreground hover:text-danger"
//                           >
//                             <X className="mr-1 h-4 w-4" />
//                             Remove
//                           </Button>
//                         </div>
//                       ) : (
//                         <div className="flex flex-col items-center gap-3 p-6 text-center">
//                           <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
//                             <Upload className="h-8 w-8 text-primary" />
//                           </div>
//                           <p className="text-foreground">
//                             Drop file here or <span className="font-medium text-primary">browse</span>
//                           </p>
//                           <p className="text-sm text-muted-foreground font-mono">
//                             Images, videos, audio up to 50MB
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                     <input
//                       type="file"
//                       className="hidden"
//                       accept="image/*,video/*,audio/*"
//                       onChange={handleFileUpload}
//                     />
//                   </label>

//                   <div className="flex flex-wrap gap-2">
//                     {["JPG", "PNG", "MP4", "MP3", "WAV", "WebM"].map((format) => (
//                       <span key={format} className="rounded border border-primary/20 bg-primary/5 px-2 py-1 text-xs font-mono text-primary/80">
//                         {format}
//                       </span>
//                     ))}
//                   </div>
//                 </TabsContent>

//                 <TabsContent value="url">
//                   <div className="space-y-4">
//                     <input
//                       type="url"
//                       value={urlInput}
//                       onChange={(e) => setUrlInput(e.target.value)}
//                       placeholder="Paste URL from Facebook, Twitter, TikTok, YouTube..."
//                       className="w-full rounded-xl border border-primary/20 bg-muted/30 px-4 py-4 text-foreground placeholder-muted-foreground outline-none transition-all focus:border-primary/50 focus:shadow-neon font-mono text-sm"
//                     />
//                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                       <Info className="h-4 w-4 text-primary/60" />
//                       Supports social media posts, news articles, and image URLs
//                     </div>
//                   </div>
//                 </TabsContent>

//                 <TabsContent value="text">
//                   <div className="space-y-4">
//                     <textarea
//                       value={textInput}
//                       onChange={(e) => setTextInput(e.target.value)}
//                       placeholder="Paste text from WhatsApp, Facebook, SMS..."
//                       rows={6}
//                       className="w-full resize-none rounded-xl border border-primary/20 bg-muted/30 px-4 py-4 text-foreground placeholder-muted-foreground outline-none transition-all focus:border-primary/50 focus:shadow-neon"
//                     />
//                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                       <Info className="h-4 w-4 text-primary/60" />
//                       Works best with complete messages including context
//                     </div>
//                   </div>
//                 </TabsContent>

//                 <TabsContent value="voice">
//                   <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-primary/20 bg-muted/30 p-6">
//                     <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-primary/30 bg-primary/10 shadow-neon">
//                       <Mic className="h-10 w-10 text-primary" />
//                     </div>
//                     <p className="mb-2 text-lg font-medium text-foreground">Voice Input</p>
//                     <p className="mb-4 text-center text-sm text-muted-foreground">
//                       Speak in Nepali or English to describe content
//                     </p>
//                     <Button className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20">
//                       <Mic className="mr-2 h-4 w-4" />
//                       Start Recording
//                     </Button>
//                   </div>
//                 </TabsContent>
//               </Tabs>

//               <div className="mt-6">
//                 <Button
//                   size="lg"
//                   className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon"
//                   onClick={handleStartVerification}
//                   disabled={
//                     (activeTab === "upload" && !uploadedFile) ||
//                     (activeTab === "url" && !urlInput) ||
//                     (activeTab === "text" && !textInput)
//                   }
//                 >
//                   <Scan className="mr-2 h-5 w-5" />
//                   Initialize Scan
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* Processing State */}
//           {(status === "uploading" || status === "analyzing") && (
//             <div className="rounded-2xl border border-primary/20 bg-card/30 p-8 text-center backdrop-blur-xl shadow-cyber">
//               <div className="mb-6 flex justify-center">
//                 <div className="relative">
//                   <div className="flex h-24 w-24 items-center justify-center rounded-full border border-primary/30 bg-primary/10 shadow-neon animate-pulse-glow">
//                     {status === "uploading" ? (
//                       <Upload className="h-12 w-12 text-primary" />
//                     ) : (
//                       <Brain className="h-12 w-12 text-primary animate-pulse" />
//                     )}
//                   </div>
//                   <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-primary/30 bg-background px-3 py-1 text-xs font-mono text-primary">
//                     {progress}%
//                   </div>
//                 </div>
//               </div>

//               <h2 className="mb-2 text-xl font-semibold text-foreground">
//                 {status === "uploading" ? "Uploading Content..." : "Neural Analysis..."}
//               </h2>
//               <p className="mb-6 text-muted-foreground font-mono text-sm">
//                 {status === "uploading"
//                   ? "Secure upload in progress"
//                   : "AI models processing content"}
//               </p>

//               <Progress value={progress} className="mb-6 h-2 bg-muted/50" />

//               <div className="text-sm text-muted-foreground font-mono">
//                 {status === "analyzing" && (
//                   <ul className="space-y-2">
//                     <li className={cn("flex items-center justify-center gap-2", progress > 40 && "text-verified")}>
//                       {progress > 40 ? <CheckCircle2 className="h-4 w-4" /> : <Loader2 className="h-4 w-4 animate-spin" />}
//                       Checking fake news patterns
//                     </li>
//                     <li className={cn("flex items-center justify-center gap-2", progress > 60 && "text-verified")}>
//                       {progress > 60 ? <CheckCircle2 className="h-4 w-4" /> : <Loader2 className="h-4 w-4 animate-spin" />}
//                       Analyzing media authenticity
//                     </li>
//                     <li className={cn("flex items-center justify-center gap-2", progress > 80 && "text-verified")}>
//                       {progress > 80 ? <CheckCircle2 className="h-4 w-4" /> : <Loader2 className="h-4 w-4 animate-spin" />}
//                       Cross-referencing sources
//                     </li>
//                     <li className={cn("flex items-center justify-center gap-2", progress > 95 && "text-verified")}>
//                       {progress > 95 ? <CheckCircle2 className="h-4 w-4" /> : <Loader2 className="h-4 w-4 animate-spin" />}
//                       Generating report
//                     </li>
//                   </ul>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Results */}
//           {status === "complete" && result && (
//             <div className="space-y-6">
//               {/* Verdict Card */}
//               {(() => {
//                 const config = getVerdictConfig(result.verdict);
//                 const Icon = getVerdictIcon(result.verdict);
//                 return (
//                   <div className={cn(
//                     "rounded-2xl border-2 p-8 backdrop-blur-xl",
//                     config.border,
//                     config.bg,
//                     config.glow
//                   )}>
//                     <div className="flex flex-col items-center text-center md:flex-row md:text-left">
//                       <div className={cn("mb-4 flex h-20 w-20 items-center justify-center rounded-full border md:mb-0 md:mr-6", config.border, config.bg)}>
//                         <Icon className={cn("h-10 w-10", config.color)} />
//                       </div>
//                       <div className="flex-1">
//                         <p className={cn("mb-1 text-sm font-mono uppercase tracking-wider", config.color)}>
//                           Verification Result
//                         </p>
//                         <h2 className={cn("mb-2 text-2xl font-bold capitalize md:text-3xl", config.color)}>
//                           {result.verdict === "fake" ? "Likely Fake" : 
//                            result.verdict === "suspicious" ? "Suspicious Content" :
//                            result.verdict === "verified" ? "Likely Authentic" : "Uncertain"}
//                         </h2>
//                         <p className="text-muted-foreground">
//                           {result.verdict === "suspicious" 
//                             ? "This content shows signs of manipulation or misinformation"
//                             : "Analysis complete"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })()}

//               {/* Scores */}
//               <div className="grid gap-4 md:grid-cols-2">
//                 <div className="rounded-xl border border-danger/20 bg-card/30 p-6 backdrop-blur-sm">
//                   <div className="mb-4 flex items-center justify-between">
//                     <span className="text-sm font-mono text-muted-foreground">FAKE_NEWS_SCORE</span>
//                     <span className="text-2xl font-bold text-danger font-mono">{result.fakeScore}%</span>
//                   </div>
//                   <Progress value={result.fakeScore} className="h-2 bg-muted/50" />
//                 </div>
//                 <div className="rounded-xl border border-warning/20 bg-card/30 p-6 backdrop-blur-sm">
//                   <div className="mb-4 flex items-center justify-between">
//                     <span className="text-sm font-mono text-muted-foreground">DEEPFAKE_SCORE</span>
//                     <span className="text-2xl font-bold text-warning font-mono">{result.deepfakeScore}%</span>
//                   </div>
//                   <Progress value={result.deepfakeScore} className="h-2 bg-muted/50" />
//                 </div>
//               </div>

//               {/* Manipulation Indicators */}
//               <div className="rounded-xl border border-primary/20 bg-card/30 p-6 backdrop-blur-sm">
//                 <h3 className="mb-4 font-semibold text-foreground flex items-center gap-2">
//                   <AlertTriangle className="h-5 w-5 text-warning" />
//                   Manipulation Indicators
//                 </h3>
//                 <ul className="space-y-2">
//                   {result.manipulationIndicators.map((indicator, index) => (
//                     <li key={index} className="flex items-start gap-3 rounded-lg border border-warning/20 bg-warning/5 p-3">
//                       <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
//                       <span className="text-sm text-foreground">{indicator}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               {/* Explanation */}
//               <div className="rounded-xl border border-primary/20 bg-card/30 p-6 backdrop-blur-sm">
//                 <h3 className="mb-4 font-semibold text-foreground flex items-center gap-2">
//                   <Brain className="h-5 w-5 text-primary" />
//                   AI Analysis
//                 </h3>
//                 <div className="space-y-4">
//                   <div className="rounded-lg border border-primary/10 bg-muted/30 p-4">
//                     <p className="mb-1 text-xs font-mono text-primary/60">ENGLISH</p>
//                     <p className="text-foreground">{result.explanation}</p>
//                   </div>
//                   <div className="rounded-lg border border-accent/10 bg-accent/5 p-4">
//                     <p className="mb-1 text-xs font-mono text-accent/60">नेपाली</p>
//                     <p className="text-foreground">{result.explanationNepali}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex flex-wrap gap-3">
//                 <Button className="gap-2 bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20">
//                   <Share2 className="h-4 w-4" />
//                   Share Result
//                 </Button>
//                 <Button variant="outline" className="gap-2 border-danger/30 text-danger hover:bg-danger/10">
//                   <Flag className="h-4 w-4" />
//                   Report Dangerous
//                 </Button>
//                 <Button variant="ghost" onClick={resetVerification} className="gap-2 text-muted-foreground hover:text-foreground">
//                   <Zap className="h-4 w-4" />
//                   New Scan
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// }


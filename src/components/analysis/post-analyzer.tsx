
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ScoreCircle } from "./score-circle";
import { auth } from "@/lib/firebase";
import { processPostAnalysis } from "@/app/lib/actions";
import { Sparkles, Copy, RefreshCw, Zap, TrendingUp, Heart, Smile, Check, Info } from "lucide-react";
import { AnalyzePostEngagementOutput } from "@/ai/flows/analyze-post-engagement";

export function PostAnalyzer() {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (text.length < 10) {
      toast({ title: "Too short", description: "Post must be at least 10 characters.", variant: "destructive" });
      return;
    }
    if (text.length > 500) {
      toast({ title: "Too long", description: "Post must be under 500 characters.", variant: "destructive" });
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      toast({ title: "Authentication required", description: "Please sign in to analyze posts.", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysisResult = await processPostAnalysis(user.uid, user.displayName || "Anonymous", user.photoURL, text);
      setResult(analysisResult);
    } catch (error: any) {
      toast({ title: "Analysis failed", description: error.message, variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: "Copied!", description: "Optimized post copied to clipboard." });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
      <div className="space-y-6">
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-right from-primary to-gold" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Analyze Post
            </CardTitle>
            <CardDescription>Enter your social media post text for an instant AI engagement score.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Textarea
                placeholder="Paste your post content here... (10-500 characters)"
                className="min-h-[160px] resize-none border-primary/10 focus-visible:ring-primary font-body text-lg"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                {text.length}/500
              </div>
            </div>
            <Button 
              className="w-full h-12 text-lg font-headline shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
              onClick={handleAnalyze}
              disabled={isAnalyzing || text.length < 10}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing with Gemini...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Measure Engagement
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-gold/20 glow-gold">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-gold" />
                  Optimized Versions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.optimizations.map((opt: string, idx: number) => (
                  <div key={idx} className="group relative rounded-xl border border-gold/10 bg-muted/30 p-4 transition-all hover:bg-muted/50">
                    <p className="text-sm md:text-base leading-relaxed mb-4">{opt}</p>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(opt)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {result ? (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <Card className="flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-card to-background">
              <ScoreCircle score={result.analysis.overallEngagementScore} size="lg" label="Total IQ" />
              <div className="mt-6">
                <Badge className="bg-primary/20 text-primary border-primary/30 py-1 px-4 text-sm mb-2">
                  Tone: {result.analysis.emotionalTone}
                </Badge>
                <p className="text-muted-foreground text-sm">Potential reach: <span className="text-foreground font-bold">{result.analysis.overallEngagementScore > 80 ? "Viral Potential" : result.analysis.overallEngagementScore > 60 ? "Solid Reach" : "Niche Audience"}</span></p>
              </div>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-gold" /> Hook Strength</span>
                    <span className="font-bold">{result.analysis.hookStrength}%</span>
                  </div>
                  <Progress value={result.analysis.hookStrength} className="h-1.5" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2"><Heart className="h-4 w-4 text-primary" /> Emotional Intensity</span>
                    <span className="font-bold">{result.analysis.emotionalIntensity}%</span>
                  </div>
                  <Progress value={result.analysis.emotionalIntensity} className="h-1.5" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Clarity</span>
                    <span className="font-bold">{result.analysis.clarity}%</span>
                  </div>
                  <Progress value={result.analysis.clarity} className="h-1.5" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2"><Smile className="h-4 w-4 text-blue-400" /> Novelty</span>
                    <span className="font-bold">{result.analysis.novelty}%</span>
                  </div>
                  <Progress value={result.analysis.novelty} className="h-1.5" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Virality Factors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.analysis.viralityFactors.map((f: string, i: number) => (
                    <Badge key={i} variant="outline" className="border-primary/30 text-xs">{f}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Info className="h-4 w-4" /> Optimization Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {result.analysis.optimizationSuggestions.map((s: string, i: number) => (
                  <p key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-primary">•</span> {s}
                  </p>
                ))}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground border-dashed border-muted">
            <RefreshCw className="h-12 w-12 mb-4 opacity-20" />
            <p>Analysis results will appear here after you measure engagement.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

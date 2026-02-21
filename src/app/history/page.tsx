
'use client';

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { NavBar } from "@/components/layout/nav-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { getUserHistory } from "@/app/lib/actions";
import { Calendar, TrendingUp, Sparkles, ChevronRight, Search } from "lucide-react";
import { format } from "date-fns";

export default function HistoryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const history = await getUserHistory(u.uid);
        setPosts(history);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center"><Sparkles className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen pb-20 md:pt-20">
      <NavBar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold mb-1">Your Post IQ History</h1>
            <p className="text-muted-foreground">Review your past performance and improvements.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1">{posts.length} Analyzed</Badge>
          </div>
        </header>

        {posts.length === 0 ? (
          <Card className="text-center p-12 bg-muted/20 border-dashed">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground mb-4">No analysis history found yet.</p>
            <Button asChild><a href="/">Start Analyzing</a></Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden border-primary/10 hover:border-primary/30 transition-all">
                <CardHeader className="p-4 bg-muted/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {post.createdAt ? format(post.createdAt.toDate(), "MMM dd, yyyy • HH:mm") : 'Recent'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={post.analysis.overallEngagementScore > 75 ? "bg-green-500/20 text-green-500 border-green-500/30" : "bg-primary/20 text-primary border-primary/30"}>
                        Score: {post.analysis.overallEngagementScore}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="details" className="border-none">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/5 transition-all">
                        <p className="text-left line-clamp-1 text-sm flex-1 pr-4">{post.text}</p>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 py-4 space-y-4 bg-background">
                        <div className="rounded-lg bg-muted/30 p-4">
                          <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-2">Original Post</h4>
                          <p className="text-sm italic">{post.text}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-[10px] uppercase text-muted-foreground mb-1">Hook</p>
                            <p className="font-bold text-lg">{post.analysis.hookStrength}%</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase text-muted-foreground mb-1">Clarity</p>
                            <p className="font-bold text-lg">{post.analysis.clarity}%</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase text-muted-foreground mb-1">Tone</p>
                            <p className="font-bold">{post.analysis.emotionalTone}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase text-muted-foreground mb-1">Novelty</p>
                            <p className="font-bold text-lg">{post.analysis.novelty}%</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-xs uppercase tracking-wider text-gold mb-2 flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> AI Optimizations
                          </h4>
                          {post.optimizations.map((opt: string, i: number) => (
                            <div key={i} className="text-xs p-2 rounded bg-gold/5 border border-gold/10">
                              {opt}
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

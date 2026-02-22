
'use client';

import { useMemo } from "react";
import { NavBar } from "@/components/layout/nav-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Star, User, Flame, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { useFirestore } from "@/firebase";

export default function LeaderboardPage() {
  const db = useFirestore();
  
  // Use client-side useCollection to fetch leaderboard entries.
  // This ensures security rules are applied and allows for detailed error feedback.
  const leaderboardQuery = useMemoFirebase(() => {
    return query(
      collection(db, "leaderboard_entries"),
      orderBy("score", "desc"),
      limit(10)
    );
  }, [db]);

  const { data: entries, isLoading, error } = useCollection(leaderboardQuery);

  return (
    <div className="min-h-screen pb-20 md:pt-20">
      <NavBar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <header className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 text-gold animate-bounce">
            <Trophy className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-headline font-bold mb-2">Global IQ Rankings</h1>
          <p className="text-muted-foreground">The most engaging posts generated this week.</p>
        </header>

        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="animate-pulse h-20 bg-muted/50" />
            ))
          ) : error ? (
            <Card className="p-8 text-center border-destructive/20 bg-destructive/5">
              <p className="text-destructive font-medium mb-2">Failed to load leaderboard.</p>
              <p className="text-xs text-muted-foreground">This may be due to security rule restrictions. Our diagnostic system has recorded this event.</p>
            </Card>
          ) : !entries || entries.length === 0 ? (
            <Card className="text-center p-12 bg-muted/20 border-dashed">
              <p className="text-muted-foreground">The leaderboard is currently empty. Be the first to rank!</p>
            </Card>
          ) : (
            entries.map((entry, index) => (
              <Card 
                key={entry.id} 
                className={`relative overflow-hidden transition-all hover:scale-[1.01] ${index === 0 ? "border-gold/50 glow-gold bg-gold/5" : "border-primary/10"}`}
              >
                {index === 0 && (
                  <div className="absolute top-0 right-0 p-2">
                    <Star className="h-6 w-6 text-gold fill-gold" />
                  </div>
                )}
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center font-headline font-bold text-xl italic text-muted-foreground">
                    {index === 0 ? <Trophy className="h-8 w-8 text-gold" /> : index === 1 ? <Medal className="h-7 w-7 text-gray-400" /> : index === 2 ? <Medal className="h-6 w-6 text-orange-400" /> : `#${index + 1}`}
                  </div>
                  
                  <Avatar className={`h-12 w-12 border-2 ${index === 0 ? "border-gold" : "border-muted"}`}>
                    <AvatarImage src={entry.photoUrl || ""} />
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline font-bold text-lg truncate flex items-center gap-2">
                      {entry.displayName}
                      {index < 3 && <Badge variant="secondary" className="text-[10px] h-4">Elite Creator</Badge>}
                    </h3>
                    <p className="text-muted-foreground text-sm truncate italic">"{entry.text || 'High engagement post'}"</p>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end text-gold font-bold text-2xl font-headline">
                      {entry.score}
                      <Flame className="h-5 w-5 fill-gold" />
                    </div>
                    <span className="text-[10px] uppercase text-muted-foreground tracking-widest">IQ SCORE</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-primary/10 border border-primary/20 text-center">
          <h2 className="text-xl font-headline font-bold mb-2 flex items-center justify-center gap-2">
            <TrendingUp className="h-5 w-5" /> Want to see your name here?
          </h2>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">Analyze your posts and aim for the top. Leaderboard entries are limited to 1 per user per day to ensure fairness.</p>
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}

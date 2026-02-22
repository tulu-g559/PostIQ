
'use client';

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Zap, Sparkles, TrendingUp, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function LandingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Zap className="h-12 w-12 text-primary animate-pulse" />
      </div>
    );
  }

  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bg');

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">Q</div>
            <span className="font-headline text-xl font-bold tracking-tight">Post<span className="text-primary">IQ</span></span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Button asChild variant="default">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button asChild variant="ghost">
                <Link href="/signup">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="container relative z-10 mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Engagement Analysis</span>
            </div>
            <h1 className="mx-auto max-w-4xl font-headline text-5xl font-bold tracking-tight sm:text-7xl mb-6">
              Level Up Your <span className="text-primary">Social IQ</span> with Gemini
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10 md:text-xl">
              Stop guessing and start growing. Get instant engagement scores, virality factors, and AI-optimized rewrites for your social media posts.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="h-12 px-8 text-lg font-headline">
                <Link href={user ? "/dashboard" : "/signup"}>
                  Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-lg font-headline">
                <Link href="/leaderboard">View Leaderboard</Link>
              </Button>
            </div>
          </div>
          
          {/* Background Decoration */}
          <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-primary/10 blur-[120px] rounded-full" />
        </section>

        {/* Features Section */}
        <section className="py-24 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-headline text-3xl font-bold mb-4">Engineered for Creators</h2>
              <p className="text-muted-foreground">Everything you need to master social media algorithm.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-2xl border bg-card p-8 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Instant Scoring</h3>
                <p className="text-muted-foreground">Predict your post's performance before you hit send with our 0-100 IQ Score.</p>
              </div>
              <div className="rounded-2xl border bg-card p-8 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI Optimization</h3>
                <p className="text-muted-foreground">Receive two distinct, optimized versions of your post designed for maximum reach.</p>
              </div>
              <div className="rounded-2xl border bg-card p-8 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Global Leaderboard</h3>
                <p className="text-muted-foreground">Compete with creators globally and see where your content ranks in the Elite Creator list.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs">Q</div>
            <span className="font-headline font-bold tracking-tight">PostIQ</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Powered by Google Gemini 2.5 Flash</p>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            <span>Secure AES-256 Encryption</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

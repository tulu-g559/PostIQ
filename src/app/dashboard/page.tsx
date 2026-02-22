
'use client';

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/layout/nav-bar";
import { PostAnalyzer } from "@/components/analysis/post-analyzer";
import { Zap } from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push("/");
      } else {
        setUser(u);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Zap className="h-12 w-12 text-primary animate-pulse" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen pb-20 md:pt-20">
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-10">
          <h1 className="text-3xl font-headline font-bold mb-2">Welcome back, {user.displayName || user.email?.split('@')[0] || 'Creator'}</h1>
          <p className="text-muted-foreground">Ready to optimize your next post?</p>
        </div>
        
        <PostAnalyzer />
      </main>
    </div>
  );
}

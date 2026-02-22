
'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { LayoutDashboard, History, Trophy, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function NavBar() {
  const pathname = usePathname();
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  ];

  if (!user) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-md md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="hidden items-center gap-2 md:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">Q</div>
          <span className="font-headline text-xl font-bold tracking-tight">Post<span className="text-primary">IQ</span></span>
        </div>

        <div className="flex flex-1 items-center justify-around gap-1 md:flex-none md:justify-end md:gap-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex flex-col h-auto py-1 gap-1 md:flex-row md:h-10 md:py-2 md:px-4",
                  pathname === item.href ? "text-primary bg-primary/10" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] md:text-sm">{item.label}</span>
              </Button>
            </Link>
          ))}
          
          <div className="flex items-center gap-2 border-l pl-4 ml-2">
            <Avatar className="h-8 w-8 border border-primary/20">
              <AvatarImage src={user.photoURL || ""} />
              <AvatarFallback className="bg-primary/20 text-primary uppercase text-xs">
                {user.displayName?.charAt(0) || user.email?.charAt(0) || <User className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

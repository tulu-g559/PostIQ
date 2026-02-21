
'use client';

import { cn } from "@/lib/utils";

interface ScoreCircleProps {
  score: number;
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function ScoreCircle({ score, size = "md", label }: ScoreCircleProps) {
  const radius = size === "lg" ? 45 : size === "md" ? 35 : 25;
  const stroke = size === "lg" ? 8 : size === "md" ? 6 : 4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const sizes = {
    sm: "h-16 w-16 text-sm",
    md: "h-32 w-32 text-2xl",
    lg: "h-48 w-48 text-4xl",
  };

  return (
    <div className={cn("relative flex flex-col items-center justify-center", sizes[size])}>
      <svg className="h-full w-full rotate-[-90deg]">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="transparent"
          className="text-muted/30"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="url(#score-gradient)"
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF6B00" />
            <stop offset="50%" stopColor="#FFD60A" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-headline font-bold">{score}</span>
        {label && <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>}
      </div>
    </div>
  );
}

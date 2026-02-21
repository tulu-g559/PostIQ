
'use server';

import { analyzePostEngagement, AnalyzePostEngagementOutput } from "@/ai/flows/analyze-post-engagement";
import { generatePostOptimizations, GeneratePostOptimizationsOutput } from "@/ai/flows/generate-post-optimizations";
import { db } from "@/lib/firebase-admin"; // We'll need to create this admin helper or use client db if rules allow
// For this demo, we'll assume a pattern where we can use server-side firebase logic.
// However, since we don't have firebase-admin installed, we'll use the client SDK pattern in a server context or simulate the storage.
// To stay within the developer's provided stack, we'll stick to a mock storage approach if admin is unavailable, 
// but actually we'll use regular Firestore client since we're in a Server Action and it works if initialized correctly.

import { collection, addDoc, getDocs, query, where, limit, orderBy, Timestamp, setDoc, doc, getDoc } from "firebase/firestore";
import { db as clientDb } from "@/lib/firebase";

export async function processPostAnalysis(userId: string, userName: string, userPhoto: string | null, postText: string) {
  if (postText.length < 10 || postText.length > 500) {
    throw new Error("Post must be between 10 and 500 characters.");
  }

  // 1. Run Analysis
  const analysis = await analyzePostEngagement({ postText });
  const optimizations = await generatePostOptimizations({ postText });

  const postData = {
    userId,
    userName,
    userPhoto,
    text: postText,
    analysis,
    optimizations: optimizations.optimizedPosts,
    createdAt: Timestamp.now(),
  };

  // 2. Store in Posts collection
  const postsRef = collection(clientDb, "posts");
  const postDoc = await addDoc(postsRef, postData);

  // 3. Leaderboard logic
  if (analysis.overallEngagementScore >= 50) {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const leaderboardId = `${userId}_${today}`;
    const leaderboardRef = doc(clientDb, "leaderboard", leaderboardId);
    
    const existingEntry = await getDoc(leaderboardRef);
    
    if (!existingEntry.exists() || analysis.overallEngagementScore > existingEntry.data()?.score) {
      await setDoc(leaderboardRef, {
        userId,
        userName,
        userPhoto,
        score: analysis.overallEngagementScore,
        text: postText,
        date: today,
        createdAt: Timestamp.now(),
      });
    }
  }

  return { id: postDoc.id, ...postData };
}

export async function getLeaderboard() {
  const leaderboardRef = collection(clientDb, "leaderboard");
  const q = query(leaderboardRef, orderBy("score", "desc"), limit(10));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getUserHistory(userId: string) {
  const postsRef = collection(clientDb, "posts");
  const q = query(postsRef, where("userId", "==", userId), orderBy("createdAt", "desc"), limit(20));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

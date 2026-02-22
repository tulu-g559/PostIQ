
'use server';

import { analyzePostEngagement } from "@/ai/flows/analyze-post-engagement";
import { generatePostOptimizations } from "@/ai/flows/generate-post-optimizations";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

export async function processPostAnalysis(userId: string, userName: string, userPhoto: string | null, postText: string) {
  if (postText.length < 10 || postText.length > 500) {
    throw new Error("Post must be between 10 and 500 characters.");
  }

  // 1. Run Analysis
  const analysis = await analyzePostEngagement({ postText });
  const optimizations = await generatePostOptimizations({ postText });

  const db = getAdminFirestore();

  const postData = {
    userId,
    userName,
    userPhoto,
    originalText: postText,
    analysis,
    optimizations: optimizations.optimizedPosts,
    createdAt: Timestamp.now(),
  };

  // 2. Store in Posts collection
  const postsRef = db.collection("users").doc(userId).collection("posts");
  const postDoc = await postsRef.add(postData);

  // 3. Leaderboard logic
  if (analysis.overallEngagementScore >= 50) {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const leaderboardId = `${userId}_${today}`;
    const leaderboardRef = db.collection("leaderboard_entries").doc(leaderboardId);
    
    const existingEntry = await leaderboardRef.get();
    
    if (!existingEntry.exists || analysis.overallEngagementScore > existingEntry.data()?.score) {
      await leaderboardRef.set({
        id: leaderboardId,
        userId,
        postId: postDoc.id,
        score: analysis.overallEngagementScore,
        entryDate: today,
        createdAt: Timestamp.now(),
        displayName: userName,
        photoUrl: userPhoto,
        text: postText,
      });
    }
  }

  return {
    id: postDoc.id,
    ...postData,
    createdAt: postData.createdAt.toDate().toISOString(),
  };
}

export async function getUserHistory(userId: string) {
  const db = getAdminFirestore();
  const postsRef = db.collection("users").doc(userId).collection("posts");
  const snapshot = await postsRef.orderBy("createdAt", "desc").limit(20).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

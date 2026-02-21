# **App Name**: PostIQ

## Core Features:

- Firebase Authentication: Implement secure user authentication with Google login and email/password login.
- Firestore Data Storage: Store user profiles, posts, and leaderboard data in Firestore collections, including optimized indexing.
- Post Analysis with Gemini: Utilize a Cloud Function to analyze post text via the Gemini API. It should validate input, call Gemini with a structured JSON output format request, parse the JSON response, and store the analysis results in Firestore.
- Engagement Score Calculation: Use Gemini API to calculate component scores (hook strength, emotional intensity, clarity, novelty) and compute a weighted engagement score. Penalize vague phrasing and reward novelty. Round to the nearest integer.
- Real-time Dashboard: Display a dashboard with a textarea for input, an analyze button, a loading state, and a result card showcasing the engagement score (progress bar), emotional tone, hook strength, clarity score, virality factors, and optimized versions.
- History and Leaderboard Pages: Enable users to browse their previous posts, sorted by date, with the ability to expand and view the full analysis and leaderboard section. Implement Firestore real-time listeners for leaderboard and user post history updates with smooth animations.
- AI Post Optimization: Generate 2 improved rewrites of the original post using the Gemini API and present them in the user interface with a convenient 'copy' tool.
- Leaderboard Fairness: Limit leaderboard to a maximum of 1 entry per user per calendar day, storing only the highest score if multiple posts exceed the threshold. Enforce logic in Cloud Function before writing to the leaderboard.
- Security Enhancements: Validate text length (10–500 characters) in Cloud Function and Firestore security rules. Ensure users can only read/write their own posts. Leaderboard remains publicly readable.

## Style Guidelines:

- Primary color: Background - #111111 - base background
- Accent color: #FF6B00 to highlight interactive elements and scores.
- Secondary Accent: Electric Gold (#FFD60A) — high-score highlights, badges, leaderboard glow
- Score gradient: #FF6B00 → #FF9F1C → #FFD60A → lime for visual representation of scores.
- Body font: 'Poppins', a sans font for a modern, machined, objective, neutral look. Headline Font: 'Space Grotesk', a proportional sans-serif for headlines and short amounts of body text.
- Code font: 'Source Code Pro' for displaying any code snippets.
- Use clean, minimalist icons to represent virality factors and emotional tones.
- Incorporate smooth animations for score updates and transitions to enhance user experience.
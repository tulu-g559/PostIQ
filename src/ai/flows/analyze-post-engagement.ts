'use server';
/**
 * @fileOverview A Genkit flow for analyzing social media post engagement.
 *
 * - analyzePostEngagement - A function that handles the post engagement analysis process.
 * - AnalyzePostEngagementInput - The input type for the analyzePostEngagement function.
 * - AnalyzePostEngagementOutput - The return type for the analyzePostEngagement function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzePostEngagementInputSchema = z.object({
  postText: z
    .string()
    .min(10, 'Post text must be at least 10 characters long.')
    .max(500, 'Post text cannot exceed 500 characters.')
    .describe('The text content of the social media post to be analyzed.'),
});
export type AnalyzePostEngagementInput = z.infer<typeof AnalyzePostEngagementInputSchema>;

const AnalyzePostEngagementOutputSchema = z.object({
  overallEngagementScore: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe(
      'An overall score (0-100, integer) representing the potential engagement of the post. This is a weighted average of other component scores.'
    ),
  hookStrength: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe('A score (0-100, integer) indicating how effectively the post grabs attention.'),
  emotionalIntensity: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe('A score (0-100, integer) indicating the strength of emotion conveyed in the post.'),
  clarity: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe('A score (0-100, integer) indicating how clear and understandable the post is.'),
  novelty: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe('A score (0-100, integer) indicating the originality and freshness of the post content.'),
  emotionalTone: z
    .string()
    .describe(
      "The predominant emotional tone of the post (e.g., 'Positive', 'Negative', 'Neutral', 'Inspiring', 'Humorous')."
    ),
  viralityFactors: z
    .array(z.string())
    .describe('A list of keywords or phrases describing factors that could make the post viral.'),
  optimizationSuggestions: z
    .array(z.string())
    .describe(
      'A list of short, actionable suggestions to improve the post for better engagement and virality.'
    ),
});
export type AnalyzePostEngagementOutput = z.infer<typeof AnalyzePostEngagementOutputSchema>;

export async function analyzePostEngagement(
  input: AnalyzePostEngagementInput
): Promise<AnalyzePostEngagementOutput> {
  return analyzePostEngagementFlow(input);
}

const analyzePostEngagementPrompt = ai.definePrompt({
  name: 'analyzePostEngagementPrompt',
  input: { schema: AnalyzePostEngagementInputSchema },
  output: { schema: AnalyzePostEngagementOutputSchema },
  prompt: `You are an expert social media analyst specializing in predicting post engagement.

Your task is to analyze the provided social media post and provide a comprehensive assessment in a structured JSON format.

Analyze the following aspects, providing a score from 0-100 (rounded to the nearest integer) for each:
- **Hook Strength**: How well the opening captures attention.
- **Emotional Intensity**: The strength of emotion evoked.
- **Clarity**: How clear and easy to understand the message is.
- **Novelty**: How original or fresh the content and perspective are. Reward unique insights and penalize common, uninspired phrasing.

Based on these component scores, calculate a weighted **Overall Engagement Score** (0-100, rounded to the nearest integer). Assign higher weight to novelty and hook strength.

Also, identify the **Emotional Tone** (e.g., 'Positive', 'Negative', 'Neutral', 'Inspiring', 'Humorous'), list key **Virality Factors**, and provide concise **Optimization Suggestions** to improve the post's potential impact.

Ensure all scores are integers.

Post to analyze: """{{{postText}}}"""

Provide the output strictly in the following JSON format, including all fields:
${JSON.stringify(AnalyzePostEngagementOutputSchema.shape, null, 2)}
`,
});

const analyzePostEngagementFlow = ai.defineFlow(
  {
    name: 'analyzePostEngagementFlow',
    inputSchema: AnalyzePostEngagementInputSchema,
    outputSchema: AnalyzePostEngagementOutputSchema,
  },
  async (input) => {
    const { output } = await analyzePostEngagementPrompt(input);
    if (!output) {
      throw new Error('Failed to analyze post engagement: output is undefined.');
    }
    return output;
  }
);

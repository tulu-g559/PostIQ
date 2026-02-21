'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating two optimized versions of a given post.
 *
 * - generatePostOptimizations - A function that handles the post optimization process.
 * - GeneratePostOptimizationsInput - The input type for the generatePostOptimizations function.
 * - GeneratePostOptimizationsOutput - The return type for the generatePostOptimizations function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneratePostOptimizationsInputSchema = z.object({
  postText: z
    .string()
    .min(10)
    .max(500)
    .describe('The original text of the post to be optimized. Must be between 10 and 500 characters long.'),
});
export type GeneratePostOptimizationsInput = z.infer<typeof GeneratePostOptimizationsInputSchema>;

const GeneratePostOptimizationsOutputSchema = z.object({
  optimizedPosts: z
    .array(z.string())
    .min(2)
    .max(2)
    .describe('An array containing two distinct optimized versions of the original post.'),
});
export type GeneratePostOptimizationsOutput = z.infer<typeof GeneratePostOptimizationsOutputSchema>;

export async function generatePostOptimizations(
  input: GeneratePostOptimizationsInput
): Promise<GeneratePostOptimizationsOutput> {
  return generatePostOptimizationsFlow(input);
}

const generatePostOptimizationsPrompt = ai.definePrompt({
  name: 'generatePostOptimizationsPrompt',
  input: { schema: GeneratePostOptimizationsInputSchema },
  output: { schema: GeneratePostOptimizationsOutputSchema },
  prompt: `You are an expert content optimizer. Your goal is to rewrite the provided post to maximize engagement, hook strength, emotional intensity, clarity, and novelty.

Provide two distinct, optimized versions of the original post. Each optimized version should be a standalone string.

Original Post:
{{{postText}}}

Output should be a JSON object matching the following schema:
{{{_output_schema}}}`, 
});

const generatePostOptimizationsFlow = ai.defineFlow(
  {
    name: 'generatePostOptimizationsFlow',
    inputSchema: GeneratePostOptimizationsInputSchema,
    outputSchema: GeneratePostOptimizationsOutputSchema,
  },
  async (input) => {
    const { output } = await generatePostOptimizationsPrompt(input);
    if (!output) {
      throw new Error('Failed to generate optimized posts.');
    }
    return output;
  }
);

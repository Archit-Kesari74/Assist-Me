import type { RequestCategory } from '@/types';

interface ParseResult {
  category: RequestCategory;
  title: string;
  estimatedCost: number;
}

const CATEGORY_RULES: {
  match: RegExp;
  category: RequestCategory;
  title: string;
  cost: number;
}[] = [
  { match: /\b(grocer|grocery|milk|bread|biscuit|fruit|vegetable|egg|rice|flour|sugar|tea|coffee|snack|food)\b/i, category: 'groceries', title: 'Groceries', cost: 300 },
  { match: /\b(medicine|medication|tablet|tablet|pill|tablet)\b/i, category: 'medicine', title: 'Medicine', cost: 250 },
  { match: /\b(ride|drive|cab|taxi|car|hospital|doctor|clinic|appointment)\b/i, category: 'ride', title: 'A Ride', cost: 200 },
  { match: /\b(home|clean|repair|fix|plumb|electric|paint|help at home|house)\b/i, category: 'home', title: 'Help at Home', cost: 500 },
];

export function parseRequest(transcript: string): ParseResult {
  const text = transcript.trim();
  for (const rule of CATEGORY_RULES) {
    if (rule.match.test(text)) {
      return { category: rule.category, title: rule.title, estimatedCost: rule.cost };
    }
  }
  return { category: 'other', title: 'A Helping Hand', estimatedCost: 150 };
}

export function isMedicine(transcript: string): boolean {
  return /\b(medicine|medication|tablet|pill|capsule)\b/i.test(transcript.trim());
}

/** Clean up a raw transcript into a tidy description. */
export function tidyTranscript(transcript: string): string {
  const cleaned = transcript
    .trim()
    .replace(/\bi\s+(need|want|would like)\b/gi, '')
    .replace(/\bplease\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned) return transcript.trim();
  // Capitalize first letter
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

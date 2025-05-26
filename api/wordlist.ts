// /api/wordlist.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const response = await fetch("https://fly.wordfinderapi.com/api/search?length=5&word_sorting=az&group_by_length=true&page_size=99999&dictionary=all_en");
    const data = await response.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching word list', error });
  }
}

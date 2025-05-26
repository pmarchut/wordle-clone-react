// api/wordlist.ts
export const config = {
  runtime: 'edge', // 🔁 kluczowy zapis – to Edge Function
};

export default async function handler() {
  try {
    const response = await fetch("https://fly.wordfinderapi.com/api/search?length=5&word_sorting=az&group_by_length=true&page_size=99999&dictionary=all_en");
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Error fetching word list', error }),
      { status: 500 }
    );
  }
}

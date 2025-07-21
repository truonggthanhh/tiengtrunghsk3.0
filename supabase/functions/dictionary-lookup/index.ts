import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// These are required for CORS to allow your web app to call this function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// A simple, free API based on the Han Viet Dictionary project
const DICTIONARY_API_URL = "https://hvdic.thivien.net/transcript-query.php?mode=word";

interface SearchResult {
  han: string;
  pinyin: string;
  viet: string;
}

serve(async (req) => {
  // This is needed for CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { term, direction } = await req.json();

    if (!term) {
      return new Response(JSON.stringify({ error: "Search term is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let results: SearchResult[] = [];

    if (direction === 'han-viet') {
      // The API expects the term to be URL encoded
      const response = await fetch(`${DICTIONARY_API_URL}&param=${encodeURIComponent(term)}`);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const htmlResponse = await response.text();
      
      // This API returns a simple string format: "han|pinyin|viet\n"
      // We need to parse it manually.
      const lines = htmlResponse.trim().split('\n');
      results = lines.map(line => {
        const parts = line.split('|');
        return {
          han: parts[0] || '',
          pinyin: parts[1] || '',
          viet: parts[2] || '',
        };
      }).filter(r => r.han && r.viet); // Filter out any empty results
    } else {
      // Viet-Han search can be implemented here if an API is available
      // For now, we'll return an empty array for this direction.
      results = [];
    }

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
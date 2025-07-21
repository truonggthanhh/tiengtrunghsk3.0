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
      const response = await fetch(`${DICTIONARY_API_URL}&param=${encodeURIComponent(term)}`);
      
      // If the API call fails, log it but return empty results for a better user experience
      if (!response.ok) {
        console.error(`API request failed for term "${term}" with status ${response.status}`);
        return new Response(JSON.stringify([]), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      const textResponse = await response.text();
      
      // More robust parsing: check if the response is in the expected format
      if (textResponse && textResponse.includes('|')) {
        const lines = textResponse.trim().split('\n');
        results = lines.map(line => {
          const parts = line.split('|');
          return {
            han: parts[0] || '',
            pinyin: parts[1] || '',
            viet: parts[2] || '',
          };
        }).filter(r => r.han && r.viet);
      }
      // If not in the expected format, results will remain an empty array.
    } else {
      // Viet-Han is not implemented
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
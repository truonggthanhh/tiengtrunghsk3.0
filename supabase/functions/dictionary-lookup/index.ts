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
      
      if (!response.ok) {
        // Log the error for debugging but don't crash the function
        console.error(`Upstream API request failed for term "${term}" with status ${response.status}`);
        // Return empty results to the client for a graceful failure
        return new Response(JSON.stringify([]), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      const textResponse = await response.text();
      
      if (textResponse && textResponse.trim() !== '' && textResponse.includes('|')) {
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
    } else {
      results = [];
    }

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    // THE FIX: If any error occurs (e.g., network timeout to the external API),
    // log it for our own debugging, but return an empty array to the user
    // instead of a 500 error. This makes the function more resilient.
    console.error("Critical error in dictionary-lookup function:", error.message);
    return new Response(JSON.stringify([]), { // Return empty array on failure
      status: 200, // Return a success status code
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
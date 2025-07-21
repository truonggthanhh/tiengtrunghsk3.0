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
      
      // THE FIX: If the upstream API fails, we throw an error.
      // This will be caught by our main try/catch block and return a proper 500 error to the client.
      if (!response.ok) {
        console.error(`Upstream API request failed for term "${term}" with status ${response.status}`);
        throw new Error(`Upstream API request failed with status ${response.status}`);
      }
      
      const textResponse = await response.text();
      
      // The API returns an empty string for no results, which is valid.
      // We only parse if there's content and it's in the expected format.
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
      // Viet-Han is not implemented
      results = [];
    }

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    // Now, both our internal errors and upstream API errors will be caught here.
    console.error("Error in dictionary-lookup function:", error.message);
    return new Response(JSON.stringify({ error: "An error occurred during the dictionary lookup." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SearchParams {
  q: string
  mode?: 'auto' | 'hanzi' | 'pinyin' | 'vietnamese'
  page?: number
  pageSize?: number
}

interface DictionaryEntry {
  id: number
  simplified: string
  traditional: string
  pinyin_number: string
  pinyin_tone: string
  vietnamese: string
  hsk_level?: number
  frequency?: number
  relevance?: number
}

/**
 * Detect search mode based on query content
 */
function detectSearchMode(query: string): 'hanzi' | 'pinyin' | 'vietnamese' {
  // Check for Chinese characters (CJK Unified Ideographs)
  if (/[\u4e00-\u9fff]/.test(query)) {
    return 'hanzi'
  }

  // Check for pinyin with tone numbers (e.g., "ni3", "hao3")
  if (/[a-z]+[1-5]/i.test(query)) {
    return 'pinyin'
  }

  // Check for Vietnamese characters or accent marks
  if (/[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/i.test(query)) {
    return 'vietnamese'
  }

  // Check for latin characters - could be pinyin without tones
  if (/^[a-z\s]+$/i.test(query)) {
    return 'pinyin'
  }

  // Default to vietnamese for mixed/unknown content
  return 'vietnamese'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse URL parameters
    const url = new URL(req.url)
    const searchQuery = url.searchParams.get('q')?.trim()
    const searchMode = url.searchParams.get('mode') as SearchParams['mode'] || 'auto'
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = Math.min(parseInt(url.searchParams.get('pageSize') || '30'), 100)

    // Validate parameters
    if (!searchQuery) {
      return new Response(
        JSON.stringify({ error: 'Query parameter "q" is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (page < 1 || pageSize < 1) {
      return new Response(
        JSON.stringify({ error: 'Invalid page or pageSize' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Determine actual search mode
    const actualMode = searchMode === 'auto' ? detectSearchMode(searchQuery) : searchMode

    // Calculate offset for pagination
    const offset = (page - 1) * pageSize

    console.log(\`[Dictionary Lookup] Query: "\${searchQuery}", Mode: \${actualMode}, Page: \${page}, PageSize: \${pageSize}\`)

    // Call the search_dictionary function
    const { data, error, count } = await supabaseClient.rpc('search_dictionary', {
      search_query: searchQuery,
      search_mode: actualMode,
      max_results: pageSize,
      offset_val: offset
    })

    if (error) {
      console.error('[Dictionary Lookup] Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Database query failed', details: error.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get total count for pagination (approximate)
    const { count: totalCount, error: countError } = await supabaseClient
      .from('dictionary_entries')
      .select('*', { count: 'exact', head: true })
      .or(
        actualMode === 'hanzi'
          ? \`simplified.like.%\${searchQuery}%,traditional.like.%\${searchQuery}%\`
          : actualMode === 'pinyin'
          ? \`pinyin_number.ilike.%\${searchQuery}%,pinyin_tone.ilike.%\${searchQuery}%\`
          : \`vietnamese.ilike.%\${searchQuery}%\`
      )

    const total = totalCount || 0

    // Format response
    const response = {
      query: searchQuery,
      mode: actualMode,
      data: data || [],
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNextPage: page < Math.ceil(total / pageSize),
        hasPrevPage: page > 1,
      },
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('[Dictionary Lookup] Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

/**
 * Story Chapters API
 * Get all story chapters (for both languages)
 */

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

export const GET: APIRoute = async ({ cookies, url }) => {
  try {
    // Get session from cookie (optional for viewing chapters, but required for unlocked status)
    const accessToken = cookies.get('sb-access-token')?.value;

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Get query parameter for language filter
    const language = url.searchParams.get('language'); // mandarin or cantonese

    // Build query
    let query = supabase
      .from('story_chapters')
      .select('*')
      .order('chapter_number', { ascending: true });

    // Apply language filter if provided
    if (language) {
      query = query.eq('language', language);
    }

    const { data: chapters, error: chaptersError } = await query;

    if (chaptersError) {
      throw chaptersError;
    }

    // If user is logged in, get their progress
    let userProgress: any = null;
    if (accessToken) {
      const { data: { user } } = await supabase.auth.getUser(accessToken);

      if (user) {
        const { data: progress } = await supabase
          .from('user_story_progress')
          .select('*')
          .eq('user_id', user.id);

        userProgress = progress || [];
      }
    }

    // Merge chapters with user progress
    const chaptersWithProgress = chapters?.map(chapter => {
      const progress = userProgress?.find((p: any) => p.chapter_id === chapter.id);

      return {
        ...chapter,
        user_progress: progress || null,
        is_unlocked: progress?.is_unlocked || false,
        is_completed: progress?.is_completed || false,
        stars_earned: progress?.stars_earned || 0
      };
    });

    return new Response(JSON.stringify({
      success: true,
      chapters: chaptersWithProgress || []
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching story chapters:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

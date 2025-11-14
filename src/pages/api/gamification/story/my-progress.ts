/**
 * My Story Progress API
 * Get user's story mode progress
 */

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

export const GET: APIRoute = async ({ cookies, url }) => {
  try {
    // Get session from cookie
    const accessToken = cookies.get('sb-access-token')?.value;

    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Verify user session
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid session' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get query parameter for language filter
    const language = url.searchParams.get('language'); // mandarin or cantonese

    // Get user's story progress
    let query = supabase
      .from('user_story_progress')
      .select('*, chapter:story_chapters(*)')
      .eq('user_id', user.id)
      .order('chapter_number', { ascending: true });

    // Apply language filter through chapter relationship
    if (language) {
      query = query.eq('chapter.language', language);
    }

    const { data: userProgress, error: progressError } = await query;

    if (progressError) {
      throw progressError;
    }

    // Calculate stats
    const totalChapters = userProgress?.length || 0;
    const completedChapters = userProgress?.filter(p => p.is_completed).length || 0;
    const unlockedChapters = userProgress?.filter(p => p.is_unlocked).length || 0;
    const totalStars = userProgress?.reduce((sum, p) => sum + (p.stars_earned || 0), 0) || 0;
    const maxStars = totalChapters * 3; // Assuming max 3 stars per chapter
    const completionPercentage = totalChapters > 0
      ? Math.round((completedChapters / totalChapters) * 100)
      : 0;

    // Find current chapter (first unlocked but not completed)
    const currentChapter = userProgress?.find(p => p.is_unlocked && !p.is_completed) || null;

    return new Response(JSON.stringify({
      success: true,
      progress: userProgress || [],
      current_chapter: currentChapter,
      stats: {
        total_chapters: totalChapters,
        completed_chapters: completedChapters,
        unlocked_chapters: unlockedChapters,
        total_stars: totalStars,
        max_stars: maxStars,
        completion_percentage: completionPercentage
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching story progress:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

import { supabase } from '@/integrations/supabase/client';

/**
 * Initialize user progress for a new user
 * This is a fallback in case the database trigger fails
 */
export async function initUserProgress(userId: string): Promise<void> {
  try {
    // Check if user progress already exists
    const { data: existing } = await supabase
      .from('user_progress')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) {
      console.log('User progress already exists');
      return;
    }

    // Create user progress record
    const { error } = await supabase
      .from('user_progress')
      .insert({
        user_id: userId,
        total_xp: 0,
        current_level: 1,
        current_streak: 0,
        longest_streak: 0,
        last_activity_date: new Date().toISOString().split('T')[0]
      });

    if (error) {
      console.error('Failed to initialize user progress:', error);
      // Don't throw - this is not critical
    } else {
      console.log('User progress initialized successfully');
    }
  } catch (err) {
    console.error('Error in initUserProgress:', err);
    // Don't throw - this is not critical
  }
}

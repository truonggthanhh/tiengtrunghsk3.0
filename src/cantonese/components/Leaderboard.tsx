"use client";

import React from 'react';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Trophy } from 'lucide-react';

interface LeaderboardProps {
  lessonId: string;
}

const Leaderboard = ({ lessonId }: LeaderboardProps) => {
  const { data: leaderboardData, isLoading, error } = useQuery({
    queryKey: ['leaderboard', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exercise_sessions')
        .select(`
          user_id,
          score,
          total,
          created_at,
          profiles (first_name, last_name)
        `)
        .eq('lesson_id', lessonId)
        .order('score', { ascending: false })
        .order('created_at', { ascending: true }) // Tie-break by earliest completion
        .limit(10); // Show top 10

      if (error) throw error;

      // Aggregate scores per user (if a user has multiple sessions, take the best one)
      const userScores: { [key: string]: { score: number; total: number; created_at: string; user_name: string } } = {};
      data.forEach(session => {
        const userId = session.user_id;
        const userName = session.profiles ? `${session.profiles.first_name || ''} ${session.profiles.last_name || ''}`.trim() : 'Người dùng ẩn danh';
        
        if (!userScores[userId] || session.score > userScores[userId].score || (session.score === userScores[userId].score && new Date(session.created_at) < new Date(userScores[userId].created_at))) {
          userScores[userId] = {
            score: session.score,
            total: session.total,
            created_at: session.created_at,
            user_name: userName,
          };
        }
      });

      const sortedLeaderboard = Object.values(userScores)
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        })
        .slice(0, 10); // Ensure only top 10 after aggregation

      return sortedLeaderboard;
    },
    enabled: !!lessonId,
  });

  if (isLoading) {
    return <div className="p-4 text-center">Đang tải bảng xếp hạng...</div>;
  }

  if (error) {
    return <div className="p-4 text-verm text-center">Lỗi tải bảng xếp hạng: {error.message}</div>;
  }

  if (!leaderboardData || leaderboardData.length === 0) {
    return <div className="p-4 text-center text-ink/70">Chưa có ai hoàn thành bài tập này.</div>;
  }

  return (
    <div className="bg-white dark:bg-black/20 p-4 rounded-2xl border border-ink/10 shadow-[0_10px_0_#d7c8b6]">
      <h2 className="font-bold text-xl mb-3 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-jade" /> Bảng xếp hạng
      </h2>
      <ul className="space-y-2">
        {leaderboardData.map((entry, index) => (
          <li key={index} className="flex items-center justify-between p-2 bg-cream dark:bg-black/10 rounded-lg border border-ink/5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg w-6 text-center">{index + 1}.</span>
              <span className="font-semibold">{entry.user_name}</span>
            </div>
            <div className="text-ink/80">
              {entry.score} / {entry.total}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
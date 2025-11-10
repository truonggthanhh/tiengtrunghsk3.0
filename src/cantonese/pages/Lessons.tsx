import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Home } from 'lucide-react';
import LessonCard from '@/cantonese/components/LessonCard'; // Import component mới

const LessonsPage = () => {
  // Fetch lessons from Supabase, ordered by the new 'position' column
  const { data: lessons, isLoading, error } = useQuery({
    queryKey: ['lessons'],
    queryFn: async () => {
      const { data, error } = await supabase.from('lessons').select('*').order('position', { ascending: true, nullsFirst: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="max-w-3xl mx-auto p-6">Đang tải bài học...</div>;
  }

  if (error) {
    return <div className="max-w-3xl mx-auto p-6 text-verm">Lỗi: {error.message}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link to="/cantonese" className="inline-flex items-center gap-2 rounded-2xl border border-ink/20 px-4 py-2 text-ink hover:bg-black/5 dark:hover:bg-white/5 transition text-sm mb-6">
        <Home className="h-4 w-4" /> Quay về trang chủ
      </Link>
      <h1 className="text-3xl font-black mb-8">Danh sách bài học</h1>
      <div className="space-y-6">
        {lessons?.map((l: any) => (
          <LessonCard key={l.id} lesson={l} />
        ))}
      </div>
    </div>
  );
};

export default LessonsPage;
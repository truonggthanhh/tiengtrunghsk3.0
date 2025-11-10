"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LearningProgressPage = () => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex gap-3 mb-4">
        <Link to="/cantonese" className="inline-flex items-center gap-2 rounded-2xl border border-ink/20 px-4 py-2 text-ink hover:bg-black/5 dark:hover:bg-white/5 transition text-sm">
          <Home className="h-4 w-4" /> Trang chủ
        </Link>
        <Link to="/cantonese/lessons" className="inline-flex items-center gap-2 rounded-2xl border border-ink/20 px-4 py-2 text-ink hover:bg-black/5 dark:hover:bg-white/5 transition text-sm">
          <ArrowLeft className="h-4 w-4" /> Quay về bài học
        </Link>
      </div>
      <Card className="bg-white dark:bg-black/20 border border-ink/10 shadow-[0_10px_0_#d7c8b6]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-jade" /> Quá trình học tập
          </CardTitle>
          <CardDescription>Theo dõi tiến độ học tiếng Quảng Đông của bạn.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-ink/70 dark:text-cream/70">
            Tính năng này đang được phát triển! Sắp tới bạn sẽ có thể xem chi tiết điểm số, thời gian học, và các thống kê khác về quá trình học tập của mình tại đây.
          </p>
          <p className="mt-4 text-ink/70 dark:text-cream/70">
            Hãy tiếp tục luyện tập để đạt được kết quả tốt nhất!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningProgressPage;
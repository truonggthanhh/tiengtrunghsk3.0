import React from 'react';
import { Link } from 'react-router-dom';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen } from 'lucide-react';
import CantoneseRouteWrapper from '../components/CantoneseRouteWrapper';

/**
 * Cantonese Analytics Page
 * Shows comprehensive learning analytics for Cantonese (MSUTong)
 */
const CantoneseAnalyticsPage: React.FC = () => {
  return (
    <CantoneseRouteWrapper>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8 space-y-4">
          <Link to="/cantonese/lessons">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Quay lại bài học
            </Button>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-foreground">
                統計學習 (Thống kê học tập)
              </h1>
              <p className="text-muted-foreground mt-2">
                Theo dõi tiến độ và phân tích hiệu quả học tiếng Quảng (Cantonese)
              </p>
            </div>
            <BookOpen className="h-12 w-12 text-primary" />
          </div>
        </div>

        {/* Analytics Dashboard */}
        <AnalyticsDashboard language="cantonese" />
      </div>
    </CantoneseRouteWrapper>
  );
};

export default CantoneseAnalyticsPage;

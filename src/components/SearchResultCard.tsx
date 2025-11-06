import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface SearchResult {
  han: string;
  pinyin: string;
  viet: string;
}

interface SearchResultCardProps {
  result: SearchResult;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({ result }) => {
  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow bg-white">
      <CardContent className="p-5">
        <div className="flex items-baseline gap-4 flex-wrap mb-3">
          <h3 className="text-3xl font-bold text-foreground">
            {result.han}
          </h3>
          <span className="text-base font-medium text-primary bg-red-50 px-3 py-1 rounded-lg">
            {result.pinyin}
          </span>
        </div>
        <p className="text-base leading-relaxed whitespace-pre-wrap text-muted-foreground">
          {result.viet}
        </p>
      </CardContent>
    </Card>
  );
};

export default SearchResultCard;
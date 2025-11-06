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
    <Card className="mb-4 border-2 border-primary/20 hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-primary/5 group overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      <CardContent className="p-5 relative z-10">
        <div className="flex items-baseline gap-4 flex-wrap">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {result.han}
          </h3>
          <p className="text-lg font-medium text-primary/80 bg-primary/10 px-3 py-1 rounded-full">
            {result.pinyin}
          </p>
        </div>
        <div className="mt-3 pt-3 border-t border-primary/10">
          <p className="text-base leading-relaxed whitespace-pre-wrap text-foreground/90">
            {result.viet}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchResultCard;
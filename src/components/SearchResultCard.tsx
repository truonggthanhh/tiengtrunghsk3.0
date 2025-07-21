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
    <Card className="mb-4 border-primary/20 hover:bg-muted/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-baseline gap-4">
          <h3 className="text-2xl font-bold text-primary">{result.han}</h3>
          <p className="text-lg text-muted-foreground">{result.pinyin}</p>
        </div>
        <p className="mt-2 text-base whitespace-pre-wrap">{result.viet}</p>
      </CardContent>
    </Card>
  );
};

export default SearchResultCard;
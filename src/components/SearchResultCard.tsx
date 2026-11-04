import SaveWordButton from '@/components/learning/SaveWordButton';
import SpeakerButton from '@/components/SpeakerButton';
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
    <Card className="border border-border bg-card text-card-foreground transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-baseline gap-4 flex-wrap mb-3">
          <h3 className="text-3xl font-bold text-foreground">
            {result.han}
          </h3>
          <span className="text-base font-medium text-primary bg-primary/10 px-3 py-1 rounded-lg">
            {result.pinyin}
          </span>
        </div>
        <p className="text-base leading-relaxed whitespace-pre-wrap text-muted-foreground">
          {result.viet}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><SaveWordButton language="mandarin" hanzi={result.han} pronunciation={result.pinyin} meaning={result.viet} /><SpeakerButton text={result.han} className="bg-primary/10 text-primary hover:bg-primary/20" /></div>
      </CardContent>
    </Card>
  );
};

export default SearchResultCard;
import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import SearchResultCard from './SearchResultCard';
import { ScrollArea } from './ui/scroll-area';

interface SearchResult {
  han: string;
  pinyin: string;
  viet: string;
}

const DictionarySearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [direction, setDirection] = useState<'han-viet' | 'viet-han'>('han-viet');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchResults = useCallback(async (term: string, dir: string) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const { data, error: funcError } = await supabase.functions.invoke('dictionary-lookup', {
        body: { term, direction: dir },
      });

      if (funcError) throw funcError;
      
      // The API for Viet-Han is not implemented in the edge function yet
      if (dir === 'viet-han') {
        setResults([]);
      } else {
        setResults(data || []);
      }

    } catch (e: any) {
      console.error("Dictionary lookup error:", e);
      setError("Không thể tra cứu từ điển lúc này. Vui lòng thử lại sau.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchResults(searchTerm, direction);
    }, 500); // Debounce for 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, direction, fetchResults]);

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Tra Cứu Từ Điển</CardTitle>
        <CardDescription>Tra cứu Hán-Việt nhanh chóng và tiện lợi.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={direction === 'han-viet' ? "Nhập chữ Hán hoặc pinyin..." : "Nhập từ tiếng Việt..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 text-lg pl-10"
            />
          </div>
          <ToggleGroup
            type="single"
            value={direction}
            onValueChange={(value: 'han-viet' | 'viet-han') => {
              if (value) setDirection(value);
            }}
            className="border rounded-md"
          >
            <ToggleGroupItem value="han-viet" className="h-12 text-base font-semibold">Hán-Việt</ToggleGroupItem>
            <ToggleGroupItem value="viet-han" className="h-12 text-base font-semibold" disabled>Việt-Hán (Sắp có)</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <ScrollArea className="h-80 w-full border rounded-md p-4">
          {isLoading && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mr-3" />
              <span>Đang tìm kiếm...</span>
            </div>
          )}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-destructive">
              <AlertTriangle className="h-8 w-8 mb-2" />
              <span>{error}</span>
            </div>
          )}
          {!isLoading && !error && results.length > 0 && (
            <div>
              {results.map((result, index) => (
                <SearchResultCard key={`${result.han}-${index}`} result={result} />
              ))}
            </div>
          )}
          {!isLoading && !error && results.length === 0 && hasSearched && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <span>Không tìm thấy kết quả nào cho "{searchTerm}".</span>
            </div>
          )}
          {!isLoading && !error && !hasSearched && (
             <div className="flex items-center justify-center h-full text-muted-foreground">
              <span>Nhập từ khóa để bắt đầu tra cứu.</span>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DictionarySearch;
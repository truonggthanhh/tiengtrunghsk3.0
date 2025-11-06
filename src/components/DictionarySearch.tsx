import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import SearchResultCard from './SearchResultCard';
import { ScrollArea } from './ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

      setResults(data || []);

    } catch (e: any) {
      console.error("Dictionary lookup error:", e);
      setError("Không thể tra cứu từ điển lúc này. Vui lòng thử lại sau.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults(searchTerm, direction);
  };

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-xl border-gray-200">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Tra Cứu Từ Điển Hán-Việt
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Tra cứu nhanh chóng và chính xác
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={direction === 'han-viet' ? "Nhập chữ Hán hoặc pinyin..." : "Nhập từ tiếng Việt..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-14 text-lg pl-12 border-gray-300 focus:border-primary rounded-xl"
            />
          </div>
          <Select
            value={direction}
            onValueChange={(value: 'han-viet' | 'viet-han') => {
              if (value) setDirection(value);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px] h-14 text-base font-medium border-gray-300 rounded-xl">
              <SelectValue placeholder="Chọn chiều tra cứu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="han-viet" className="text-base">Hán-Việt</SelectItem>
              <SelectItem value="viet-han" className="text-base" disabled>Việt-Hán (Sắp có)</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="submit"
            className="h-14 text-base font-semibold bg-primary hover:bg-primary/90 px-8 rounded-xl"
          >
            <Search className="h-5 w-5 mr-2" />
            Tìm kiếm
          </Button>
        </form>

        <ScrollArea className="h-96 w-full border border-gray-200 rounded-xl p-4 bg-gray-50/50">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-3" />
              <span className="text-base font-medium">Đang tìm kiếm...</span>
            </div>
          )}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-destructive">
              <AlertTriangle className="h-12 w-12 mb-3" />
              <span className="text-center font-medium">{error}</span>
            </div>
          )}
          {!isLoading && !error && results.length > 0 && (
            <div className="space-y-3">
              {results.map((result, index) => (
                <SearchResultCard key={`${result.han}-${index}`} result={result} />
              ))}
            </div>
          )}
          {!isLoading && !error && results.length === 0 && hasSearched && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Search className="h-12 w-12 mb-3 text-gray-400" />
              <span className="text-center font-medium">Không tìm thấy kết quả nào cho "{searchTerm}"</span>
            </div>
          )}
          {!isLoading && !error && !hasSearched && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Search className="h-12 w-12 mb-3 text-primary" />
              <span className="text-center font-medium">Nhập từ khóa để bắt đầu tra cứu</span>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DictionarySearch;
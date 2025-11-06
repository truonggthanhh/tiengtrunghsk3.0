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
    <Card className="w-full max-w-4xl mx-auto shadow-2xl border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-50" />
      <CardHeader className="text-center relative z-10">
        <div className="flex items-center justify-center mb-2">
          <div className="bg-primary/10 p-3 rounded-full">
            <Search className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Tra Cứu Từ Điển
        </CardTitle>
        <CardDescription className="text-base">
          Tra cứu Hán-Việt nhanh chóng và tiện lợi
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder={direction === 'han-viet' ? "Nhập chữ Hán hoặc pinyin..." : "Nhập từ tiếng Việt..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 text-lg pl-10 border-2 focus:border-primary/50 transition-all duration-300"
            />
          </div>
          <Select
            value={direction}
            onValueChange={(value: 'han-viet' | 'viet-han') => {
              if (value) setDirection(value);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px] h-12 text-base font-semibold border-2 hover:border-primary/50 transition-all duration-300">
              <SelectValue placeholder="Chọn chiều tra cứu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="han-viet" className="text-base">Hán-Việt</SelectItem>
              <SelectItem value="viet-han" className="text-base" disabled>Việt-Hán (Sắp có)</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="submit"
            className="h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Search className="h-5 w-5 mr-2" />
            Tìm kiếm
          </Button>
        </form>

        <ScrollArea className="h-80 w-full border-2 rounded-lg p-4 bg-background/50 backdrop-blur-sm">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground animate-in fade-in duration-300">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div className="absolute inset-0 h-12 w-12 animate-ping opacity-20 bg-primary rounded-full" />
              </div>
              <span className="mt-4 text-lg font-medium">Đang tìm kiếm...</span>
            </div>
          )}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-destructive animate-in fade-in duration-300">
              <div className="bg-destructive/10 p-4 rounded-full mb-4">
                <AlertTriangle className="h-10 w-10" />
              </div>
              <span className="text-center font-medium">{error}</span>
            </div>
          )}
          {!isLoading && !error && results.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {results.map((result, index) => (
                <div
                  key={`${result.han}-${index}`}
                  className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <SearchResultCard result={result} />
                </div>
              ))}
            </div>
          )}
          {!isLoading && !error && results.length === 0 && hasSearched && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground animate-in fade-in duration-300">
              <div className="bg-muted/30 p-4 rounded-full mb-4">
                <Search className="h-10 w-10" />
              </div>
              <span className="text-center font-medium">Không tìm thấy kết quả nào cho "{searchTerm}"</span>
            </div>
          )}
          {!isLoading && !error && !hasSearched && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Search className="h-10 w-10 text-primary" />
              </div>
              <span className="text-center font-medium">Nhập từ khóa để bắt đầu tra cứu</span>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DictionarySearch;
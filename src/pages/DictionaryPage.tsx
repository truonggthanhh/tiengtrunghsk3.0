import SaveWordButton from '@/components/learning/SaveWordButton';
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, BookOpen, Sparkles, Loader2, Languages, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

type SearchMode = 'auto' | 'hanzi' | 'pinyin' | 'vietnamese';

interface DictionaryEntry {
  id: number;
  simplified: string;
  traditional: string;
  pinyin_number: string;
  pinyin_tone: string;
  vietnamese: string;
  hsk_level?: number;
  frequency?: number;
  relevance?: number;
}

interface SearchResponse {
  query: string;
  mode: string;
  data: DictionaryEntry[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Search mode configurations with colors
const SEARCH_MODES: Array<{ value: SearchMode; label: string; color: string }> = [
  { value: 'auto', label: 'Tự động', color: 'from-purple-500 to-pink-500' },
  { value: 'hanzi', label: 'Hán tự', color: 'from-red-500 to-orange-500' },
  { value: 'pinyin', label: 'Pinyin', color: 'from-blue-500 to-cyan-500' },
  { value: 'vietnamese', label: 'Tiếng Việt', color: 'from-green-500 to-emerald-500' },
];

// Auto-detect search mode based on query content
function detectSearchMode(query: string): SearchMode {
  // Check for Chinese characters
  if (/[\u4e00-\u9fff]/.test(query)) {
    return 'hanzi';
  }
  // Check for pinyin with tone numbers
  if (/[a-z]+[1-5]/i.test(query)) {
    return 'pinyin';
  }
  // Check for Vietnamese diacritics
  if (/[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/i.test(query)) {
    return 'vietnamese';
  }
  // Check for plain latin
  if (/^[a-z\s]+$/i.test(query)) {
    return 'pinyin';
  }
  // Default to vietnamese
  return 'vietnamese';
}

const DictionaryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('auto');
  const [page, setPage] = useState(1);
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(null);

  const debouncedQuery = useDebounce(searchQuery, 300);

  // Fetch dictionary entries - Call RPC function directly (no Edge Function needed!)
  const { data, isLoading, error } = useQuery<SearchResponse>({
    queryKey: ['dictionary', debouncedQuery, searchMode, page],
    queryFn: async () => {
      if (!debouncedQuery.trim()) {
        return {
          query: '',
          mode: searchMode,
          data: [],
          pagination: {
            page: 1,
            pageSize: 30,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false
          }
        };
      }

      const pageSize = 30;
      const offset = (page - 1) * pageSize;

      // Determine actual search mode
      const actualMode = searchMode === 'auto' ? detectSearchMode(debouncedQuery) : searchMode;

      // Call database RPC function directly
      const { data: entries, error: rpcError } = await supabase.rpc('search_dictionary', {
        search_query: debouncedQuery,
        search_mode: actualMode,
        max_results: pageSize,
        offset_val: offset
      });

      if (rpcError) {
        console.error('Dictionary search error:', rpcError);
        throw new Error(rpcError.message || 'Failed to search dictionary');
      }

      // Get approximate total count for pagination
      const countQuery = supabase
        .from('dictionary_entries')
        .select('*', { count: 'exact', head: true });

      if (actualMode === 'hanzi') {
        countQuery.or(`simplified.like.%${debouncedQuery}%,traditional.like.%${debouncedQuery}%`);
      } else if (actualMode === 'pinyin') {
        countQuery.or(`pinyin_number.ilike.%${debouncedQuery}%,pinyin_tone.ilike.%${debouncedQuery}%`);
      } else {
        countQuery.ilike('vietnamese', `%${debouncedQuery}%`);
      }

      const { count } = await countQuery;
      const total = count || 0;

      return {
        query: debouncedQuery,
        mode: actualMode,
        data: entries || [],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
          hasNextPage: page < Math.ceil(total / pageSize),
          hasPrevPage: page > 1,
        },
      };
    },
    enabled: debouncedQuery.trim().length > 0,
  });

  // Reset page when query or mode changes
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, searchMode]);

  return (
    <main className="learning-ui min-h-screen bg-background text-foreground">
      {/* Main content */}
      <div className="learning-container py-8 sm:py-12">
        <div className="section-heading mb-8"><div><p className="section-eyebrow">TỪ ĐIỂN TRUNG – VIỆT</p><h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Tra một từ. Hiểu thêm một chút.</h1><p className="mt-4 text-sm leading-7 text-muted-foreground">Tìm bằng chữ Hán, pinyin hoặc nghĩa tiếng Việt. Lưu từ mới để ôn lại sau.</p></div></div>

        {/* Search Section */}
        <div className="max-w-4xl mx-auto mb-8">
          {/* Search modes */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {SEARCH_MODES.map((mode) => (
              <Button
                key={mode.value}
                onClick={() => setSearchMode(mode.value)}
                variant={searchMode === mode.value ? 'default' : 'outline'}
                className={`${searchMode === mode.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border'
                } rounded-full transition-colors`}
              >
                {mode.label}
              </Button>
            ))}
          </div>

          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
            <Input
              type="search"
              aria-label="Tra từ điển"
              placeholder={
                searchMode === 'hanzi' ? 'Nhập Hán tự (例: 你好)' :
                searchMode === 'pinyin' ? 'Nhập pinyin (例: ni3 hao3)' :
                searchMode === 'vietnamese' ? 'Nhập tiếng Việt (例: xin chào)' :
                'Nhập Hán tự, pinyin hoặc tiếng Việt...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 rounded-2xl border-border bg-card pl-14 pr-12 text-base"
            />
            {isLoading && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-blue-500 animate-spin" />
            )}
          </div>

          {/* Search hint */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
            💡 {searchMode === 'auto' && 'Chế độ tự động sẽ phát hiện loại từ khóa bạn nhập'}
            {searchMode === 'hanzi' && 'Nhập chữ Hán giản thể hoặc phồn thể'}
            {searchMode === 'pinyin' && 'Nhập pinyin có số thanh (ví dụ: ni3 hao3) hoặc không dấu'}
            {searchMode === 'vietnamese' && 'Nhập nghĩa tiếng Việt của từ cần tra'}
          </p>
        </div>

        {/* Results */}
        <div className="max-w-5xl mx-auto">
          {error && (
            <Card className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-600">
              <CardContent className="p-6 text-center">
                <p className="text-red-700 dark:text-red-300 font-medium">
                  ❌ Lỗi tra cứu: {error.message}
                </p>
              </CardContent>
            </Card>
          )}

          {!isLoading && !error && searchQuery && data?.data.length === 0 && (
            <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-600">
              <CardContent className="p-12 text-center">
                <Search className="h-16 w-16 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
                <p className="text-xl font-bold text-yellow-800 dark:text-yellow-200 mb-2">
                  Không tìm thấy kết quả
                </p>
                <p className="text-yellow-700 dark:text-yellow-300">
                  Thử tìm kiếm với từ khóa khác hoặc đổi chế độ tra cứu
                </p>
              </CardContent>
            </Card>
          )}

          {!searchQuery && !isLoading && (
            <Card className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-2 border-blue-300 dark:border-blue-600">
              <CardContent className="p-12 text-center">
                <Sparkles className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-4 animate-pulse" />
                <p className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  Bắt đầu tra cứu từ điển
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Nhập từ khóa vào ô tìm kiếm phía trên để bắt đầu
                </p>
              </CardContent>
            </Card>
          )}

          {data && data.data.length > 0 && (
            <>
              {/* Results header */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-600 dark:text-gray-300">
                  Tìm thấy <span className="font-bold text-blue-600 dark:text-blue-400">{data.pagination.total}</span> kết quả
                  {searchMode !== 'auto' && (
                    <Badge className="ml-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      Chế độ: {SEARCH_MODES.find(m => m.value === searchMode)?.label}
                    </Badge>
                  )}
                  {data.mode !== searchMode && searchMode === 'auto' && (
                    <Badge className="ml-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                      Phát hiện: {data.mode === 'hanzi' ? 'Hán tự' : data.mode === 'pinyin' ? 'Pinyin' : 'Tiếng Việt'}
                    </Badge>
                  )}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Trang {data.pagination.page} / {data.pagination.totalPages}
                </p>
              </div>

              {/* Results list */}
              <div className="space-y-3">
                {data.data.map((entry) => (
                  <Card
                    key={entry.id}
                    className="group rounded-2xl border border-border bg-card transition-colors hover:border-primary/40"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex-1">
                          {/* Hanzi */}
                          <div className="mb-2 flex flex-wrap items-center gap-3">
                            <button type="button" onClick={() => setSelectedEntry(entry)} className="rounded text-left text-3xl font-semibold text-foreground hover:text-primary md:text-4xl" aria-label={`Xem chi tiết từ ${entry.simplified}`}>
                              {entry.simplified}
                            </button>
                            {entry.traditional !== entry.simplified && (
                              <span className="text-2xl text-gray-500 dark:text-gray-400">
                                ({entry.traditional})
                              </span>
                            )}
                            {entry.hsk_level && (
                              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                                HSK {entry.hsk_level}
                              </Badge>
                            )}
                          </div>

                          {/* Pinyin */}
                          <div className="mb-3">
                            <span className="text-lg font-medium text-blue-600 dark:text-blue-400">
                              {entry.pinyin_tone || entry.pinyin_number}
                            </span>
                          </div>

                          {/* Vietnamese */}
                          <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                            {entry.vietnamese}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2"><SaveWordButton language="mandarin" hanzi={entry.simplified} pronunciation={entry.pinyin_tone || entry.pinyin_number} meaning={entry.vietnamese} /><Button variant="ghost" size="sm" onClick={() => setSelectedEntry(entry)}>Chi tiết<ArrowRight className="h-4 w-4" /></Button></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {data.pagination.totalPages > 1 && (
                <div className="flex justify-center gap-4 mt-8">
                  <Button
                    onClick={() => setPage(p => p - 1)}
                    disabled={!data.pagination.hasPrevPage}
                    variant="outline"
                    className="bg-white/90 dark:bg-black/70 border-2 border-blue-300 dark:border-blue-600"
                  >
                    ← Trang trước
                  </Button>
                  <Button
                    onClick={() => setPage(p => p + 1)}
                    disabled={!data.pagination.hasNextPage}
                    variant="outline"
                    className="bg-white/90 dark:bg-black/70 border-2 border-blue-300 dark:border-blue-600"
                  >
                    Trang sau →
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="max-w-2xl bg-white dark:bg-gray-900 border-2 border-blue-300 dark:border-blue-600">
          <DialogHeader>
            <DialogTitle className="text-4xl font-black text-gray-900 dark:text-white flex items-center gap-4">
              {selectedEntry?.simplified}
              {selectedEntry?.traditional !== selectedEntry?.simplified && (
                <span className="text-2xl text-gray-500 dark:text-gray-400">
                  ({selectedEntry?.traditional})
                </span>
              )}
            </DialogTitle>
            <DialogDescription className="text-xl text-blue-600 dark:text-blue-400 font-medium">
              {selectedEntry?.pinyin_tone || selectedEntry?.pinyin_number}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* HSK Level */}
            {selectedEntry?.hsk_level && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">HSK Level</p>
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg px-4 py-1">
                  HSK {selectedEntry.hsk_level}
                </Badge>
              </div>
            )}

            {/* Vietnamese meaning */}
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Nghĩa tiếng Việt</p>
              <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-600 rounded-xl p-4">
                <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                  {selectedEntry?.vietnamese}
                </p>
              </div>
            </div>

            {/* Pinyin variants */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pinyin (có dấu thanh)</p>
                <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
                  {selectedEntry?.pinyin_tone || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pinyin (số thanh)</p>
                <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
                  {selectedEntry?.pinyin_number}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default DictionaryPage;

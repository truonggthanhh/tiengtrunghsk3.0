import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { FileText, Calendar, User, Eye, Tag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image_url: string | null;
  published_at: string;
  view_count: number;
  tags: string[];
  author_id: string;
  profiles?: {
    first_name: string;
    last_name: string;
  };
}

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['blog-posts', 'mandarin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          id,
          title,
          slug,
          excerpt,
          featured_image_url,
          published_at,
          view_count,
          tags,
          author_id,
          profiles:author_id (first_name, last_name)
        `)
        .eq('language', 'mandarin')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const filteredPosts = posts?.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
          Lỗi tải bài viết: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/50 via-purple-50/30 to-pink-50/50 dark:from-gray-950 dark:via-cyan-950/10 dark:to-purple-950/10">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 grid place-items-center shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 dark:from-cyan-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent text-left">
                Blog
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-left">Kiến thức học Tiếng Trung</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8 max-w-2xl mx-auto">
          <Input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-gray-300 dark:border-gray-700 focus:border-cyan-500 dark:focus:border-cyan-500"
          />
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts && filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                to={`/mandarin/blog/${post.slug}`}
                className="group"
              >
                <Card className="h-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-gray-200/50 dark:border-gray-800/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  {/* Featured Image */}
                  {post.featured_image_url && (
                    <div className="aspect-video overflow-hidden rounded-t-xl">
                      <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <CardHeader className="border-b border-gray-200 dark:border-gray-800">
                    <CardTitle className="text-xl font-black text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                    {post.excerpt && (
                      <CardDescription className="text-gray-600 dark:text-gray-400 line-clamp-3">
                        {post.excerpt}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="p-4">
                    {/* Tags */}
                    {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      {post.published_at && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.published_at).toLocaleDateString('vi-VN')}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.view_count || 0}
                      </div>
                      {post.profiles && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {post.profiles.first_name} {post.profiles.last_name}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {searchQuery ? 'Không tìm thấy bài viết nào' : 'Chưa có bài viết nào'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;

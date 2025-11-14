import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/components/SessionContextProvider';
import { Calendar, User, Eye, Tag, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CommentsSection from '@/components/CommentsSection';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
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

const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { session } = useSession();

  // Check if user is admin
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const isAdmin = userProfile?.role === 'admin';

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          id,
          title,
          slug,
          content,
          featured_image_url,
          published_at,
          view_count,
          tags,
          author_id,
          profiles:author_id (first_name, last_name)
        `)
        .eq('slug', slug)
        .eq('language', 'mandarin')
        .eq('status', 'published')
        .single();

      if (error) throw error;
      return data as BlogPost;
    },
    enabled: !!slug,
  });

  // Increment view count when post loads
  useEffect(() => {
    if (post?.id) {
      supabase.rpc('increment_blog_post_view_count', { post_id: post.id });
    }
  }, [post?.id]);

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

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
          {error ? `Lỗi: ${error.message}` : 'Không tìm thấy bài viết'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/50 via-purple-50/30 to-pink-50/50 dark:from-gray-950 dark:via-cyan-950/10 dark:to-purple-950/10">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/mandarin/blog" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Quay lại Blog
          </Link>
        </Button>

        {/* Article */}
        <article className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl overflow-hidden">
          {/* Featured Image */}
          {post.featured_image_url && (
            <div className="aspect-video overflow-hidden">
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6 md:p-10">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
              {post.title}
            </h1>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 pb-6 mb-6 border-b border-gray-200 dark:border-gray-800">
              {post.published_at && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.published_at).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              )}
              {post.profiles && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <User className="h-4 w-4" />
                  {post.profiles.first_name} {post.profiles.last_name}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Eye className="h-4 w-4" />
                {post.view_count || 0} lượt xem
              </div>
            </div>

            {/* Tags */}
            {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Article Content */}
            <div
              className="prose prose-lg dark:prose-invert max-w-none
                prose-headings:font-black prose-headings:text-gray-900 dark:prose-headings:text-white
                prose-p:text-gray-700 dark:prose-p:text-gray-300
                prose-a:text-cyan-600 dark:prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 dark:prose-strong:text-white
                prose-code:text-purple-600 dark:prose-code:text-purple-400
                prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800
                prose-img:rounded-xl prose-img:shadow-lg"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Comments Section */}
            <CommentsSection postId={post.id} isAdmin={isAdmin} />
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetailPage;

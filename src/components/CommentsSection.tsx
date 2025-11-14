import React, { useState } from 'react';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/cantonese/components/providers/SessionContextProvider';
import { toast } from 'sonner';
import { MessageCircle, ThumbsUp, Reply, Trash2, Check, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Comment {
  id: string;
  post_id: string;
  author_id: string | null;
  parent_comment_id: string | null;
  content: string;
  status: 'pending' | 'approved' | 'spam' | 'deleted';
  author_name: string | null;
  likes_count: number;
  created_at: string;
  profiles?: {
    first_name: string;
    last_name: string;
  };
  replies?: Comment[];
}

interface CommentsSectionProps {
  postId: string;
  isAdmin?: boolean;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postId, isAdmin = false }) => {
  const queryClient = useQueryClient();
  const { session } = useSession();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // Fetch comments
  const { data: comments, isLoading } = useQuery<Comment[]>({
    queryKey: ['blog-comments', postId],
    queryFn: async () => {
      const query = supabase
        .from('blog_comments')
        .select(`
          id,
          post_id,
          author_id,
          parent_comment_id,
          content,
          status,
          author_name,
          likes_count,
          created_at,
          profiles:author_id (first_name, last_name)
        `)
        .eq('post_id', postId)
        .is('parent_comment_id', null)
        .order('created_at', { ascending: false });

      // Show all comments if admin, otherwise only approved
      if (!isAdmin) {
        query.eq('status', 'approved');
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch replies for each comment
      const commentsWithReplies = await Promise.all(
        (data || []).map(async (comment) => {
          const replyQuery = supabase
            .from('blog_comments')
            .select(`
              id,
              post_id,
              author_id,
              parent_comment_id,
              content,
              status,
              author_name,
              likes_count,
              created_at,
              profiles:author_id (first_name, last_name)
            `)
            .eq('parent_comment_id', comment.id)
            .order('created_at', { ascending: true });

          if (!isAdmin) {
            replyQuery.eq('status', 'approved');
          }

          const { data: replies } = await replyQuery;
          return { ...comment, replies: replies || [] };
        })
      );

      return commentsWithReplies;
    },
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async ({ content, parentId }: { content: string; parentId: string | null }) => {
      if (!session?.user) throw new Error('Must be logged in to comment');
      if (!content.trim()) throw new Error('Comment cannot be empty');

      // Get user profile for author_name
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', session.user.id)
        .single();

      const authorName = profile
        ? `${profile.first_name} ${profile.last_name}`
        : 'Anonymous';

      const { error } = await supabase.from('blog_comments').insert([{
        post_id: postId,
        author_id: session.user.id,
        parent_comment_id: parentId,
        content: content.trim(),
        author_name: authorName,
        status: 'pending', // Requires admin approval
      }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-comments', postId] });
      toast.success('Bình luận của bạn đang chờ duyệt!');
      setNewComment('');
      setReplyContent('');
      setReplyingTo(null);
    },
    onError: (error: Error) => toast.error(`Lỗi: ${error.message}`),
  });

  // Like comment mutation
  const likeCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      await supabase.rpc('increment_comment_likes', { comment_id_param: commentId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-comments', postId] });
    },
    onError: (error: Error) => toast.error(`Lỗi: ${error.message}`),
  });

  // Update comment status (admin only)
  const updateStatusMutation = useMutation({
    mutationFn: async ({ commentId, status }: { commentId: string; status: string }) => {
      const { error } = await supabase
        .from('blog_comments')
        .update({ status })
        .eq('id', commentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-comments', postId] });
      toast.success('Đã cập nhật trạng thái!');
    },
    onError: (error: Error) => toast.error(`Lỗi: ${error.message}`),
  });

  // Delete comment mutation (admin only)
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', commentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-comments', postId] });
      toast.success('Đã xóa bình luận!');
    },
    onError: (error: Error) => toast.error(`Lỗi: ${error.message}`),
  });

  const handleSubmitComment = () => {
    addCommentMutation.mutate({ content: newComment, parentId: null });
  };

  const handleSubmitReply = (parentId: string) => {
    addCommentMutation.mutate({ content: replyContent, parentId });
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const authorName = comment.profiles
      ? `${comment.profiles.first_name} ${comment.profiles.last_name}`
      : comment.author_name || 'Anonymous';

    return (
      <div key={comment.id} className={`${isReply ? 'ml-8' : ''}`}>
        <Card className="p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900 dark:text-white">{authorName}</span>
                {isAdmin && (
                  <Badge variant={comment.status === 'approved' ? 'default' : 'secondary'}>
                    {comment.status}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-500">
                {new Date(comment.created_at).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            {/* Admin actions */}
            {isAdmin && (
              <div className="flex gap-1">
                {comment.status === 'pending' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => updateStatusMutation.mutate({ commentId: comment.id, status: 'approved' })}
                  >
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                )}
                {comment.status === 'approved' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => updateStatusMutation.mutate({ commentId: comment.id, status: 'pending' })}
                  >
                    <X className="h-4 w-4 text-orange-600" />
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="ghost">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
                      <AlertDialogDescription>Xóa vĩnh viễn bình luận này?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteCommentMutation.mutate(comment.id)}>
                        Xóa
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-3">{comment.content}</p>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => likeCommentMutation.mutate(comment.id)}
              className="text-gray-600 dark:text-gray-400"
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              {comment.likes_count || 0}
            </Button>

            {!isReply && session && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="text-gray-600 dark:text-gray-400"
              >
                <Reply className="h-4 w-4 mr-1" />
                Trả lời
              </Button>
            )}
          </div>

          {/* Reply form */}
          {replyingTo === comment.id && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Viết trả lời..."
                rows={3}
                className="mb-2"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleSubmitReply(comment.id)}
                  disabled={!replyContent.trim() || addCommentMutation.isPending}
                >
                  <Send className="h-4 w-4 mr-1" />
                  Gửi
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent('');
                  }}
                >
                  Hủy
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Render replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {comment.replies.map((reply) => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
          Bình luận ({comments?.length || 0})
        </h2>
      </div>

      {/* New comment form */}
      {session ? (
        <Card className="p-4 mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết bình luận của bạn..."
            rows={4}
            className="mb-3"
          />
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || addCommentMutation.isPending}
            className="bg-gradient-to-r from-cyan-500 to-purple-500"
          >
            <Send className="h-4 w-4 mr-2" />
            {addCommentMutation.isPending ? 'Đang gửi...' : 'Gửi bình luận'}
          </Button>
        </Card>
      ) : (
        <Card className="p-4 mb-6 bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800">
          <p className="text-gray-700 dark:text-gray-300">
            Vui lòng đăng nhập để bình luận
          </p>
        </Card>
      )}

      {/* Comments list */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-cyan-500 border-t-transparent"></div>
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => renderComment(comment))}
        </div>
      ) : (
        <Card className="p-8 text-center bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
          <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">
            Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
          </p>
        </Card>
      )}
    </div>
  );
};

export default CommentsSection;

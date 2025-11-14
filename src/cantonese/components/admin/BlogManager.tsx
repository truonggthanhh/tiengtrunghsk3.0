import React, { useState, useRef } from 'react';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSession } from '@/cantonese/components/providers/SessionContextProvider';
import { FileText, Trash2, Edit3, Eye, PlusCircle, Upload, Image as ImageIcon } from 'lucide-react';
import RichTextEditor from '@/components/RichTextEditor';
import ImageUpload from '@/components/ImageUpload';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string | null;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  view_count: number;
  tags: string[];
  category_id: string | null;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  language: string;
  color: string | null;
  display_order: number;
}

const BlogManager = () => {
  const queryClient = useQueryClient();
  const { session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state for new post
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');

  // Edit state
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editExcerpt, setEditExcerpt] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editStatus, setEditStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [editFeaturedImageUrl, setEditFeaturedImageUrl] = useState('');
  const [editCategoryId, setEditCategoryId] = useState<string>('');

  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['blog-posts-admin', 'cantonese'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('language', 'cantonese')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session,
  });

  const { data: categories } = useQuery<BlogCategory[]>({
    queryKey: ['blog-categories', 'cantonese'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .eq('language', 'cantonese')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!session,
  });

  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const uploadImage = async (file: File): Promise<string> => {
    if (!session?.user?.id) throw new Error('User not authenticated');

    const sanitizedFileName = file.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9.]/g, "-");
    const filePath = `blog-images/${session.user.id}/${Date.now()}-${sanitizedFileName}`;

    const { error } = await supabase.storage.from('lesson_pdfs').upload(filePath, file);
    if (error) throw new Error(`Upload failed: ${error.message}`);

    const { data: { publicUrl } } = supabase.storage.from('lesson_pdfs').getPublicUrl(filePath);
    return publicUrl;
  };

  const addPostMutation = useMutation({
    mutationFn: async () => {
      if (!title || !content || !session?.user?.id) {
        throw new Error('Please fill in all required fields');
      }

      const slug = createSlug(title);
      let imageUrl = featuredImageUrl;

      if (featuredImage) {
        imageUrl = await uploadImage(featuredImage);
      }

      const tagsArray = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];

      const postData = {
        title,
        slug,
        excerpt,
        content,
        featured_image_url: imageUrl || null,
        author_id: session.user.id,
        language: 'cantonese',
        status,
        published_at: status === 'published' ? new Date().toISOString() : null,
        tags: tagsArray,
        category_id: categoryId || null,
      };

      const { error } = await supabase.from('blog_posts').insert([postData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts-admin', 'cantonese'] });
      toast.success('Bài viết đã được tạo!');
      setTitle('');
      setExcerpt('');
      setContent('');
      setTags('');
      setStatus('draft');
      setFeaturedImage(null);
      setFeaturedImageUrl('');
      setCategoryId('');
    },
    onError: (err: Error) => toast.error(`Lỗi: ${err.message}`),
  });

  const updatePostMutation = useMutation({
    mutationFn: async () => {
      if (!editingPost || !editTitle || !editContent) {
        throw new Error('Please fill in all required fields');
      }

      const slug = createSlug(editTitle);
      const tagsArray = editTags ? editTags.split(',').map(t => t.trim()).filter(Boolean) : [];

      const postData: any = {
        title: editTitle,
        slug,
        excerpt: editExcerpt,
        content: editContent,
        status: editStatus,
        tags: tagsArray,
        featured_image_url: editFeaturedImageUrl || null,
        category_id: editCategoryId || null,
      };

      if (editStatus === 'published' && editingPost.status !== 'published') {
        postData.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', editingPost.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts-admin', 'cantonese'] });
      queryClient.invalidateQueries({ queryKey: ['blog-posts', 'cantonese'] });
      toast.success('Bài viết đã được cập nhật!');
      setEditingPost(null);
    },
    onError: (err: Error) => toast.error(`Lỗi: ${err.message}`),
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase.from('blog_posts').delete().eq('id', postId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts-admin', 'cantonese'] });
      toast.success('Bài viết đã được xóa.');
    },
    onError: (err: Error) => toast.error(`Lỗi: ${err.message}`),
  });

  const handleEditClick = (post: BlogPost) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditExcerpt(post.excerpt || '');
    setEditContent(post.content);
    setEditTags(Array.isArray(post.tags) ? post.tags.join(', ') : '');
    setEditStatus(post.status);
    setEditFeaturedImageUrl(post.featured_image_url || '');
    setEditCategoryId(post.category_id || '');
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Posts List */}
      <div className="lg:col-span-2">
        <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-gray-200/50 dark:border-gray-800/50 shadow-xl">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 grid place-items-center shadow-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black text-gray-900 dark:text-white">Danh sách Bài viết</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Quản lý blog posts</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-red-600 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">Lỗi tải bài viết.</div>
            ) : (
              <div className="space-y-3">
                {posts?.map((post) => (
                  <div key={post.id} className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-cyan-300 dark:hover:border-cyan-700 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900 dark:text-white">{post.title}</h3>
                          <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                            {post.status}
                          </Badge>
                        </div>
                        {post.excerpt && <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{post.excerpt}</p>}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.view_count || 0}
                          </div>
                          {post.published_at && (
                            <span>{new Date(post.published_at).toLocaleDateString('vi-VN')}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(post)}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
                              <AlertDialogDescription>Xóa vĩnh viễn bài viết "{post.title}"</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deletePostMutation.mutate(post.id)}>Xóa</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add New Post Form */}
      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-gray-200/50 dark:border-gray-800/50 shadow-xl">
            <CardHeader className="border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-pink-500/10 via-cyan-500/10 to-purple-500/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-500 to-cyan-500 grid place-items-center shadow-lg">
                  <PlusCircle className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl font-black text-gray-900 dark:text-white">Bài viết mới</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề *</Label>
                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Tiêu đề bài viết" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Mô tả ngắn</Label>
                <Textarea id="excerpt" value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Mô tả ngắn..." rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Nội dung *</Label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Viết nội dung bài viết..."
                  height="300px"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Danh mục</Label>
                <Select value={categoryId || "none"} onValueChange={(val) => setCategoryId(val === "none" ? "" : val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Không chọn</SelectItem>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="featured-image">Ảnh đại diện</Label>
                <ImageUpload
                  bucket="lesson_pdfs"
                  folder="blog-images"
                  onImageUploaded={setFeaturedImageUrl}
                  currentImageUrl={featuredImageUrl}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</Label>
                <Input id="tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="grammar, vocabulary, tips" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select value={status} onValueChange={(value: 'draft' | 'published') => setStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Bản nháp</SelectItem>
                    <SelectItem value="published">Xuất bản</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => addPostMutation.mutate()} disabled={addPostMutation.isPending} className="w-full bg-gradient-to-r from-cyan-500 to-purple-500">
                <PlusCircle className="h-4 w-4 mr-2" />
                {addPostMutation.isPending ? 'Đang tạo...' : 'Tạo bài viết'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingPost} onOpenChange={(isOpen) => !isOpen && setEditingPost(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Chỉnh sửa bài viết</DialogTitle>
            <DialogDescription>Cập nhật nội dung bài viết</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Tiêu đề</Label>
              <Input id="edit-title" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-excerpt">Mô tả ngắn</Label>
              <Textarea id="edit-excerpt" value={editExcerpt} onChange={e => setEditExcerpt(e.target.value)} rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-content">Nội dung</Label>
              <RichTextEditor
                value={editContent}
                onChange={setEditContent}
                placeholder="Viết nội dung bài viết..."
                height="400px"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Danh mục</Label>
              <Select value={editCategoryId || "none"} onValueChange={(val) => setEditCategoryId(val === "none" ? "" : val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không chọn</SelectItem>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-featured-image">Ảnh đại diện</Label>
              <ImageUpload
                bucket="lesson_pdfs"
                folder="blog-images"
                onImageUploaded={setEditFeaturedImageUrl}
                currentImageUrl={editFeaturedImageUrl}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tags">Tags</Label>
              <Input id="edit-tags" value={editTags} onChange={e => setEditTags(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Trạng thái</Label>
              <Select value={editStatus} onValueChange={(value: 'draft' | 'published' | 'archived') => setEditStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Bản nháp</SelectItem>
                  <SelectItem value="published">Xuất bản</SelectItem>
                  <SelectItem value="archived">Lưu trữ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPost(null)}>Hủy</Button>
            <Button onClick={() => updatePostMutation.mutate()} disabled={updatePostMutation.isPending} className="bg-gradient-to-r from-cyan-500 to-purple-500">
              {updatePostMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManager;

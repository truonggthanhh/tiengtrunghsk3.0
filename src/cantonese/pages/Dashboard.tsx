import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSession } from '@/cantonese/components/providers/SessionContextProvider';
import { Upload, Sparkles, FileText, Trash2, Music, Users, PlusCircle, BookOpen, ListMusic, Edit3, Clock, CheckCircle2, XCircle, Star, Replace, GripVertical, KeyRound, Lock, Newspaper, UserCog } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ManageUserLessonsDialog from '@/cantonese/components/admin/ManageUserLessonsDialog';
import SortableLessonItem from '@/cantonese/components/admin/SortableLessonItem'; // Import the new component
import { CourseAccessManagement } from '@/cantonese/components/admin/CourseAccessManagement';
import BlogManager from '@/cantonese/components/admin/BlogManager';
import CourseManager from '@/cantonese/components/admin/CourseManager';

const extractVideoId = (url: string) => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

type Lesson = {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  pdf_url: string | null;
  user_id: string | null;
  position: number;
};

type Course = {
  id: string;
  name: string;
  slug: string;
  language: string;
  is_free: boolean;
  is_active: boolean;
};

type Job = {
  id: string;
  lesson_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message: string | null;
  updated_at: string;
};

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: 'user' | 'admin';
  updated_at: string;
  cantonese_access?: boolean;
  mandarin_access?: boolean;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { session, isLoading: isSessionLoading } = useSession();
  const [activeTab, setActiveTab] = useState('lessons');
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  // Memoize returnUrl để tránh tính toán lại khi component re-render do tab switch
  const returnUrl = useMemo(() => {
    return encodeURIComponent(window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    if (!isSessionLoading && !session) {
      toast.error('Vui lòng đăng nhập để truy cập Dashboard.');
      navigate(`/cantonese/login?returnUrl=${returnUrl}`);
      return;
    }

    if (session) {
      const checkAdminRole = async () => {
        setIsCheckingRole(true);
        const { data, error } = await supabase.rpc('get_my_role');
        if (error) {
          console.error("Lỗi khi kiểm tra vai trò admin:", error);
          setIsUserAdmin(false);
        } else {
          setIsUserAdmin(data === 'admin');
        }
        setIsCheckingRole(false);
      };
      checkAdminRole();
    }
  }, [session, isSessionLoading, navigate, returnUrl]);

  if (isSessionLoading || isCheckingRole) {
    return <div className="p-6">Đang kiểm tra quyền truy cập...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/50 via-purple-50/30 to-pink-50/50 dark:from-gray-950 dark:via-cyan-950/10 dark:to-purple-950/10">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 grid place-items-center shadow-lg">
              <UserCog className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 dark:from-cyan-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Dashboard Quản trị
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Quản lý nội dung học Tiếng Quảng Đông</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <nav className="flex flex-col space-y-2 p-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl">
                <Button
                  variant={activeTab === 'lessons' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('lessons')}
                  className={`justify-start gap-3 transition-all ${
                    activeTab === 'lessons'
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                      : 'hover:bg-cyan-50 dark:hover:bg-cyan-900/20 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <BookOpen className="h-5 w-5" />
                  <span className="font-semibold">Bài học</span>
                </Button>

                <Button
                  variant={activeTab === 'songs' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('songs')}
                  className={`justify-start gap-3 transition-all ${
                    activeTab === 'songs'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <ListMusic className="h-5 w-5" />
                  <span className="font-semibold">Bài hát</span>
                </Button>

                {isUserAdmin && (
                  <Button
                    variant={activeTab === 'users' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('users')}
                    className={`justify-start gap-3 transition-all ${
                      activeTab === 'users'
                        ? 'bg-gradient-to-r from-pink-500 to-cyan-500 text-white shadow-lg'
                        : 'hover:bg-pink-50 dark:hover:bg-pink-900/20 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Users className="h-5 w-5" />
                    <span className="font-semibold">Người dùng</span>
                  </Button>
                )}

                {isUserAdmin && (
                  <Button
                    variant={activeTab === 'courseaccess' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('courseaccess')}
                    className={`justify-start gap-3 transition-all ${
                      activeTab === 'courseaccess'
                        ? 'bg-gradient-to-r from-cyan-500 to-pink-500 text-white shadow-lg'
                        : 'hover:bg-cyan-50 dark:hover:bg-cyan-900/20 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Lock className="h-5 w-5" />
                    <span className="font-semibold">Khóa học</span>
                  </Button>
                )}

                <Button
                  variant={activeTab === 'blog' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('blog')}
                  className={`justify-start gap-3 transition-all ${
                    activeTab === 'blog'
                      ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white shadow-lg'
                      : 'hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Newspaper className="h-5 w-5" />
                  <span className="font-semibold">Blog</span>
                </Button>

                <Button
                  variant={activeTab === 'courses' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('courses')}
                  className={`justify-start gap-3 transition-all ${
                    activeTab === 'courses'
                      ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white shadow-lg'
                      : 'hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <BookOpen className="h-5 w-5" />
                  <span className="font-semibold">Quản lý khóa học</span>
                </Button>
              </nav>
            </div>
          </aside>

          {/* Content Area */}
          <main className="lg:col-span-4">
            <div className="transition-all duration-300">
              {activeTab === 'lessons' && <LessonManager />}
              {activeTab === 'songs' && <SongManager />}
              {activeTab === 'users' && isUserAdmin && <UserManager />}
              {activeTab === 'courseaccess' && isUserAdmin && <CourseAccessManagement />}
              {activeTab === 'blog' && <BlogManager />}
              {activeTab === 'courses' && <CourseManager />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

const LessonManager = () => {
  const queryClient = useQueryClient();
  const { session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [courseId, setCourseId] = useState<string>('');
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDesc, setEditedDesc] = useState('');
  const [selectedLessons, setSelectedLessons] = useState<Set<string>>(new Set());
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lessonToReplacePdf, setLessonToReplacePdf] = useState<Lesson | null>(null);

  const { data: fetchedLessons, isLoading: isLoadingLessons } = useQuery<Lesson[]>({
    queryKey: ['lessons'],
    queryFn: async () => {
      const { data, error } = await supabase.from('lessons').select('*').order('position', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!session,
  });

  useEffect(() => {
    if (fetchedLessons) {
      setLessons(fetchedLessons);
    }
  }, [fetchedLessons]);

  const { data: jobs, isLoading: isLoadingJobs } = useQuery<Job[]>({
    queryKey: ['exercise_generation_jobs', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data, error } = await supabase.from('exercise_generation_jobs').select('*').eq('user_id', session.user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!session,
  });

  const { data: reviewTestStatus, isLoading: isLoadingReviewStatus } = useQuery({
    queryKey: ['review_tests_status', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return new Set();
      const { data, error } = await supabase.from('review_tests').select('lesson_id').eq('user_id', session.user.id);
      if (error) throw error;
      return new Set(data.map(item => item.lesson_id));
    },
    enabled: !!session,
  });

  const { data: courses } = useQuery<Course[]>({
    queryKey: ['courses-admin', 'cantonese'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('language', 'cantonese')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!session,
  });

  useEffect(() => {
    if (!session?.user?.id) return;
    const channel = supabase.channel('realtime-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'exercise_generation_jobs', filter: `user_id=eq.${session.user.id}` },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['exercise_generation_jobs', session.user.id] });
          if ((payload.new as Job)?.status === 'completed') {
            queryClient.invalidateQueries({ queryKey: ['exercises', (payload.new as Job).lesson_id, session.user.id] });
          }
        }
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'review_tests', filter: `user_id=eq.${session.user.id}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ['review_tests_status', session.user.id] });
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [session, queryClient]);

  const addLessonMutation = useMutation({
    mutationFn: async ({ title, description, pdfPath, userId, courseId }: { title: string; description: string; pdfPath?: string; userId: string; courseId?: string }) => {
      const { data, error } = await supabase.from('lessons').insert([{ title, description, pdf_url: pdfPath, user_id: userId, course_id: courseId || null }]).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['lessons'] }); toast.success('Bài học đã được tải lên!'); setFile(null); setTitle(''); setDesc(''); setCourseId(''); },
    onError: (err) => toast.error(`Lỗi: ${err.message}`),
  });

  const updateLessonMutation = useMutation({
    mutationFn: async ({ id, title, description }: { id: string; title: string; description: string }) => {
      const { error } = await supabase.from('lessons').update({ title, description }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['lessons'] }); toast.success('Bài học đã được cập nhật!'); setEditingLesson(null); },
    onError: (err: Error) => toast.error(`Lỗi: ${err.message}`),
  });

  const generateExercisesMutation = useMutation({
    mutationFn: async (lesson: { id: string }) => {
      const { data, error } = await supabase.functions.invoke('generate-exercises', { body: { lessonId: lesson.id } });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data) => { toast.info(data.message); queryClient.invalidateQueries({ queryKey: ['exercise_generation_jobs', session?.user?.id] }); },
    onError: (err: any) => toast.error(`Lỗi: ${err.message}`),
  });

  const generateReviewBatchMutation = useMutation({
    mutationFn: async (lesson_ids: string[]) => {
      const { data, error } = await supabase.functions.invoke('trigger-review-generation-batch', { body: { lesson_ids } });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data) => { toast.info(data.message); setSelectedLessons(new Set()); },
    onError: (err: any) => toast.error(`Lỗi khi tạo đề ôn tập: ${err.message}`),
  });

  const deleteLessonMutation = useMutation({
    mutationFn: async (lessonToDelete: { id: string; pdf_url?: string | null }) => {
      const { error } = await supabase.rpc('delete_lesson_and_dependents', { lesson_id_to_delete: lessonToDelete.id });
      if (error) throw new Error(`RPC Error: ${error.message}`);
      if (lessonToDelete.pdf_url) {
        try {
          const filePath = new URL(lessonToDelete.pdf_url).pathname.split('/lesson_pdfs/')[1];
          if (filePath) {
            await supabase.storage.from('lesson_pdfs').remove([filePath]);
          }
        } catch (e) { console.warn("Could not parse or delete PDF from storage:", e); }
      }
    },
    onSuccess: () => { toast.success('Bài học đã được xóa.'); },
    onError: (err: Error) => toast.error(`Lỗi: ${err.message}`),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['lessons'] }),
  });

  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const { error } = await supabase.from('exercise_generation_jobs').delete().eq('id', jobId);
      if (error) throw error;
    },
    onMutate: async (jobId: string) => {
      await queryClient.cancelQueries({ queryKey: ['exercise_generation_jobs', session?.user?.id] });
      const previousJobs = queryClient.getQueryData<Job[]>(['exercise_generation_jobs', session?.user?.id]);
      if (previousJobs) {
        queryClient.setQueryData<Job[]>(
          ['exercise_generation_jobs', session?.user?.id],
          previousJobs.filter(job => job.id !== jobId)
        );
      }
      return { previousJobs };
    },
    onError: (err: Error, _jobId, context) => {
      toast.error(`Lỗi khi hủy tác vụ: ${err.message}`);
      if (context?.previousJobs) {
        queryClient.setQueryData(['exercise_generation_jobs', session?.user?.id], context.previousJobs);
      }
      queryClient.invalidateQueries({ queryKey: ['exercise_generation_jobs', session?.user?.id] });
    },
    onSuccess: () => {
        toast.success('Tác vụ đã được hủy.');
    }
  });

  const updateLessonOrderMutation = useMutation({
    mutationFn: async (orderedLessonIds: string[]) => {
      const { error } = await supabase.rpc('update_lesson_order', { lesson_ids: orderedLessonIds });
      if (error) throw error;
    },
    onSuccess: () => { toast.success('Đã lưu thứ tự bài học!'); queryClient.invalidateQueries({ queryKey: ['lessons'] }); },
    onError: (err: Error) => toast.error(`Lỗi lưu thứ tự: ${err.message}`),
  });

  const replacePdfMutation = useMutation({
    mutationFn: async ({ lesson, newFile }: { lesson: Lesson; newFile: File }) => {
      if (!session?.user?.id) throw new Error("User not authenticated");

      // 1. Upload new file
      const sanitizedFileName = newFile.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9.]/g, "-");
      const newFilePath = `${session.user.id}/${Date.now()}-${sanitizedFileName}`;
      const { error: uploadError } = await supabase.storage.from('lesson_pdfs').upload(newFilePath, newFile);
      if (uploadError) throw new Error(`Lỗi tải lên PDF mới: ${uploadError.message}`);
      const { data: { publicUrl: newPublicUrl } } = supabase.storage.from('lesson_pdfs').getPublicUrl(newFilePath);

      // 2. Update lesson with new URL
      const { error: updateError } = await supabase.from('lessons').update({ pdf_url: newPublicUrl }).eq('id', lesson.id);
      if (updateError) throw new Error(`Lỗi cập nhật bài học: ${updateError.message}`);

      // 3. Delete old file (if it exists)
      if (lesson.pdf_url) {
        try {
          const oldFilePath = new URL(lesson.pdf_url).pathname.split('/lesson_pdfs/')[1];
          if (oldFilePath) {
            await supabase.storage.from('lesson_pdfs').remove([oldFilePath]);
          }
        } catch (e) { console.warn("Could not parse or delete old PDF from storage:", e); }
      }
    },
    onSuccess: () => { toast.success('Đã thay thế file PDF thành công!'); queryClient.invalidateQueries({ queryKey: ['lessons'] }); },
    onError: (err: Error) => toast.error(`Lỗi: ${err.message}`),
  });

  async function uploadHandler() {
    if (!file || !title || !session?.user?.id) { toast.error('Vui lòng điền tiêu đề và chọn file PDF.'); return; }
    const sanitizedFileName = file.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9.]/g, "-");
    const filePath = `${session.user.id}/${Date.now()}-${sanitizedFileName}`;
    const { error } = await supabase.storage.from('lesson_pdfs').upload(filePath, file);
    if (error) { toast.error(`Lỗi tải lên PDF: ${error.message}`); return; }
    const { data: { publicUrl } } = supabase.storage.from('lesson_pdfs').getPublicUrl(filePath);
    addLessonMutation.mutate({ title, description: desc, pdfPath: publicUrl, userId: session.user.id, courseId: courseId || undefined });
  }

  const handleUpdateLesson = () => {
    if (editingLesson && editedTitle) {
      updateLessonMutation.mutate({ id: editingLesson.id, title: editedTitle, description: editedDesc });
    }
  };

  const handleSelectLesson = (lessonId: string, checked: boolean) => {
    setSelectedLessons(prev => {
      const newSet = new Set(prev);
      if (checked) newSet.add(lessonId); else newSet.delete(lessonId);
      return newSet;
    });
  };

  const handleGenerateReviewBatch = () => {
    if (selectedLessons.size === 0) return;
    generateReviewBatchMutation.mutate(Array.from(selectedLessons));
  };

  const sensors = useSensors(useSensor(PointerSensor));
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setLessons((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        const orderedIds = newOrder.map(item => item.id);
        updateLessonOrderMutation.mutate(orderedIds);
        return newOrder;
      });
    }
  };

  const handleReplacePdfClick = (lesson: Lesson) => {
    setLessonToReplacePdf(lesson);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && lessonToReplacePdf) {
      replacePdfMutation.mutate({ lesson: lessonToReplacePdf, newFile: file });
    }
    // Reset for next use
    if (event.target) event.target.value = '';
    setLessonToReplacePdf(null);
  };

  const lessonJobs = new Map(jobs?.map(job => [job.lesson_id, job]));

  return (
    <TooltipProvider>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Lessons List */}
        <div className="lg:col-span-2">
          <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-gray-200/50 dark:border-gray-800/50 shadow-xl">
            <CardHeader className="border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 grid place-items-center shadow-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black text-gray-900 dark:text-white">Danh sách Bài học</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Kéo thả để sắp xếp. Chọn bài học để tạo đề ôn tập.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6">
                <Button
                  onClick={handleGenerateReviewBatch}
                  disabled={selectedLessons.size === 0 || generateReviewBatchMutation.isPending}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold shadow-lg"
                >
                  <Star className="h-4 w-4 mr-2" />
                  {generateReviewBatchMutation.isPending ? 'Đang xử lý...' : `Tạo đề ôn tập (${selectedLessons.size})`}
                </Button>
              </div>
              {(isLoadingLessons || isLoadingJobs || isLoadingReviewStatus) ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
                  </div>
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={lessons.map(l => l.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                      {lessons?.map((l) => (
                        <SortableLessonItem
                          key={l.id}
                          lesson={l}
                          job={lessonJobs.get(l.id)}
                          hasReviewTests={reviewTestStatus?.has(l.id)}
                          isSelected={selectedLessons.has(l.id)}
                          onSelect={handleSelectLesson}
                          onEdit={() => { setEditingLesson(l); setEditedTitle(l.title); setEditedDesc(l.description || ''); }}
                          onGenerate={() => generateExercisesMutation.mutate(l)}
                          onCancelJob={(jobId) => deleteJobMutation.mutate(jobId)}
                          onDelete={() => deleteLessonMutation.mutate(l)}
                          onReplacePdf={() => handleReplacePdfClick(l)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add New Lesson Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-gray-200/50 dark:border-gray-800/50 shadow-xl">
              <CardHeader className="border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-pink-500/10 via-cyan-500/10 to-purple-500/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-500 to-cyan-500 grid place-items-center shadow-lg">
                    <PlusCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black text-gray-900 dark:text-white">Thêm Bài học</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Tải lên PDF mới</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="lesson-title" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tiêu đề bài học</Label>
                  <Input
                    id="lesson-title"
                    placeholder="Ví dụ: Bài 1 - Chào hỏi"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="border-gray-300 dark:border-gray-700 focus:border-cyan-500 dark:focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lesson-desc" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Mô tả (tùy chọn)</Label>
                  <Textarea
                    id="lesson-desc"
                    placeholder="Mô tả ngắn về bài học..."
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                    className="border-gray-300 dark:border-gray-700 focus:border-cyan-500 dark:focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Khóa học (tùy chọn)</Label>
                  <Select value={courseId || "none"} onValueChange={(val) => setCourseId(val === "none" ? "" : val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khóa học..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Không chọn</SelectItem>
                      {courses?.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lesson-pdf" className="text-sm font-semibold text-gray-700 dark:text-gray-300">File PDF</Label>
                  <Input
                    id="lesson-pdf"
                    type="file"
                    accept="application/pdf"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="border-gray-300 dark:border-gray-700"
                  />
                </div>
                <Button
                  onClick={uploadHandler}
                  disabled={addLessonMutation.isPending}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold shadow-lg"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {addLessonMutation.isPending ? 'Đang tải...' : 'Tải lên & Lưu'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingLesson} onOpenChange={(isOpen) => !isOpen && setEditingLesson(null)}>
        <DialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <DialogHeader className="border-b border-gray-200 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 grid place-items-center shadow-lg">
                <Edit3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black text-gray-900 dark:text-white">Chỉnh sửa bài học</DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">Cập nhật tiêu đề và mô tả</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tiêu đề</Label>
              <Input
                id="edit-title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="border-gray-300 dark:border-gray-700 focus:border-cyan-500 dark:focus:border-cyan-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-desc" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Mô tả</Label>
              <Textarea
                id="edit-desc"
                value={editedDesc}
                onChange={(e) => setEditedDesc(e.target.value)}
                className="border-gray-300 dark:border-gray-700 focus:border-cyan-500 dark:focus:border-cyan-500"
              />
            </div>
          </div>
          <DialogFooter className="border-t border-gray-200 dark:border-gray-800 pt-4">
            <Button variant="outline" onClick={() => setEditingLesson(null)} className="border-gray-300 dark:border-gray-700">
              Hủy
            </Button>
            <Button
              onClick={handleUpdateLesson}
              disabled={updateLessonMutation.isPending}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold shadow-lg"
            >
              {updateLessonMutation.isPending ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="application/pdf" style={{ display: 'none' }} />
    </TooltipProvider>
  );
};

const SongManager = () => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [lrc, setLrc] = useState('');

  // Edit state
  const [editingSong, setEditingSong] = useState<any>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editArtist, setEditArtist] = useState('');
  const [editYoutubeUrl, setEditYoutubeUrl] = useState('');
  const [editLrc, setEditLrc] = useState('');

  const { data: songs, isLoading, error } = useQuery({
    queryKey: ['songs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('songs').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addSongMutation = useMutation({
    mutationFn: async (newSong: { title: string; artist: string; youtube_video_id: string; lrc: string }) => {
      const { error } = await supabase.from('songs').insert([newSong]);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['songs'] }); toast.success('Bài hát đã được thêm!'); setTitle(''); setArtist(''); setYoutubeUrl(''); setLrc(''); },
    onError: (err: Error) => toast.error(`Lỗi: ${err.message}`),
  });

  const updateSongMutation = useMutation({
    mutationFn: async ({ id, title, artist, youtube_video_id, lrc }: { id: string; title: string; artist: string; youtube_video_id: string; lrc: string }) => {
      const { error } = await supabase.from('songs').update({ title, artist, youtube_video_id, lrc }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] });
      toast.success('Bài hát đã được cập nhật!');
      setEditingSong(null);
    },
    onError: (err: Error) => toast.error(`Lỗi: ${err.message}`),
  });

  const deleteSongMutation = useMutation({
    mutationFn: async (songId: string) => {
      const { error } = await supabase.from('songs').delete().eq('id', songId);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['songs'] }); toast.success('Bài hát đã được xóa.'); },
    onError: (err: Error) => toast.error(`Lỗi: ${err.message}`),
  });

  const handleSubmit = () => {
    const videoId = extractVideoId(youtubeUrl);
    if (!title || !artist || !videoId || !lrc) { toast.error('Vui lòng điền đủ thông tin và link YouTube hợp lệ.'); return; }
    addSongMutation.mutate({ title, artist, youtube_video_id: videoId, lrc });
  };

  const handleEditClick = (song: any) => {
    setEditingSong(song);
    setEditTitle(song.title);
    setEditArtist(song.artist);
    setEditYoutubeUrl(`https://www.youtube.com/watch?v=${song.youtube_video_id}`);
    setEditLrc(song.lrc);
  };

  const handleUpdateSong = () => {
    const videoId = extractVideoId(editYoutubeUrl);
    if (!editTitle || !editArtist || !videoId || !editLrc) {
      toast.error('Vui lòng điền đủ thông tin và link YouTube hợp lệ.');
      return;
    }
    updateSongMutation.mutate({
      id: editingSong.id,
      title: editTitle,
      artist: editArtist,
      youtube_video_id: videoId,
      lrc: editLrc
    });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Songs List */}
      <div className="lg:col-span-2">
        <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-gray-200/50 dark:border-gray-800/50 shadow-xl">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 grid place-items-center shadow-lg">
                <ListMusic className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black text-gray-900 dark:text-white">Danh sách Bài hát</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">Quản lý bài hát học Tiếng Quảng</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-red-600 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">Lỗi tải bài hát.</div>
            ) : (
              <div className="space-y-3">
                {songs?.map((s: any) => (
                  <div key={s.id} className="group p-4 border border-gray-200 dark:border-gray-800 rounded-xl flex items-center justify-between flex-wrap gap-3 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-900/10">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 grid place-items-center shadow-md">
                        <Music className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white">{s.title}</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{s.artist}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild className="hover:bg-purple-50 dark:hover:bg-purple-900/20 border-purple-300 dark:border-purple-700">
                        <Link to={`/cantonese/songs/${s.id}`} className="flex items-center gap-2">
                          <Music className="h-4 w-4" />
                          Nghe
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(s)} className="hover:bg-cyan-50 dark:hover:bg-cyan-900/20 border-cyan-300 dark:border-cyan-700">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="hover:bg-red-50 dark:hover:bg-red-900/20 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle><AlertDialogDescription>Xóa vĩnh viễn bài hát "{s.title}".</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Hủy</AlertDialogCancel><AlertDialogAction onClick={() => deleteSongMutation.mutate(s.id)}>Xóa</AlertDialogAction></AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add New Song Form */}
      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-gray-200/50 dark:border-gray-800/50 shadow-xl">
            <CardHeader className="border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 grid place-items-center shadow-lg">
                  <PlusCircle className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl font-black text-gray-900 dark:text-white">Thêm Bài hát</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="song-title" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tiêu đề bài hát</Label>
                <Input
                  id="song-title"
                  placeholder="Ví dụ: 七里香"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="border-gray-300 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="song-artist" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nghệ sĩ</Label>
                <Input
                  id="song-artist"
                  placeholder="Ví dụ: Jay Chou 周杰倫"
                  value={artist}
                  onChange={e => setArtist(e.target.value)}
                  className="border-gray-300 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube-url" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Link YouTube</Label>
                <Input
                  id="youtube-url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={e => setYoutubeUrl(e.target.value)}
                  className="border-gray-300 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lrc-content" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nội dung LRC</Label>
                <Textarea
                  id="lrc-content"
                  placeholder="[00:00.00]Dán nội dung file .LRC vào đây..."
                  value={lrc}
                  onChange={e => setLrc(e.target.value)}
                  rows={8}
                  className="border-gray-300 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-500 font-mono text-sm"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">Format: [MM:SS.MS]Lời bài hát</p>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={addSongMutation.isPending}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold shadow-lg"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                {addSongMutation.isPending ? 'Đang thêm...' : 'Thêm Bài hát'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingSong} onOpenChange={(isOpen) => !isOpen && setEditingSong(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <DialogHeader className="border-b border-gray-200 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 grid place-items-center shadow-lg">
                <Edit3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black text-gray-900 dark:text-white">Chỉnh sửa bài hát</DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">Cập nhật thông tin bài hát và lời bài hát</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tiêu đề bài hát</Label>
              <Input
                id="edit-title"
                placeholder="Ví dụ: 七里香"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                className="border-gray-300 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-artist" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nghệ sĩ</Label>
              <Input
                id="edit-artist"
                placeholder="Ví dụ: Jay Chou 周杰倫"
                value={editArtist}
                onChange={e => setEditArtist(e.target.value)}
                className="border-gray-300 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-youtube" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Link YouTube</Label>
              <Input
                id="edit-youtube"
                placeholder="https://www.youtube.com/watch?v=..."
                value={editYoutubeUrl}
                onChange={e => setEditYoutubeUrl(e.target.value)}
                className="border-gray-300 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-lrc" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Lời bài hát (Format LRC)</Label>
              <Textarea
                id="edit-lrc"
                placeholder="[00:00.00]Dán nội dung file .LRC vào đây"
                value={editLrc}
                onChange={e => setEditLrc(e.target.value)}
                rows={12}
                className="font-mono text-sm border-gray-300 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-500"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Format: [MM:SS.MS]Lời bài hát. Ví dụ: [00:15.50]你好
              </p>
            </div>
          </div>
          <DialogFooter className="border-t border-gray-200 dark:border-gray-800 pt-4">
            <Button variant="outline" onClick={() => setEditingSong(null)} className="border-gray-300 dark:border-gray-700">
              Hủy
            </Button>
            <Button
              onClick={handleUpdateSong}
              disabled={updateSongMutation.isPending}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold shadow-lg"
            >
              {updateSongMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const UserManager = () => {
  const [selectedUserForLessons, setSelectedUserForLessons] = useState<Profile | null>(null);

  const { data: profiles, isLoading, error } = useQuery<Profile[]>({
    queryKey: ['allProfiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('id, first_name, last_name, role, updated_at');
      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-gray-200/50 dark:border-gray-800/50 shadow-xl">
        <CardHeader className="border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-pink-500/10 via-cyan-500/10 to-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-500 to-cyan-500 grid place-items-center shadow-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-black text-gray-900 dark:text-white">Danh sách Người dùng</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">Quản lý quyền truy cập ngôn ngữ và bài học cho từng người dùng.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-red-600 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">Lỗi tải danh sách người dùng.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 dark:border-gray-800">
                    <TableHead className="font-bold text-gray-900 dark:text-white">Họ và Tên</TableHead>
                    <TableHead className="font-bold text-gray-900 dark:text-white">Vai trò</TableHead>
                    <TableHead className="font-bold text-gray-900 dark:text-white">Ngày cập nhật</TableHead>
                    <TableHead className="font-bold text-gray-900 dark:text-white">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles?.map((p) => (
                    <TableRow key={p.id} className="border-gray-200 dark:border-gray-800 hover:bg-pink-50/50 dark:hover:bg-pink-900/10 transition-colors">
                      <TableCell className="font-medium text-gray-900 dark:text-white">{p.first_name || ''} {p.last_name || ''}</TableCell>
                      <TableCell>
                        <Badge
                          variant={p.role === 'admin' ? 'default' : 'secondary'}
                          className={p.role === 'admin' ? 'bg-gradient-to-r from-pink-500 to-cyan-500 text-white' : ''}
                        >
                          {p.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">{new Date(p.updated_at).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUserForLessons(p)}
                            className="hover:bg-pink-50 dark:hover:bg-pink-900/20 border-pink-300 dark:border-pink-700"
                          >
                            <BookOpen className="h-4 w-4 mr-2" /> Bài học
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      <ManageUserLessonsDialog user={selectedUserForLessons} onClose={() => setSelectedUserForLessons(null)} />
    </>
  );
};

export default Dashboard;
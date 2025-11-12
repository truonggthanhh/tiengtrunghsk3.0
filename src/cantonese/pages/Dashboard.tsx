import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSession } from '@/cantonese/components/providers/SessionContextProvider';
import { Upload, Sparkles, FileText, Trash2, Music, Users, PlusCircle, BookOpen, ListMusic, Edit3, Clock, CheckCircle2, XCircle, Star, Replace, GripVertical, KeyRound, Globe, Lock } from 'lucide-react';
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
import ManageUserLessonsDialog from '@/cantonese/components/admin/ManageUserLessonsDialog';
import ManageUserLanguageAccessDialog from '@/cantonese/components/admin/ManageUserLanguageAccessDialog';
import SortableLessonItem from '@/cantonese/components/admin/SortableLessonItem'; // Import the new component
import { CourseAccessManagement } from '@/cantonese/components/admin/CourseAccessManagement';

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

  useEffect(() => {
    if (!isSessionLoading && !session) {
      toast.error('Vui lòng đăng nhập để truy cập Dashboard.');
      navigate('/cantonese/login');
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
  }, [session, isSessionLoading, navigate]);

  if (isSessionLoading || isCheckingRole) {
    return <div className="p-6">Đang kiểm tra quyền truy cập...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <Link to="/cantonese" className="text-sm text-ink/70 hover:text-ink dark:text-cream/70 dark:hover:text-cream mb-4 inline-block">← Quay về trang chủ</Link>
      <h1 className="text-3xl font-black mb-4">Dashboard Quản trị</h1>
      <div className="grid md:grid-cols-4 gap-6">
        <aside className="md:col-span-1">
          <nav className="flex flex-col space-y-1 p-2 bg-white dark:bg-black/20 rounded-2xl border border-ink/10 shadow-sm">
            <Button variant={activeTab === 'lessons' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('lessons')} className="justify-start gap-2"><BookOpen className="h-4 w-4" /> Quản lý Bài học</Button>
            <Button variant={activeTab === 'songs' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('songs')} className="justify-start gap-2"><ListMusic className="h-4 w-4" /> Quản lý Bài hát</Button>
            {isUserAdmin && (<Button variant={activeTab === 'users' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('users')} className="justify-start gap-2"><Users className="h-4 w-4" /> Quản lý Người dùng</Button>)}
            {isUserAdmin && (<Button variant={activeTab === 'courseaccess' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('courseaccess')} className="justify-start gap-2"><Lock className="h-4 w-4" /> Khóa học</Button>)}
          </nav>
        </aside>
        <main className="md:col-span-3">
          {activeTab === 'lessons' && <LessonManager />}
          {activeTab === 'songs' && <SongManager />}
          {activeTab === 'users' && isUserAdmin && <UserManager />}
          {activeTab === 'courseaccess' && isUserAdmin && <CourseAccessManagement />}
        </main>
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
    mutationFn: async ({ title, description, pdfPath, userId }: { title: string; description: string; pdfPath?: string; userId: string }) => {
      const { data, error } = await supabase.from('lessons').insert([{ title, description, pdf_url: pdfPath, user_id: userId }]).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['lessons'] }); toast.success('Bài học đã được tải lên!'); setFile(null); setTitle(''); setDesc(''); },
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
    addLessonMutation.mutate({ title, description: desc, pdfPath: publicUrl, userId: session.user.id });
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
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách Bài học</CardTitle>
              <CardDescription>Kéo thả để sắp xếp. Chọn bài học để tạo đề ôn tập, hoặc quản lý từng bài học.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Button onClick={handleGenerateReviewBatch} disabled={selectedLessons.size === 0 || generateReviewBatchMutation.isPending}>
                  <Star className="h-4 w-4 mr-2" />
                  {generateReviewBatchMutation.isPending ? 'Đang xử lý...' : `Tạo đề ôn tập (${selectedLessons.size})`}
                </Button>
              </div>
              {(isLoadingLessons || isLoadingJobs || isLoadingReviewStatus) ? <div>Đang tải...</div> : (
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
        <div>
          <Card>
            <CardHeader><CardTitle>Thêm Bài học mới</CardTitle><CardDescription>Tải lên file PDF để tạo bài học mới.</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Tiêu đề bài học" value={title} onChange={e => setTitle(e.target.value)} />
              <Textarea placeholder="Mô tả ngắn (tùy chọn)" value={desc} onChange={e => setDesc(e.target.value)} />
              <Input type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} />
              <Button onClick={uploadHandler} disabled={addLessonMutation.isPending}><Upload className="h-4 w-4 mr-2" /> {addLessonMutation.isPending ? 'Đang tải...' : 'Tải lên & Lưu'}</Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Dialog open={!!editingLesson} onOpenChange={(isOpen) => !isOpen && setEditingLesson(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Chỉnh sửa bài học</DialogTitle><DialogDescription>Cập nhật tiêu đề và mô tả.</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="edit-title" className="text-right">Tiêu đề</Label><Input id="edit-title" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="edit-desc" className="text-right">Mô tả</Label><Textarea id="edit-desc" value={editedDesc} onChange={(e) => setEditedDesc(e.target.value)} className="col-span-3" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setEditingLesson(null)}>Hủy</Button><Button onClick={handleUpdateLesson} disabled={updateLessonMutation.isPending}>{updateLessonMutation.isPending ? 'Đang lưu...' : 'Lưu'}</Button></DialogFooter>
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

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader><CardTitle>Danh sách Bài hát</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? <div>Đang tải...</div> : error ? <div className="text-verm">Lỗi tải bài hát.</div> : (
              <div className="space-y-3">
                {songs?.map((s: any) => (
                  <div key={s.id} className="p-3 border rounded-lg flex items-center justify-between flex-wrap gap-2">
                    <div><span className="font-semibold">{s.title}</span> - {s.artist}</div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild><Link to={`/songs/${s.id}`}>Nghe</Link></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
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
      <div>
        <Card>
          <CardHeader><CardTitle>Thêm Bài hát mới</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Tiêu đề bài hát" value={title} onChange={e => setTitle(e.target.value)} />
            <Input placeholder="Nghệ sĩ" value={artist} onChange={e => setArtist(e.target.value)} />
            <Input placeholder="Link YouTube" value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} />
            <Textarea placeholder="Dán nội dung file .LRC" value={lrc} onChange={e => setLrc(e.target.value)} rows={10} />
            <Button onClick={handleSubmit} disabled={addSongMutation.isPending}><PlusCircle className="h-4 w-4 mr-2" /> {addSongMutation.isPending ? 'Đang thêm...' : 'Thêm'}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const UserManager = () => {
  const [selectedUserForLessons, setSelectedUserForLessons] = useState<Profile | null>(null);
  const [selectedUserForLanguage, setSelectedUserForLanguage] = useState<Profile | null>(null);

  const { data: profiles, isLoading, error } = useQuery<Profile[]>({
    queryKey: ['allProfiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('id, first_name, last_name, role, updated_at, cantonese_access, mandarin_access');
      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Người dùng</CardTitle>
          <CardDescription>Quản lý quyền truy cập ngôn ngữ và bài học cho từng người dùng.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? <div>Đang tải...</div> : error ? <div className="text-verm">Lỗi tải danh sách người dùng.</div> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ và Tên</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Quyền ngôn ngữ</TableHead>
                  <TableHead>Ngày cập nhật</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles?.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.first_name || ''} {p.last_name || ''}</TableCell>
                    <TableCell><Badge variant={p.role === 'admin' ? 'default' : 'secondary'}>{p.role}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {p.cantonese_access && <Badge variant="outline" className="text-jade border-jade">粵</Badge>}
                        {p.mandarin_access && <Badge variant="outline" className="text-primary border-primary">中</Badge>}
                        {!p.cantonese_access && !p.mandarin_access && <span className="text-muted-foreground text-sm">Chưa cấp</span>}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(p.updated_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedUserForLanguage(p)}>
                          <Globe className="h-4 w-4 mr-2" /> Ngôn ngữ
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setSelectedUserForLessons(p)}>
                          <KeyRound className="h-4 w-4 mr-2" /> Bài học
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <ManageUserLessonsDialog user={selectedUserForLessons} onClose={() => setSelectedUserForLessons(null)} />
      <ManageUserLanguageAccessDialog user={selectedUserForLanguage} onClose={() => setSelectedUserForLanguage(null)} />
    </>
  );
};

export default Dashboard;
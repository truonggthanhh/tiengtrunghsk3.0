import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSession } from '@/components/SessionContextProvider';
import { BookOpen, Trash2, Edit3, PlusCircle, Eye, EyeOff } from 'lucide-react';
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
import { Switch } from "@/components/ui/switch";

interface Course {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  language: string;
  is_free: boolean;
  display_order: number;
  is_active: boolean;
  thumbnail_url: string | null;
  color: string | null;
}

const CourseManager = () => {
  const queryClient = useQueryClient();
  const { session } = useSession();

  // Form state for new course
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isFree, setIsFree] = useState(false);
  const [color, setColor] = useState('#3B82F6');

  // Edit state
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIsFree, setEditIsFree] = useState(false);
  const [editIsActive, setEditIsActive] = useState(true);
  const [editColor, setEditColor] = useState('#3B82F6');

  const { data: courses, isLoading, error } = useQuery<Course[]>({
    queryKey: ['courses-admin', 'mandarin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('language', 'mandarin')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!session,
  });

  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const addCourseMutation = useMutation({
    mutationFn: async () => {
      if (!name) {
        throw new Error('Vui lòng nhập tên khóa học');
      }

      const slug = createSlug(name);
      const displayOrder = (courses?.length || 0) + 1;

      const courseData = {
        name,
        slug,
        description: description || null,
        language: 'mandarin',
        is_free: isFree,
        display_order: displayOrder,
        is_active: true,
        color: color || '#3B82F6',
      };

      const { error } = await supabase.from('courses').insert([courseData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses-admin', 'mandarin'] });
      toast.success('Khóa học đã được tạo!');
      setName('');
      setDescription('');
      setIsFree(false);
      setColor('#3B82F6');
    },
    onError: (err: Error) => toast.error(`Lỗi: ${err.message}`),
  });

  const updateCourseMutation = useMutation({
    mutationFn: async () => {
      if (!editingCourse || !editName) {
        throw new Error('Vui lòng nhập tên khóa học');
      }

      const slug = createSlug(editName);

      const courseData = {
        name: editName,
        slug,
        description: editDescription || null,
        is_free: editIsFree,
        is_active: editIsActive,
        color: editColor || '#3B82F6',
      };

      const { error } = await supabase
        .from('courses')
        .update(courseData)
        .eq('id', editingCourse.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses-admin', 'mandarin'] });
      toast.success('Khóa học đã được cập nhật!');
      setEditingCourse(null);
    },
    onError: (err: Error) => toast.error(`Lỗi: ${err.message}`),
  });

  const deleteCourseMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const { error } = await supabase.from('courses').delete().eq('id', courseId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses-admin', 'mandarin'] });
      toast.success('Khóa học đã được xóa.');
    },
    onError: (err: Error) => toast.error(`Lỗi: ${err.message}`),
  });

  const handleEditClick = (course: Course) => {
    setEditingCourse(course);
    setEditName(course.name);
    setEditDescription(course.description || '');
    setEditIsFree(course.is_free);
    setEditIsActive(course.is_active);
    setEditColor(course.color || '#3B82F6');
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Courses List */}
      <div className="lg:col-span-2">
        <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-gray-200/50 dark:border-gray-800/50 shadow-xl">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 grid place-items-center shadow-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black text-gray-900 dark:text-white">Danh sách Khóa học</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Quản lý các khóa học</CardDescription>
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
              <div className="text-red-600 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">Lỗi tải khóa học.</div>
            ) : (
              <div className="space-y-3">
                {courses?.map((course) => (
                  <div key={course.id} className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-cyan-300 dark:hover:border-cyan-700 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: course.color || '#3B82F6' }}
                          />
                          <h3 className="font-bold text-gray-900 dark:text-white">{course.name}</h3>
                          {course.is_free && <Badge variant="secondary">Miễn phí</Badge>}
                          {!course.is_active && <Badge variant="outline">Ẩn</Badge>}
                        </div>
                        {course.description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{course.description}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(course)}>
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
                              <AlertDialogDescription>Xóa vĩnh viễn khóa học "{course.name}"</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteCourseMutation.mutate(course.id)}>Xóa</AlertDialogAction>
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

      {/* Add New Course Form */}
      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-gray-200/50 dark:border-gray-800/50 shadow-xl">
            <CardHeader className="border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-pink-500/10 via-cyan-500/10 to-purple-500/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-500 to-cyan-500 grid place-items-center shadow-lg">
                  <PlusCircle className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl font-black text-gray-900 dark:text-white">Khóa học mới</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên khóa học *</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Giáo trình Hán Ngữ" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Mô tả khóa học..." rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Màu sắc</Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    placeholder="#3B82F6"
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is-free">Khóa học miễn phí</Label>
                <Switch id="is-free" checked={isFree} onCheckedChange={setIsFree} />
              </div>
              <Button onClick={() => addCourseMutation.mutate()} disabled={addCourseMutation.isPending} className="w-full bg-gradient-to-r from-cyan-500 to-purple-500">
                <PlusCircle className="h-4 w-4 mr-2" />
                {addCourseMutation.isPending ? 'Đang tạo...' : 'Tạo khóa học'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingCourse} onOpenChange={(isOpen) => !isOpen && setEditingCourse(null)}>
        <DialogContent className="max-w-2xl bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Chỉnh sửa khóa học</DialogTitle>
            <DialogDescription>Cập nhật thông tin khóa học</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tên khóa học</Label>
              <Input id="edit-name" value={editName} onChange={e => setEditName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Mô tả</Label>
              <Textarea id="edit-description" value={editDescription} onChange={e => setEditDescription(e.target.value)} rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-color">Màu sắc</Label>
              <div className="flex gap-2">
                <Input
                  id="edit-color"
                  type="color"
                  value={editColor}
                  onChange={e => setEditColor(e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  value={editColor}
                  onChange={e => setEditColor(e.target.value)}
                  placeholder="#3B82F6"
                  className="flex-1"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-is-free">Khóa học miễn phí</Label>
              <Switch id="edit-is-free" checked={editIsFree} onCheckedChange={setEditIsFree} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="edit-is-active">Hiển thị khóa học</Label>
                {editIsActive ? <Eye className="h-4 w-4 text-green-600" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
              </div>
              <Switch id="edit-is-active" checked={editIsActive} onCheckedChange={setEditIsActive} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCourse(null)}>Hủy</Button>
            <Button onClick={() => updateCourseMutation.mutate()} disabled={updateCourseMutation.isPending} className="bg-gradient-to-r from-cyan-500 to-purple-500">
              {updateCourseMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseManager;

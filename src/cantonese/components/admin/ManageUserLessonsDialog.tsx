import React, { useState, useEffect } from 'react';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from 'lucide-react';

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
};

type Lesson = {
  id: string;
  title: string;
};

interface ManageUserLessonsDialogProps {
  user: Profile | null;
  onClose: () => void;
}

const ManageUserLessonsDialog = ({ user, onClose }: ManageUserLessonsDialogProps) => {
  const queryClient = useQueryClient();
  const [selectedLessonIds, setSelectedLessonIds] = useState<Set<string>>(new Set());

  // Query 1: Fetch ALL lessons (for admin to choose from)
  const { data: allLessons, isLoading: isLoadingAllLessons } = useQuery<Lesson[]>({
    queryKey: ['all_lessons_for_admin'],
    queryFn: async () => {
      const { data, error } = await supabase.from('lessons').select('id, title').order('position', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Query 2: Fetch lessons currently assigned to the selected user
  const { data: userAssignedLessons, isLoading: isLoadingUserLessons } = useQuery<{ lesson_id: string }[]>({
    queryKey: ['user_lesson_access', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase.from('user_lesson_access').select('lesson_id').eq('user_id', user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Effect to initialize the checkboxes based on fetched user data
  useEffect(() => {
    if (userAssignedLessons) {
      const initialIds = new Set(userAssignedLessons.map(l => l.lesson_id));
      setSelectedLessonIds(initialIds);
    }
  }, [userAssignedLessons]);

  const mutation = useMutation({
    mutationFn: async ({ userId, lessonIds }: { userId: string; lessonIds: string[] }) => {
      const { error } = await supabase.rpc('set_user_lesson_access', {
        user_id_in: userId,
        lesson_ids_in: lessonIds,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Đã cập nhật quyền truy cập bài học cho người dùng.');
      queryClient.invalidateQueries({ queryKey: ['user_lesson_access', user?.id] });
      onClose();
    },
    onError: (err: any) => {
      toast.error(`Lỗi: ${err.message}`);
    },
  });

  const handleSave = () => {
    if (user) {
      mutation.mutate({ userId: user.id, lessonIds: Array.from(selectedLessonIds) });
    }
  };

  const handleCheckboxChange = (lessonId: string, checked: boolean) => {
    setSelectedLessonIds(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(lessonId);
      } else {
        newSet.delete(lessonId);
      }
      return newSet;
    });
  };

  const isLoading = isLoadingAllLessons || isLoadingUserLessons;

  return (
    <Dialog open={!!user} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Quản lý bài học</DialogTitle>
          <DialogDescription>
            Chọn các bài học mà người dùng <strong>{user?.first_name} {user?.last_name}</strong> có thể truy cập.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <ScrollArea className="h-72 w-full rounded-md border p-4">
              <div className="space-y-2">
                {allLessons?.map(lesson => (
                  <div key={lesson.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`lesson-${lesson.id}`}
                      checked={selectedLessonIds.has(lesson.id)}
                      onCheckedChange={(checked) => handleCheckboxChange(lesson.id, !!checked)}
                    />
                    <label
                      htmlFor={`lesson-${lesson.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {lesson.title}
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={handleSave} disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManageUserLessonsDialog;
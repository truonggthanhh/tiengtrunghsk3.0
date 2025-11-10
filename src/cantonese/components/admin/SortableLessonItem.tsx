import React from 'react';
import { Link } from 'react-router-dom';
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
import { Button } from "@/components/ui/button";
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { GripVertical, Edit3, Replace, Clock, Sparkles, CheckCircle2, XCircle, Trash2 } from 'lucide-react';

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

interface SortableLessonItemProps {
  lesson: Lesson;
  job?: Job;
  hasReviewTests?: boolean;
  isSelected: boolean;
  onSelect: (lessonId: string, checked: boolean) => void;
  onEdit: () => void;
  onGenerate: () => void;
  onCancelJob: (jobId: string) => void;
  onDelete: () => void;
  onReplacePdf: () => void;
}

export default function SortableLessonItem({ lesson, job, hasReviewTests, isSelected, onSelect, onEdit, onGenerate, onCancelJob, onDelete, onReplacePdf }: SortableLessonItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: lesson.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const isProcessing = job?.status === 'pending' || job?.status === 'processing';

  return (
    <div ref={setNodeRef} style={style} className="p-3 border rounded-lg flex items-center justify-between flex-wrap gap-2 bg-white dark:bg-black/20">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing"><GripVertical className="h-5 w-5 text-ink/50" /></Button>
        <Checkbox id={`select-${lesson.id}`} onCheckedChange={(checked) => onSelect(lesson.id, !!checked)} checked={isSelected} />
        <div>
          <div className="font-semibold flex items-center gap-2">
            {lesson.title}
            {hasReviewTests && <Badge variant="secondary" className="bg-jade/20 text-jade">Đã có đề ôn tập</Badge>}
          </div>
          <div className="text-sm text-ink/70">{new Date(lesson.created_at).toLocaleString()}</div>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap items-center">
        <Button variant="outline" size="sm" asChild><Link to={`/lessons/${lesson.id}`}>Xem</Link></Button>
        <Button variant="outline" size="sm" onClick={onEdit}><Edit3 className="h-4 w-4" /></Button>
        <Button variant="outline" size="sm" onClick={onReplacePdf}><Replace className="h-4 w-4" /></Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" onClick={onGenerate} disabled={isProcessing}>
              {job?.status === 'pending' && <><Clock className="h-4 w-4 mr-2 animate-spin" /><span>Đang chờ</span></>}
              {job?.status === 'processing' && <><Sparkles className="h-4 w-4 mr-2 animate-spin" /><span>Đang tạo...</span></>}
              {job?.status === 'completed' && <><CheckCircle2 className="h-4 w-4 mr-2 text-jade" /><span>Tạo lại</span></>}
              {job?.status === 'failed' && <><XCircle className="h-4 w-4 mr-2 text-verm" /><span>Thất bại</span></>}
              {!job && <><Sparkles className="h-4 w-4 mr-2" /><span>Tạo bài tập</span></>}
            </Button>
          </TooltipTrigger>
          {job?.status === 'failed' && job.error_message && <TooltipContent><p className="max-w-xs">{job.error_message}</p></TooltipContent>}
        </Tooltip>
        {isProcessing && job && (
          <AlertDialog>
            <AlertDialogTrigger asChild><Button variant="destructive" size="sm"><XCircle className="h-4 w-4 mr-2" /> Hủy</Button></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader><AlertDialogTitle>Hủy tác vụ?</AlertDialogTitle><AlertDialogDescription>Bạn có chắc muốn hủy tác vụ tạo bài tập cho "{lesson.title}"? Hành động này không thể hoàn tác.</AlertDialogDescription></AlertDialogHeader>
              <AlertDialogFooter><AlertDialogCancel>Không</AlertDialogCancel><AlertDialogAction onClick={() => onCancelJob(job.id)}>Có, hủy tác vụ</AlertDialogAction></AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild><Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle><AlertDialogDescription>Hành động này sẽ xóa vĩnh viễn bài học "{lesson.title}" và tất cả dữ liệu liên quan.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel>Hủy</AlertDialogCancel><AlertDialogAction onClick={onDelete}>Xóa</AlertDialogAction></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Lock, Unlock, Search, BookOpen, GraduationCap, Music } from 'lucide-react';
import { formatCourseName, getCourseCategory, CourseType } from '@/hooks/useCourseAccess';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: string;
}

interface CourseAccessRecord {
  course_type: string;
  is_unlocked: boolean;
  unlocked_at: string | null;
  unlocked_by_admin_name: string | null;
  notes: string | null;
}

const ALL_COURSES: CourseType[] = [
  'hsk_1', 'hsk_2', 'hsk_3', 'hsk_4', 'hsk_5', 'hsk_6',
  'msutong_1', 'msutong_2', 'msutong_3', 'msutong_4',
  ...Array.from({ length: 20 }, (_, i) => `cantonese_lesson_${i + 1}` as CourseType),
];

export const CourseAccessManagement: React.FC = () => {
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [bulkNotes, setBulkNotes] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'mandarin_hsk' | 'mandarin_msutong' | 'cantonese'>('all');
  const queryClient = useQueryClient();

  // Fetch users via RPC (gets email from auth.users)
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_all_users_with_emails');

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      return (data || []) as Profile[];
    },
  });

  // Fetch course access for selected user
  const { data: courseAccess = [], isLoading: isLoadingAccess } = useQuery({
    queryKey: ['courseAccess', selectedUserId],
    queryFn: async () => {
      if (!selectedUserId) return [];

      const { data, error } = await supabase.rpc('get_user_course_access', {
        p_user_id: selectedUserId,
      });

      if (error) throw error;
      return data as CourseAccessRecord[];
    },
    enabled: !!selectedUserId,
  });

  // Get current admin ID
  const { data: currentAdmin } = useQuery({
    queryKey: ['currentAdmin'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.id;
    },
  });

  // Unlock course mutation
  const unlockMutation = useMutation({
    mutationFn: async ({ courseType, notes }: { courseType: string; notes?: string }) => {
      if (!selectedUserId || !currentAdmin) throw new Error('Missing user or admin ID');

      const { error } = await supabase.rpc('unlock_course_for_user', {
        p_user_id: selectedUserId,
        p_course_type: courseType,
        p_admin_id: currentAdmin,
        p_notes: notes || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseAccess', selectedUserId] });
      toast.success('Đã mở khóa khóa học');
    },
    onError: (error: any) => {
      toast.error('Lỗi mở khóa', { description: error.message });
    },
  });

  // Lock course mutation
  const lockMutation = useMutation({
    mutationFn: async (courseType: string) => {
      if (!selectedUserId || !currentAdmin) throw new Error('Missing user or admin ID');

      const { error } = await supabase.rpc('lock_course_for_user', {
        p_user_id: selectedUserId,
        p_course_type: courseType,
        p_admin_id: currentAdmin,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseAccess', selectedUserId] });
      toast.success('Đã khóa lại khóa học');
    },
    onError: (error: any) => {
      toast.error('Lỗi khóa', { description: error.message });
    },
  });

  // Bulk unlock mutation
  const bulkUnlockMutation = useMutation({
    mutationFn: async ({ courseTypes, notes }: { courseTypes: string[]; notes?: string }) => {
      if (!selectedUserId || !currentAdmin) throw new Error('Missing user or admin ID');

      const { error } = await supabase.rpc('bulk_unlock_courses', {
        p_user_id: selectedUserId,
        p_course_types: courseTypes,
        p_admin_id: currentAdmin,
        p_notes: notes || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseAccess', selectedUserId] });
      toast.success('Đã mở khóa nhiều khóa học');
      setBulkNotes('');
    },
    onError: (error: any) => {
      toast.error('Lỗi mở khóa hàng loạt', { description: error.message });
    },
  });

  // Filter users by email search
  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  // Find selected user
  const selectedUser = users.find(u => u.id === selectedUserId);

  // Group courses by category
  const getCoursesByCategory = () => {
    return ALL_COURSES.filter(course => {
      if (filterCategory === 'all') return true;
      return getCourseCategory(course) === filterCategory;
    });
  };

  const filteredCourses = getCoursesByCategory();

  // Check if course is unlocked
  const isCourseUnlocked = (courseType: string) => {
    return courseAccess.find(a => a.course_type === courseType)?.is_unlocked || false;
  };

  // Get course info
  const getCourseInfo = (courseType: string) => {
    return courseAccess.find(a => a.course_type === courseType);
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    if (category === 'mandarin_hsk') return <GraduationCap className="w-4 h-4" />;
    if (category === 'mandarin_msutong') return <BookOpen className="w-4 h-4" />;
    return <Music className="w-4 h-4" />;
  };

  // Bulk unlock by category
  const handleBulkUnlockCategory = (category: 'mandarin_hsk' | 'mandarin_msutong' | 'cantonese') => {
    const coursesToUnlock = ALL_COURSES.filter(c => getCourseCategory(c) === category);
    bulkUnlockMutation.mutate({ courseTypes: coursesToUnlock, notes: bulkNotes });
  };

  return (
    <div className="space-y-6">
      {/* User Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Quản lý Quyền Truy Cập Khóa Học</CardTitle>
          <CardDescription>Mở khóa hoặc khóa các khóa học cho người dùng</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search users */}
          <div className="space-y-2">
            <Label htmlFor="search-email">Tìm người dùng theo email</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="search-email"
                  placeholder="Nhập email..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* User list */}
          {isLoadingUsers ? (
            <div className="text-center py-4">Đang tải...</div>
          ) : (
            <div className="max-h-60 overflow-y-auto border rounded-lg">
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedUserId === user.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{user.email}</div>
                      {(user.first_name || user.last_name) && (
                        <div className="text-sm text-gray-500">
                          {user.first_name} {user.last_name}
                        </div>
                      )}
                    </div>
                    {user.role === 'admin' && (
                      <Badge variant="secondary">Admin</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Course Access Management */}
      {selectedUser && (
        <Card>
          <CardHeader>
            <CardTitle>Khóa học của: {selectedUser.email}</CardTitle>
            <CardDescription>
              {selectedUser.first_name} {selectedUser.last_name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bulk Actions */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold">Mở khóa hàng loạt</h3>
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkUnlockCategory('mandarin_hsk')}
                  disabled={bulkUnlockMutation.isPending}
                >
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Tất cả HSK 1-6
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkUnlockCategory('mandarin_msutong')}
                  disabled={bulkUnlockMutation.isPending}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Tất cả Msutong 1-4
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkUnlockCategory('cantonese')}
                  disabled={bulkUnlockMutation.isPending}
                >
                  <Music className="w-4 h-4 mr-2" />
                  Tất cả Cantonese (20 bài)
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bulk-notes">Ghi chú (optional)</Label>
                <Textarea
                  id="bulk-notes"
                  placeholder="VD: Học viên VIP, đã thanh toán gói 6 tháng..."
                  value={bulkNotes}
                  onChange={(e) => setBulkNotes(e.target.value)}
                  rows={2}
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-4">
              <Label>Lọc:</Label>
              <Select value={filterCategory} onValueChange={(v: any) => setFilterCategory(v)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="mandarin_hsk">HSK 1-6</SelectItem>
                  <SelectItem value="mandarin_msutong">Msutong 1-4</SelectItem>
                  <SelectItem value="cantonese">Cantonese (20 bài)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Course List */}
            {isLoadingAccess ? (
              <div className="text-center py-4">Đang tải...</div>
            ) : (
              <div className="grid gap-2">
                {filteredCourses.map(course => {
                  const isUnlocked = isCourseUnlocked(course);
                  const info = getCourseInfo(course);
                  const category = getCourseCategory(course);

                  return (
                    <div
                      key={course}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        isUnlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {getCategoryIcon(category)}
                        <div className="flex-1">
                          <div className="font-medium">{formatCourseName(course)}</div>
                          {info?.notes && (
                            <div className="text-sm text-gray-500 mt-1">{info.notes}</div>
                          )}
                          {info?.unlocked_at && (
                            <div className="text-xs text-gray-400 mt-1">
                              Mở bởi {info.unlocked_by_admin_name} lúc{' '}
                              {new Date(info.unlocked_at).toLocaleString('vi-VN')}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isUnlocked ? (
                          <>
                            <Badge variant="default" className="bg-green-600">
                              <Unlock className="w-3 h-3 mr-1" />
                              Đã mở
                            </Badge>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => lockMutation.mutate(course)}
                              disabled={lockMutation.isPending}
                            >
                              <Lock className="w-4 h-4 mr-1" />
                              Khóa lại
                            </Button>
                          </>
                        ) : (
                          <>
                            <Badge variant="secondary">
                              <Lock className="w-3 h-3 mr-1" />
                              Bị khóa
                            </Badge>
                            <Button
                              size="sm"
                              onClick={() => unlockMutation.mutate({ courseType: course })}
                              disabled={unlockMutation.isPending}
                            >
                              <Unlock className="w-4 h-4 mr-1" />
                              Mở khóa
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

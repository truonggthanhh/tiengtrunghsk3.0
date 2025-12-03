import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useSession } from '@/components/SessionContextProvider';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Home, Loader2, UserCog, Key, Sparkles, Upload, FileText, Lock, Music, PlusCircle, Trash2, Edit3, Newspaper, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { CourseAccessManagement } from '@/components/admin/CourseAccessManagement';
import BlogManager from '@/mandarin/components/admin/BlogManager';
import CourseManager from '@/mandarin/components/admin/CourseManager';

const extractVideoId = (url: string) => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

interface AuthUser {
  email: string;
}

interface UserProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  auth_users: AuthUser | null;
}

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  email: string;
}

const AdminDashboardPage: React.FC = () => {
  const { session, isLoading: isSessionLoading } = useSession();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API Key Management
  const [apiKey, setApiKey] = useState('');
  const [savedApiKey, setSavedApiKey] = useState('');

  // AI Content Generation
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Vocabulary Upload
  const [vocabularyJson, setVocabularyJson] = useState('');

  // Document Upload
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  // Track if we've already fetched data to prevent re-fetching on tab switch
  const hasFetchedRef = React.useRef(false);

  // Memoize returnUrl để tránh tính toán lại khi component re-render do tab switch
  const returnUrl = useMemo(() => {
    return encodeURIComponent(window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    if (!isSessionLoading) {
      if (!session) {
        navigate(`/mandarin/login?returnUrl=${returnUrl}`);
        return;
      }
      // Only fetch once when component mounts
      if (!hasFetchedRef.current) {
        hasFetchedRef.current = true;
        fetchUserProfile(session.user.id);
      }
    }
  }, [session?.user?.id, isSessionLoading, navigate, returnUrl]);

  // Load saved API key
  useEffect(() => {
    const stored = localStorage.getItem('gemini_api_key');
    if (stored) {
      setSavedApiKey(stored);
      setApiKey(stored);
    }
  }, []);

  const fetchUserProfile = async (userId: string) => {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profileError || profileData?.role !== 'admin') {
      setError('Bạn không có quyền truy cập trang này.');
      setIsLoadingUsers(false);
      toast.error('Truy cập bị từ chối', { description: 'Bạn không có quyền quản trị.' });
      navigate('/mandarin'); // Redirect non-admin users
      return;
    }
    fetchUsers();
  };

  const fetchUsers = async () => {
    // Only show loading spinner if we don't have data yet
    if (users.length === 0) {
      setIsLoadingUsers(true);
    }
    setError(null);

    // Fetch profiles
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, role');

    if (profilesError) {
      setError('Không thể tải danh sách người dùng: ' + profilesError.message);
      toast.error('Lỗi tải người dùng', { description: profilesError.message });
      setIsLoadingUsers(false);
      return;
    }

    // Fetch emails from auth_users view
    const { data: emailsData, error: emailsError } = await supabase
      .from('auth_users')
      .select('id, email');

    // Create a map of user IDs to emails for quick lookup
    const emailMap = new Map<string, string>();
    if (!emailsError && emailsData) {
      emailsData.forEach(user => {
        emailMap.set(user.id, user.email || 'N/A');
      });
    }

    // Combine profiles with emails
    const formattedUsers: UserProfile[] = profilesData.map(profile => ({
      id: profile.id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      role: profile.role,
      email: emailMap.get(profile.id) || 'N/A',
    }));

    setUsers(formattedUsers);
    setIsLoadingUsers(false);
  };

  const handleAdminToggle = async (userId: string, currentRole: string) => {
    if (session?.user.id === userId) {
      toast.error('Không thể thay đổi quyền của chính mình', { description: 'Bạn không thể tự gỡ bỏ quyền quản trị của mình.' });
      return;
    }

    const newRole = currentRole === 'admin' ? 'user' : 'admin';

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (updateError) {
      toast.error('Cập nhật thất bại', { description: updateError.message });
    } else {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      toast.success('Cập nhật thành công', { description: `Quyền quản trị của người dùng đã được thay đổi thành ${newRole === 'admin' ? 'admin' : 'người dùng thường'}.` });
    }
  };

  // API Key Management
  // ⚠️ SECURITY WARNING: Storing API keys in localStorage is NOT secure for production
  // localStorage is vulnerable to XSS attacks. For production, API keys should be:
  // 1. Stored server-side in environment variables or secure vault
  // 2. API calls should go through a backend proxy that manages keys securely
  // 3. Never expose keys to client-side JavaScript
  // This implementation is for development/testing only
  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error('Lỗi', { description: 'Vui lòng nhập API key' });
      return;
    }
    // TODO: Move to secure server-side storage
    localStorage.setItem('gemini_api_key', apiKey);
    setSavedApiKey(apiKey);
    toast.success('Đã lưu', { description: 'API key đã được lưu thành công' });
    toast.warning('Cảnh báo bảo mật', {
      description: 'API key lưu trong trình duyệt không an toàn cho production. Chỉ dùng cho testing.',
      duration: 5000
    });
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setSavedApiKey('');
    toast.success('Đã xóa', { description: 'API key đã được xóa' });
  };

  // AI Content Generation
  const handleGenerateContent = async () => {
    if (!savedApiKey) {
      toast.error('Lỗi', { description: 'Vui lòng lưu API key trước' });
      return;
    }
    if (!generationPrompt.trim()) {
      toast.error('Lỗi', { description: 'Vui lòng nhập prompt' });
      return;
    }

    setIsGenerating(true);
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(savedApiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const result = await model.generateContent(generationPrompt);
      const response = await result.response;
      const text = response.text();

      setGeneratedContent(text);
      toast.success('Thành công', { description: 'Nội dung đã được tạo' });
    } catch (error: any) {
      toast.error('Lỗi', { description: error.message || 'Không thể tạo nội dung' });
    } finally {
      setIsGenerating(false);
    }
  };

  // Vocabulary Upload
  const handleUploadVocabulary = async () => {
    if (!vocabularyJson.trim()) {
      toast.error('Lỗi', { description: 'Vui lòng nhập dữ liệu JSON' });
      return;
    }

    try {
      const data = JSON.parse(vocabularyJson);
      // Here you would typically save to Supabase or a file
      // For now, we'll just show success
      console.log('Vocabulary data:', data);
      toast.success('Thành công', { description: 'Từ vựng đã được upload (xem console)' });
      setVocabularyJson('');
    } catch (error: any) {
      toast.error('Lỗi', { description: 'JSON không hợp lệ: ' + error.message });
    }
  };

  // Document Upload
  const handleUploadDocument = async () => {
    if (!documentFile) {
      toast.error('Lỗi', { description: 'Vui lòng chọn file' });
      return;
    }

    try {
      // Here you would typically upload to Supabase Storage
      // For now, we'll just show the file info
      console.log('Document to upload:', documentFile.name, documentFile.size);
      toast.success('Thành công', { description: `File ${documentFile.name} đã được upload (xem console)` });
      setDocumentFile(null);
    } catch (error: any) {
      toast.error('Lỗi', { description: error.message });
    }
  };

  if (isSessionLoading || isLoadingUsers) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-3 text-lg">Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center justify-center text-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <UserCog className="w-12 h-12 text-destructive mx-auto mb-4" />
              <CardTitle className="text-2xl">Lỗi Truy Cập</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="secondary" className="font-bold">
                <Link to="/mandarin">
                  <Home className="mr-2 h-4 w-4" /> Quay lại trang chủ
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        <Card className="w-full max-w-6xl mx-auto shadow-2xl">
          <CardHeader className="bg-gradient-vivid text-white dark:text-white rounded-t-xl">
            <CardTitle className="text-3xl font-bold flex items-center gap-3">
              <div className="bg-white/20 dark:bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <UserCog className="h-7 w-7" />
              </div>
              Bảng Điều Khiển Quản Trị
            </CardTitle>
            <CardDescription className="text-white/90 dark:text-white/90 text-base">
              Quản lý toàn bộ hệ thống học tiếng Trung.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="songs" className="w-full">
              <TabsList className="grid w-full grid-cols-9 mb-6">
                <TabsTrigger value="songs" className="flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  <span className="hidden sm:inline">Bài hát</span>
                </TabsTrigger>
                <TabsTrigger value="blog" className="flex items-center gap-2">
                  <Newspaper className="h-4 w-4" />
                  <span className="hidden sm:inline">Blog</span>
                </TabsTrigger>
                <TabsTrigger value="courses" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Quản lý khóa học</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <UserCog className="h-4 w-4" />
                  <span className="hidden sm:inline">Người dùng</span>
                </TabsTrigger>
                <TabsTrigger value="courseaccess" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span className="hidden sm:inline">Quyền khóa học</span>
                </TabsTrigger>
                <TabsTrigger value="apikey" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  <span className="hidden sm:inline">API Key</span>
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden sm:inline">AI Generator</span>
                </TabsTrigger>
                <TabsTrigger value="vocabulary" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <span className="hidden sm:inline">Từ vựng</span>
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Tài liệu</span>
                </TabsTrigger>
              </TabsList>

              {/* Songs Management Tab */}
              <TabsContent value="songs" className="space-y-4">
                <SongManager />
              </TabsContent>

              {/* Blog Management Tab */}
              <TabsContent value="blog" className="space-y-4">
                <BlogManager />
              </TabsContent>

              {/* Courses Management Tab */}
              <TabsContent value="courses" className="space-y-4">
                <CourseManager />
              </TabsContent>

              {/* Users Management Tab */}
              <TabsContent value="users" className="space-y-4">
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead className="text-center">Quản trị viên</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map(user => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.first_name} {user.last_name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{user.id.substring(0, 8)}...</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center">
                              <Switch
                                id={`admin-toggle-${user.id}`}
                                checked={user.role === 'admin'}
                                onCheckedChange={() => handleAdminToggle(user.id, user.role)}
                                disabled={session?.user.id === user.id}
                              />
                              <Label htmlFor={`admin-toggle-${user.id}`} className="sr-only">Toggle admin status for {user.first_name}</Label>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Course Access Management Tab */}
              <TabsContent value="courseaccess" className="space-y-4">
                <CourseAccessManagement />
              </TabsContent>

              {/* API Key Management Tab */}
              <TabsContent value="apikey" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      Quản lý API Key Gemini
                    </CardTitle>
                    <CardDescription>
                      Lưu API key để sử dụng Gemini AI cho việc tạo bài tập và nội dung
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="apikey">Gemini API Key</Label>
                      <Input
                        id="apikey"
                        type="password"
                        placeholder="Nhập API key của bạn..."
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                      {savedApiKey && (
                        <p className="text-sm text-green-600">✓ API key đã được lưu</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveApiKey}>Lưu API Key</Button>
                      <Button onClick={handleClearApiKey} variant="outline">Xóa API Key</Button>
                    </div>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Hướng dẫn:</strong> Truy cập{' '}
                        <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">
                          Google AI Studio
                        </a>{' '}
                        để lấy API key miễn phí.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* AI Content Generation Tab */}
              <TabsContent value="ai" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Tạo nội dung với AI
                    </CardTitle>
                    <CardDescription>
                      Sử dụng Gemini AI để tạo bài tập, từ vựng, và nội dung học tập
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="prompt">Prompt (Mô tả nội dung cần tạo)</Label>
                      <Textarea
                        id="prompt"
                        placeholder="Ví dụ: Tạo 10 câu hội thoại tiếng Trung HSK 3 về chủ đề đi chợ, kèm pinyin và dịch tiếng Việt..."
                        value={generationPrompt}
                        onChange={(e) => setGenerationPrompt(e.target.value)}
                        rows={5}
                      />
                    </div>
                    <Button onClick={handleGenerateContent} disabled={isGenerating || !savedApiKey}>
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang tạo...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Tạo nội dung
                        </>
                      )}
                    </Button>
                    {!savedApiKey && (
                      <p className="text-sm text-red-600">⚠ Vui lòng lưu API key trước</p>
                    )}
                    {generatedContent && (
                      <div className="space-y-2">
                        <Label>Kết quả</Label>
                        <Textarea
                          value={generatedContent}
                          onChange={(e) => setGeneratedContent(e.target.value)}
                          rows={15}
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedContent);
                            toast.success('Đã sao chép', { description: 'Nội dung đã được copy vào clipboard' });
                          }}
                        >
                          Sao chép
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Vocabulary Upload Tab */}
              <TabsContent value="vocabulary" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Upload từ vựng / Hội thoại
                    </CardTitle>
                    <CardDescription>
                      Thêm từ vựng hoặc hội thoại mới vào các cấp độ HSK
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="vocabulary-json">Dữ liệu JSON</Label>
                      <Textarea
                        id="vocabulary-json"
                        placeholder='{"level": "HSK3", "words": [{"hanzi": "你好", "pinyin": "nǐ hǎo", "meaning": "xin chào"}]}'
                        value={vocabularyJson}
                        onChange={(e) => setVocabularyJson(e.target.value)}
                        rows={10}
                        className="font-mono text-sm"
                      />
                    </div>
                    <Button onClick={handleUploadVocabulary}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload từ vựng
                    </Button>
                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Format JSON:</strong> Nhập dữ liệu theo định dạng VocabularyWord interface.
                        Xem file src/data/hsk1.ts để tham khảo cấu trúc.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Documents Upload Tab */}
              <TabsContent value="documents" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Upload tài liệu
                    </CardTitle>
                    <CardDescription>
                      Upload PDF, Word, hoặc file khác làm tài liệu học tập
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="document">Chọn file</Label>
                      <Input
                        id="document"
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                      />
                      {documentFile && (
                        <p className="text-sm text-green-600">✓ Đã chọn: {documentFile.name}</p>
                      )}
                    </div>
                    <Button onClick={handleUploadDocument} disabled={!documentFile}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload tài liệu
                    </Button>
                    <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-800">
                        <strong>Hỗ trợ:</strong> PDF, Word (.doc, .docx), Text (.txt). Tối đa 10MB.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <div className="text-center mt-8">
          <Button asChild className="font-bold bg-gradient-spring text-white hover:bg-gradient-spring/90 border-0 shadow-cyan">
            <Link to="/mandarin">
              <Home className="mr-2 h-4 w-4" /> Quay lại trang chủ
            </Link>
          </Button>
        </div>
      </main>
    </div>
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] });
      toast.success('Bài hát đã được thêm!');
      setTitle('');
      setArtist('');
      setYoutubeUrl('');
      setLrc('');
    },
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] });
      toast.success('Bài hát đã được xóa.');
    },
    onError: (err: Error) => toast.error(`Lỗi: ${err.message}`),
  });

  const handleSubmit = () => {
    const videoId = extractVideoId(youtubeUrl);
    if (!title || !artist || !videoId || !lrc) {
      toast.error('Vui lòng điền đủ thông tin và link YouTube hợp lệ.');
      return;
    }
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
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Danh sách Bài hát</CardTitle>
            <CardDescription>Quản lý các bài hát Mandopop</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div>Đang tải...</div>
            ) : error ? (
              <div className="text-red-600">Lỗi tải bài hát.</div>
            ) : (
              <div className="space-y-3">
                {songs?.map((s: any) => (
                  <div key={s.id} className="p-3 border rounded-lg flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="font-semibold">{s.title}</span> - {s.artist}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/mandarin/songs/${s.id}`}>Nghe</Link>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(s)}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Xóa vĩnh viễn bài hát "{s.title}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteSongMutation.mutate(s.id)}>
                              Xóa
                            </AlertDialogAction>
                          </AlertDialogFooter>
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
          <CardHeader>
            <CardTitle>Thêm Bài hát mới</CardTitle>
            <CardDescription>Nhập thông tin bài hát và lời bài hát với timestamp</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="song-title">Tiêu đề bài hát</Label>
              <Input
                id="song-title"
                placeholder="Ví dụ: 七里香"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="song-artist">Nghệ sĩ</Label>
              <Input
                id="song-artist"
                placeholder="Ví dụ: Jay Chou 周杰倫"
                value={artist}
                onChange={e => setArtist(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="song-youtube">Link YouTube</Label>
              <Input
                id="song-youtube"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={e => setYoutubeUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="song-lrc">Lời bài hát (Format LRC)</Label>
              <Textarea
                id="song-lrc"
                placeholder="[00:00.00]Dán nội dung file .LRC vào đây&#10;[00:05.00]Mỗi dòng có timestamp [MM:SS.MS]"
                value={lrc}
                onChange={e => setLrc(e.target.value)}
                rows={12}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                Format: [MM:SS.MS]Lời bài hát. Ví dụ: [00:15.50]你好
              </p>
            </div>
            <Button onClick={handleSubmit} disabled={addSongMutation.isPending} className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" />
              {addSongMutation.isPending ? 'Đang thêm...' : 'Thêm Bài hát'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingSong} onOpenChange={(isOpen) => !isOpen && setEditingSong(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa bài hát</DialogTitle>
            <DialogDescription>Cập nhật thông tin bài hát và lời bài hát</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Tiêu đề bài hát</Label>
              <Input
                id="edit-title"
                placeholder="Ví dụ: 七里香"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-artist">Nghệ sĩ</Label>
              <Input
                id="edit-artist"
                placeholder="Ví dụ: Jay Chou 周杰倫"
                value={editArtist}
                onChange={e => setEditArtist(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-youtube">Link YouTube</Label>
              <Input
                id="edit-youtube"
                placeholder="https://www.youtube.com/watch?v=..."
                value={editYoutubeUrl}
                onChange={e => setEditYoutubeUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-lrc">Lời bài hát (Format LRC)</Label>
              <Textarea
                id="edit-lrc"
                placeholder="[00:00.00]Dán nội dung file .LRC vào đây"
                value={editLrc}
                onChange={e => setEditLrc(e.target.value)}
                rows={12}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                Format: [MM:SS.MS]Lời bài hát. Ví dụ: [00:15.50]你好
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSong(null)}>
              Hủy
            </Button>
            <Button onClick={handleUpdateSong} disabled={updateSongMutation.isPending}>
              {updateSongMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboardPage;
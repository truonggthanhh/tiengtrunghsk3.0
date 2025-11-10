import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useSession } from '@/components/SessionContextProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Home, Loader2, UserCog, Key, Sparkles, Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  is_admin: boolean;
  email: string; // Assuming email can be fetched or is part of the profile
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

  useEffect(() => {
    if (!isSessionLoading) {
      if (!session) {
        navigate('/mandarin/login');
        return;
      }
      fetchUserProfile(session.user.id);
    }
  }, [session, isSessionLoading, navigate]);

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
      .select('is_admin')
      .eq('id', userId)
      .single();

    if (profileError || !profileData?.is_admin) {
      setError('Bạn không có quyền truy cập trang này.');
      setIsLoadingUsers(false);
      toast.error('Truy cập bị từ chối', { description: 'Bạn không có quyền quản trị.' });
      navigate('/mandarin'); // Redirect non-admin users
      return;
    }
    fetchUsers();
  };

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    setError(null);
    const { data: usersData, error: usersError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, is_admin, auth_users(email)'); // Fetch email from auth.users

    if (usersError) {
      setError('Không thể tải danh sách người dùng: ' + usersError.message);
      toast.error('Lỗi tải người dùng', { description: usersError.message });
    } else {
      const formattedUsers: UserProfile[] = usersData.map(profile => ({
        id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        is_admin: profile.is_admin,
        email: (profile.auth_users as any)?.email || 'N/A', // Access email from nested object
      }));
      setUsers(formattedUsers);
    }
    setIsLoadingUsers(false);
  };

  const handleAdminToggle = async (userId: string, currentStatus: boolean) => {
    if (session?.user.id === userId) {
      toast.error('Không thể thay đổi quyền của chính mình', { description: 'Bạn không thể tự gỡ bỏ quyền quản trị của mình.' });
      return;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ is_admin: !currentStatus })
      .eq('id', userId);

    if (updateError) {
      toast.error('Cập nhật thất bại', { description: updateError.message });
    } else {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, is_admin: !currentStatus } : user
        )
      );
      toast.success('Cập nhật thành công', { description: `Quyền quản trị của người dùng đã được thay đổi thành ${!currentStatus ? 'admin' : 'người dùng thường'}.` });
    }
  };

  // API Key Management
  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error('Lỗi', { description: 'Vui lòng nhập API key' });
      return;
    }
    localStorage.setItem('gemini_api_key', apiKey);
    setSavedApiKey(apiKey);
    toast.success('Đã lưu', { description: 'API key đã được lưu thành công' });
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
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <UserCog className="h-4 w-4" />
                  <span className="hidden sm:inline">Người dùng</span>
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
                                checked={user.is_admin}
                                onCheckedChange={() => handleAdminToggle(user.id, user.is_admin)}
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

export default AdminDashboardPage;
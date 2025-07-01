import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Home, KeyRound, AlertTriangle, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { cn } from '@/lib/utils';

interface DiagnosticResult {
  status: 'idle' | 'success' | 'error';
  message: string;
}

const AiTutorDiagnosticPage = () => {
  const { level } = useParams<{ level: string }>();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [tempApiKey, setTempApiKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult>({ status: 'idle', message: '' });
  const [initialError, setInitialError] = useState<string | null>(null);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('geminiApiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      setApiKey(tempApiKey.trim());
      localStorage.setItem('geminiApiKey', tempApiKey.trim());
      setInitialError(null);
      setDiagnosticResult({ status: 'idle', message: '' }); // Reset result when new key is entered
    }
  };

  const handleResetApiKey = () => {
    setApiKey(null);
    setTempApiKey('');
    localStorage.removeItem('geminiApiKey');
    setDiagnosticResult({ status: 'idle', message: '' });
  };

  const handleRunTest = useCallback(async () => {
    if (!apiKey) return;

    setIsTesting(true);
    setDiagnosticResult({ status: 'idle', message: '' });

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Perform a lightweight request to validate the key and configuration
      await model.countTokens("test");

      setDiagnosticResult({
        status: 'success',
        message: 'Kết nối thành công! API Key và dự án Google Cloud của bạn đã được cấu hình chính xác. Bây giờ bạn có thể yêu cầu tôi khôi phục lại chức năng chat.'
      });

    } catch (e: any) {
      console.error("Diagnostic Error:", e);
      let errorMessage = `Kết nối thất bại. Lỗi gốc từ Google: ${e.message || e.toString()}`;
      
      if (e.message) {
        if (e.message.includes('API key not valid')) {
          errorMessage += '\n\nGợi ý: Vui lòng kiểm tra lại xem bạn đã sao chép đúng API Key chưa. Key thường bắt đầu bằng "AIza".';
        } else if (e.message.includes('quota')) {
          errorMessage += '\n\nGợi ý: Bạn đã hết hạn ngạch sử dụng API miễn phí. Vui lòng kiểm tra trang tổng quan thanh toán trong dự án Google Cloud của bạn.';
        } else if (e.message.includes('400')) {
          errorMessage += '\n\nGợi ý: Lỗi này thường xảy ra khi API "Generative Language API" chưa được bật trong dự án Google Cloud của bạn. Hãy chắc chắn rằng bạn đã kích hoạt nó.';
        } else if (e.message.includes('permission denied')) {
            errorMessage += '\n\nGợi ý: API Key của bạn không có quyền truy cập vào mô hình Gemini. Hãy kiểm tra lại các quyền trong dự án Google Cloud.';
        }
      }

      setDiagnosticResult({ status: 'error', message: errorMessage });
    } finally {
      setIsTesting(false);
    }
  }, [apiKey]);

  // UI for entering API Key
  if (!apiKey) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center justify-center text-center">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <KeyRound className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-2xl">Nhập API Key của Google Gemini</CardTitle>
              <CardDescription>
                Để sử dụng Trợ lý ảo, bạn cần cung cấp API Key của riêng mình.
              </CardDescription>
              {initialError && (
                <p className="text-sm text-destructive pt-2 font-semibold">{initialError}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="password"
                placeholder="Dán API Key của bạn vào đây"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
              />
              <Button onClick={handleSaveApiKey} className="w-full">Lưu và Tiếp tục</Button>
              <div className="text-xs text-muted-foreground p-2 border rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  API Key của bạn chỉ được lưu trữ trên trình duyệt này.
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary underline ml-1">
                    Lấy API Key tại đây.
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // UI for Diagnostic Tool
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center justify-center text-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Công cụ chẩn đoán kết nối AI</CardTitle>
            <CardDescription>
              Công cụ này sẽ giúp kiểm tra xem API Key của bạn có hợp lệ và dự án Google Cloud đã được cấu hình đúng hay chưa.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button onClick={handleRunTest} disabled={isTesting} size="lg" className="w-full">
              {isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isTesting ? 'Đang kiểm tra...' : 'Bắt đầu kiểm tra kết nối'}
            </Button>

            {diagnosticResult.status !== 'idle' && (
              <div className={cn(
                "p-4 rounded-lg text-left whitespace-pre-wrap",
                diagnosticResult.status === 'success' && 'bg-green-100 text-green-900 dark:bg-green-900/50 dark:text-green-200',
                diagnosticResult.status === 'error' && 'bg-red-100 text-red-900 dark:bg-red-900/50 dark:text-red-200'
              )}>
                <div className="flex items-start gap-3">
                  {diagnosticResult.status === 'success' && <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />}
                  {diagnosticResult.status === 'error' && <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />}
                  <p className="font-medium text-sm">{diagnosticResult.message}</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col sm:flex-row gap-2">
            <Button onClick={handleResetApiKey} variant="outline" className="w-full sm:w-auto">Nhập lại API Key</Button>
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" /> Về trang chủ
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default AiTutorDiagnosticPage;
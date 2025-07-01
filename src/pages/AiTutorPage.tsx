import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Home, Bot, User, Send, KeyRound, AlertTriangle } from 'lucide-react';
import { GoogleGenerativeAI, GenerativeModel, ChatSession } from '@google/generative-ai';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AiTutorPage = () => {
  const { level } = useParams<{ level: string }>();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [tempApiKey, setTempApiKey] = useState('');
  const [model, setModel] = useState<GenerativeModel | null>(null);
  const [chat, setChat] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('geminiApiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const resetAiState = useCallback(() => {
    setApiKey(null);
    setModel(null);
    setChat(null);
    localStorage.removeItem('geminiApiKey');
  }, []);

  useEffect(() => {
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const modelInstance = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        setModel(modelInstance);
        setError(null);
      } catch (e) {
        console.error("AI Initialization Error:", e);
        setError('API Key không hợp lệ hoặc đã xảy ra lỗi khi khởi tạo. Vui lòng kiểm tra lại.');
        resetAiState();
      }
    } else {
      setModel(null);
    }
  }, [apiKey, resetAiState]);

  useEffect(() => {
    if (model) {
      const chatSession = model.startChat({
        systemInstruction: `You are a friendly and patient Chinese language tutor for HSK level ${level}. Your name is HaoHao. Always respond in Vietnamese. Keep your answers concise and focused on helping the user practice their speaking and grammar. If the user makes a mistake in Chinese, gently correct them, explain why it's a mistake, and provide the correct version.`,
      });
      setChat(chatSession);
      setMessages([
        { role: 'model', text: `你好！我是你的 HSK ${level} 辅导老师“好好”。有什么可以帮你的吗？(Xin chào! Tôi là "HaoHao", gia sư HSK ${level} của bạn. Tôi có thể giúp gì cho bạn?)` }
      ]);
    } else {
      setChat(null);
    }
  }, [model, level]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      setApiKey(tempApiKey.trim());
      localStorage.setItem('geminiApiKey', tempApiKey.trim());
      setError(null);
    }
  };

  const handleSendMessage = useCallback(async () => {
    if (!userInput.trim() || isLoading || !chat) return;

    const currentInput = userInput;
    const newUserMessage: Message = { role: 'user', text: currentInput };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);
    setError(null);

    try {
      const result = await chat.sendMessage(currentInput);
      const response = result.response;
      const text = response.text();
      
      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (e: any) {
      console.error("Send Message Error:", e);
      
      let detailedError = 'Đã xảy ra lỗi khi giao tiếp với AI. Vui lòng kiểm tra lại API Key và thử lại.';
      if (e.message) {
          if (e.message.includes('API key not valid')) {
              detailedError = 'API Key của bạn không hợp lệ. Vui lòng kiểm tra lại hoặc tạo một key mới.';
          } else if (e.message.includes('quota')) {
              detailedError = 'Bạn đã hết hạn ngạch sử dụng API. Vui lòng kiểm tra tài khoản Google AI của bạn.';
          } else if (e.message.includes('400')) {
              detailedError = 'Yêu cầu không hợp lệ. Có thể do API key chưa được kích hoạt hoặc có vấn đề với tài khoản của bạn.';
          } else {
              detailedError = `Lỗi từ AI: ${e.message}`;
          }
      }
      
      setError(detailedError);
      resetAiState();
      setMessages(prev => prev.slice(0, -1)); // Remove user message that failed
    } finally {
      setIsLoading(false);
    }
  }, [userInput, isLoading, chat, resetAiState]);

  if (!chat) {
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
              {error && (
                <p className="text-sm text-destructive pt-2 font-semibold">{error}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="password"
                placeholder="Dán API Key của bạn vào đây"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
              />
              <Button onClick={handleSaveApiKey} className="w-full">Lưu và Bắt đầu</Button>
              <div className="text-xs text-muted-foreground p-2 border rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  API Key của bạn chỉ được lưu trữ trên trình duyệt này và không được gửi đến máy chủ của chúng tôi. 
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

  return (
    <div className="min-h-screen bg-background flex flex-col h-screen">
      <Header />
      <main className="container mx-auto p-4 flex-grow flex flex-col h-[calc(100vh-80px)]">
        <Card className="w-full h-full flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Bot />
              Trợ lý ảo HaoHao - HSK {level}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow p-0">
            <ScrollArea className="h-[calc(100vh-250px)] p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={cn("flex items-start gap-3", message.role === 'user' ? 'justify-end' : 'justify-start')}>
                    {message.role === 'model' && (
                      <Avatar>
                        <AvatarFallback><Bot /></AvatarFallback>
                      </Avatar>
                    )}
                    <div className={cn("max-w-[75%] rounded-lg px-4 py-2", message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    </div>
                    {message.role === 'user' && (
                      <Avatar>
                        <AvatarFallback><User /></AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3 justify-start">
                    <Avatar>
                      <AvatarFallback><Bot /></AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <p className="text-sm animate-pulse">HaoHao đang nhập...</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="border-t p-4">
            <div className="flex w-full items-center space-x-2">
              <Input
                placeholder="Nhập tin nhắn bằng tiếng Trung hoặc tiếng Việt..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                disabled={isLoading}
              />
              <Button onClick={handleSendMessage} disabled={isLoading || !userInput.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default AiTutorPage;
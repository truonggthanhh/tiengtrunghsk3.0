import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Home, KeyRound, AlertTriangle, Send, Loader2, RefreshCw } from 'lucide-react';
import { GoogleGenerativeAI, ChatSession } from '@google/generative-ai';
import ChatMessage, { Message } from '@/components/ChatMessage';
import { ScrollArea } from '@/components/ui/scroll-area';

const AiTutorPage = () => {
  const { level } = useParams<{ level: string }>();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [tempApiKey, setTempApiKey] = useState('');
  
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('geminiApiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  useEffect(() => {
    if (apiKey) {
      initializeChat();
    }
  }, [apiKey, level]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const initializeChat = () => {
    try {
      const genAI = new GoogleGenerativeAI(apiKey!);
      const systemPrompt = `Bạn là một gia sư tiếng Trung tên là "HaoHao AI". Nhiệm vụ của bạn là giúp người dùng luyện tập cho kỳ thi HSK cấp độ ${level}. Hãy luôn thân thiện, kiên nhẫn và đưa ra những câu trả lời ngắn gọn, dễ hiểu. Bắt đầu cuộc trò chuyện bằng cách chào người dùng và hỏi họ muốn luyện tập kỹ năng gì hôm nay (ví dụ: từ vựng, ngữ pháp, hội thoại). Chỉ trả lời bằng tiếng Việt.`;
      
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: systemPrompt,
      });

      const session = model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 1000,
        },
      });
      setChatSession(session);
      setMessages([]); // Clear previous messages
      // Start the conversation with a message from the AI
      setIsLoading(true);
      session.sendMessage("Bắt đầu").then(result => {
        setMessages(prev => [...prev, { role: 'model', parts: [{ text: result.response.text() }] }]);
      }).catch(handleApiError).finally(() => setIsLoading(false));

    } catch (e: any) {
      handleApiError(e);
    }
  };

  const handleApiError = (e: any) => {
    console.error("API Error:", e);
    let errorMessage = `Đã xảy ra lỗi khi kết nối với AI. Lỗi gốc: ${e.message || e.toString()}`;
    if (e.message) {
      if (e.message.includes('API key not valid')) {
        errorMessage += '\n\nGợi ý: API Key của bạn không hợp lệ. Vui lòng nhập lại.';
      } else if (e.message.includes('quota')) {
        errorMessage += '\n\nGợi ý: Bạn đã hết hạn ngạch sử dụng API. Vui lòng kiểm tra dự án Google Cloud.';
      } else if (e.message.includes('400')) {
        errorMessage += '\n\nGợi ý: API "Generative Language API" có thể chưa được bật trong dự án Google Cloud của bạn.';
      }
    }
    setMessages(prev => [...prev, { role: 'error', parts: [{ text: errorMessage }] }]);
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading || !chatSession) return;

    const userMessage: Message = { role: 'user', parts: [{ text: userInput }] };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const result = await chatSession.sendMessage(userInput);
      const aiResponse: Message = { role: 'model', parts: [{ text: result.response.text() }] };
      setMessages(prev => [...prev, aiResponse]);
    } catch (e: any) {
      handleApiError(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      localStorage.setItem('geminiApiKey', tempApiKey.trim());
      setApiKey(tempApiKey.trim());
    }
  };

  const handleResetApiKey = () => {
    setApiKey(null);
    setTempApiKey('');
    localStorage.removeItem('geminiApiKey');
    setMessages([]);
    setChatSession(null);
  };

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
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="password"
                placeholder="Dán API Key của bạn vào đây"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
              />
              <Button onClick={handleSaveApiKey} className="w-full">Lưu và Bắt đầu Chat</Button>
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center justify-center">
        <Card className="w-full max-w-3xl h-[80vh] flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Trợ lý ảo HSK {level}</CardTitle>
              <CardDescription>Luyện nói cùng HaoHao AI</CardDescription>
            </div>
            <Button onClick={handleResetApiKey} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" /> Đổi API Key
            </Button>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden">
            <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
              {messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} />
              ))}
              {isLoading && messages.length > 0 && (
                <div className="flex justify-start items-start gap-3 my-4">
                   <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Nhập câu trả lời của bạn..."
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !userInput.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span className="sr-only">Gửi</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
        <div className="text-center mt-4">
            <Button asChild variant="secondary">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" /> Về trang chủ
              </Link>
            </Button>
          </div>
      </main>
    </div>
  );
};

export default AiTutorPage;
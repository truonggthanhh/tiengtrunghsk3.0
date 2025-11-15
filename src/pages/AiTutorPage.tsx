import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Home, KeyRound, AlertTriangle, Send, Loader2, RefreshCw, Mic, MicOff, Volume2 } from 'lucide-react';
import type { ChatSession } from '@google/generative-ai';
import ChatMessage, { Message } from '@/components/ChatMessage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const AiTutorPage = () => {
  const { level } = useParams<{ level: string }>();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [tempApiKey, setTempApiKey] = useState('');
  
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatMode, setChatMode] = useState<'text' | 'voice'>('text');

  const recognitionRef = useRef<any>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // --- Initialization and Setup ---
  useEffect(() => {
    const storedApiKey = localStorage.getItem('geminiApiKey');
    if (storedApiKey) setApiKey(storedApiKey);
  }, []);

  useEffect(() => {
    if (apiKey) initializeChat();
  }, [apiKey, level]);

  useEffect(() => {
    setupSpeechRecognition();
    // Clean up on unmount
    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  // --- Core Functions ---
  const initializeChat = async () => {
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey!);
      const systemPrompt = `Bạn là một gia sư tiếng Trung tên là "HaoHao AI". Nhiệm vụ của bạn là giúp người dùng luyện tập cho kỳ thi HSK cấp độ ${level}. Hãy luôn thân thiện, kiên nhẫn và đưa ra những câu trả lời ngắn gọn, dễ hiểu. Khi người dùng nói, bạn sẽ nhận được văn bản phiên âm. Dựa vào đó, hãy đưa ra phản hồi về ngữ pháp, cách dùng từ và cả những lỗi phát âm có thể xảy ra (ví dụ: nếu người dùng nói 'li' thay vì 'ni', hãy chỉ ra điều đó). Bắt đầu cuộc trò chuyện bằng cách chào người dùng và hỏi họ muốn luyện tập kỹ năng gì. Chỉ trả lời bằng tiếng Việt.`;

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: systemPrompt });
      const session = model.startChat({ history: [] });
      setChatSession(session);
      setMessages([]);
      setIsLoading(true);
      session.sendMessage("Bắt đầu").then(result => {
        const initialResponse = { role: 'model', parts: [{ text: result.response.text() }] } as Message;
        setMessages(prev => [...prev, initialResponse]);
        if (chatMode === 'voice') speak(initialResponse.parts[0].text);
      }).catch(handleApiError).finally(() => setIsLoading(false));
    } catch (e: any) { handleApiError(e); }
  };

  const setupSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'zh-CN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        sendMessage(transcript);
      };
    } else {
      console.warn("Speech Recognition not supported by this browser.");
    }
  };

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Cancel any previous speech
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const chineseVoice = voices.find(voice => voice.lang.startsWith('zh'));
    if (chineseVoice) utterance.voice = chineseVoice;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading || !chatSession) return;

    const userMessage: Message = { role: 'user', parts: [{ text: messageText }] };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const result = await chatSession.sendMessage(messageText);
      const aiResponse: Message = { role: 'model', parts: [{ text: result.response.text() }] };
      setMessages(prev => [...prev, aiResponse]);
      if (chatMode === 'voice') speak(aiResponse.parts[0].text);
    } catch (e: any) {
      handleApiError(e);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Event Handlers ---
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(userInput);
    setUserInput('');
  };

  const handleVoiceButtonClick = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      window.speechSynthesis.cancel(); // Stop AI from speaking
      recognitionRef.current.start();
    }
  };

  const handleApiError = (e: any) => {
    console.error("API Error:", e);
    let errorMessage = `Đã xảy ra lỗi khi kết nối với AI. Lỗi gốc: ${e.message || e.toString()}`;
    setMessages(prev => [...prev, { role: 'error', parts: [{ text: errorMessage }] }]);
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
          <Card className="w-full max-w-lg p-6 md:p-8 rounded-xl shadow-lg border">
            <CardHeader>
              <KeyRound className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-2xl">Nhập API Key của Google Gemini</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input type="password" placeholder="Dán API Key của bạn vào đây" value={tempApiKey} onChange={(e) => setTempApiKey(e.target.value)} className="h-12 text-base border-2" />
              <Button onClick={handleSaveApiKey} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all font-bold">Lưu và Bắt đầu Chat</Button>
              <div className="text-xs text-muted-foreground p-2 border rounded-lg flex items-start gap-2 bg-yellow-100/50 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-700">
                <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-1 text-yellow-600 dark:text-yellow-400" />
                <div>API Key của bạn chỉ được lưu trữ trên trình duyệt này. <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary underline ml-1">Lấy API Key tại đây.</a></div>
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
        <Card className="w-full max-w-3xl h-[80vh] flex flex-col rounded-xl shadow-lg border">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Trợ lý ảo HSK {level}</CardTitle>
              <CardDescription>Luyện nói cùng HaoHao AI</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="chat-mode" checked={chatMode === 'voice'} onCheckedChange={(checked) => setChatMode(checked ? 'voice' : 'text')} />
              <Label htmlFor="chat-mode">Chat giọng nói</Label>
            </div>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden">
            <ScrollArea className="h-full pr-4">
              {messages.map((msg, index) => (
                <div key={index} className="relative group">
                  <ChatMessage message={msg} />
                  {msg.role === 'model' && chatMode === 'voice' && (
                    <Button variant="ghost" size="icon" className="absolute top-2 left-10 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => speak(msg.parts[0].text)}>
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {isLoading && messages.length > 0 && <div className="flex justify-start items-start gap-3 my-4"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            {chatMode === 'text' ? (
              <form onSubmit={handleFormSubmit} className="flex w-full items-center space-x-2">
                <Input value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Nhập câu trả lời của bạn..." disabled={isLoading} className="h-12 text-base border-2" />
                <Button type="submit" disabled={isLoading || !userInput.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all font-bold"><Send className="h-4 w-4" /></Button>
              </form>
            ) : (
              <div className="w-full flex justify-center">
                <Button onClick={handleVoiceButtonClick} disabled={isLoading || isSpeaking} size="lg" className={cn("rounded-full w-20 h-20 text-primary-foreground transition-all duration-300 font-bold", isListening ? "bg-destructive hover:bg-destructive/90 animate-pulse" : "bg-primary hover:bg-primary/90 hover:scale-[1.02]")}>
                  {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
        <div className="text-center mt-4 flex gap-4">
          <Button onClick={handleResetApiKey} variant="outline" className="hover:bg-accent hover:text-accent-foreground transition-colors font-bold"><RefreshCw className="mr-2 h-4 w-4" /> Đổi API Key</Button>
          <Button asChild variant="secondary" className="hover:bg-accent hover:text-accent-foreground transition-colors font-bold"><Link to="/mandarin"><Home className="mr-2 h-4 w-4" /> Về trang chủ</Link></Button>
        </div>
      </main>
    </div>
  );
};

export default AiTutorPage;
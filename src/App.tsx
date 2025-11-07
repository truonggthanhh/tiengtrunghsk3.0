import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/ThemeProvider";
import FlashcardPage from "./pages/FlashcardPage";
import PinyinChoicePage from "./pages/PinyinChoicePage";
import MeaningChoicePage from "./pages/MeaningChoicePage";
import FillInTheBlankPage from "./pages/FillInTheBlankPage";
import SentenceChoicePage from "./pages/SentenceChoicePage";
import SentenceScramblePage from "./pages/SentenceScramblePage";
import PronunciationPage from "./pages/PronunciationPage";
import AiTutorPage from "./pages/AiTutorPage";
import MsutongPage from "./pages/MsutongPage";
import MsutongAiTutorPage from "./pages/msutong/AiTutorPage";
import MsutongSentenceChoicePage from "./pages/msutong/SentenceChoicePage";
import MsutongSentenceScramblePage from "./pages/msutong/SentenceScramblePage";
import MsutongFlashcardPage from "./pages/msutong/MsutongFlashcardPage";
import MsutongPinyinChoicePage from "./pages/msutong/MsutongPinyinChoicePage";
import MsutongMeaningChoicePage from "./pages/msutong/MsutongMeaningChoicePage";
import MsutongFillInTheBlankPage from "./pages/msutong/MsutongFillInTheBlankPage";
import MsutongPronunciationPage from "./pages/msutong/MsutongPronunciationPage";
import MsutongReadingComprehensionPage from "./pages/msutong/MsutongReadingComprehensionPage";
import HandwritingPage from "./pages/HandwritingPage"; // Import new HSK handwriting page
import MsutongHandwritingPage from "./pages/msutong/MsutongHandwritingPage"; // Import new Msutong handwriting page
import Login from "./pages/Login";
import AdminDashboardPage from "./pages/AdminDashboardPage"; 
import { SessionContextProvider } from "./components/SessionContextProvider";
import { PinyinProvider } from "./contexts/PinyinContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SessionContextProvider>
            <PinyinProvider>
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminDashboardPage />} /> 
              
              {/* HSK Routes */}
              <Route path="/hsk/:level/flashcard" element={<FlashcardPage />} />
              <Route path="/hsk/:level/pinyin-choice" element={<PinyinChoicePage />} />
              <Route path="/hsk/:level/meaning-choice" element={<MeaningChoicePage />} />
              <Route path="/hsk/:level/fill-in-the-blank" element={<FillInTheBlankPage />} />
              <Route path="/hsk/:level/sentence-choice" element={<SentenceChoicePage />} />
              <Route path="/hsk/:level/sentence-scramble" element={<SentenceScramblePage />} />
              <Route path="/hsk/:level/pronunciation" element={<PronunciationPage />} />
              <Route path="/hsk/:level/handwriting-practice" element={<HandwritingPage />} /> {/* New HSK Handwriting Route */}
              <Route path="/hsk/:level/ai-tutor" element={<AiTutorPage />} />

              {/* Msutong Routes */}
              <Route path="/msutong" element={<MsutongPage />} />
              <Route path="/msutong/msutong-flashcard" element={<MsutongFlashcardPage />} />
              <Route path="/msutong/msutong-pinyin-choice" element={<MsutongPinyinChoicePage />} />
              <Route path="/msutong/msutong-meaning-choice" element={<MsutongMeaningChoicePage />} />
              <Route path="/msutong/msutong-fill-in-the-blank" element={<MsutongFillInTheBlankPage />} />
              <Route path="/msutong/msutong-pronunciation" element={<MsutongPronunciationPage />} />
              <Route path="/msutong/msutong-sentence-choice" element={<MsutongSentenceChoicePage />} />
              <Route path="/msutong/msutong-sentence-scramble" element={<MsutongSentenceScramblePage />} />
              <Route path="/msutong/msutong-reading-comprehension" element={<MsutongReadingComprehensionPage />} />
              <Route path="/msutong/msutong-handwriting-practice" element={<MsutongHandwritingPage />} /> {/* New Msutong Handwriting Route */}
              <Route path="/msutong/msutong-ai-tutor" element={<MsutongAiTutorPage />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
              </Routes>
            </PinyinProvider>
          </SessionContextProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
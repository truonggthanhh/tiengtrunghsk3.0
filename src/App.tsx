import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/ThemeProvider";

// Language Selection
import LanguageSelection from "./pages/LanguageSelection";

// Mandarin App Pages
import MandarinIndex from "./pages/Index";
import DictionaryPage from "./pages/DictionaryPage";
import SongsPage from "./pages/SongsPage";
import SongDetail from "./pages/SongDetail";
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
import HandwritingPage from "./pages/HandwritingPage";
import MsutongHandwritingPage from "./pages/msutong/MsutongHandwritingPage";
import MandarinLogin from "./pages/Login";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ProfilePage from "./pages/ProfilePage";
import LearningProgressPage from "./pages/LearningProgressPage";
import { SessionContextProvider } from "./components/SessionContextProvider";
import { PinyinProvider } from "./contexts/PinyinContext";

// Cantonese App Pages
import CantoneseIndex from "./cantonese/pages/Index";
import CantoneseLogin from "./cantonese/pages/Login";
import CantoneseDashboard from "./cantonese/pages/Dashboard";
import CantoneseProfile from "./cantonese/pages/Profile";
import CantoneseLessons from "./cantonese/pages/Lessons";
import CantoneseLessonDetail from "./cantonese/pages/LessonDetail";
import CantonesePractice from "./cantonese/pages/Practice";
import CantoneseReview from "./cantonese/pages/ReviewPage";
import CantoneseSongs from "./cantonese/pages/SongsPage";
import CantoneseSongDetail from "./cantonese/pages/SongDetail";
import CantoneseLearningProgress from "./cantonese/pages/LearningProgress";
import CantoneseForgotPassword from "./cantonese/pages/ForgotPassword";
import CantoneseUpdatePassword from "./cantonese/pages/UpdatePassword";
import CantoneseBlog from "./cantonese/pages/BlogPage";
import CantoneseBlogDetail from "./cantonese/pages/BlogDetailPage";
import MandarinBlog from "./mandarin/pages/BlogPage";
import MandarinBlogDetail from "./mandarin/pages/BlogDetailPage";

// Cantonese Components
import CantonesePageWrapper from "./cantonese/components/layouts/PageWrapper";
import CantoneseProtectedRoute from "./cantonese/components/ProtectedRoute";
import CantoneseThemeProvider from "./cantonese/components/providers/ThemeProvider";
import CantoneseSettingsProvider from "./cantonese/components/providers/SettingsProvider";
import CantoneseSessionContextProvider from "./cantonese/components/providers/SessionContextProvider";
import CantoneseProfileProvider from "./cantonese/components/providers/ProfileProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Không refetch khi quay lại tab
      refetchOnMount: false, // Không refetch khi component mount lại
      refetchOnReconnect: false, // Không refetch khi reconnect internet
      staleTime: 5 * 60 * 1000, // Data được coi là fresh trong 5 phút
      gcTime: 10 * 60 * 1000, // Cache data trong 10 phút (formerly cacheTime)
      retry: 1, // Chỉ retry 1 lần nếu request fail
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Language Selection */}
            <Route path="/" element={<LanguageSelection />} />

            {/* Mandarin App Routes */}
            <Route path="/mandarin">
              <Route
                index
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <MandarinIndex />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="login"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <MandarinLogin />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="profile"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <ProfilePage />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="learning-progress"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <LearningProgressPage />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="admin"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <AdminDashboardPage />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="dictionary"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <DictionaryPage />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />

              {/* Songs Routes */}
              <Route
                path="songs"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <SongsPage />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="songs/:songId"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <SongDetail />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />

              {/* Blog Routes */}
              <Route
                path="blog"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <MandarinBlog />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="blog/:slug"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <MandarinBlogDetail />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />

              {/* HSK Routes */}
              <Route
                path="hsk/:level/flashcard"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <FlashcardPage />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="hsk/:level/pinyin-choice"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <PinyinChoicePage />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="hsk/:level/meaning-choice"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <MeaningChoicePage />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="hsk/:level/fill-in-the-blank"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <FillInTheBlankPage />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="hsk/:level/sentence-choice"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <SentenceChoicePage />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="hsk/:level/sentence-scramble"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <SentenceScramblePage />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="hsk/:level/pronunciation"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <PronunciationPage />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="hsk/:level/handwriting-practice"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <HandwritingPage />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="hsk/:level/ai-tutor"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <AiTutorPage />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />

              {/* Msutong Routes */}
              <Route
                path="msutong"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <MsutongPage />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="msutong/msutong-flashcard"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <MsutongFlashcardPage />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="msutong/msutong-pinyin-choice"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <MsutongPinyinChoicePage />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="msutong/msutong-meaning-choice"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <MsutongMeaningChoicePage />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="msutong/msutong-fill-in-the-blank"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <MsutongFillInTheBlankPage />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="msutong/msutong-pronunciation"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <MsutongPronunciationPage />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="msutong/msutong-sentence-choice"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <MsutongSentenceChoicePage />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="msutong/msutong-sentence-scramble"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <MsutongSentenceScramblePage />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="msutong/msutong-reading-comprehension"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <MsutongReadingComprehensionPage />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="msutong/msutong-handwriting-practice"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <MsutongHandwritingPage />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="msutong/msutong-ai-tutor"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <MsutongAiTutorPage />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
            </Route>

            {/* Cantonese App Routes */}
            <Route path="/cantonese">
              <Route
                index
                element={
                  <CantoneseThemeProvider>
                    <CantoneseSettingsProvider>
                      <CantoneseSessionContextProvider>
                        <CantoneseProfileProvider>
                          <CantonesePageWrapper>
                            <CantoneseIndex />
                          </CantonesePageWrapper>
                        </CantoneseProfileProvider>
                      </CantoneseSessionContextProvider>
                    </CantoneseSettingsProvider>
                  </CantoneseThemeProvider>
                }
              />

              {/* Public routes */}
              <Route
                path="login"
                element={
                  <CantoneseThemeProvider>
                    <CantoneseSettingsProvider>
                      <CantoneseSessionContextProvider>
                        <CantoneseProfileProvider>
                          <CantonesePageWrapper>
                            <CantoneseLogin />
                          </CantonesePageWrapper>
                        </CantoneseProfileProvider>
                      </CantoneseSessionContextProvider>
                    </CantoneseSettingsProvider>
                  </CantoneseThemeProvider>
                }
              />
              <Route
                path="forgot-password"
                element={
                  <CantoneseThemeProvider>
                    <CantoneseSettingsProvider>
                      <CantoneseSessionContextProvider>
                        <CantoneseProfileProvider>
                          <CantonesePageWrapper>
                            <CantoneseForgotPassword />
                          </CantonesePageWrapper>
                        </CantoneseProfileProvider>
                      </CantoneseSessionContextProvider>
                    </CantoneseSettingsProvider>
                  </CantoneseThemeProvider>
                }
              />
              <Route
                path="update-password"
                element={
                  <CantoneseThemeProvider>
                    <CantoneseSettingsProvider>
                      <CantoneseSessionContextProvider>
                        <CantoneseProfileProvider>
                          <CantonesePageWrapper>
                            <CantoneseUpdatePassword />
                          </CantonesePageWrapper>
                        </CantoneseProfileProvider>
                      </CantoneseSessionContextProvider>
                    </CantoneseSettingsProvider>
                  </CantoneseThemeProvider>
                }
              />
              <Route
                path="lessons"
                element={
                  <CantoneseThemeProvider>
                    <CantoneseSettingsProvider>
                      <CantoneseSessionContextProvider>
                        <CantoneseProfileProvider>
                          <CantonesePageWrapper>
                            <CantoneseLessons />
                          </CantonesePageWrapper>
                        </CantoneseProfileProvider>
                      </CantoneseSessionContextProvider>
                    </CantoneseSettingsProvider>
                  </CantoneseThemeProvider>
                }
              />
              <Route
                path="lessons/:lessonId"
                element={
                  <CantoneseThemeProvider>
                    <CantoneseSettingsProvider>
                      <CantoneseSessionContextProvider>
                        <CantoneseProfileProvider>
                          <CantonesePageWrapper>
                            <CantoneseLessonDetail />
                          </CantonesePageWrapper>
                        </CantoneseProfileProvider>
                      </CantoneseSessionContextProvider>
                    </CantoneseSettingsProvider>
                  </CantoneseThemeProvider>
                }
              />
              <Route
                path="practice/:lessonId/:type"
                element={
                  <CantoneseThemeProvider>
                    <CantoneseSettingsProvider>
                      <CantoneseSessionContextProvider>
                        <CantoneseProfileProvider>
                          <CantonesePageWrapper>
                            <CantonesePractice />
                          </CantonesePageWrapper>
                        </CantoneseProfileProvider>
                      </CantoneseSessionContextProvider>
                    </CantoneseSettingsProvider>
                  </CantoneseThemeProvider>
                }
              />
              <Route
                path="review/:lessonId"
                element={
                  <CantoneseThemeProvider>
                    <CantoneseSettingsProvider>
                      <CantoneseSessionContextProvider>
                        <CantoneseProfileProvider>
                          <CantonesePageWrapper>
                            <CantoneseReview />
                          </CantonesePageWrapper>
                        </CantoneseProfileProvider>
                      </CantoneseSessionContextProvider>
                    </CantoneseSettingsProvider>
                  </CantoneseThemeProvider>
                }
              />
              <Route
                path="songs"
                element={
                  <CantoneseThemeProvider>
                    <CantoneseSettingsProvider>
                      <CantoneseSessionContextProvider>
                        <CantoneseProfileProvider>
                          <CantonesePageWrapper>
                            <CantoneseSongs />
                          </CantonesePageWrapper>
                        </CantoneseProfileProvider>
                      </CantoneseSessionContextProvider>
                    </CantoneseSettingsProvider>
                  </CantoneseThemeProvider>
                }
              />
              <Route
                path="songs/:songId"
                element={
                  <CantoneseThemeProvider>
                    <CantoneseSettingsProvider>
                      <CantoneseSessionContextProvider>
                        <CantoneseProfileProvider>
                          <CantonesePageWrapper>
                            <CantoneseSongDetail />
                          </CantonesePageWrapper>
                        </CantoneseProfileProvider>
                      </CantoneseSessionContextProvider>
                    </CantoneseSettingsProvider>
                  </CantoneseThemeProvider>
                }
              />
              <Route
                path="blog"
                element={
                  <CantoneseThemeProvider>
                    <CantoneseSettingsProvider>
                      <CantoneseSessionContextProvider>
                        <CantoneseProfileProvider>
                          <CantonesePageWrapper>
                            <CantoneseBlog />
                          </CantonesePageWrapper>
                        </CantoneseProfileProvider>
                      </CantoneseSessionContextProvider>
                    </CantoneseSettingsProvider>
                  </CantoneseThemeProvider>
                }
              />
              <Route
                path="blog/:slug"
                element={
                  <CantoneseThemeProvider>
                    <CantoneseSettingsProvider>
                      <CantoneseSessionContextProvider>
                        <CantoneseProfileProvider>
                          <CantonesePageWrapper>
                            <CantoneseBlogDetail />
                          </CantonesePageWrapper>
                        </CantoneseProfileProvider>
                      </CantoneseSessionContextProvider>
                    </CantoneseSettingsProvider>
                  </CantoneseThemeProvider>
                }
              />

              {/* Protected routes - wrap in providers + ProtectedRoute */}
              <Route
                path="dashboard"
                element={
                  <CantoneseThemeProvider>
                    <CantoneseSettingsProvider>
                      <CantoneseSessionContextProvider>
                        <CantoneseProfileProvider>
                          <CantoneseProtectedRoute>
                            <CantonesePageWrapper showBackButton={false}>
                              <CantoneseDashboard />
                            </CantonesePageWrapper>
                          </CantoneseProtectedRoute>
                        </CantoneseProfileProvider>
                      </CantoneseSessionContextProvider>
                    </CantoneseSettingsProvider>
                  </CantoneseThemeProvider>
                }
              />
              <Route
                path="profile"
                element={
                  <CantoneseThemeProvider>
                    <CantoneseSettingsProvider>
                      <CantoneseSessionContextProvider>
                        <CantoneseProfileProvider>
                          <CantoneseProtectedRoute>
                            <CantonesePageWrapper>
                              <CantoneseProfile />
                            </CantonesePageWrapper>
                          </CantoneseProtectedRoute>
                        </CantoneseProfileProvider>
                      </CantoneseSessionContextProvider>
                    </CantoneseSettingsProvider>
                  </CantoneseThemeProvider>
                }
              />
              <Route
                path="learning-progress"
                element={
                  <CantoneseThemeProvider>
                    <CantoneseSettingsProvider>
                      <CantoneseSessionContextProvider>
                        <CantoneseProfileProvider>
                          <CantoneseProtectedRoute>
                            <CantonesePageWrapper>
                              <CantoneseLearningProgress />
                            </CantonesePageWrapper>
                          </CantoneseProtectedRoute>
                        </CantoneseProfileProvider>
                      </CantoneseSessionContextProvider>
                    </CantoneseSettingsProvider>
                  </CantoneseThemeProvider>
                }
              />
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

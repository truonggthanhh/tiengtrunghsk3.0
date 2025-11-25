import React, { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { SessionContextProvider } from "./components/SessionContextProvider";
import { PinyinProvider } from "./contexts/PinyinContext";
import { GamificationProvider } from "./components/gamification/GamificationProvider";
import ErrorBoundary from "./components/ErrorBoundary";

// Cantonese Components (keep providers non-lazy)
import CantonesePageWrapper from "./cantonese/components/layouts/PageWrapper";
import CantoneseProtectedRoute from "./cantonese/components/ProtectedRoute";
import CantoneseThemeProvider from "./cantonese/components/providers/ThemeProvider";
import CantoneseSettingsProvider from "./cantonese/components/providers/SettingsProvider";
import CantoneseSessionContextProvider from "./cantonese/components/providers/SessionContextProvider";
import CantoneseProfileProvider from "./cantonese/components/providers/ProfileProvider";
import CantoneseRouteWrapper from "./cantonese/components/CantoneseRouteWrapper";

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Lazy loaded pages
const NotFound = lazy(() => import("./pages/NotFound"));
const LanguageSelection = lazy(() => import("./pages/LanguageSelection"));

// Mandarin App Pages
const MandarinIndex = lazy(() => import("./pages/Index"));
const DictionaryPage = lazy(() => import("./pages/DictionaryPage"));
const SongsPage = lazy(() => import("./pages/SongsPage"));
const SongDetail = lazy(() => import("./pages/SongDetail"));
const FlashcardPage = lazy(() => import("./pages/FlashcardPage"));
const PinyinChoicePage = lazy(() => import("./pages/PinyinChoicePage"));
const MeaningChoicePage = lazy(() => import("./pages/MeaningChoicePage"));
const FillInTheBlankPage = lazy(() => import("./pages/FillInTheBlankPage"));
const SentenceChoicePage = lazy(() => import("./pages/SentenceChoicePage"));
const SentenceScramblePage = lazy(() => import("./pages/SentenceScramblePage"));
const PronunciationPage = lazy(() => import("./pages/PronunciationPage"));
const AiTutorPage = lazy(() => import("./pages/AiTutorPage"));
const MsutongPage = lazy(() => import("./pages/MsutongPage"));
const MsutongAiTutorPage = lazy(() => import("./pages/msutong/AiTutorPage"));
const MsutongSentenceChoicePage = lazy(() => import("./pages/msutong/SentenceChoicePage"));
const MsutongSentenceScramblePage = lazy(() => import("./pages/msutong/SentenceScramblePage"));
const MsutongFlashcardPage = lazy(() => import("./pages/msutong/MsutongFlashcardPage"));
const MsutongPinyinChoicePage = lazy(() => import("./pages/msutong/MsutongPinyinChoicePage"));
const MsutongMeaningChoicePage = lazy(() => import("./pages/msutong/MsutongMeaningChoicePage"));
const MsutongFillInTheBlankPage = lazy(() => import("./pages/msutong/MsutongFillInTheBlankPage"));
const MsutongPronunciationPage = lazy(() => import("./pages/msutong/MsutongPronunciationPage"));
const MsutongReadingComprehensionPage = lazy(() => import("./pages/msutong/MsutongReadingComprehensionPage"));
const HandwritingPage = lazy(() => import("./pages/HandwritingPage"));
const MsutongHandwritingPage = lazy(() => import("./pages/msutong/MsutongHandwritingPage"));
const MandarinLogin = lazy(() => import("./pages/Login"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const LearningProgressPage = lazy(() => import("./pages/LearningProgressPage"));
const MandarinBlog = lazy(() => import("./mandarin/pages/BlogPage"));
const MandarinBlogDetail = lazy(() => import("./mandarin/pages/BlogDetailPage"));
const MandarinGamificationIndex = lazy(() => import("./mandarin/pages/GamificationIndex"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const EnhancedPronunciationPage = lazy(() => import("./pages/EnhancedPronunciationPage"));

// Mandarin Gamification Pages
const MandarinBossBattles = lazy(() => import("./mandarin/pages/gamification/BossBattles"));
const MandarinCardCollection = lazy(() => import("./mandarin/pages/gamification/CardCollection"));
const MandarinLuckyWheel = lazy(() => import("./mandarin/pages/gamification/LuckyWheel"));
const MandarinMissions = lazy(() => import("./mandarin/pages/gamification/Missions"));
const MandarinStoryMode = lazy(() => import("./mandarin/pages/gamification/StoryMode"));
const MandarinBadges = lazy(() => import("./mandarin/pages/gamification/Badges"));

// Cantonese App Pages
const CantoneseIndex = lazy(() => import("./cantonese/pages/Index"));
const CantoneseLogin = lazy(() => import("./cantonese/pages/Login"));
const CantoneseDashboard = lazy(() => import("./cantonese/pages/Dashboard"));
const CantoneseProfile = lazy(() => import("./cantonese/pages/Profile"));
const CantoneseLessons = lazy(() => import("./cantonese/pages/Lessons"));
const CantoneseLessonDetail = lazy(() => import("./cantonese/pages/LessonDetail"));
const CantonesePractice = lazy(() => import("./cantonese/pages/Practice"));
const CantoneseReview = lazy(() => import("./cantonese/pages/ReviewPage"));
const CantoneseSongs = lazy(() => import("./cantonese/pages/SongsPage"));
const CantoneseSongDetail = lazy(() => import("./cantonese/pages/SongDetail"));
const CantoneseLearningProgress = lazy(() => import("./cantonese/pages/LearningProgress"));
const CantoneseForgotPassword = lazy(() => import("./cantonese/pages/ForgotPassword"));
const CantoneseUpdatePassword = lazy(() => import("./cantonese/pages/UpdatePassword"));
const CantoneseBlog = lazy(() => import("./cantonese/pages/BlogPage"));
const CantoneseBlogDetail = lazy(() => import("./cantonese/pages/BlogDetailPage"));
const CantoneseAnalyticsPage = lazy(() => import("./cantonese/pages/AnalyticsPage"));
const CantoneseEnhancedPronunciationPage = lazy(() => import("./cantonese/pages/EnhancedPronunciationPage"));

// Cantonese Gamification Pages
const CantoneseGamificationDashboard = lazy(() => import("./cantonese/pages/gamification/index"));
const CantoneseBossBattles = lazy(() => import("./cantonese/pages/gamification/BossBattles"));
const CantoneseCardCollection = lazy(() => import("./cantonese/pages/gamification/CardCollection"));
const CantoneseLuckyWheel = lazy(() => import("./cantonese/pages/gamification/LuckyWheel"));
const CantoneseMissions = lazy(() => import("./cantonese/pages/gamification/Missions"));
const CantoneseStoryMode = lazy(() => import("./cantonese/pages/gamification/StoryMode"));
const CantoneseBadges = lazy(() => import("./cantonese/pages/gamification/Badges"));

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
      <GamificationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
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

              {/* Analytics Route */}
              <Route
                path="analytics"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <AnalyticsPage />
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
                path="hsk/:level/enhanced-pronunciation"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <EnhancedPronunciationPage />
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

              {/* Gamification Routes */}
              <Route
                path="gamification"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <MandarinGamificationIndex />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="gamification/boss-battles"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <MandarinBossBattles />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="gamification/card-collection"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <MandarinCardCollection />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="gamification/lucky-wheel"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <MandarinLuckyWheel />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="gamification/missions"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <MandarinMissions />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="gamification/story-mode"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <MandarinStoryMode />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
              <Route
                path="gamification/badges"
                element={
                  <SessionContextProvider>
                    <PinyinProvider>
                      <MandarinBadges />
                    </PinyinProvider>
                  </SessionContextProvider>
                }
              />
            </Route>

            {/* Cantonese App Routes - Using CantoneseRouteWrapper to reduce duplication */}
            <Route path="/cantonese">
              <Route
                index
                element={
                  <CantoneseRouteWrapper>
                    <CantoneseIndex />
                  </CantoneseRouteWrapper>
                }
              />

              {/* Public routes */}
              <Route
                path="login"
                element={
                  <CantoneseRouteWrapper>
                    <CantoneseLogin />
                  </CantoneseRouteWrapper>
                }
              />
              <Route
                path="forgot-password"
                element={
                  <CantoneseRouteWrapper>
                    <CantoneseForgotPassword />
                  </CantoneseRouteWrapper>
                }
              />
              <Route
                path="update-password"
                element={
                  <CantoneseRouteWrapper>
                    <CantoneseUpdatePassword />
                  </CantoneseRouteWrapper>
                }
              />
              <Route
                path="lessons"
                element={
                  <CantoneseRouteWrapper>
                    <CantoneseLessons />
                  </CantoneseRouteWrapper>
                }
              />
              <Route
                path="lessons/:lessonId"
                element={
                  <CantoneseRouteWrapper>
                    <CantoneseLessonDetail />
                  </CantoneseRouteWrapper>
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

              {/* Analytics Route */}
              <Route
                path="analytics"
                element={
                  <CantoneseRouteWrapper>
                    <CantoneseAnalyticsPage />
                  </CantoneseRouteWrapper>
                }
              />

              {/* Enhanced Pronunciation Route */}
              <Route
                path=":level/enhanced-pronunciation"
                element={
                  <CantoneseRouteWrapper>
                    <CantoneseEnhancedPronunciationPage />
                  </CantoneseRouteWrapper>
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

              {/* Gamification Routes */}
              <Route
                path="gamification"
                element={
                  <CantoneseThemeProvider>
                    <CantoneseSettingsProvider>
                      <CantoneseSessionContextProvider>
                        <CantoneseProfileProvider>
                          <CantoneseProtectedRoute>
                            <CantonesePageWrapper>
                              <CantoneseGamificationDashboard />
                            </CantonesePageWrapper>
                          </CantoneseProtectedRoute>
                        </CantoneseProfileProvider>
                      </CantoneseSessionContextProvider>
                    </CantoneseSettingsProvider>
                  </CantoneseThemeProvider>
                }
              />
              <Route
                path="gamification/boss-battles"
                element={
                  <CantoneseThemeProvider>
                    <CantoneseSettingsProvider>
                      <CantoneseSessionContextProvider>
                        <CantoneseProfileProvider>
                          <CantoneseProtectedRoute>
                            <CantonesePageWrapper>
                              <CantoneseBossBattles />
                            </CantonesePageWrapper>
                          </CantoneseProtectedRoute>
                        </CantoneseProfileProvider>
                      </CantoneseSessionContextProvider>
                    </CantoneseSettingsProvider>
                  </CantoneseThemeProvider>
                }
              />
              <Route
                path="gamification/card-collection"
                element={
                  <CantoneseThemeProvider>
                    <CantoneseSettingsProvider>
                      <CantoneseSessionContextProvider>
                        <CantoneseProfileProvider>
                          <CantoneseProtectedRoute>
                            <CantonesePageWrapper>
                              <CantoneseCardCollection />
                            </CantonesePageWrapper>
                          </CantoneseProtectedRoute>
                        </CantoneseProfileProvider>
                      </CantoneseSessionContextProvider>
                    </CantoneseSettingsProvider>
                  </CantoneseThemeProvider>
                }
              />
              <Route
                path="gamification/lucky-wheel"
                element={
                  <CantoneseThemeProvider>
                    <CantoneseSettingsProvider>
                      <CantoneseSessionContextProvider>
                        <CantoneseProfileProvider>
                          <CantoneseProtectedRoute>
                            <CantonesePageWrapper>
                              <CantoneseLuckyWheel />
                            </CantonesePageWrapper>
                          </CantoneseProtectedRoute>
                        </CantoneseProfileProvider>
                      </CantoneseSessionContextProvider>
                    </CantoneseSettingsProvider>
                  </CantoneseThemeProvider>
                }
              />
              <Route
                path="gamification/missions"
                element={
                  <CantoneseThemeProvider>
                    <CantoneseSettingsProvider>
                      <CantoneseSessionContextProvider>
                        <CantoneseProfileProvider>
                          <CantoneseProtectedRoute>
                            <CantonesePageWrapper>
                              <CantoneseMissions />
                            </CantonesePageWrapper>
                          </CantoneseProtectedRoute>
                        </CantoneseProfileProvider>
                      </CantoneseSessionContextProvider>
                    </CantoneseSettingsProvider>
                  </CantoneseThemeProvider>
                }
              />
              <Route
                path="gamification/story-mode"
                element={
                  <CantoneseThemeProvider>
                    <CantoneseSettingsProvider>
                      <CantoneseSessionContextProvider>
                        <CantoneseProfileProvider>
                          <CantoneseProtectedRoute>
                            <CantonesePageWrapper>
                              <CantoneseStoryMode />
                            </CantonesePageWrapper>
                          </CantoneseProtectedRoute>
                        </CantoneseProfileProvider>
                      </CantoneseSessionContextProvider>
                    </CantoneseSettingsProvider>
                  </CantoneseThemeProvider>
                }
              />
              <Route
                path="gamification/badges"
                element={
                  <CantoneseThemeProvider>
                    <CantoneseSettingsProvider>
                      <CantoneseSessionContextProvider>
                        <CantoneseProfileProvider>
                          <CantoneseProtectedRoute>
                            <CantonesePageWrapper>
                              <CantoneseBadges />
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
            </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </GamificationProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

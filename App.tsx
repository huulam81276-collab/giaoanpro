
import React, { useState, useEffect, useCallback } from 'react';
import { LessonPlanForm } from './components/LessonPlanForm';
import { LessonPlanDisplay } from './components/LessonPlanDisplay';
import { ApiKeyForm } from './components/ApiKeyForm';
import { LoginForm } from './components/LoginForm';
import { LoadingSpinner } from './components/icons/LoadingSpinner';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { ClipboardDocumentListIcon } from './components/icons/ClipboardDocumentListIcon';
import type { LessonPlanInput, GeneratedLessonPlan, Language } from './types';
import { generateLessonPlanPart } from './services/geminiService';
// import { authService } from './services/authService'; // Removed as heartbeat is disabled
import { deepMerge } from './utils/deepMerge';
import { translations } from './utils/locales';


const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
  
const getGenerationStatusMessage = (part: string, congVan: string, lang: Language): string => {
    const prefix = lang === 'vi' ? "AI đang viết: " : "AI is writing: ";
    const t = translations[lang];

    if (congVan === '5512' || congVan === '958') {
        switch (part) {
            case 'initial': return prefix + (lang === 'vi' ? "Mục tiêu bài học..." : "Lesson Objectives...");
            case 'thietBi': return prefix + (lang === 'vi' ? "Thiết bị dạy học..." : "Teaching Equipment...");
            case 'giaoDucTichHop': return prefix + (lang === 'vi' ? "Nội dung giáo dục tích hợp..." : "Integrated Education Content...");
            case 'hoatDong1': return prefix + (lang === 'vi' ? "Hoạt động 1: Mở đầu..." : "Activity 1: Introduction...");
            case 'hoatDong2': return prefix + (lang === 'vi' ? "Hoạt động 2: Hình thành kiến thức..." : "Activity 2: Knowledge Formation...");
            case 'hoatDong3': return prefix + (lang === 'vi' ? "Hoạt động 3: Luyện tập..." : "Activity 3: Practice...");
            case 'hoatDong4': return prefix + (lang === 'vi' ? "Hoạt động 4: Vận dụng..." : "Activity 4: Application...");
            default: return prefix + (lang === 'vi' ? "Đang soạn thảo..." : "Drafting...");
        }
    } else { // 2345 & 1001
        switch (part) {
            case 'initial': return prefix + (lang === 'vi' ? "Yêu cầu cần đạt..." : "Requirements...");
            case 'doDungDayHoc': return prefix + (lang === 'vi' ? "Đồ dùng dạy học..." : "Teaching Aids...");
            case 'hoatDongMoDau': return prefix + (lang === 'vi' ? "Hoạt động 1: Mở đầu..." : "Activity 1: Introduction...");
            case 'hoatDongHinhThanhKienThuc': return prefix + (lang === 'vi' ? "Hoạt động 2: Hình thành kiến thức..." : "Activity 2: Knowledge Formation...");
            case 'hoatDongLuyenTap': return prefix + (lang === 'vi' ? "Hoạt động 3: Luyện tập..." : "Activity 3: Practice...");
            case 'hoatDongVanDung': return prefix + (lang === 'vi' ? "Hoạt động 4: Vận dụng..." : "Activity 4: Application...");
            case 'dieuChinhSauBaiDay': return prefix + (lang === 'vi' ? "Điều chỉnh sau bài dạy..." : "Post-lesson Adjustments...");
            default: return prefix + (lang === 'vi' ? "Đang soạn thảo..." : "Drafting...");
        }
    }
}

const App: React.FC = () => {
  // State xác thực người dùng
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem('app-authenticated') === 'true');
  const [userEmail, setUserEmail] = useState<string | null>(() => localStorage.getItem('session_email'));

  const [apiKey, setApiKey] = useState<string | null>(() => localStorage.getItem('user-gemini-api-key'));
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  
  // State ngôn ngữ
  const [lang, setLang] = useState<Language>('vi');

  const [formData, setFormData] = useState<LessonPlanInput>({
    teacherName: '',
    subject: '',
    grade: '',
    duration: { level: 'THCS', periods: '' },
    lessonTitle: '',
    congVan: '5512',
    integrateDigitalCompetency: false,
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedLessonPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] = useState<string | null>(null);
  const [isGenerationComplete, setIsGenerationComplete] = useState<boolean>(false);

  const t = translations[lang];
  
  const handleLoginSuccess = (email: string) => {
    localStorage.setItem('app-authenticated', 'true');
    setIsAuthenticated(true);
    setUserEmail(email);
  };

  const handleLogout = useCallback((reason?: string) => {
      localStorage.removeItem('app-authenticated');
      localStorage.removeItem('session_email');
      localStorage.removeItem('session_token');
      localStorage.removeItem('session_fingerprint');
      setIsAuthenticated(false);
      setUserEmail(null);
      if (reason) alert(reason);
  }, []);

  // --- LOGIC KIỂM TRA PHIÊN (SINGLE SESSION) - DISABLED FOR CSV MODE ---
  /*
  useEffect(() => {
    if (!isAuthenticated || !userEmail) return;

    const handleStorageChange = (event: StorageEvent) => {
       if (event.key === 'app-authenticated' && event.newValue === null) {
           setIsAuthenticated(false);
           setUserEmail(null);
       }
    };
    window.addEventListener('storage', handleStorageChange);

    // Disabled because static CSV cannot check active sessions
    // const intervalId = setInterval(async () => {
    //    ...
    // }, 10000);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
        // clearInterval(intervalId);
    };
  }, [isAuthenticated, userEmail, handleLogout, lang]);
  */
  // ---------------------------------------------

  const handleSaveKey = (key: string) => {
    localStorage.setItem('user-gemini-api-key', key);
    setApiKey(key);
    setApiKeyError(null);
    setError(null); 
  };
  
  const handleClearKey = () => {
    localStorage.removeItem('user-gemini-api-key');
    setApiKey(null);
    setGeneratedPlan(null);
    setIsLoading(false);
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = [...e.target.files];
      setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
      e.target.value = '';
    }
  };
  
  const handleFileRemove = (indexToRemove: number) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };
  
  const runAutomatedGeneration = async (apiKey: string, sequence: string[], fileParts: any[]) => {
    let currentPlan: GeneratedLessonPlan | null = null;
    
    for (const partToGenerate of sequence) {
        setGenerationStatus(getGenerationStatusMessage(partToGenerate, formData.congVan, lang));
        try {
            const newPart = await generateLessonPlanPart(apiKey, formData, fileParts, currentPlan, partToGenerate, lang);
            const updatedPlan = deepMerge(currentPlan, newPart);
            
            setGeneratedPlan(updatedPlan); 
            currentPlan = updatedPlan;
            
            if (partToGenerate === 'initial' && newPart) {
                 setFormData(prev => ({
                    ...prev,
                    lessonTitle: prev.lessonTitle || newPart.lessonTitle,
                    subject: prev.subject || newPart.subject,
                    grade: prev.grade || newPart.grade,
                }));
            }
        } catch (err) {
            console.error("Error during generation step:", err);
            
            if (err instanceof Error && /API key/i.test(err.message)) {
                setApiKeyError(lang === 'vi' ? "API Key không hợp lệ hoặc đã hết hạn." : "Invalid or expired API Key.");
                handleClearKey();
                return; 
            }
            
            const friendlyPartName = getGenerationStatusMessage(partToGenerate, formData.congVan, lang).replace(lang === 'vi' ? 'AI đang viết: ' : 'AI is writing: ','').replace('...','');
            const errorMessage = (err instanceof Error) ? err.message : (lang === 'vi' ? 'Đã xảy ra lỗi không xác định.' : 'An unknown error occurred.');
            
            let displayError = lang === 'vi' 
                ? `Lỗi khi đang tạo "${friendlyPartName}": ${errorMessage}`
                : `Error generating "${friendlyPartName}": ${errorMessage}`;

            if (errorMessage.includes('503') || /model is overloaded/i.test(errorMessage)) {
              displayError = lang === 'vi'
                ? `Hệ thống AI hiện đang quá tải. Đây là sự cố tạm thời từ phía Google. Vui lòng đợi một vài phút rồi thử lại.`
                : `AI system is overloaded. This is a temporary issue from Google. Please wait a moment and try again.`;
            }

            setError(displayError);
            setIsLoading(false);
            setGenerationStatus(null);
            return;
        }
    }
    
    setIsLoading(false);
    setIsGenerationComplete(true);
    setGenerationStatus(null);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      setError(lang === 'vi' ? "Vui lòng cung cấp API Key để tiếp tục." : "Please provide API Key to continue.");
      return;
    }
    if (selectedFiles.length === 0) {
      setError(lang === 'vi' ? 'Vui lòng tải lên ít nhất một hình ảnh hoặc file PDF sách giáo khoa.' : "Please upload at least one image or PDF textbook.");
      return;
    }

    setGeneratedPlan(null);
    setError(null);
    setIsGenerationComplete(false);
    setGenerationStatus(lang === 'vi' ? "Đang chuẩn bị..." : "Preparing...");
    setIsLoading(true);

    const sequence = formData.congVan === '5512'
      ? ['initial', 'thietBi', 'giaoDucTichHop', 'hoatDong1', 'hoatDong2', 'hoatDong3', 'hoatDong4']
      : formData.congVan === '958'
      ? ['initial', 'thietBi', 'hoatDong1', 'hoatDong2', 'hoatDong3', 'hoatDong4']
      : ['initial', 'doDungDayHoc', 'hoatDongMoDau', 'hoatDongHinhThanhKienThuc', 'hoatDongLuyenTap', 'hoatDongVanDung', 'dieuChinhSauBaiDay'];
    
    try {
        const parts = await Promise.all(
            selectedFiles.map(async (file) => {
              const base64Data = await fileToBase64(file);
              return {
                inlineData: {
                  mimeType: file.type,
                  data: base64Data,
                },
              };
            })
        );
        await runAutomatedGeneration(apiKey, sequence, parts);
    } catch (err) {
        console.error(err);
        setError(lang === 'vi' ? "Không thể xử lý tệp đã tải lên." : "Cannot process uploaded files.");
        setIsLoading(false);
        setGenerationStatus(null);
    }
  };
  
  if (!isAuthenticated) {
    return (
        <div className="min-h-screen main-bg">
            <LoginForm onLoginSuccess={handleLoginSuccess} lang={lang} setLang={setLang} />
        </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="min-h-screen main-bg flex items-center justify-center p-4">
        <div className="relative w-full max-w-md">
            <button
                onClick={() => handleLogout()}
                className="absolute -top-12 right-0 text-sm text-slate-600 hover:text-red-600 font-medium"
            >
                {t.logout}
            </button>
            <div className="absolute -top-12 left-0 flex bg-white/50 rounded-lg p-1 ring-1 ring-black/5">
                <button 
                    onClick={() => setLang('vi')} 
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${lang === 'vi' ? 'bg-sky-100 text-sky-700 font-bold' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Tiếng Việt
                </button>
                <button 
                    onClick={() => setLang('en')} 
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${lang === 'en' ? 'bg-sky-100 text-sky-700 font-bold' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    English
                </button>
            </div>
            <ApiKeyForm onSave={handleSaveKey} initialError={apiKeyError} lang={lang} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen main-bg text-slate-800">
        <main className="container mx-auto px-4 py-8 md:py-12">
          <header className="text-center mb-8 relative">
             <div className="flex justify-between items-start mb-4">
                 <div className="flex bg-white/50 rounded-lg p-1 ring-1 ring-black/5 backdrop-blur-sm">
                    <button 
                        onClick={() => setLang('vi')} 
                        className={`px-3 py-1.5 text-xs rounded-md transition-colors ${lang === 'vi' ? 'bg-sky-500 text-white font-bold shadow-sm' : 'text-slate-600 hover:bg-white/50'}`}
                    >
                        Tiếng Việt
                    </button>
                    <button 
                        onClick={() => setLang('en')} 
                        className={`px-3 py-1.5 text-xs rounded-md transition-colors ${lang === 'en' ? 'bg-sky-500 text-white font-bold shadow-sm' : 'text-slate-600 hover:bg-white/50'}`}
                    >
                        English
                    </button>
                </div>

                 <div className="flex flex-col items-end space-y-2">
                     <button
                        onClick={handleClearKey}
                        className="text-xs text-slate-500 hover:text-sky-600 bg-white/50 px-3 py-1.5 rounded-md shadow-sm ring-1 ring-black/5"
                        title={t.changeKey}
                      >
                        {t.changeKey}
                      </button>
                      <button
                        onClick={() => handleLogout()}
                        className="text-xs text-red-500 hover:text-red-700 bg-white/50 px-3 py-1.5 rounded-md shadow-sm ring-1 ring-black/5"
                      >
                        {t.logout}
                      </button>
                 </div>
             </div>
            
            <div className="inline-block bg-white text-sky-500 p-2 rounded-xl mb-3 ring-1 ring-black/5 shadow-lg">
               <SparklesIcon className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              {t.appTitle}
            </h1>
             <div className="mt-3">
              <span className="inline-block bg-gradient-to-r from-sky-500 to-cyan-500 text-white text-sm font-bold px-5 py-2 rounded-full shadow-lg transform hover:scale-105 transition-transform">
                {t.proBadge}
              </span>
            </div>
            <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
              {t.appDesc}
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1 bg-white/60 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-xl shadow-slate-900/5 ring-1 ring-black/5">
              <LessonPlanForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                onFileChange={handleFileChange}
                selectedFiles={selectedFiles}
                onFileRemove={handleFileRemove}
                lang={lang}
              />
            </div>
            
            <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-900/5 ring-1 ring-black/5 sticky top-8">
              <div className="p-6 md:p-8 h-[85vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b border-gray-200 pb-3">{t.contentTitle}</h2>
                {isLoading && !generatedPlan && (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center">
                    <LoadingSpinner className="w-12 h-12 mb-4" />
                    <p className="text-lg font-medium animate-pulse">{generationStatus || t.waitingStatus}</p>
                    <p className="text-sm max-w-sm mx-auto mt-2">{t.waitingDesc}</p>
                  </div>
                )}
                {error && (
                  <div className="flex flex-col items-center justify-center h-full text-red-700 bg-red-100/50 p-4 rounded-lg border border-red-300/30">
                    <p className="font-semibold mb-2">{t.errorTitle}</p>
                    <p className="text-sm text-center">{error}</p>
                  </div>
                )}
                {!isLoading && !error && !generatedPlan && (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center space-y-3">
                    <ClipboardDocumentListIcon className="w-16 h-16 opacity-50 mb-2" />
                    <p className="text-lg font-medium text-slate-600">{t.emptyState}</p>
                    <p className="text-sm max-w-xs mx-auto">
                      {t.emptyStateDesc}
                    </p>
                  </div>
                )}

                {generatedPlan && (
                  <LessonPlanDisplay
                    plan={generatedPlan}
                    basicInfo={formData}
                    isLoading={isLoading}
                    isComplete={isGenerationComplete}
                    generationStatus={generationStatus}
                    lang={lang}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
    </div>
  );
};

export default App;

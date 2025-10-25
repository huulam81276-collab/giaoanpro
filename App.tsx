import React, { useState } from 'react';
import { LessonPlanForm } from './components/LessonPlanForm';
import { LessonPlanDisplay } from './components/LessonPlanDisplay';
import { ApiKeyForm } from './components/ApiKeyForm';
import { LoadingSpinner } from './components/icons/LoadingSpinner';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { ClipboardDocumentListIcon } from './components/icons/ClipboardDocumentListIcon';
import type { LessonPlanInput, GeneratedLessonPlan } from './types';
import { generateLessonPlanPart } from './services/geminiService';
import { deepMerge } from './utils/deepMerge';


const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
  
const getGenerationStatusMessage = (part: string, congVan: string): string => {
    if (congVan === '5512' || congVan === '958') {
        switch (part) {
            case 'initial': return "AI đang viết: Mục tiêu bài học...";
            case 'thietBi': return "AI đang viết: Thiết bị dạy học...";
            case 'giaoDucTichHop': return "AI đang viết: Nội dung giáo dục tích hợp...";
            case 'hoatDong1': return "AI đang viết: Hoạt động 1: Mở đầu...";
            case 'hoatDong2': return "AI đang viết: Hoạt động 2: Hình thành kiến thức...";
            case 'hoatDong3': return "AI đang viết: Hoạt động 3: Luyện tập...";
            case 'hoatDong4': return "AI đang viết: Hoạt động 4: Vận dụng...";
            default: return "AI đang soạn thảo...";
        }
    } else if (congVan === '1001') {
        switch (part) {
            case 'initial': return "AI đang viết: Yêu cầu cần đạt...";
            case 'doDungDayHoc': return "AI đang viết: Đồ dùng dạy học...";
            case 'hoatDongMoDau': return "AI đang viết: Hoạt động 1: Mở đầu...";
            case 'hoatDongHinhThanhKienThuc': return "AI đang viết: Hoạt động 2: Hình thành kiến thức...";
            case 'hoatDongLuyenTap': return "AI đang viết: Hoạt động 3: Luyện tập...";
            case 'hoatDongVanDung': return "AI đang viết: Hoạt động 4: Vận dụng...";
            case 'dieuChinhSauBaiDay': return "AI đang viết: Điều chỉnh sau bài dạy...";
            default: return "AI đang soạn thảo...";
        }
    } else { // 2345
        switch (part) {
            case 'initial': return "AI đang viết: Yêu cầu cần đạt...";
            case 'doDungDayHoc': return "AI đang viết: Đồ dùng dạy học...";
            case 'hoatDongMoDau': return "AI đang viết: Hoạt động 1: Mở đầu...";
            case 'hoatDongHinhThanhKienThuc': return "AI đang viết: Hoạt động 2: Hình thành kiến thức...";
            case 'hoatDongLuyenTap': return "AI đang viết: Hoạt động 3: Luyện tập...";
            case 'hoatDongVanDung': return "AI đang viết: Hoạt động 4: Vận dụng...";
            case 'dieuChinhSauBaiDay': return "AI đang viết: Điều chỉnh sau bài dạy...";
            default: return "AI đang soạn thảo...";
        }
    }
}

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(() => localStorage.getItem('user-gemini-api-key'));
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [formData, setFormData] = useState<LessonPlanInput>({
    teacherName: '',
    subject: '',
    grade: '',
    duration: { level: 'THCS', periods: '' },
    lessonTitle: '',
    congVan: '5512',
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedLessonPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] = useState<string | null>(null);
  const [isGenerationComplete, setIsGenerationComplete] = useState<boolean>(false);
  
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
        setGenerationStatus(getGenerationStatusMessage(partToGenerate, formData.congVan));
        try {
            const newPart = await generateLessonPlanPart(apiKey, formData, fileParts, currentPlan, partToGenerate);
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
                setApiKeyError("API Key không hợp lệ hoặc đã hết hạn. Vui lòng nhập lại.");
                handleClearKey();
                return; 
            }
            
            const friendlyPartName = getGenerationStatusMessage(partToGenerate, formData.congVan).replace('AI đang viết: ','').replace('...','');
            const errorMessage = (err instanceof Error) ? err.message : 'Đã xảy ra lỗi không xác định.';
            setError(`Lỗi khi đang tạo "${friendlyPartName}": ${errorMessage}`);
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
      setError("Vui lòng cung cấp API Key để tiếp tục.");
      return;
    }
    if (selectedFiles.length === 0) {
      setError('Vui lòng tải lên ít nhất một hình ảnh hoặc file PDF sách giáo khoa.');
      return;
    }

    setGeneratedPlan(null);
    setError(null);
    setIsGenerationComplete(false);
    setGenerationStatus("Đang chuẩn bị...");
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
        setError("Không thể xử lý tệp đã tải lên.");
        setIsLoading(false);
        setGenerationStatus(null);
    }
  };
  
  if (!apiKey) {
    return (
      <div className="min-h-screen main-bg flex items-center justify-center p-4">
        <ApiKeyForm onSave={handleSaveKey} initialError={apiKeyError} />
      </div>
    );
  }

  return (
    <div className="min-h-screen main-bg text-slate-800">
        <main className="container mx-auto px-4 py-8 md:py-12">
          <header className="text-center mb-8 relative">
             <button
                onClick={handleClearKey}
                className="absolute top-0 right-0 text-xs text-slate-500 hover:text-sky-600 bg-white/50 px-3 py-1.5 rounded-md shadow-sm ring-1 ring-black/5"
                title="Xóa API Key và nhập lại"
              >
                Đổi API Key
              </button>
            <div className="inline-block bg-white text-sky-500 p-2 rounded-xl mb-3 ring-1 ring-black/5 shadow-lg">
               <SparklesIcon className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              ỨNG DỤNG SOẠN KHBD
            </h1>
             <div className="mt-3">
              <span className="inline-block bg-gradient-to-r from-sky-500 to-cyan-500 text-white text-sm font-bold px-5 py-2 rounded-full shadow-lg transform hover:scale-105 transition-transform">
                Bản Pro
              </span>
            </div>
            <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
              Trợ lý AI đắc lực giúp bạn tạo giáo án chuyên nghiệp <br /> theo các mẫu của Bộ GD&ĐT (Công văn 5512, 2345) và các Sở GD&ĐT (Công văn 958 - Gia Lai, Công văn 1001).
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
              />
            </div>
            
            <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-900/5 ring-1 ring-black/5 sticky top-8">
              <div className="p-6 md:p-8 h-[85vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b border-gray-200 pb-3">Nội dung bài giảng</h2>
                {isLoading && !generatedPlan && (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center">
                    <LoadingSpinner className="w-12 h-12 mb-4" />
                    <p className="text-lg font-medium animate-pulse">{generationStatus || 'AI đang soạn bài, vui lòng chờ...'}</p>
                    <p className="text-sm max-w-sm mx-auto mt-2">AI đang phân tích và soạn giáo án hoàn chỉnh. Quá trình này có thể mất một chút thời gian.</p>
                  </div>
                )}
                {error && (
                  <div className="flex flex-col items-center justify-center h-full text-red-700 bg-red-100/50 p-4 rounded-lg border border-red-300/30">
                    <p className="font-semibold mb-2">Đã xảy ra lỗi</p>
                    <p className="text-sm text-center">{error}</p>
                  </div>
                )}
                {!isLoading && !error && !generatedPlan && (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center space-y-3">
                    <ClipboardDocumentListIcon className="w-20 h-20 text-slate-300" />
                    <p className="font-semibold text-lg text-slate-700">Giáo án của bạn sẽ xuất hiện ở đây.</p>
                    <p className="text-sm text-slate-500">Hãy điền thông tin và tải ảnh SGK để AI bắt đầu hành trình sáng tạo.</p>
                  </div>
                )}
                {generatedPlan && (
                  <LessonPlanDisplay 
                      plan={generatedPlan} 
                      basicInfo={formData} 
                      isLoading={isLoading}
                      isComplete={isGenerationComplete}
                      generationStatus={generationStatus}
                  />
                )}
              </div>
            </div>
          </div>
          <footer className="text-center mt-16 pt-8 border-t border-gray-200 text-slate-500 text-sm">
              <p className="font-semibold text-slate-700">Trung tâm Tin học ứng dụng Bal Digitech</p>
              <p className="mt-2">Cung cấp: Tài khoản Canva, ứng dụng hỗ trợ giáo viên.</p>
              <p>Đào tạo: Trí tuệ nhân tạo, E-learning, ứng dụng AI trong giáo dục.</p>
              <p className="mt-2">
                  Liên hệ đào tạo: <a href="tel:0972300864" className="text-sky-600 hover:underline font-medium">0972.300.864 - Thầy Giới</a>
              </p>
               <p className="mt-2 text-xs text-slate-400">
                  Ứng dụng được phát triển bởi Thầy Giới.
              </p>
          </footer>
        </main>
    </div>
  );
};

export default App;
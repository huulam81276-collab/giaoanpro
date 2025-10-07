
import React, { useState } from 'react';
import { LessonPlanForm } from './components/LessonPlanForm';
import { LessonPlanDisplay } from './components/LessonPlanDisplay';
import { ApiKeyForm } from './components/ApiKeyForm';
import { LoadingSpinner } from './components/icons/LoadingSpinner';
import { DocumentPlusIcon } from './components/icons/DocumentPlusIcon';
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
    if (congVan === '5512') {
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
    } else { // 2345
        switch (part) {
            case 'initial': return "AI đang viết: Yêu cầu cần đạt...";
            case 'doDungDayHoc': return "AI đang viết: Đồ dùng dạy học...";
            case 'giaoDucTichHop': return "AI đang viết: Nội dung giáo dục tích hợp...";
            case 'hoatDongDayHoc': return "AI đang viết: Các hoạt động dạy học...";
            case 'dieuChinhSauBaiDay': return "AI đang viết: Điều chỉnh sau bài dạy...";
            default: return "AI đang soạn thảo...";
        }
    }
}

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(() => localStorage.getItem('user-gemini-api-key'));
  const [formData, setFormData] = useState<LessonPlanInput>({
    teacherName: 'Nguyễn Văn A',
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
  
  const runAutomatedGeneration = async (sequence: string[], fileParts: any[], currentApiKey: string) => {
    let currentPlan: GeneratedLessonPlan | null = null;
    
    for (const partToGenerate of sequence) {
        setGenerationStatus(getGenerationStatusMessage(partToGenerate, formData.congVan));
        try {
            const newPart = await generateLessonPlanPart(currentApiKey, formData, fileParts, currentPlan, partToGenerate);
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
                setError("API Key không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại.");
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
      : ['initial', 'doDungDayHoc', 'giaoDucTichHop', 'hoatDongDayHoc', 'dieuChinhSauBaiDay'];
    
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
        await runAutomatedGeneration(sequence, parts, apiKey);
    } catch (err) {
        console.error(err);
        setError("Không thể xử lý tệp đã tải lên.");
        setIsLoading(false);
        setGenerationStatus(null);
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      {!apiKey ? (
        <div className="flex items-center justify-center min-h-screen p-4">
          <ApiKeyForm onSave={handleSaveKey} initialError={error} />
        </div>
      ) : (
        <main className="container mx-auto px-4 py-8 md:py-12">
          <header className="text-center mb-12 relative">
             <button
                onClick={handleClearKey}
                className="absolute top-0 right-0 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-semibold px-3 py-1 rounded-md transition-colors"
                title="Xóa API Key hiện tại và nhập key mới"
            >
                Đổi API Key
            </button>
            <div className="inline-block bg-slate-800 text-indigo-400 p-3 rounded-xl mb-4 ring-1 ring-white/10">
               <DocumentPlusIcon className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-100 tracking-tight">
              SOẠN KẾ HOẠCH BÀI DẠY
            </h1>
             <div className="mt-4">
              <span className="inline-block bg-red-600 text-white text-sm font-bold px-5 py-2 rounded-full shadow-lg transform hover:scale-105 transition-transform">
                Bản Pro
              </span>
            </div>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
              Tạo giáo án chuyên nghiệp theo Công văn 5512 và 2345 từ hình ảnh Sách giáo khoa.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-lg ring-1 ring-white/10">
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
            
            <div className="lg:col-span-3 bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-lg ring-1 ring-white/10 sticky top-8">
              <div className="p-6 md:p-8 h-[85vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-slate-100 mb-4 border-b border-slate-700 pb-3">Kết quả Giáo án</h2>
                {isLoading && !generatedPlan && (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center">
                    <LoadingSpinner className="w-12 h-12 mb-4" />
                    <p className="text-lg font-medium animate-pulse">{generationStatus || 'AI đang soạn bài, vui lòng chờ...'}</p>
                    <p className="text-sm max-w-sm mx-auto mt-2">AI đang phân tích và soạn giáo án hoàn chỉnh. Quá trình này có thể mất một chút thời gian.</p>
                  </div>
                )}
                {error && (
                  <div className="flex flex-col items-center justify-center h-full text-red-300 bg-red-900/50 p-4 rounded-lg border border-red-500/30">
                    <p className="font-semibold mb-2">Đã xảy ra lỗi</p>
                    <p className="text-sm text-center">{error}</p>
                  </div>
                )}
                {!isLoading && !error && !generatedPlan && (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center space-y-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2-2z" />
                    </svg>
                    <p className="font-semibold text-lg text-slate-300">Giáo án của bạn sẽ xuất hiện ở đây.</p>
                    <p className="text-sm">Hãy điền thông tin và tải ảnh SGK để AI bắt đầu soạn bài.</p>
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
          <footer className="text-center mt-16 pt-8 border-t border-slate-800 text-slate-400 text-sm">
              <p className="font-semibold text-slate-300">Trung tâm Tin học ứng dụng Bal Digitech</p>
              <p className="mt-2">Cung cấp: Tài khoản Canva, ứng dụng hỗ trợ giáo viên.</p>
              <p>Đào tạo: Trí tuệ nhân tạo, E-learning, ứng dụng AI trong giáo dục.</p>
              <p className="mt-2">
                  Liên hệ đào tạo: <a href="tel:0972300864" className="text-indigo-400 hover:underline font-medium">0972.300.864 - Thầy Giới</a>
              </p>
               <p className="mt-2 text-xs text-slate-500">
                  Ứng dụng được phát triển bởi Thầy Giới.
              </p>
          </footer>
        </main>
      )}
    </div>
  );
};

export default App;

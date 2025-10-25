





import React, { useState, useEffect } from 'react';
import type { LessonPlanInput } from '../types';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { SparklesIcon } from './icons/SparklesIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { ArrowUpTrayIcon } from './icons/ArrowUpTrayIcon';

interface LessonPlanFormProps {
  formData: LessonPlanInput;
  setFormData: React.Dispatch<React.SetStateAction<LessonPlanInput>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFiles: File[];
  onFileRemove: (index: number) => void;
}

export const LessonPlanForm: React.FC<LessonPlanFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  isLoading,
  onFileChange,
  selectedFiles,
  onFileRemove,
}) => {
  const [imagePreviewUrls, setImagePreviewUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const urlsToRevoke: string[] = [];
    const newUrls: Record<string, string> = {};

    selectedFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        newUrls[file.name] = url;
        urlsToRevoke.push(url);
      }
    });
    
    setImagePreviewUrls(newUrls);

    return () => {
      urlsToRevoke.forEach(url => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'level' || name === 'periods') {
      setFormData((prev) => ({
        ...prev,
        duration: { ...prev.duration, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const inputStyles = "w-full px-3 py-2 bg-white/50 text-slate-900 border-0 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm transition";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Thông tin bài giảng</h2>
      
      <div>
        <label htmlFor="teacherName" className="block text-sm font-medium text-slate-700 mb-1">
          Tên giáo viên
        </label>
        <input
          type="text"
          id="teacherName"
          name="teacherName"
          value={formData.teacherName}
          onChange={handleInputChange}
          placeholder="hãy điền họ tên của bạn"
          className={inputStyles}
          required
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">
          Môn học
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleInputChange}
          placeholder="AI tự xác định nếu trống"
          className={inputStyles}
        />
      </div>

      <div>
        <label htmlFor="grade" className="block text-sm font-medium text-slate-700 mb-1">
          Lớp
        </label>
        <input
          type="text"
          id="grade"
          name="grade"
          value={formData.grade}
          onChange={handleInputChange}
          placeholder="AI tự xác định nếu trống"
          className={inputStyles}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
            Thời gian thực hiện
        </label>
        <div className="grid grid-cols-2 gap-2">
            <select
                name="level"
                value={formData.duration.level}
                onChange={handleInputChange}
                className={inputStyles}
            >
                <option value="TieuHoc">Cấp Tiểu học (35 phút)</option>
                <option value="THCS">Cấp THCS (45 phút)</option>
                <option value="THPT">Cấp THPT (45 phút)</option>
            </select>
            <input
                type="number"
                name="periods"
                value={formData.duration.periods}
                onChange={handleInputChange}
                placeholder="Số tiết"
                min="1"
                className={inputStyles + " [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"}
            />
        </div>
        <p className="text-xs text-slate-500 mt-1">Để trống số tiết để AI tự đề xuất.</p>
    </div>
      
      <div>
        <label htmlFor="lessonTitle" className="block text-sm font-medium text-slate-700 mb-1">
          Tên bài dạy (tùy chọn)
        </label>
        <input
          type="text"
          id="lessonTitle"
          name="lessonTitle"
          value={formData.lessonTitle}
          onChange={handleInputChange}
          placeholder="AI sẽ tự xác định nếu để trống"
          className={inputStyles}
        />
      </div>

      <div>
          <label htmlFor="congVan" className="block text-sm font-medium text-slate-700 mb-1">
            Mẫu giáo án theo
          </label>
          <select
            id="congVan"
            name="congVan"
            value={formData.congVan}
            onChange={handleInputChange}
            className={inputStyles}
          >
            <option value="5512">Công văn 5512</option>
            <option value="2345">Công văn 2345</option>
            <option value="1001">Công văn 1001</option>
          </select>
        </div>


      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Tải lên hình ảnh hoặc PDF Sách giáo khoa
        </label>
        {selectedFiles.length > 0 ? (
          <div className="mt-2">
            <div className="grid grid-cols-3 gap-3">
               {selectedFiles.map((file, index) => (
                <div key={`${file.name}-${index}`} className="relative group aspect-square">
                  {file.type.startsWith('image/') ? (
                    <img src={imagePreviewUrls[file.name]} alt={`preview ${index}`} className="w-full h-full object-cover rounded-lg shadow-sm ring-1 ring-black/5" />
                   ) : (
                    <div className="w-full h-full bg-slate-200 rounded-lg flex flex-col items-center justify-center p-2 text-center ring-1 ring-black/5">
                        <DocumentTextIcon className="w-10 h-10 text-slate-500 mb-2 shrink-0"/>
                        <span className="text-xs text-slate-700 break-all line-clamp-2">{file.name}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => onFileRemove(index)}
                      className="text-white hover:text-red-400 transition-colors"
                      aria-label="Remove image"
                    >
                      <XCircleIcon className="w-8 h-8" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
             <label htmlFor="file-upload" className="relative mt-3 inline-flex items-center cursor-pointer rounded-md font-medium text-sky-600 hover:text-sky-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-100 focus-within:ring-sky-500">
                <span>Thêm tệp...</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*,application/pdf" onChange={onFileChange} />
              </label>
          </div>
        ) : (
          <div className="mt-2">
             <label htmlFor="file-upload" className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-slate-100/50 hover:bg-slate-200/60 transition-colors">
                 <div className="text-center">
                      <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-slate-400" />
                      <p className="mt-2 text-sm text-slate-500">
                        <span className="font-semibold text-sky-600">Nhấn để tải lên</span> hoặc kéo thả
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        PNG, JPG, PDF
                      </p>
                      <p className="mt-2 text-xs text-red-500 font-medium px-2">
                        Lưu ý: Chỉ tạo được nội dung 1 bài học, không soạn cả năm học.
                      </p>
                 </div>
                 <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*,application/pdf" onChange={onFileChange} />
             </label>
          </div>
        )}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-2 px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 focus:ring-sky-500 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <>
              <LoadingSpinner className="w-5 h-5" />
              <span className="animate-pulse">Đang tạo...</span>
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              Tạo Giáo án với AI
            </>
          )}
        </button>
      </div>
    </form>
  );
};
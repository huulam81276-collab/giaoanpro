import React, { useState } from 'react';
import { LoadingSpinner } from './icons/LoadingSpinner';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRVLSxqvWdU-U1mjqOClNqveAYe7m50qPNKw5FdFGS-HjTWsnU7W46mGn231fJfVpmG5DPW0jvrPv0U/pub?gid=0&single=true&output=csv';

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(CSV_URL);
      if (!response.ok) {
        throw new Error('Không thể kết nối đến cơ sở dữ liệu người dùng.');
      }
      const text = await response.text();
      
      // Phân tích CSV: Tách dòng bằng regex để xử lý cả \r\n và \n
      const rows = text.split(/\r?\n/);
      
      // Lọc bỏ các dòng trống
      const nonEmptyRows = rows.filter(row => row.trim().length > 0);
      
      // YÊU CẦU: Bắt đầu từ dòng số 2 (index 1), bỏ qua dòng tiêu đề (index 0)
      const dataRows = nonEmptyRows.slice(1);
      
      let isAuthenticated = false;

      for (const row of dataRows) {
        // Tách cột bằng dấu phẩy
        const parts = row.split(',');
        
        if (parts.length >= 2) {
          const csvEmail = parts[0].trim();
          const csvPassword = parts[1].trim();

          // So sánh Email (không phân biệt hoa thường) và Mật khẩu (chính xác)
          if (csvEmail.toLowerCase() === email.trim().toLowerCase() && csvPassword === password.trim()) {
            isAuthenticated = true;
            break;
          }
        }
      }

      if (isAuthenticated) {
        onLoginSuccess();
      } else {
        setError('Email hoặc mật khẩu không chính xác.');
      }

    } catch (err) {
      console.error(err);
      setError('Đã xảy ra lỗi khi kiểm tra thông tin đăng nhập.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-white/60 backdrop-blur-xl p-8 rounded-2xl shadow-xl shadow-slate-900/5 ring-1 ring-black/5">
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full bg-sky-100 text-sky-600 mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">
            Đăng nhập
          </h1>
          <p className="text-sm text-slate-500">
            Hệ thống soạn bài giảng tự động theo thông tư 5512, 2345, 958, 1001.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email đăng ký
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-white/50 text-slate-900 border-0 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm transition"
              placeholder="nhapemail@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-white/50 text-slate-900 border-0 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm transition"
              placeholder="******"
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded border border-red-100">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 focus:ring-sky-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <LoadingSpinner className="w-5 h-5" />
                <span>Đang xác thực...</span>
              </>
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>
         <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-slate-400">
            <p>Sản phẩm hỗ trợ giáo viên chuyển đổi số.</p>
       </div>
      </div>
    </div>
  );
};
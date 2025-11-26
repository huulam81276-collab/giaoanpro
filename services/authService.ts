
// Link CSV chứa danh sách tài khoản
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRVLSxqvWdU-U1mjqOClNqveAYe7m50qPNKw5FdFGS-HjTWsnU7W46mGn231fJfVpmG5DPW0jvrPv0U/pub?gid=0&single=true&output=csv';

// Luôn trả về true vì chế độ CSV đã được cấu hình sẵn URL
export const isConfigured = true;

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    email: string;
    token: string;
  };
}

export const authService = {
  /**
   * Xử lý đăng nhập bằng cách đọc file CSV
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await fetch(CSV_URL);
        if (!response.ok) {
            return { success: false, message: 'Không thể kết nối đến dữ liệu tài khoản.' };
        }
        
        const csvText = await response.text();
        
        // Tách dòng, xử lý cả \r\n và \n
        const rows = csvText.split(/\r?\n/);
        
        const cleanEmail = email.trim().toLowerCase();
        const cleanPassword = password.trim();

        // Bắt đầu quét từ dòng số 2 (index 1), bỏ qua dòng tiêu đề (index 0)
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row.trim()) continue; // Bỏ qua dòng trống

            // Tách cột bằng dấu phẩy
            const cols = row.split(',');
            
            // Giả sử cột A là Email (index 0), cột B là Password (index 1)
            if (cols.length >= 2) {
                const rowEmail = cols[0].trim().toLowerCase();
                const rowPass = cols[1].trim();

                if (rowEmail === cleanEmail && rowPass === cleanPassword) {
                    // Đăng nhập thành công
                    // Tạo một token giả lập để lưu vào localStorage
                    const mockToken = `csv-token-${Date.now()}-${Math.random()}`;
                    return { 
                        success: true, 
                        user: { 
                            email: cleanEmail, 
                            token: mockToken 
                        } 
                    };
                }
            }
        }

        return { success: false, message: 'Email hoặc mật khẩu không đúng.' };

    } catch (e) {
        console.error("Login Error", e);
        return { success: false, message: 'Lỗi khi xử lý dữ liệu đăng nhập.' };
    }
  },

  /**
   * Với CSV tĩnh, không thể kiểm tra phiên làm việc từ xa (đá tài khoản).
   * Luôn trả về true để duy trì phiên đăng nhập hiện tại.
   */
  checkSession: async (email: string, currentToken: string): Promise<boolean> => {
    return true;
  }
};


import React, { useEffect, useState } from 'react';

const NOTIFICATION_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRVLSxqvWdU-U1mjqOClNqveAYe7m50qPNKw5FdFGS-HjTWsnU7W46mGn231fJfVpmG5DPW0jvrPv0U/pub?gid=436682251&single=true&output=csv';

export const NotificationBanner: React.FC = () => {
  const [text, setText] = useState<string>('');

  useEffect(() => {
    fetch(NOTIFICATION_URL)
      .then((res) => res.text())
      .then((data) => {
        // Làm sạch dữ liệu CSV (loại bỏ dấu ngoặc kép bao quanh nếu có)
        let cleanText = data.trim();
        if (cleanText.startsWith('"') && cleanText.endsWith('"')) {
          cleanText = cleanText.substring(1, cleanText.length - 1);
        }
        // Thay thế 2 dấu ngoặc kép liền nhau thành 1 (quy tắc CSV)
        cleanText = cleanText.replace(/""/g, '"');
        setText(cleanText);
      })
      .catch((err) => console.error('Error fetching notification:', err));
  }, []);

  if (!text) return null;

  return (
    <div className="w-full bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg overflow-hidden mb-6 shadow-sm relative h-10 flex items-center">
      <div className="animate-marquee whitespace-nowrap absolute font-medium text-sm">
        <span className="mx-4">🔔</span>
        {text}
        <span className="mx-4">🔔</span>
      </div>
    </div>
  );
};

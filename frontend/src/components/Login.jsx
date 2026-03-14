import { useState } from 'react';
import { Lock, Loader2 } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!passcode.trim()) {
      setError('Vui lòng nhập mã truy cập');
      return;
    }

    setIsLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/verify-passcode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcode.trim() })
      });
      const data = await res.json();
      
      if (data.success) {
        onLoginSuccess();
      } else {
        setError('Mã truy cập không chính xác. Vui lòng thử lại!');
      }
    } catch (err) {
      console.error(err);
      setError('Lỗi kết nối máy chủ. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-100/50 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-100/50 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 max-w-[420px] w-full relative z-10 border border-gray-100">
        
        {/* Header stripe */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600"></div>

        <div className="text-center mb-8">
          <img 
            src="/logo.png" 
            alt="Logo THPT Lạng Giang 1" 
            className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 sm:mb-5 object-contain drop-shadow-sm hover:scale-105 transition-transform duration-500" 
          />
          <h1 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight mb-2">CodeMind 10</h1>
          <div className="w-full flex justify-center">
             <p className="text-[11px] sm:text-[13px] text-gray-500 italic font-medium leading-relaxed whitespace-nowrap">
               Gia sư Tin học AI - Độc quyền THPT Lạng Giang số 1
             </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
              <Lock size={18} />
            </div>
            <input 
              type="password" 
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Nhập mã truy cập..."
              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all shadow-sm"
              disabled={isLoading}
            />
          </div>
          
          {error && (
             <div className="mb-5 text-sm text-red-500 bg-red-50 p-3 rounded-xl text-center font-medium border border-red-100 animate-fade-in">
               {error}
             </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3.5 px-4 rounded-xl flex justify-center items-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              'Vào Phòng Học'
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center text-xs text-gray-400 font-medium">
          © {new Date().getFullYear()} Copyright by Giáo viên Trần Thị Ngà
        </div>
      </div>
    </div>
  );
}

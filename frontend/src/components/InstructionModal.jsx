import { X, BookOpen, MessageSquare, Code, Play, Bug } from 'lucide-react';

export default function InstructionModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-5 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen size={24} />
            Hướng dẫn dùng CodeMind 10
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            title="Đóng (Esc)"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6 text-gray-700">
          
          <div className="flex gap-4 items-start">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-xl shrink-0 mt-1">
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">1. Học cùng Gia sư AI</h3>
              <p className="text-sm leading-relaxed">
                Tại khung chat ở giữa, bạn có thể trò chuyện với <b>Gia sư CodeMind</b>. AI sẽ đóng vai trò như một người thầy dẫn dắt bạn từng bước giải quyết bài toán thay vì chỉ đưa ngay đáp án. Hãy chọn một <b>Lộ trình bài học</b> bên trái để AI định hướng kiến thức nhé.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="bg-green-100 text-green-600 p-3 rounded-xl shrink-0 mt-1">
              <Code size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">2. Viết Code và Chạy thử</h3>
              <p className="text-sm leading-relaxed mb-3">
                Khu vực bên phải là <b>Trình soạn thảo Python</b>. Code của bạn sẽ tự động được lưu lại cứ mỗi 1 giây nên không sợ mất bài.
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex gap-2 items-center">
                  <Play size={16} className="text-green-500 fill-current" /> 
                  <span>Bấm <b>Chạy thử</b> để xem kết quả xuất ra ở khung Console màu đen phía dưới.</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600 italic">
                  <span>* Hỗ trợ gõ lệnh <code className="bg-gray-100 px-1 py-0.5 rounded text-red-500">input()</code> (sẽ hiển thị khung pop-up hỏi thông tin trên màn hình).</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="bg-orange-100 text-orange-500 p-3 rounded-xl shrink-0 mt-1">
              <Bug size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">3. Tính năng Săn Bug (Gỡ lỗi)</h3>
              <p className="text-sm leading-relaxed">
                Nếu code chạy báo lỗi đỏ lòm ở Console, khoan hãy hoảng sợ! Bạn chỉ cần nhấn nút <b>Săn Bug (AI)</b> màu cam đỏ. Hệ thống sẽ tự động gắp toàn bộ code lỗi ném sang cho Gia sư AI phân tích và đưa ra chỉ dẫn để bạn bắt mạch sửa lỗi.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-primary-600 hover:bg-primary-500 text-white font-medium py-2.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Đã hiểu, quay lại học!
          </button>
        </div>

      </div>
    </div>
  );
}

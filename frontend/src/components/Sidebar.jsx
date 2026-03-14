import { Book, ChevronRight, PlayCircle } from 'lucide-react';

const LESSONS = [
  { id: 1, title: "Ngôn ngữ lập trình bậc cao và Python", desc: "Làm quen với Python, môi trường lập trình và cách Python hoạt động.", topic: "Mở đầu" },
  { id: 2, title: "Biến và lệnh gán", desc: "Cách lưu trữ dữ liệu trong bộ nhớ bằng biến.", topic: "Mở đầu" },
  { id: 3, title: "Các lệnh vào ra đơn giản", desc: "Sử dụng input() và print() để giao tiếp với người dùng.", topic: "Mở đầu" },
  { id: 4, title: "Câu lệnh rẽ nhánh if", desc: "Dạy máy tính cách ra quyết định điều kiện.", topic: "Cấu trúc rẽ nhánh" },
  { id: 5, title: "Câu lệnh lặp for", desc: "Lặp với số lần biết trước trong Python.", topic: "Cấu trúc lặp" },
  { id: 6, title: "Câu lệnh lặp while", desc: "Lặp theo điều kiện chưa biết trước số lần.", topic: "Cấu trúc lặp" },
  { id: 7, title: "Kiểu dữ liệu danh sách", desc: "Lưu trữ nhiều giá trị trong một biến List.", topic: "Kiểu dữ liệu cấu trúc" },
  { id: 8, title: "Một số lệnh làm việc với dữ liệu danh sách", desc: "Thêm, sửa, xóa, sắp xếp danh sách.", topic: "Kiểu dữ liệu cấu trúc" },
  { id: 9, title: "Xâu ký tự", desc: "Xử lý văn bản và chuỗi (String).", topic: "Kiểu dữ liệu cấu trúc" },
  { id: 10, title: "Một số lệnh làm việc với xâu ký tự", desc: "Các hàm cắt chuỗi, tìm kiếm chuỗi.", topic: "Kiểu dữ liệu cấu trúc" },
  { id: 11, title: "Hàm trong Python", desc: "Đóng gói mã để tái sử dụng (def).", topic: "Chương trình con" },
  { id: 12, title: "Tham số của hàm", desc: "Truyền dữ liệu vào và lấy kết quả ra từ hàm.", topic: "Chương trình con" },
  { id: 13, title: "Phạm vi của biến", desc: "Biến cục bộ và biến toàn cục.", topic: "Chương trình con" },
  { id: 14, title: "Nhận biết lỗi chương trình", desc: "Phân loại lỗi cú pháp, lỗi ngoại lệ, lỗi logic.", topic: "Kiểm thử và gỡ lỗi" },
  { id: 15, title: "Kiểm thử và gỡ lỗi chương trình", desc: "Kỹ năng trace lỗi và debug.", topic: "Kiểm thử và gỡ lỗi" },
  { id: 16, title: "Thực hành viết chương trình đơn giản", desc: "Vận dụng tổng hợp các kiến thức.", topic: "Thực hành" },
  { id: 17, title: "Ôn tập lập trình Python", desc: "Tổng kết lại chủ đề 5.", topic: "Thực hành" }
];

// Group summaries
const TOPIC_SUMMARIES = {
  "Mở đầu": "Làm quen với khái niệm lập trình và cú pháp cơ bản của Python.",
  "Cấu trúc rẽ nhánh": "Điều khiển luồng chương trình bằng các câu lệnh điều kiện.",
  "Cấu trúc lặp": "Tự động hóa các tác vụ lặp đi lặp lại.",
  "Kiểu dữ liệu cấu trúc": "Làm việc với List và String - thao tác nhiều dữ liệu cùng lúc.",
  "Chương trình con": "Đóng gói mã lệnh thành các Hàm (Def) để dễ quản lý.",
  "Thực hành": "Ôn tập và vận dụng tổng hợp để viết ứng dụng thực tế."
};

export default function Sidebar({ activeLesson, onSelectLesson, onOpenInstruction }) {
  
  // Group lessons by generic topic
  const groupedLessons = LESSONS.reduce((acc, lesson) => {
    if (!acc[lesson.topic]) acc[lesson.topic] = [];
    acc[lesson.topic].push(lesson);
    return acc;
  }, {});

  const handleContinue = () => {
    if (!activeLesson) {
      onSelectLesson(LESSONS[0]);
    } else {
      const currentIndex = LESSONS.findIndex(l => l.id === activeLesson.id);
      if (currentIndex < LESSONS.length - 1) {
        onSelectLesson(LESSONS[currentIndex + 1]);
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200 bg-primary-50 px-5">
        <h1 className="text-2xl font-black flex items-center gap-2 text-primary-800 tracking-tight">
          <Book className="text-primary-600" size={24} /> 
          CodeMind 10
        </h1>
        <p className="text-[11px] text-primary-600/80 mt-1 mb-1 italic leading-tight font-medium">Gia sư Tin học AI - Độc quyền THPT Lạng Giang số 1</p>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-5 scrollbar-thin">
        <div className="space-y-8">
          {Object.entries(groupedLessons).map(([topic, lessonsInTopic]) => (
            <div key={topic} className="space-y-3">
              <div className="ml-2 mb-2">
                <h3 className="text-[11px] font-extrabold text-primary-600 uppercase tracking-widest">{topic}</h3>
                <p className="text-xs text-gray-400 mt-0.5 max-w-[90%] leading-relaxed">{TOPIC_SUMMARIES[topic]}</p>
              </div>
              <ul className="space-y-1.5">
                {lessonsInTopic.map((lesson) => (
                  <li key={lesson.id} className="relative group">
                    <button
                      onClick={() => onSelectLesson(lesson)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-300 flex items-start gap-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 relative z-10
                        ${activeLesson?.id === lesson.id 
                          ? 'bg-gradient-to-r from-primary-100 to-white text-primary-700 border-l-4 border-primary-500 font-medium' 
                          : 'bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-white text-gray-700 border border-transparent hover:border-gray-200'
                        }
                      `}
                    >
                      <span className={`min-w-[45px] font-semibold mt-0.5 ${activeLesson?.id === lesson.id ? 'text-primary-600' : 'text-gray-400'}`}>
                        Bài {lesson.id}
                      </span>
                      <div className="flex-1 pr-2">
                        <span className={`block font-medium ${activeLesson?.id === lesson.id ? 'text-primary-700' : 'text-gray-700'}`}>
                          {lesson.title}
                        </span>
                        <span className={`block text-xs mt-0.5 line-clamp-2 leading-relaxed ${activeLesson?.id === lesson.id ? 'text-primary-600/80' : 'text-gray-400'}`}>
                          {lesson.desc}
                        </span>
                      </div>
                      <ChevronRight size={16} className={`mt-0.5 shrink-0 transition-transform ${activeLesson?.id === lesson.id ? 'text-primary-500 translate-x-1' : 'text-gray-300 group-hover:text-gray-400'}`} />
                    </button>
                    <div className="absolute left-[105%] top-1/2 -translate-y-1/2 w-64 bg-gray-800 text-white text-xs p-3 rounded-lg opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 z-50 shadow-xl hidden md:block">
                      <div className="font-bold mb-1">Mục tiêu bài học:</div>
                      <div className="text-gray-200 leading-relaxed">{lesson.desc}</div>
                      {/* Tooltip arrow */}
                      <div className="absolute top-1/2 -translate-y-1/2 -left-1 border-t-8 border-t-transparent border-r-8 border-r-gray-800 border-b-8 border-b-transparent w-0 h-0"></div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      
      {/* Nút Học tiếp cố định ở dưới cùng */}
      <div className="p-4 border-t border-gray-200 bg-white flex flex-col gap-3">
        {/* Nút Hướng dẫn */}
        <button 
          onClick={onOpenInstruction}
          className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2.5 px-4 rounded-xl flex justify-center items-center gap-2 transition-all border border-blue-200"
        >
          <Book className="w-5 h-5" />
          Hướng dẫn sử dụng
        </button>

        {/* Nút Chuyển Bài */}
        <button 
          onClick={handleContinue}
          className="w-full bg-primary-600 hover:bg-primary-500 text-white font-medium py-3 px-4 rounded-xl flex justify-center items-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          <PlayCircle size={20} />
          {activeLesson ? 'Chuyển bài tiếp theo' : 'Bắt đầu học ngay'}
        </button>
        <div className="text-center text-[10px] text-gray-400 font-medium">
          © Copyright by Giáo viên Trần Thị Ngà
        </div>
      </div>
    </div>
  );
}

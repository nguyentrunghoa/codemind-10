import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Loader2 } from 'lucide-react';

export default function Chatbot({ activeLesson, errorToAnalyze }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Initial greeting if no active lesson
  useEffect(() => {
    setMessages([{
      role: 'CodeMind',
      text: `Chào mừng bạn đến với **CodeMind 10**! 🚀 \n\nTôi là gia sư AI cá nhân của bạn, hãy chọn một bài học ở thanh bên trái (Lộ trình) để bắt đầu nhé!`
    }]);
  }, []);

  // Handle lesson change
  useEffect(() => {
    if (activeLesson) {
      setMessages([{
        role: 'CodeMind',
        text: `Chào bạn, chúng ta cùng tìm hiểu **Bài ${activeLesson.id}: ${activeLesson.title}** nhé! 📚\n\nBạn muốn làm gì tiếp theo?\n\n**[1]** Học bài mới\n**[2]** Ôn tập kiến thức cũ\n**[3]** Săn Bug (Sửa lỗi code đang làm)`
      }]);
    }
  }, [activeLesson]);

  // Handle Bug Hunter
  useEffect(() => {
    if (errorToAnalyze) {
      const userMsg = { role: 'user', text: `Hãy giúp tôi phân tích lỗi trong đoạn code sau:\n\n\`\`\`python\n${errorToAnalyze}\n\`\`\`` };
      setMessages(prev => [...prev, userMsg]);
      sendMessageApi([...messages, userMsg]);
    }
  }, [errorToAnalyze]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', text: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    
    await sendMessageApi(newMessages);
  };

  const sendMessageApi = async (chatHistory) => {
    setIsLoading(true);

    // Format for Gemini API (user/model)
    let formattedHistory = chatHistory.map(msg => ({
      role: msg.role === 'CodeMind' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    // Gemini API BẮT BUỘC tin nhắn đầu tiên trong mảng Lịch sử chat (history) phải xuất phát từ 'user'
    // Do tin nhắn chào sân của ứng dụng luôn là 'model' (CodeMind), API sẽ ném lỗi 400.
    // Cách xử lý khéo léo: Chèn tự động một câu chào giả từ 'user' lên đầu mảng để tạo đà (chỉ xử lý ngầm dưới API)
    if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
      formattedHistory = [
        { role: 'user', parts: [{ text: 'Xin chào gia sư CodeMind, hãy bắt đầu buổi học nào!' }] },
        ...formattedHistory
      ];
    }

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: formattedHistory })
      });

      const data = await res.json();
      
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'CodeMind', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'CodeMind', text: 'Xin lỗi, hệ thống AI đang bận. Bạn hãy thử lại sau nhé!' }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'CodeMind', text: 'Đã xảy ra lỗi kết nối với máy chủ AI. 🐛' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white shadow-sm z-10 sticky top-0 flex gap-2 items-center">
        <div className="bg-primary-100 text-primary-600 p-2 rounded-lg">
          <Bot size={24} />
        </div>
        <div>
          <h2 className="font-bold text-gray-800 text-lg">Gia sư CodeMind</h2>
          <p className="text-xs text-green-600 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Online
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 pb-[80px]"
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'CodeMind' && (
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0 mt-1">
                <Bot size={18} />
              </div>
            )}
            
            <div 
              className={`max-w-[85%] rounded-2xl p-4 shadow-sm prose prose-sm md:prose-base
                ${msg.role === 'user' 
                  ? 'bg-primary-600 text-white rounded-tr-none prose-invert' 
                  : 'bg-white border border-gray-100 text-gray-800 text-[15px] rounded-tl-none'}
              `}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center shrink-0 mt-1">
                <User size={18} />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mt-1 relative">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-20 animate-ping"></span>
              <Bot size={18} className="animate-pulse" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex flex-col justify-center h-[52px]">
              <div className="flex gap-1.5 items-center">
                <div className="w-2.5 h-2.5 bg-primary-400/80 rounded-full animate-bounce [animation-duration:1s] [animation-delay:-0.3s]"></div>
                <div className="w-2.5 h-2.5 bg-primary-500/80 rounded-full animate-bounce [animation-duration:1s] [animation-delay:-0.15s]"></div>
                <div className="w-2.5 h-2.5 bg-primary-600/80 rounded-full animate-bounce [animation-duration:1s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200 absolute bottom-0 left-0 right-0 z-10 w-full drop-shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <div className="flex bg-gray-50 rounded-xl border border-gray-200 p-1 focus-within:ring-2 focus-within:ring-primary-300 focus-within:border-primary-400 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhắn tin cho CodeMind..."
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none p-3 h-12 max-h-32 text-gray-700 outline-none text-sm md:text-base leading-relaxed scrollbar-thin"
            rows="1"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-primary-600 text-white rounded-lg px-4 h-12 hover:bg-primary-500 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all duration-300 flex items-center justify-center aspect-square md:aspect-auto self-end"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="text-center mt-2">
           <span className="text-xs text-gray-400">CodeMind có thể mắc lỗi nhỏ. Hãy chủ động kiểm tra lại.</span>
        </div>
      </div>
    </div>
  );
}

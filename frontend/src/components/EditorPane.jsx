import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Bug, Terminal, HandHeart, Paintbrush, Trash2 } from 'lucide-react';

export default function EditorPane({ onAnalyzeError }) {
  // 1. Auto Load / Save Code
  const [code, setCode] = useState(() => {
    return localStorage.getItem('code_mind_saved') || '# Viết code Python của bạn tại đây\n\ndef main():\n    print("Hello, Tin học 10!")\n\nif __name__ == "__main__":\n    main()\n';
  });
  
  const [output, setOutput] = useState('');
  const [isOutputError, setIsOutputError] = useState(false);
  const [theme, setTheme] = useState('vs-dark');

  // Auto-save effect
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('code_mind_saved', code);
    }, 1000);
    return () => clearTimeout(timer);
  }, [code]);

  const handleRunCode = async () => {
    if (!code.trim()) {
      setOutput('> Code rỗng. Vui lòng gõ một vài dòng lệnh Python nhé!');
      setIsOutputError(true);
      return;
    }

    setOutput('> Đang khởi tạo môi trường Python (lần đầu có thể mất 3-5 giây)...\n');
    setIsOutputError(false);

    try {
      if (!window.pyodideIsLoaded) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
        
        window.pyodide = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/'
        });
        
        await window.pyodide.runPythonAsync(`
import builtins
import js
import sys

class JsOutput:
    def write(self, text):
        js.appendOutput(text)
    def flush(self):
        pass

sys.stdout = JsOutput()
sys.stderr = JsOutput()

def custom_input(prompt_text=""):
    res = js.prompt(prompt_text)
    if res is None: 
        raise EOFError("Người dùng đã hủy nhập lệnh (User canceled input)")
    js.appendOutput(prompt_text + str(res) + "\\n")
    return res

builtins.input = custom_input
        `);
        window.pyodideIsLoaded = true;
      }

      // Chuẩn bị thực thi
      let currentOutput = "> Đang thực thi lệnh...\n\n";
      setOutput(currentOutput);
      
      window.appendOutput = (text) => {
        currentOutput += text;
        setOutput(currentOutput);
      };

      await window.pyodide.runPythonAsync(code);
      
      currentOutput += '\n\n✅ Chương trình chạy thành công (Exit Code 0).';
      setOutput(currentOutput);
      setIsOutputError(false);
    } catch (err) {
      console.error(err);
      let errorMsg = err.message || String(err);
      if (window.appendOutput) {
         window.appendOutput('\n\n❌ Lỗi thực thi:\n' + errorMsg);
      } else {
         setOutput(prev => prev + '\n\n❌ Lỗi thực thi:\n' + errorMsg);
      }
      setIsOutputError(true);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'vs-dark' ? 'light' : 'vs-dark');
  };

  const handleBugHunt = () => {
    if (!code.trim()) return;
    onAnalyzeError(code);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] relative">
      
      {/* Auto-save Toast indicator */}
      <div className="absolute top-16 right-4 z-20 pointer-events-none opacity-50 flex items-center gap-1 text-xs text-gray-400">
        Đã lưu tự động <HandHeart size={12} />
      </div>

      {/* Editor Header */}
      <div className="px-4 py-3 bg-[#252526] border-b border-[#3c3c3c] flex items-center justify-between z-10 select-none">
        
        <div className="text-gray-300 font-mono text-sm flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 cursor-pointer transition-colors"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 cursor-pointer transition-colors"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 cursor-pointer transition-colors"></div>
          </div>
          <span className="bg-[#1e1e1e] py-1 px-3 rounded-t-md border-b-[2px] border-primary-500 text-primary-400 text-xs">main.py</span>
        </div>

        <div className="flex gap-3">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg text-gray-300 text-sm font-medium transition-all duration-300 group relative"
          >
            <Paintbrush size={16} />
            {/* Tooltip */}
            <div className="absolute top-10 right-0 w-32 p-2 bg-gray-900 border border-gray-700 text-xs text-center text-gray-200 rounded-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none origin-top-right z-50 shadow-xl">
              Đổi giao diện Editor
            </div>
          </button>
          <button 
            onClick={handleRunCode}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 hover:shadow-[0_0_15px_rgba(74,222,128,0.2)] px-4 py-1.5 rounded-lg text-white text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
          >
            <Play size={16} className="text-green-400" />
            <span className="hidden md:inline">Chạy thử</span>
          </button>
          
          <button 
            onClick={handleBugHunt}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 px-4 py-1.5 rounded-lg text-white text-sm font-medium transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:-translate-y-0.5 group relative"
          >
            <Bug size={16} className="animate-pulse" />
            <span className="hidden md:inline">Săn Bug (AI)</span>
            
            {/* Tooltip */}
            <div className="absolute top-10 right-0 w-48 p-2 bg-gray-800 text-xs text-gray-200 rounded opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none origin-top-right z-50">
              Nhờ CodeMind AI kiểm tra các lỗi logic, cú pháp trong đoạn code này.
            </div>
          </button>
        </div>
      </div>

      {/* Editor Main Content */}
      <div className="flex-1 relative border-b border-[#3c3c3c]">
        <Editor
          height="100%"
          defaultLanguage="python"
          theme={theme}
          value={code}
          onChange={(val) => setCode(val)}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            padding: { top: 16 },
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            bracketPairColorization: { enabled: true },
          }}
        />
      </div>

      {/* Terminal / Output Console with Enhanced Syntax Highlighting Logic */}
      <div className="h-1/3 min-h-[150px] max-h-[50%] bg-[#1e1e1e] flex flex-col shadow-inner relative">
        <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-[#3c3c3c] shadow-sm select-none z-10 w-full shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-400 font-mono tracking-wider uppercase">
            <Terminal size={14} className="text-gray-500" />
            <span>Console Output</span>
          </div>
          
          <button 
            onClick={() => { setOutput(''); setIsOutputError(false); }}
            title="Xóa lịch sử Output"
            className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 transition-colors bg-gray-800 hover:bg-gray-700 px-2.5 py-1 rounded text-xs font-mono lowercase"
          >
            <Trash2 size={13} /> Clear
          </button>
        </div>
        <div className="flex-1 p-4 font-mono text-sm overflow-y-auto bg-[#141414] scrollbar-thin scrollbar-thumb-gray-600">
          {!output ? (
            <span className="text-gray-600/70 italic text-[13px]">Chưa có kết quả chạy chương trình... Ấn "Chạy thử" để xem console.</span>
          ) : (
            <div className="whitespace-pre-wrap leading-relaxed">
              {output.split('\n').map((line, idx) => {
                let lineColor = 'text-green-400';
                if (line.startsWith('>')) lineColor = 'text-blue-400';
                else if (line.includes('❌') || line.includes('Error:') || isOutputError) lineColor = 'text-red-400';
                else if (line.includes('✅')) lineColor = 'text-emerald-400 font-bold';
                else if (line.match(/^[0-9]+$/)) lineColor = 'text-yellow-400';

                return (
                  <span key={idx} className={`block ${lineColor}`}>
                    {line}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

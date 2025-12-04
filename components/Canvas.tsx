import React from 'react';
import { GenMode } from '../types';
import { ArrowLeft, Sparkles, Bot } from 'lucide-react';

interface CanvasProps {
  mode: GenMode;
  onBack: () => void;
}

const Canvas: React.FC<CanvasProps> = ({ mode, onBack }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
       {/* Toolbar */}
      <div className="h-16 border-b border-slate-700 flex items-center px-6 gap-4 bg-slate-800">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2 text-sm text-slate-300"
        >
          <ArrowLeft size={18} />
          返回首页
        </button>
        <div className="h-6 w-[1px] bg-slate-600"></div>
        <div className="flex items-center gap-2 font-semibold">
           {mode === 'native' ? <Sparkles size={20} className="text-purple-400"/> : <Bot size={20} className="text-blue-400"/>}
           <span>{mode === 'native' ? '原生大模型生图模式' : 'Agent 智能生图模式'}</span>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800/50 to-slate-950"></div>
        
        <div className="text-center z-10 max-w-lg px-6">
           <h2 className="text-3xl font-bold mb-4">画板页面</h2>
           <p className="text-slate-400 mb-8">
             您已进入 
             <span className={`mx-2 font-bold ${mode === 'native' ? 'text-purple-400' : 'text-blue-400'}`}>
               {mode === 'native' ? '原生' : 'Agent'}
             </span>
             生图模式。在这里，我们可以专注于创作，而不需要在首页进行多余的设置。
           </p>
           
           <div className="p-8 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-800/50">
             <p className="text-sm text-slate-500">Canvas Workspace Area</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
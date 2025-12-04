
import React, { useState, useEffect } from 'react';
import { User, FileSystemItem, GenMode } from '../types';
import FileExplorer from './FileExplorer';
import { Sparkles, Bot, LayoutTemplate, ShoppingBag, Bell, Moon, Eraser, Expand, ScanSearch, PenTool, ChevronLeft, ChevronRight } from 'lucide-react';
import { INITIAL_FILES } from '../constants';
import { FEATURE_IMAGES } from '../images';

interface HomeProps {
  user: User;
  onNavigateToCanvas: (mode: GenMode) => void;
}

const Home: React.FC<HomeProps> = ({ user, onNavigateToCanvas }) => {
  const [files, setFiles] = useState<FileSystemItem[]>(INITIAL_FILES);
  
  // Carousel State
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  // Responsive items per page calculation
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else if (window.innerWidth < 1280) setItemsPerPage(3);
      else setItemsPerPage(4);
    };
    
    // Initial call
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset page if items per page changes to avoid empty views
  useEffect(() => {
    setCurrentPage(0);
  }, [itemsPerPage]);

  const features = [
    {
      id: 'native',
      title: '原生大模型',
      desc: '自由创作无限可能',
      icon: <Sparkles size={24} />,
      gradient: 'from-violet-600 to-indigo-600',
      image: FEATURE_IMAGES.native,
      action: () => onNavigateToCanvas('native'),
    },
    {
      id: 'agent',
      title: 'Agent生图',
      desc: '复杂场景智能调优',
      icon: <Bot size={24} />,
      gradient: 'from-blue-600 to-cyan-600',
      image: FEATURE_IMAGES.agent,
      action: () => onNavigateToCanvas('agent'),
    },
    {
      id: 'detail',
      title: '商详页生成',
      desc: '电商转化率神器',
      icon: <LayoutTemplate size={24} />,
      gradient: 'from-emerald-500 to-teal-600',
      image: FEATURE_IMAGES.detail,
      action: () => alert('此功能开发中...'),
    },
    {
      id: 'buyer',
      title: '虚拟买家秀',
      desc: '还原真实穿戴效果',
      icon: <ShoppingBag size={24} />,
      gradient: 'from-orange-500 to-rose-600',
      image: FEATURE_IMAGES.buyer,
      action: () => alert('此功能开发中...'),
    },
    {
      id: 'expand',
      title: '智能扩图',
      desc: '突破边界构图自由',
      icon: <Expand size={24} />,
      gradient: 'from-fuchsia-500 to-purple-600',
      image: FEATURE_IMAGES.expand,
      action: () => alert('此功能开发中...'),
    },
    {
      id: 'remove',
      title: '魔法消除',
      desc: '一键去除多余杂物',
      icon: <Eraser size={24} />,
      gradient: 'from-red-500 to-orange-500',
      image: FEATURE_IMAGES.remove,
      action: () => alert('此功能开发中...'),
    },
    {
      id: 'upscale',
      title: '超清放大',
      desc: '4K画质细节重塑',
      icon: <ScanSearch size={24} />,
      gradient: 'from-amber-500 to-yellow-500',
      image: FEATURE_IMAGES.upscale,
      action: () => alert('此功能开发中...'),
    },
    {
      id: 'vector',
      title: '矢量化转换',
      desc: '位图转SVG无损设计',
      icon: <PenTool size={24} />,
      gradient: 'from-slate-700 to-slate-900',
      image: FEATURE_IMAGES.vector,
      action: () => alert('此功能开发中...'),
    },
  ];

  const totalPages = Math.ceil(features.length / itemsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 overflow-x-hidden">
      {/* 1. Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-end gap-4">
           {/* Right side controls */}
           <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
             <Moon size={20} />
           </button>
           <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors relative">
             <Bell size={20} />
             <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
           </button>
           <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
              <img src={user.avatarUrl} alt={user.name} />
           </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 pt-10">
        {/* 2. Personalized Greeting */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-2">
            你好，<span className="text-primary">{user.name}</span> ！
          </h1>
          <p className="text-slate-500 text-lg">
            准备好将你的想法变成艺术了吗？
          </p>
        </div>

        {/* 3. Carousel Feature Cards */}
        <section className="mb-12 animate-fade-in relative group/section" style={{ animationDelay: '0.1s' }}>
          
          <div className="relative overflow-hidden -mx-3 p-3"> {/* Negative margin to compensate for card padding */}
            <div 
              className="flex transition-transform duration-500 ease-out will-change-transform"
              style={{ transform: `translateX(-${currentPage * 100}%)` }}
            >
              {features.map((feature) => (
                <div 
                  key={feature.id}
                  className="flex-shrink-0"
                  style={{ width: `${100 / itemsPerPage}%` }}
                >
                  <div 
                    onClick={feature.action}
                    className="mx-3 h-[360px] rounded-[2rem] relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 select-none"
                  >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} transition-transform duration-700 group-hover:scale-110`}></div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
                    <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>

                    {/* Main Image in the Box Area */}
                    <div className="absolute inset-x-4 top-20 bottom-24 rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-500 group-hover:scale-[1.02] group-hover:-translate-y-1 bg-black/20">
                       <img 
                        src={feature.image} 
                        alt={feature.title} 
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                        loading="lazy"
                      />
                       {/* Inner shine */}
                       <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-between p-6 z-20 pointer-events-none">
                      
                      {/* Icon Box */}
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 shadow-lg group-hover:scale-110 transition-transform duration-300">
                         {feature.icon}
                      </div>

                      {/* Text */}
                      <div className="transform transition-transform duration-300 group-hover:translate-x-1 translate-y-2 group-hover:translate-y-0">
                        <h3 className="text-2xl font-bold text-white mb-1 leading-tight shadow-black drop-shadow-md">
                          {feature.title}
                        </h3>
                        <div className="h-0.5 w-6 bg-white/70 mb-2 rounded-full group-hover:w-12 transition-all"></div>
                        <p className="text-white/90 text-sm font-medium leading-relaxed drop-shadow-md">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                    
                    {/* Global Shine effect animation */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -translate-x-full group-hover:translate-x-full pointer-events-none z-30"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Indicators (Dots) */}
          <div className="flex justify-center items-center mt-6 gap-3">
             {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    currentPage === idx 
                      ? 'w-8 h-2.5 bg-primary' 
                      : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to page ${idx + 1}`}
                />
             ))}
          </div>

        </section>

        {/* 4. Windows-style Project Folder System */}
        <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <FileExplorer items={files} setItems={setFiles} />
        </section>

      </main>
    </div>
  );
};

export default Home;

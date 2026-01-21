'use client'

import { Cpu, LayoutDashboard, Briefcase, FileText, Settings, Bell, Sparkles } from 'lucide-react'

export function NavBar() {


    function onNavigate(arg0: string): void {
        throw new Error('Function not implemented.');
    }

    return (

      <nav className="sticky top-0 z-30 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="w-8 h-8 bg-linear-to-tr from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Cpu size={18} />
            </div>
            <span>Resu<span className="text-violet-400">M8</span></span>
          </div>

          {/* Navigation Links - Centered */}
          <div className="hidden md:flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800/50">
            <button className="flex items-center gap-2 px-4 py-1.5 bg-slate-800 text-white rounded-md text-sm font-medium shadow-sm transition-all">
              <LayoutDashboard size={16} className="text-violet-400" /> Dashboard
            </button>
            <button className="flex items-center gap-2 px-4 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md text-sm font-medium transition-colors">
              <Briefcase size={16} /> Job Tracker
            </button>
            <button className="flex items-center gap-2 px-4 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md text-sm font-medium transition-colors">
              <FileText size={16} /> My Resumes
            </button>
            <button className="flex items-center gap-2 px-4 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md text-sm font-medium transition-colors">
              <Settings size={16} /> Settings
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
             <button className="text-slate-400 hover:text-white relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-950"></span>
             </button>
            
            <div className="h-6 w-px bg-slate-800 mx-2 hidden sm:block"></div>

            <button className="hidden sm:flex bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium items-center gap-2 transition-colors shadow-lg shadow-violet-900/20">
               <Sparkles size={16} /> New Resume
            </button>

            <div className="flex items-center gap-3 pl-2 cursor-pointer hover:opacity-80 transition-opacity">
               <div className="w-9 h-9 rounded-full bg-linear-to-br from-purple-500 to-blue-500 ring-2 ring-slate-800"></div>
               <div className="hidden lg:block overflow-hidden text-left">
                 <p className="text-sm font-medium text-white truncate leading-none mb-1">Alex Dev</p>
                 <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider leading-none">Pro Plan</p>
               </div>
            </div>
          </div>
        </div>
      </nav>


    );
}
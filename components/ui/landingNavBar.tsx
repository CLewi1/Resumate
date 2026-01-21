import { Cpu } from "lucide-react";

interface LandingNavBarProps {
  onOpenLogin: () => void;
}

export default function LandingNavBar({ onOpenLogin }: LandingNavBarProps) {
    

    return (
        <>
      <nav className="sticky top-0 w-full z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-linear-to-tr from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Cpu size={18} />
            </div>
            <span>Resu<span className="text-violet-400">M8</span></span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onOpenLogin} className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block">
              Log In
            </button>
            <button 
              onClick={onOpenLogin}
              className="bg-white text-slate-950 px-5 py-2 rounded-full text-sm font-semibold hover:bg-slate-200 transition-colors"
            >
              Join Beta
            </button>
          </div>
        </div>
      </nav>
      </>
    );
}
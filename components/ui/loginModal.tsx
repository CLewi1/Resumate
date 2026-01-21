import { X, Github, User } from "lucide-react";

interface LoginModalProps {
    isOpen : boolean;
    onClose: () => void;
    onLogin: () => void;
}

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <div 
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-8 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Decorative gradient blob */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"></div>

                <button 
                onClick={onClose} 
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                <X size={20} />
                </button>
                
                <div className="text-center mb-8 relative z-10">
                <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-violet-500/20 text-violet-400">
                    <User size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-slate-400 text-sm">Sign in to sync your resumes and track job applications.</p>
                </div>

                <div className="space-y-3 relative z-10">
                <button 
                    onClick={onLogin}
                    className="w-full bg-[#24292F] hover:bg-[#2c3238] border border-slate-700 text-white p-3.5 rounded-xl flex items-center justify-center gap-3 transition-all font-medium group"
                >
                    <Github size={20} className="group-hover:scale-110 transition-transform" />
                    Continue with GitHub
                </button>
                <button 
                    onClick={onLogin}
                    className="w-full bg-white text-slate-900 hover:bg-slate-100 p-3.5 rounded-xl flex items-center justify-center gap-3 font-semibold transition-colors"
                >
                    <div className="w-5 h-5 rounded-full bg-linear-to-tr from-blue-500 to-red-500 flex items-center justify-center text-[10px] text-white font-bold">G</div>
                    Continue with Google
                </button>
                </div>
                
                <div className="mt-8 text-center text-xs text-slate-500">
                By continuing, you agree to our <span className="underline cursor-pointer hover:text-violet-400">Terms</span> and <span className="underline cursor-pointer hover:text-violet-400">Privacy Policy</span>.
                </div>
            </div>
        </div> 

    );

}
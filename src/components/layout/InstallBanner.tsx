import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { getInstallPrompt, clearInstallPrompt } from '@/sw-register';

export default function InstallBanner() {
  const [visible, setVisible] = useState(false);
  const [prompt, setPrompt] = useState(getInstallPrompt());

  useEffect(() => {
    const check = () => {
      const p = getInstallPrompt();
      setPrompt(p);
      setVisible(!!p && !window.matchMedia('(display-mode: standalone)').matches);
    };
    check();
    const interval = setInterval(check, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const choice = await prompt.userChoice;
    if (choice.outcome === 'accepted') {
      setVisible(false);
    }
    clearInstallPrompt();
    setPrompt(null);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-4 right-4 z-40 animate-fade-up">
      <div className="glass rounded-2xl shadow-xl p-3 flex items-center gap-3 max-w-xs">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white shrink-0">
          <Download size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold">ثبّت Life OS</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">أضف التطبيق لشاشتك الرئيسية</p>
        </div>
        <button
          onClick={handleInstall}
          className="px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition shrink-0"
        >
          تثبيت
        </button>
        <button
          onClick={() => setVisible(false)}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

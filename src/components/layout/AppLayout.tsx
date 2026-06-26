import type { ReactNode } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Video } from 'lucide-react';
import { motion } from 'motion/react';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { resolved, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolved === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-canvas-soft text-ink font-sans flex flex-col">
      <header className="sticky top-0 z-30 bg-canvas/80 backdrop-blur-md border-b border-hairline px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-primary text-on-primary flex items-center justify-center">
            <Video className="size-4" />
          </div>
          <span className="text-base font-semibold tracking-tight">ClipWise</span>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="size-8 flex items-center justify-center rounded-full text-body hover:text-ink hover:bg-canvas-soft-2 border border-hairline transition-all duration-200 cursor-pointer"
          title={`Switch to ${resolved === 'dark' ? 'light' : 'dark'} mode`}
        >
          {resolved === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex-1 max-w-5xl mx-auto w-full px-6 py-12"
      >
        {children}
      </motion.main>

      <footer className="border-t border-hairline px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-mute">
          <p>&copy; {new Date().getFullYear()} ClipWise</p>
          <p>AI-powered YouTube summaries</p>
        </div>
      </footer>
    </div>
  );
}

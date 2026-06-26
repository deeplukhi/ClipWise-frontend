import { FileText, ListChecks, Target, Clock, Lightbulb, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export type FormatType = 'summary' | 'keyPoints' | 'motivational' | 'timestamps' | 'insight';

interface FormatSelectorProps {
  selected: FormatType;
  onChange: (format: FormatType) => void;
  loadingFormats?: Set<string>;
}

const FORMATS: { key: FormatType; label: string; icon: typeof FileText }[] = [
  { key: 'summary', label: 'Summary', icon: FileText },
  { key: 'keyPoints', label: 'Key Points', icon: ListChecks },
  { key: 'motivational', label: 'Motivational', icon: Target },
  { key: 'timestamps', label: 'Timeline', icon: Clock },
  { key: 'insight', label: 'Insights', icon: Lightbulb },
];

export function FormatSelector({ selected, onChange, loadingFormats }: FormatSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-wrap gap-2 mb-8 justify-center"
    >
      {FORMATS.map(({ key, label, icon: Icon }) => {
        const loading = loadingFormats?.has(key);
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            disabled={loading}
            className={`relative inline-flex items-center gap-1.5 px-4 h-8 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer border ${
              selected === key
                ? 'bg-primary text-on-primary border-transparent'
                : 'bg-canvas text-body border-hairline hover:text-ink hover:border-hairline-strong'
            } ${loading ? 'opacity-60 cursor-wait' : ''}`}
          >
            {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Icon className="size-3.5" />}
            {label}
          </button>
        );
      })}
    </motion.div>
  );
}

import { Clock, ExternalLink, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import type { Summary } from '@/services/summarize.service';

interface HistoryListProps {
  summaries: Summary[];
  onSelect: (id: string) => void;
  selectedId?: string;
  onDelete?: (id: string) => void;
}

export function HistoryList({ summaries, onSelect, selectedId, onDelete }: HistoryListProps) {
  if (!summaries.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="w-full max-w-2xl mx-auto mt-16"
    >
      <h3 className="text-xs font-mono text-body uppercase tracking-wider mb-4 flex items-center gap-2">
        <Clock className="size-3.5" />
        Recent Summaries
      </h3>
      <div className="flex flex-col gap-1.5">
        {summaries.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 + i * 0.05, ease: 'easeOut' }}
            className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 ${
              selectedId === s.id
                ? 'bg-canvas border-hairline-strong shadow-level-1'
                : 'bg-canvas border-hairline hover:border-hairline-strong hover:shadow-level-1'
            }`}
          >
            <button onClick={() => onSelect(s.id)} className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">
              <ExternalLink className="size-3.5 text-mute shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ink truncate">{s.videoTitle || s.youtubeUrl}</p>
                <p className="text-xs text-mute mt-0.5">
                  {new Date(s.createdAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>
            </button>
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(s.id); }}
                className="size-7 shrink-0 flex items-center justify-center rounded-md text-mute hover:text-error hover:bg-error/10 cursor-pointer transition-colors"
                title="Delete"
              >
                <Trash2 className="size-3.5" />
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

import { motion } from 'motion/react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface JobProgressProps {
  progress: number;
  step: string;
  status: 'processing' | 'completed' | 'failed';
  error?: string;
}

export function JobProgress({ progress, step, status, error }: JobProgressProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-xl mx-auto my-8"
    >
      <div className="bg-canvas border border-hairline rounded-lg shadow-level-1 p-5">
        <div className="flex items-center gap-3 mb-3">
          {status === 'processing' && <Loader2 className="size-5 text-accent animate-spin" />}
          {status === 'completed' && <CheckCircle className="size-5 text-success" />}
          {status === 'failed' && <XCircle className="size-5 text-error" />}
          <div>
            <p className="text-sm font-medium text-ink">
              {status === 'processing' && 'Summarizing your video...'}
              {status === 'completed' && 'Done!'}
              {status === 'failed' && 'Something went wrong'}
            </p>
            {status === 'processing' && (
              <p className="text-xs text-mute mt-0.5">{step}</p>
            )}
            {status === 'failed' && error && (
              <p className="text-xs text-error mt-0.5">{error}</p>
            )}
          </div>
        </div>

        {status === 'processing' && (
          <div className="w-full h-1.5 bg-canvas-soft-2 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

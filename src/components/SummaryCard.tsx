import { Copy, Check, Loader2, Download, Share2, Link, FileDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { summarizeService } from '@/services/summarize.service';
import type { Summary } from '@/services/summarize.service';
import type { FormatType } from './FormatSelector';

interface SummaryCardProps {
  data: Summary;
  format: FormatType;
  loading?: boolean;
}

const FORMAT_LABELS: Record<FormatType, string> = {
  summary: 'Summary',
  keyPoints: 'Key Points',
  motivational: 'Motivational',
  timestamps: 'Timeline',
  insight: 'Insights',
};

function formatContent(data: Summary, format: FormatType): string {
  const content = data[format];
  if (!content) return 'Not available for this format.';
  return content;
}

export function SummaryCard({ data, format, loading }: SummaryCardProps) {
  const [copied, setCopied] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const content = formatContent(data, format);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = async (type: 'pdf' | 'md') => {
    try {
      const blob = await (type === 'pdf'
        ? summarizeService.exportPdf(data.id)
        : summarizeService.exportMd(data.id));
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `clipwise-${data.id}.${type}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`${type.toUpperCase()} downloaded`);
    } catch {
      toast.error('Failed to export');
    }
  };

  const handleShare = async () => {
    setShareLoading(true);
    try {
      const res = await summarizeService.createShare(data.id);
      if (res.data?.url) {
        await navigator.clipboard.writeText(res.data.url);
        toast.success('Share link copied to clipboard');
      }
    } catch {
      toast.error('Failed to create share link');
    } finally {
      setShareLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto"
    >
      {data.videoTitle && (
        <p className="text-sm text-body font-mono uppercase tracking-wider mb-4 truncate">
          {data.videoTitle}
        </p>
      )}

      <div className="bg-canvas border border-hairline rounded-lg shadow-level-1 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-hairline">
          <h3 className="text-sm font-medium text-ink">{FORMAT_LABELS[format]}</h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleExport('md')}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-2.5 h-7 rounded-sm text-xs font-medium text-body hover:text-ink hover:bg-canvas-soft-2 transition-all duration-200 cursor-pointer disabled:opacity-50"
              title="Download Markdown"
            >
              <FileDown className="size-3" />
              MD
            </button>
            <button
              onClick={() => handleExport('pdf')}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-2.5 h-7 rounded-sm text-xs font-medium text-body hover:text-ink hover:bg-canvas-soft-2 transition-all duration-200 cursor-pointer disabled:opacity-50"
              title="Download PDF"
            >
              <Download className="size-3" />
              PDF
            </button>
            <button
              onClick={handleShare}
              disabled={loading || shareLoading}
              className="inline-flex items-center gap-1.5 px-2.5 h-7 rounded-sm text-xs font-medium text-body hover:text-ink hover:bg-canvas-soft-2 transition-all duration-200 cursor-pointer disabled:opacity-50"
              title="Create share link"
            >
              {shareLoading ? <Loader2 className="size-3 animate-spin" /> : <Share2 className="size-3" />}
              Share
            </button>
            <button
              onClick={handleCopy}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-2.5 h-7 rounded-sm text-xs font-medium text-body hover:text-ink hover:bg-canvas-soft-2 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {copied ? <Check className="size-3 text-success" /> : <Copy className="size-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
        <div className="p-5">
          {loading ? (
            <div className="flex items-center gap-3 py-8 text-body">
              <Loader2 className="size-4 animate-spin" />
              <span className="text-sm">Generating {FORMAT_LABELS[format].toLowerCase()}...</span>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.p
                key={content}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="text-sm text-body leading-relaxed whitespace-pre-wrap"
              >
                {content}
              </motion.p>
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
}

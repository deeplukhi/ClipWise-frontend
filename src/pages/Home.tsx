import { useState, useEffect, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { InputBar } from '@/components/InputBar';
import { SearchBar } from '@/components/SearchBar';
import { FormatSelector, type FormatType } from '@/components/FormatSelector';
import { SummaryCard } from '@/components/SummaryCard';
import { HistoryList } from '@/components/HistoryList';
import { JobProgress } from '@/components/JobProgress';
import { summarizeService, type Summary, type SearchResult } from '@/services/summarize.service';
import { queryKeys } from '@/lib/query-keys';
import { socket } from '@/lib/socket';
import { Wand2, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

const ON_DEMAND_FORMATS: FormatType[] = ['keyPoints', 'motivational', 'timestamps', 'insight'];

export function Home() {
  const [format, setFormat] = useState<FormatType>('summary');
  const [currentSummary, setCurrentSummary] = useState<Summary | null>(null);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [loadingFormats, setLoadingFormats] = useState<Set<string>>(new Set());

  // Job queue state
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [jobProgress, setJobProgress] = useState(0);
  const [jobStep, setJobStep] = useState('');
  const [jobStatus, setJobStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');
  const [jobError, setJobError] = useState<string | undefined>();
  const jobTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const queryClient = useQueryClient();

  const { data: historyData } = useQuery({
    queryKey: queryKeys.summaries.list({ page: 1, limit: 10 }),
    queryFn: () => summarizeService.list({ page: 1, limit: 10 }),
    select: (res) => res.data,
    enabled: !searchQuery,
  });

  // ---- Search ----
  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    setSearchLoading(true);
    try {
      const res = await summarizeService.search(q, { page: 1, limit: 20 });
      setSearchResults(res.data?.data || []);
    } catch {
      toast.error('Search failed');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
  };

  // ---- Job submission ----
  const mutation = useMutation({
    mutationFn: (url: string) => summarizeService.create(url),
    onSuccess: (res) => {
      const data = res.data as { jobId: string } | undefined;
      if (data?.jobId) {
        setCurrentJobId(data.jobId);
        setJobProgress(0);
        setJobStep('Queued...');
        setJobStatus('processing');
        setJobError(undefined);
        setCurrentSummary(null);
        setSelectedId(undefined);
        socket.connect();
        socket.emit('join-job', data.jobId);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.summaries.all });
    },
  });

  // ---- Socket.IO job events ----
  useEffect(() => {
    if (!currentJobId || jobStatus !== 'processing') return;

    const onProgress = (data: { jobId: string; progress: number; step: string }) => {
      if (data.jobId !== currentJobId) return;
      setJobProgress(data.progress);
      setJobStep(data.step);
    };

    const onCompleted = (data: { jobId: string; summaryId: string }) => {
      if (data.jobId !== currentJobId) return;
      setJobStatus('completed');
      socket.disconnect();
      loadMutation.mutate(data.summaryId);
      queryClient.invalidateQueries({ queryKey: queryKeys.summaries.all });
      const t = setTimeout(() => {
        setCurrentJobId(null);
        setJobStatus('idle');
      }, 800);
      jobTimersRef.current.push(t);
    };

    const onFailed = (data: { jobId: string; error: string }) => {
      if (data.jobId !== currentJobId) return;
      setJobStatus('failed');
      setJobError(data.error);
      socket.disconnect();

      const t = setTimeout(() => {
        setCurrentJobId(null);
        setJobStatus('idle');
      }, 5000);
      jobTimersRef.current.push(t);
    };

    socket.on('job:progress', onProgress);
    socket.on('job:completed', onCompleted);
    socket.on('job:failed', onFailed);

    return () => {
      socket.off('job:progress', onProgress);
      socket.off('job:completed', onCompleted);
      socket.off('job:failed', onFailed);
      jobTimersRef.current.forEach(clearTimeout);
      jobTimersRef.current = [];
    };
  }, [currentJobId, jobStatus]);

  // ---- Load summary by ID ----
  const loadMutation = useMutation({
    mutationFn: (id: string) => summarizeService.getById(id),
    onSuccess: (res) => {
      if (res.data) {
        setCurrentSummary(res.data);
        setSelectedId(res.data.id);
        toast.success('Video summarized successfully!');
      }
    },
  });

  // ---- On-demand format generation ----
  const generateMutation = useMutation({
    mutationFn: ({ id, format }: { id: string; format: string }) =>
      summarizeService.generateFormat(id, format),
    onMutate: ({ format }) => {
      setLoadingFormats((prev) => new Set(prev).add(format));
    },
    onSuccess: (res, { format }) => {
      if (res.data) {
        setCurrentSummary(res.data);
      }
      setLoadingFormats((prev) => {
        const next = new Set(prev);
        next.delete(format);
        return next;
      });
    },
    onError: (_err, { format }) => {
      setLoadingFormats((prev) => {
        const next = new Set(prev);
        next.delete(format);
        return next;
      });
      toast.error('Failed to generate format');
    },
  });

  useEffect(() => {
    if (!currentSummary || format === 'summary') return;
    if (!ON_DEMAND_FORMATS.includes(format)) return;
    if (currentSummary[format]) return;
    if (loadingFormats.has(format)) return;

    generateMutation.mutate({ id: currentSummary.id, format });
  }, [format, currentSummary?.id]);

  // ---- Delete summary ----
  const deleteMutation = useMutation({
    mutationFn: (id: string) => summarizeService.remove(id),
    onSuccess: (_res, id) => {
      if (currentSummary?.id === id) {
        setCurrentSummary(null);
        setSelectedId(undefined);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.summaries.all });
      toast.success('Summary deleted');
    },
    onError: () => {
      toast.error('Failed to delete summary');
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  // ---- Clear job on manual history select ----
  const handleHistorySelect = (id: string) => {
    if (id === selectedId) {
      setCurrentSummary(null);
      setSelectedId(undefined);
    } else {
      loadMutation.mutate(id);
    }
    if (currentJobId) {
      socket.disconnect();
      setCurrentJobId(null);
      setJobStatus('idle');
    }
  };

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl bg-canvas border border-hairline mb-16">
        <div className="pointer-events-none absolute inset-0 select-none overflow-hidden" aria-hidden>
          <div className="orb orb-1 -top-32 -right-16 size-[26rem]" style={{ background: 'rgba(0, 255, 255, 0.25)', filter: 'blur(120px)' }} />
          <div className="orb orb-2 -bottom-48 left-1/4 size-[24rem]" style={{ background: 'rgba(255, 0, 255, 0.2)', filter: 'blur(120px)' }} />
          <div className="orb orb-3 top-1/4 -left-24 size-72" style={{ background: 'rgba(0, 255, 128, 0.2)', filter: 'blur(120px)' }} />
          <div className="orb orb-4 bottom-1/3 right-1/4 size-56" style={{ background: 'rgba(0, 128, 255, 0.2)', filter: 'blur(120px)' }} />
          <div className="orb orb-5 top-1/2 left-1/2 size-64" style={{ background: 'rgba(255, 0, 128, 0.18)', filter: 'blur(120px)' }} />
          <div className="orb orb-1r top-1/3 right-1/2 size-40" style={{ background: 'rgba(255, 255, 0, 0.15)', filter: 'blur(100px)' }} />
          <div className="orb orb-2r bottom-1/2 left-1/3 size-36" style={{ background: 'rgba(0, 200, 255, 0.15)', filter: 'blur(100px)' }} />
          <div className="orb orb-3r top-10 right-1/4 size-32" style={{ background: 'rgba(255, 255, 255, 0.25)', filter: 'blur(100px)' }} />
          <div className="orb orb-4r bottom-20 left-10 size-28" style={{ background: 'rgba(255, 255, 255, 0.2)', filter: 'blur(100px)' }} />
          <div className="orb orb-1l top-1/2 -right-10 size-24" style={{ background: 'rgba(0, 255, 200, 0.2)', filter: 'blur(80px)' }} />
          <div className="orb orb-2l -bottom-20 right-1/3 size-36" style={{ background: 'rgba(255, 100, 0, 0.15)', filter: 'blur(100px)' }} />
          <div className="orb orb-3l top-1/4 left-1/3 size-20" style={{ background: 'rgba(200, 0, 255, 0.15)', filter: 'blur(80px)' }} />
          <div className="orb orb-4l bottom-1/3 left-1/2 size-16" style={{ background: 'rgba(0, 255, 255, 0.2)', filter: 'blur(60px)' }} />
          <div className="orb orb-5 top-1/3 left-10 size-12" style={{ background: 'rgba(255, 150, 0, 0.15)', filter: 'blur(60px)' }} />
        </div>

        <div className="relative text-center px-8 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 h-7 rounded-full bg-canvas border border-hairline text-xs text-body font-medium mb-6">
              <Wand2 className="size-3" />
              Powered by OpenRouter
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
            className="text-[32px] md:text-[40px] font-semibold tracking-tight text-ink mb-4"
          >
            Summarize any YouTube video
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
            className="text-body text-base md:text-lg max-w-lg mx-auto leading-relaxed"
          >
            Paste a link and get the video broken down into summary, key points, motivational, timeline, and insights.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
            className="mt-8"
          >
            <InputBar onSubmit={(url) => mutation.mutate(url)} loading={mutation.isPending} />
          </motion.div>
        </div>
      </div>

      {/* Job progress indicator */}
      {jobStatus === 'processing' && (
        <JobProgress progress={jobProgress} step={jobStep} status="processing" />
      )}
      {jobStatus === 'failed' && (
        <JobProgress progress={100} step="" status="failed" error={jobError} />
      )}

      {/* Summary result */}
      {currentSummary && jobStatus !== 'processing' && (
        <>
          <FormatSelector selected={format} onChange={setFormat} loadingFormats={loadingFormats} />
          <SummaryCard data={currentSummary} format={format} loading={loadingFormats.has(format)} />
        </>
      )}

      {/* Search + History */}
      <div className="mt-16">
        <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />

        {searchResults !== null ? (
          <>
            <h3 className="text-xs font-mono text-body uppercase tracking-wider mb-4 flex items-center gap-2">
              <Search className="size-3.5" />
              Search results for "{searchQuery}"
            </h3>
            {searchLoading ? (
              <p className="text-sm text-mute">Searching...</p>
            ) : searchResults.length === 0 ? (
              <p className="text-sm text-mute">No results found</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {searchResults.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg bg-canvas border border-hairline hover:border-hairline-strong hover:shadow-level-1 transition-all duration-200"
                  >
                    <button onClick={() => handleHistorySelect(r.id)} className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">
                      <Search className="size-3.5 text-mute shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-ink truncate">{r.videoTitle || r.youtubeUrl}</p>
                        <p className="text-xs text-mute mt-0.5 line-clamp-1">{r.summary.slice(0, 100)}...</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="size-7 shrink-0 flex items-center justify-center rounded-md text-mute hover:text-error hover:bg-error/10 cursor-pointer transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <HistoryList
            summaries={historyData?.data || []}
            onSelect={handleHistorySelect}
            selectedId={selectedId}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}

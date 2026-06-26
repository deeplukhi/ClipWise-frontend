import { useState } from 'react';
import { Link, Sparkles } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';

interface InputBarProps {
  onSubmit: (url: string) => void;
  loading: boolean;
}

export function InputBar({ onSubmit, loading }: InputBarProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = url.trim();
    if (!trimmed) {
      setError('Please enter a YouTube URL');
      return;
    }
    if (!trimmed.includes('youtube.com') && !trimmed.includes('youtu.be')) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    onSubmit(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-mute" />
          <input
            type="text"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(''); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Paste a YouTube link..."
            className={`w-full h-11 pl-10 pr-3.5 bg-canvas border text-sm text-ink placeholder-mute rounded-full transition-all duration-200 outline-none ${
              error
                ? 'border-error ring-1 ring-error/30'
                : focused
                  ? 'border-hairline-strong ring-1 ring-hairline-strong/30'
                  : 'border-hairline'
            }`}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-1.5 px-5 h-11 bg-primary text-on-primary rounded-full text-sm font-medium hover:opacity-90 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer shrink-0"
        >
          {loading ? (
            <Spinner />
          ) : (
            <Sparkles className="size-4" />
          )}
          {loading ? 'Analyzing' : 'Summarize'}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-error ml-4">{error}</p>}
    </form>
  );
}

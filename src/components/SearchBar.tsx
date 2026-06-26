import { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
}

export function SearchBar({ onSearch, onClear }: SearchBarProps) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setValue(next);
    clearTimeout(debounceRef.current);
    if (!next.trim()) { onClear(); return; }
    const delay = next.endsWith(' ') ? 0 : 100;
    debounceRef.current = setTimeout(() => onSearch(next.trim()), delay);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  };

  const handleClear = () => {
    setValue('');
    clearTimeout(debounceRef.current);
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-4">
      <div className={`relative flex items-center h-10 bg-canvas border rounded-lg transition-all duration-200 ${
        focused ? 'border-hairline-strong ring-1 ring-hairline-strong/30' : 'border-hairline'
      }`}>
        <Search className="absolute left-3 size-4 text-mute" />
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search summaries..."
          className="flex-1 bg-transparent pl-10 pr-8 text-sm text-ink placeholder-mute outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 size-4 flex items-center justify-center text-mute hover:text-ink cursor-pointer"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
    </form>
  );
}

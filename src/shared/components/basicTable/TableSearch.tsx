import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { IconSearch } from '@tabler/icons-react';
import { Input } from '@/shared/shadcn/components/input';

const DEBOUNCE_MS = 300;

interface TableSearchProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Search input that updates instantly while typing, but reports the value only after
 * DEBOUNCE_MS of inactivity — one request per phrase instead of one per keystroke.
 */
export const TableSearch = ({ value, onChange }: TableSearchProps) => {
  const [text, setText] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  const timeoutRef = useRef<number | undefined>(undefined);

  // Sync when the value changes from outside (e.g. browser back changes ?search= in the URL).
  // Adjusting state during render instead of in an effect: https://react.dev/learn/you-might-not-need-an-effect
  if (value !== prevValue) {
    setPrevValue(value);
    setText(value);
  }

  // Drop a pending update when the component unmounts
  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextText = event.target.value;
    setText(nextText);
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => onChange(nextText), DEBOUNCE_MS);
  };

  return (
    <div className="relative w-64">
      <IconSearch className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-content-muted [--icon-size:1rem]" />
      <Input
        type="search"
        value={text}
        onChange={handleChange}
        placeholder="Search…"
        aria-label="Search table"
        // shadcn's border-input / muted-foreground / ring tokens don't exist in our theme — use ours
        className="border-border bg-surface-raised pl-8 placeholder:text-content-muted focus-visible:border-content-muted focus-visible:ring-0"
      />
    </div>
  );
};

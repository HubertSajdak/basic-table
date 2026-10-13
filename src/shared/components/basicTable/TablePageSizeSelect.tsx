import { Select } from '@base-ui/react/select';
import { IconCheck, IconChevronDown } from '@tabler/icons-react';
import { Typography } from '@/shared/components/typography/Typography';

interface TablePageSizeSelectProps {
  value: number;
  options: number[];
  onChange: (pageSize: number) => void;
}

export const TablePageSizeSelect = ({ value, options, onChange }: TablePageSizeSelectProps) => {
  // Keep the current size selectable even if it isn't a preset (e.g. ?limit=7 typed into the URL)
  const sizes = options.includes(value) ? options : [...options, value].sort((a, b) => a - b);
  const items = sizes.map((size) => ({ value: size, label: String(size) }));

  return (
    <div className="flex items-center gap-2">
      <Typography variant="body1" component="span" className="text-content-secondary">
        Rows per page
      </Typography>
      <Select.Root
        items={items}
        value={value}
        onValueChange={(nextValue) => {
          if (nextValue !== null) onChange(nextValue);
        }}
      >
        <Select.Trigger
          aria-label="Rows per page"
          className="flex h-8 items-center gap-1 rounded-lg border border-border bg-surface-raised px-2.5 text-sm text-content-primary outline-none hover:bg-table-row-hover focus-visible:border-content-muted"
        >
          <Select.Value />
          <Select.Icon className="flex text-content-secondary [--icon-size:1rem]">
            <IconChevronDown />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Positioner alignItemWithTrigger={false} side="bottom" align="end" sideOffset={4} className="z-50">
            <Select.Popup className="min-w-(--anchor-width) rounded-lg border border-border bg-surface-raised p-1 shadow-md outline-none">
              <Select.List>
                {items.map((item) => (
                  <Select.Item
                    key={item.value}
                    value={item.value}
                    className="flex cursor-pointer items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm text-content-primary outline-none data-highlighted:bg-table-row-hover"
                  >
                    <Select.ItemText>{item.label}</Select.ItemText>
                    <Select.ItemIndicator className="flex [--icon-size:0.875rem]">
                      <IconCheck />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};

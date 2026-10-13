import type { Column, RowData, Table } from '@tanstack/react-table';
import { Popover } from '@base-ui/react/popover';
import { Checkbox } from '@base-ui/react/checkbox';
import { IconCheck, IconFilter } from '@tabler/icons-react';
import { Button } from '@/shared/shadcn/components/button';
import { Typography } from '@/shared/components/typography/Typography';
import type { Features } from './BasicTable';

interface TableColumnSettingsProps<TData extends RowData> {
  table: Table<Features, TData>;
}

// String headers read best; columns with JSX or empty headers fall back to their id
const getColumnLabel = <TData extends RowData>(column: Column<Features, TData, unknown>) => {
  const { header } = column.columnDef;
  return typeof header === 'string' && header !== '' ? header : column.id;
};

export const TableColumnSettings = <TData extends RowData>({ table }: TableColumnSettingsProps<TData>) => {
  const hideableColumns = table.getAllLeafColumns().filter((column) => column.getCanHide());
  const visibleColumnCount = table.getVisibleLeafColumns().length;
  const isAllVisible = table.getIsAllColumnsVisible();

  return (
    <Popover.Root>
      <Popover.Trigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Column settings"
            className="relative text-content-secondary"
          />
        }
      >
        <IconFilter />
        {/* Dot: some columns are hidden */}
        {!isAllVisible && <span className="absolute top-0.5 right-0.5 size-1.5 rounded-full bg-primary" />}
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner side="bottom" align="end" sideOffset={4} className="z-50">
          <Popover.Popup className="w-60 rounded-lg border border-border bg-surface-raised p-2 shadow-md outline-none">
            <div className="flex items-center justify-between px-2 py-1">
              <Popover.Title
                render={
                  <Typography variant="subtitle1" component="h2" className="text-content-secondary">
                    Columns
                  </Typography>
                }
              />
              {!isAllVisible && (
                <button
                  type="button"
                  onClick={() => table.resetColumnVisibility()}
                  className="text-xs text-content-secondary hover:text-content-primary"
                >
                  Show all
                </button>
              )}
            </div>

            <ul className="mt-1 flex flex-col">
              {hideableColumns.map((column) => {
                const isVisible = column.getIsVisible();
                // Never let the user hide the last visible column — the table would be empty
                const isLastVisible = isVisible && visibleColumnCount === 1;

                return (
                  <li key={column.id}>
                    <label className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-table-row-hover has-data-disabled:cursor-not-allowed">
                      <Checkbox.Root
                        checked={isVisible}
                        onCheckedChange={(checked) => column.toggleVisibility(checked)}
                        disabled={isLastVisible}
                        className="flex size-4 shrink-0 items-center justify-center rounded-xs border border-content-muted bg-surface-raised transition-colors data-checked:border-content-primary data-checked:bg-content-primary data-disabled:opacity-50"
                      >
                        <Checkbox.Indicator className="flex text-content-inverse [--icon-size:0.75rem] [--icon-stroke-width:3]">
                          <IconCheck />
                        </Checkbox.Indicator>
                      </Checkbox.Root>
                      <Typography variant="body1" component="span" className="truncate text-content-primary">
                        {getColumnLabel(column)}
                      </Typography>
                    </label>
                  </li>
                );
              })}
            </ul>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
};

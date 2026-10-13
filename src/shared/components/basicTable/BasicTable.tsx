import { useState, type CSSProperties, type MouseEvent } from 'react';
import {
  useTable,
  type Column,
  type ColumnDef,
  type ColumnPinningState,
  type ColumnVisibilityState,
  type PaginationState,
  type RowData,
  flexRender,
  functionalUpdate,
  type SortingState,
  type SortDirection,
  type Updater,
  tableFeatures,
  columnFilteringFeature,
  columnPinningFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/shadcn/components/table';
import { cn } from 'cn';
import { IconArrowUp, IconArrowDown, IconArrowsSort } from '@tabler/icons-react';
import { Button } from '@/shared/shadcn/components/button';
import { Skeleton } from '@/shared/shadcn/components/skeleton';
import { TypographyWithTooltip } from '@/shared/components/typography/TypographyWithTooltip';
import { TablePagination } from './TablePagination';
import { TableSummary } from './TableSummary';
import { TableSearch } from './TableSearch';
import { TableColumnSettings } from './TableColumnSettings';

export interface TablePropsSortingState {
  sortBy?: string;
  order?: 'asc' | 'desc';
}

// Offset-based, matching the API: skip = number of rows to skip (not a page number)
export interface TablePropsPaginationState {
  limit: number;
  skip: number;
}

// Per-column options available in `columnDef.meta`
export interface BasicTableColumnMeta {
  // Any CSS color, incl. theme tokens: 'var(--color-feedback-info-surface)'. Keep it opaque on pinned columns.
  backgroundColor?: string;
  textColor?: string;
}

export const features = tableFeatures({
  // Type-only slot: makes `columnDef.meta` typed as BasicTableColumnMeta
  columnMeta: {} as BasicTableColumnMeta,
  columnSizingFeature,
  columnPinningFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSortingFeature,
  // Search: globalFilter state + the filtered row model that applies it (default fn 'auto' = includesString)
  columnFilteringFeature,
  globalFilteringFeature,
  // Row models are used only in client-side mode; with manualFiltering/manualSorting/manualPagination they're skipped
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
});

export type Features = typeof features;

const SKELETON_ROW_COUNT = 5;

const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export type TableDensity = 'standard' | 'compact';

// Full class names (not interpolated) so Tailwind can detect them
const densityClasses: Record<TableDensity, { cell: string; header: string; skeleton: string }> = {
  standard: { cell: 'py-2', header: 'h-11', skeleton: 'h-8' },
  compact: { cell: 'py-1', header: 'h-8', skeleton: 'h-5' },
};

export interface TableProps<TData extends RowData> {
  data: TData[];
  columns: ColumnDef<Features, TData>[];
  stickyHeader?: boolean;
  columnPinning?: ColumnPinningState;
  isLoading?: boolean;
  // Row height: 'compact' halves the vertical cell padding and lowers the header (naming as in MUI DataGrid)
  density?: TableDensity;
  /**
   * Mode is picked per feature by the presence of its callback:
   * - prop + callback -> server-side: controlled by the parent, `data` is already sorted/paged
   * - prop alone      -> client-side: used as the initial value, the table sorts/pages itself
   * - no `pagination` -> no paging, all rows are shown
   * - no `search`     -> no search input
   */
  pagination?: TablePropsPaginationState;
  sorting?: TablePropsSortingState;
  search?: string;
  // Choices in the "Rows per page" select
  pageSizeOptions?: number[];
  // Server-side pagination only: total number of rows on the backend
  rowCount?: number;
  onPaginationChange?: (pageState: TablePropsPaginationState) => void;
  onSortingChange?: (sortingState: TablePropsSortingState) => void;
  onSearchChange?: (search: string) => void;
  // Row actions; receive the row's data. Note: a double click also fires onRowClick twice before it.
  onRowClick?: (row: TData, event: MouseEvent<HTMLTableRowElement>) => void;
  onRowDoubleClick?: (row: TData, event: MouseEvent<HTMLTableRowElement>) => void;
}

// Pinned columns stick to the start/end edge while scrolling horizontally
const getPinningStyles = <TData extends RowData>(column: Column<Features, TData, unknown>): CSSProperties => {
  const isPinned = column.getIsPinned();

  return {
    position: isPinned ? 'sticky' : undefined,
    insetInlineStart: isPinned === 'start' ? column.getStart('start') : undefined,
    insetInlineEnd: isPinned === 'end' ? column.getAfter('end') : undefined,
  };
};

// Column colors from `columnDef.meta` go in as CSS variables (not inline background-color),
// so hover classes can still restyle the cell — inline styles would always win over classes
const getColumnColorStyle = <TData extends RowData>(column: Column<Features, TData, unknown>) => {
  const { backgroundColor, textColor } = column.columnDef.meta ?? {};
  return { '--column-bg': backgroundColor, '--column-text': textColor } as CSSProperties;
};

const getColumnColorClass = <TData extends RowData>(column: Column<Features, TData, unknown>) => {
  const { backgroundColor, textColor } = column.columnDef.meta ?? {};
  return cn(
    backgroundColor &&
      // On row hover: darken the column's own color slightly instead of replacing it with the row hover gray
      'bg-(--column-bg) transition-colors group-hover/row:bg-[color-mix(in_srgb,var(--column-bg),var(--color-content-primary)_5%)]',
    // Selected row: a stronger darkening than hover, so both states stay distinguishable
    backgroundColor &&
      'group-data-[state=selected]/row:bg-[color-mix(in_srgb,var(--column-bg),var(--color-content-primary)_8%)]',
    textColor && 'text-(--column-text)',
  );
};

// API format (sortBy/order, skip/limit) -> TanStack state
const toTableSorting = (sorting?: TablePropsSortingState): SortingState =>
  sorting?.sortBy ? [{ id: sorting.sortBy, desc: sorting.order === 'desc' }] : [];

const toTablePagination = (pagination: TablePropsPaginationState | undefined, rowCount: number): PaginationState =>
  pagination
    ? { pageIndex: Math.floor(pagination.skip / pagination.limit), pageSize: pagination.limit }
    : { pageIndex: 0, pageSize: rowCount };

const SortIndicator = ({ direction }: { direction: false | SortDirection }) => {
  if (direction === 'asc') return <IconArrowUp />;
  if (direction === 'desc') return <IconArrowDown />;
  return <IconArrowsSort className="opacity-40" />;
};

export const BasicTable = <TData extends RowData>({
  data,
  columns,
  stickyHeader = false,
  columnPinning,
  isLoading,
  density = 'standard',
  pagination,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  sorting,
  search,
  rowCount,
  onPaginationChange,
  onSortingChange,
  onSearchChange,
  onRowClick,
  onRowDoubleClick,
}: TableProps<TData>) => {
  const isServerSorting = onSortingChange !== undefined;
  const isServerPagination = onPaginationChange !== undefined;
  const isServerSearch = onSearchChange !== undefined;

  // Client-side mode keeps its own state; the props only seed the initial value
  const [localSorting, setLocalSorting] = useState<SortingState>(() => toTableSorting(sorting));
  const [localPagination, setLocalPagination] = useState<PaginationState>(() =>
    toTablePagination(pagination, data.length),
  );

  const [localSearch, setLocalSearch] = useState(search ?? '');
  // UI preference, not a data query — always local, in both modes. {} = all columns visible
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({});
  // Clicked (highlighted) row, kept by object identity rather than row.id (= index in `data`):
  // client mode keeps the same objects, so it survives paging/sorting; new server data clears it by itself
  const [activeRow, setActiveRow] = useState<TData | null>(null);

  const tableSearchState = isServerSearch ? (search ?? '') : localSearch;

  const handleSearchChange = (value: string) => {
    if (isServerSearch) {
      onSearchChange(value);
      return;
    }
    setLocalSearch(value);
    // A new result set starts from the first page
    setLocalPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const tableSortingState = isServerSorting ? toTableSorting(sorting) : localSorting;
  const tablePaginationState = isServerPagination ? toTablePagination(pagination, data.length) : localPagination;

  const handleSortingChange = (updater: Updater<SortingState>) => {
    if (!isServerSorting) {
      setLocalSorting(updater);
      // New order means a different first page — go back to the start
      setLocalPagination((prev) => ({ ...prev, pageIndex: 0 }));
      return;
    }
    // TanStack state -> API format
    const [firstSort] = functionalUpdate(updater, tableSortingState);
    onSortingChange?.(
      firstSort
        ? { sortBy: firstSort.id, order: firstSort.desc ? 'desc' : 'asc' }
        : { sortBy: undefined, order: undefined },
    );
  };

  const handlePaginationChange = (updater: Updater<PaginationState>) => {
    if (!isServerPagination) {
      setLocalPagination(updater);
      return;
    }
    const { pageIndex, pageSize } = functionalUpdate(updater, tablePaginationState);
    onPaginationChange?.({ limit: pageSize, skip: pageIndex * pageSize });
  };

  //Table instance
  const table = useTable({
    features,
    data,
    columns,
    state: {
      sorting: tableSortingState,
      pagination: tablePaginationState,
      globalFilter: tableSearchState,
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    // manual = server-side: `data` is already the filtered, sorted current page — the table must not redo it
    manualFiltering: isServerSearch,
    manualSorting: isServerSorting,
    // No `pagination` at all -> also manual, so every row is shown instead of slicing by a stale page size
    manualPagination: isServerPagination || !pagination,
    // Client-side counts pages from `data` itself; a passed rowCount would override that
    rowCount: isServerPagination ? rowCount : undefined,
    onSortingChange: handleSortingChange,
    onPaginationChange: handlePaginationChange,
    // The API sorts by a single field
    enableMultiSort: false,
    // Sorting is opt-in: a column is sortable only with `enableSorting: true` in its columnDef
    defaultColumn: {
      enableSorting: false,
    },
    initialState: {
      columnPinning,
    },
  });

  // All rows, not just the current page: the backend total in server mode,
  // otherwise the rows left after local search (filtered + sorted, before paging)
  const totalRowCount = isServerPagination ? (rowCount ?? 0) : table.getPrePaginatedRowModel().rows.length;

  // Divider between pinned and scrolling columns: right edge of the last start-pinned column,
  // left edge of the first end-pinned one. Only the width is set — the color comes from the cell's border color.
  const getPinnedEdgeClass = (column: Column<Features, TData, unknown>) => {
    const position = column.getIsPinned();
    // Compared against *visible* pinned columns, so the divider moves when the edge column is hidden
    if (position === 'start' && column.id === table.getStartVisibleLeafColumns().at(-1)?.id) return 'border-r';
    if (position === 'end' && column.id === table.getEndVisibleLeafColumns().at(0)?.id) return 'border-l';
    return undefined;
  };

  return (
    // border-separate keeps cell borders attached to sticky cells (they vanish with border-collapse)
    <div
      className={cn(
        // Always a column layout, independent of stickyHeader (which only pins the column headers):
        // toolbar and summary bar stay in view; only the rows scroll. The table container is as tall
        // as its rows (no flex-1, so no gap above the summary bar), but can shrink (min-h-0) and scroll
        'relative flex h-full w-full flex-col *:data-[slot=table-container]:min-h-0 *:data-[slot=table-container]:overflow-auto',
      )}
    >
      {/* Toolbar: search on the left; column settings and pagination pushed to the right */}
      <div className="flex shrink-0 items-center gap-4 pb-2">
        {search !== undefined && <TableSearch value={tableSearchState} onChange={handleSearchChange} />}
        <div className="ml-auto flex items-center gap-2">
          <TableColumnSettings table={table} />
          {pagination && (
            <TablePagination
              table={table}
              // Current page from the active source (props in server mode, local state in client mode)
              pagination={{
                limit: tablePaginationState.pageSize,
                skip: tablePaginationState.pageIndex * tablePaginationState.pageSize,
              }}
              rowCount={totalRowCount}
              pageSizeOptions={pageSizeOptions}
            />
          )}
        </div>
      </div>

      <Table className={cn('table-fixed border-separate border-spacing-0')}>
        {/* z-20: above pinned body cells (z-10) — with equal z-index the later tbody would paint over the header */}
        <TableHeader className={cn(stickyHeader && 'sticky top-0 z-20')}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  className={cn(
                    // Whole header row reads as one rounded, bordered bar
                    'border-y border-table-header-border border-t-table-header-border-top px-4 font-normal',
                    densityClasses[density].header,
                    'first:rounded-l-lg first:border-l last:rounded-r-lg last:border-r',
                    // Column color from meta replaces the default header colors (no hover here)
                    header.column.columnDef.meta?.backgroundColor ? 'bg-(--column-bg)' : 'bg-table-header',
                    header.column.columnDef.meta?.textColor ? 'text-(--column-text)' : 'text-table-header-content',
                    header.column.getIsPinned() && 'z-10',
                    getPinnedEdgeClass(header.column),
                  )}
                  style={{
                    width: header.getSize(),
                    ...getPinningStyles(header.column),
                    ...getColumnColorStyle(header.column),
                  }}
                >
                  {header.isPlaceholder ? null : header.column.getCanSort() ? (
                    <Button
                      variant="ghost"
                      onClick={header.column.getToggleSortingHandler()}
                      // Looks like plain header text; smaller sort icon than the global 24px
                      className="h-auto gap-1 p-0 font-normal hover:bg-transparent hover:text-inherit [--icon-size:1rem]"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <SortIndicator direction={header.column.getIsSorted()} />
                    </Button>
                  ) : (
                    flexRender(header.column.columnDef.header, header.getContext())
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="[&_tr:last-child>td]:border-b-0">
          {isLoading
            ? Array.from({ length: SKELETON_ROW_COUNT }, (_, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell colSpan={table.getVisibleLeafColumns().length}>
                    <Skeleton className={cn('w-full bg-surface-sunken', densityClasses[density].skeleton)} />
                  </TableCell>
                </TableRow>
              ))
            : table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  // Same attribute shadcn's TableRow uses for selection
                  data-state={row.original === activeRow ? 'selected' : undefined}
                  onClick={(event) => {
                    setActiveRow(row.original);
                    onRowClick?.(row.original, event);
                  }}
                  onDoubleClick={(event) => onRowDoubleClick?.(row.original, event)}
                  className={cn(
                    'group/row hover:bg-table-row-hover data-[state=selected]:bg-table-row-selected',
                    // Pointer only when there's an actual action, not just the highlight
                    (onRowClick || onRowDoubleClick) && 'cursor-pointer',
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'border-b border-table-row-border',
                        // Overrides only the vertical part of shadcn's p-2
                        densityClasses[density].cell,
                        cell.column.getIsPinned() && 'z-10',
                        // Pinned cells need an opaque background; a column color (below) already provides one
                        cell.column.getIsPinned() &&
                          !cell.column.columnDef.meta?.backgroundColor &&
                          // Same opaque color as the row hover, so the pinned cell never turns see-through;
                          // transition-colors matches TableRow's, so both fade in sync
                          'bg-background transition-colors group-hover/row:bg-table-row-hover group-data-[state=selected]/row:bg-table-row-selected',
                        getPinnedEdgeClass(cell.column),
                        getColumnColorClass(cell.column),
                      )}
                      style={{ ...getPinningStyles(cell.column), ...getColumnColorStyle(cell.column) }}
                    >
                      {/* div, not the default <p>: custom cell renderers may return block content */}
                      <TypographyWithTooltip component="div">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TypographyWithTooltip>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <TableSummary totalRowCount={totalRowCount} />
    </div>
  );
};

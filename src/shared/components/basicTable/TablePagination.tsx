import type { RowData, Table } from '@tanstack/react-table';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { Button } from '@/shared/shadcn/components/button';
import { Typography } from '@/shared/components/typography/Typography';
import type { Features, TablePropsPaginationState } from './BasicTable';
import { TablePageSizeSelect } from './TablePageSizeSelect';

interface TablePaginationProps<TData extends RowData> {
  table: Table<Features, TData>;
  pagination: TablePropsPaginationState;
  rowCount: number;
  pageSizeOptions: number[];
}

export const TablePagination = <TData extends RowData>({
  table,
  pagination,
  rowCount,
  pageSizeOptions,
}: TablePaginationProps<TData>) => {
  const firstRow = rowCount === 0 ? 0 : pagination.skip + 1;
  const lastRow = Math.min(pagination.skip + pagination.limit, rowCount);

  return (
    <div className="flex items-center justify-end gap-2 py-2">
      {/* Goes through the same onPaginationChange path as the arrows, so it works in both modes */}
      <TablePageSizeSelect
        value={pagination.limit}
        options={pageSizeOptions}
        onChange={(pageSize) => table.setPageSize(pageSize)}
      />
      <Typography variant="body1" component="span" className="text-content-secondary">
        {firstRow}–{lastRow} of {rowCount}
      </Typography>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Previous page"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <IconChevronLeft />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Next page"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <IconChevronRight />
      </Button>
    </div>
  );
};

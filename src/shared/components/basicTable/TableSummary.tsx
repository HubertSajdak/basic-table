import { Typography } from '@/shared/components/typography/Typography';

interface TableSummaryProps {
  totalRowCount: number;
}

// Full-width bar under the table; styled like the header bar so the table has a matching top and bottom
export const TableSummary = ({ totalRowCount }: TableSummaryProps) => {
  return (
    <div className="mt-2 flex h-9 shrink-0 items-center rounded-lg border border-table-header-border bg-table-header px-4">
      <Typography variant="caption" component="span" className="text-table-header-content">
        Total rows: {totalRowCount}
      </Typography>
    </div>
  );
};

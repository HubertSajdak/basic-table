import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { type TablePropsPaginationState, type TablePropsSortingState } from '@/shared/components/basicTable/BasicTable';

export type TableQuery = TablePropsPaginationState & TablePropsSortingState & { search?: string };

const DEFAULT_QUERY: TableQuery = {
  limit: 10,
  skip: 0,
};

interface UseTableQueryOptions {
  defaultQuery?: Partial<TableQuery>;
  // true: state lives in the URL (?limit=&skip=&sortBy=&order=&search=) — survives refresh and can be shared
  shouldUseUrlParams?: boolean;
}

const parseOrder = (value: string | null): TableQuery['order'] =>
  value === 'asc' || value === 'desc' ? value : undefined;

const readQueryFromUrl = (searchParams: URLSearchParams, defaults: TableQuery): TableQuery => ({
  limit: Number(searchParams.get('limit')) || defaults.limit,
  skip: Number(searchParams.get('skip')) || defaults.skip,
  sortBy: searchParams.get('sortBy') ?? defaults.sortBy,
  order: parseOrder(searchParams.get('order')) ?? defaults.order,
  search: searchParams.get('search') ?? defaults.search,
});

const writeQueryToUrl = (searchParams: URLSearchParams, query: TableQuery) => {
  const next = new URLSearchParams(searchParams);
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined) next.delete(key);
    else next.set(key, String(value));
  });
  return next;
};

export const useTableQuery = ({ defaultQuery, shouldUseUrlParams = true }: UseTableQueryOptions = {}) => {
  const defaults: TableQuery = { ...DEFAULT_QUERY, ...defaultQuery };
  const [searchParams, setSearchParams] = useSearchParams();
  const [localQuery, setLocalQuery] = useState<TableQuery>(defaults);

  const query = shouldUseUrlParams ? readQueryFromUrl(searchParams, defaults) : localQuery;

  const updateQuery = (patch: Partial<TableQuery>) => {
    const nextQuery = { ...query, ...patch };
    if (shouldUseUrlParams) {
      // replace: paging/sorting shouldn't flood the browser history
      setSearchParams((prev) => writeQueryToUrl(prev, nextQuery), { replace: true });
    } else {
      setLocalQuery(nextQuery);
    }
  };

  const onPaginationChange = (pagination: TablePropsPaginationState) => {
    updateQuery(pagination);
  };

  const onSortingChange = (sorting: TablePropsSortingState) => {
    // New order means a different first page — go back to the start
    updateQuery({ ...sorting, skip: 0 });
  };

  const onSearchChange = (search: string) => {
    // Empty text removes ?search= from the URL; a new result set starts from the first page
    updateQuery({ search: search || undefined, skip: 0 });
  };

  return {
    query,
    pagination: { limit: query.limit, skip: query.skip } satisfies TablePropsPaginationState,
    sorting: { sortBy: query.sortBy, order: query.order } satisfies TablePropsSortingState,
    search: query.search ?? '',
    onPaginationChange,
    onSortingChange,
    onSearchChange,
  };
};

import { BasicTable } from '@/shared/components/basicTable/BasicTable';
import { useTableQuery } from '@/shared/components/basicTable/useQueryParams';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { PeopleApi } from '../api/people.api';
import { getPeopleListColumnDef } from './peopleList.config';

export const PeopleList = () => {
  const { query, pagination, sorting, search, onPaginationChange, onSortingChange, onSearchChange } = useTableQuery();

  const { data, isFetching } = useQuery({
    queryKey: PeopleApi.getAllPeopleQueryKey(query),
    queryFn: () => PeopleApi.getAllPeople(query),
    // Keep the current page visible while the next one loads
    placeholderData: keepPreviousData,
  });

  return (
    <BasicTable
      data={data?.users ?? []}
      columns={getPeopleListColumnDef()}
      rowCount={data?.total ?? 0}
      pagination={pagination}
      sorting={sorting}
      search={search}
      isLoading={isFetching}
      onPaginationChange={onPaginationChange}
      onSortingChange={onSortingChange}
      onSearchChange={onSearchChange}
      stickyHeader
      columnPinning={{ start: ['id'], end: [] }}
      density="compact"
    />
  );
};

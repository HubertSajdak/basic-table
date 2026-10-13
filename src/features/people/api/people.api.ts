import { Http } from '@/config/http/Http';
import type { PeopleModel } from '../types/people.model';
import type { PeopleDto } from './people.dto';

export const PeopleApi = {
  getAllPeopleQueryKey: (query?: PeopleDto.Query) =>
    [
      'people',
      'list',
      ...(query
        ? [
            ...(query.skip !== undefined ? [query.skip] : []),
            ...(query.limit !== undefined ? [query.limit] : []),
            ...(query.sortBy !== undefined ? [query.sortBy] : []),
            ...(query.order !== undefined ? [query.order] : []),
            ...(query.search !== undefined ? [query.search] : []),
          ]
        : []),
    ] as const,
  getAllPeople: async (query: PeopleDto.Query): Promise<PeopleModel.People> => {
    const { search, ...params } = query;
    // dummyjson calls the search phrase `q`; an empty `q` returns all users (with paging/sorting)
    return await Http.get<PeopleModel.People>('https://dummyjson.com/users/search', { ...params, q: search ?? '' });
  },
};

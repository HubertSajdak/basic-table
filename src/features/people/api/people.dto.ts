export namespace PeopleDto {
  interface Pagination {
    limit?: number;
    skip?: number;
  }

  interface Sort {
    sortBy?: string;
    // dummyjson expects lowercase
    order?: 'asc' | 'desc';
  }

  interface Search {
    search?: string;
  }

  export interface Query extends Pagination, Sort, Search {}

  export interface PaginatedResponse<T> {
    users: T[];
    total: number;
    skip: number;
    limit: number;
  }
}

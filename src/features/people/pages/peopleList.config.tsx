import type { ColumnDef } from '@tanstack/react-table';
import type { PeopleModel } from '../types/people.model';
import { type Features } from '@/shared/components/basicTable/BasicTable';
import { Avatar, AvatarImage } from '@/shared/shadcn/components/avatar';
export const getPeopleListColumnDef = (): ColumnDef<Features, PeopleModel.Person>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
    enableSorting: true,
    meta: {
      backgroundColor: 'var(--color-feedback-info-surface)',
      textColor: 'var(--color-feedback-success)',
    },
  },
  {
    id: 'image',
    cell: ({ row }) => {
      return (
        <Avatar>
          <AvatarImage src={row.original.image} />
        </Avatar>
      );
    },
  },
  {
    accessorKey: 'firstName',
    header: 'First Name',
    enableSorting: true,
    meta: {
      backgroundColor: 'var(--color-feedback-info-surface)',
      textColor: 'var(--color-feedback-success)',
    },
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
    enableSorting: true,
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'age',
    header: 'Age',
  },
  {
    accessorKey: 'address.city',
    header: 'City',
    enableSorting: true,
  },
  {
    accessorKey: 'address.country',
    header: 'Country',
    enableSorting: true,
  },
  {
    accessorKey: 'company.name',
    header: 'Company',
  },
];

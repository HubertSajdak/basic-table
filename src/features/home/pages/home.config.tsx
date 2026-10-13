import type { ColumnDef } from '@tanstack/react-table';
import { type Features } from '@/shared/components/basicTable/BasicTable';
import type { ProductsModel } from '../types/products.model';

const priceFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

// Cells format for display only — sorting still compares the raw values
export const getProductsColumnDef = (): ColumnDef<Features, ProductsModel.Product>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 70,
    enableSorting: true,
  },
  {
    accessorKey: 'title',
    header: 'Product',
    size: 260,
    enableSorting: true,
  },
  {
    accessorKey: 'category',
    header: 'Category',
    enableSorting: true,
  },
  {
    accessorKey: 'brand',
    header: 'Brand',
  },
  {
    accessorKey: 'price',
    header: 'Price',
    enableSorting: true,
    meta: {
      backgroundColor: 'var(--color-feedback-success-surface)',
      textColor: 'var(--color-feedback-success)',
    },
    cell: ({ row }) => priceFormatter.format(row.original.price),
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
    enableSorting: true,
  },
  {
    accessorKey: 'rating',
    header: 'Rating',
    enableSorting: true,
    cell: ({ row }) => `${row.original.rating.toFixed(1)} / 5`,
  },
  {
    accessorKey: 'createdAt',
    header: 'Added',
    enableSorting: true,
  },
];

import { BasicTable } from '@/shared/components/basicTable/BasicTable';
import { productsMock } from '../mocks/products.mock';
import { getProductsColumnDef } from './home.config';

// Client-side mode: no on*Change callbacks, so the props are only initial values
// and the table searches, sorts and pages the full mock array by itself
export const Home = () => {
  return (
    <BasicTable
      data={productsMock}
      columns={getProductsColumnDef()}
      pagination={{ limit: 10, skip: 0 }}
      sorting={{ sortBy: 'id', order: 'asc' }}
      search=""
      density="compact"
    />
  );
};

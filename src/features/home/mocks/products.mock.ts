import type { ProductsModel } from '../types/products.model';

const titles = [
  'Wireless Mouse',
  'Mechanical Keyboard',
  'USB-C Hub',
  '27" 4K Monitor',
  'Noise Cancelling Headphones',
  'Webcam Full HD',
  'Laptop Stand',
  'Portable SSD 1TB',
  'Desk Lamp LED',
  'Ergonomic Chair',
  'Bluetooth Speaker',
  'Smartwatch',
  'Phone Charger 65W',
  'HDMI Cable 2m',
  'Gaming Mousepad',
];

const categories = ['Accessories', 'Peripherals', 'Audio', 'Displays', 'Storage', 'Furniture', 'Wearables'];
const brands = ['Logitech', 'Dell', 'Sony', 'Anker', 'Samsung', 'Razer', 'IKEA', 'Apple'];

const PRODUCT_COUNT = 47;

// Deterministic values (no Math.random) so the data — and sort results — are the same on every reload
export const productsMock: ProductsModel.Product[] = Array.from({ length: PRODUCT_COUNT }, (_, index) => {
  const id = index + 1;
  const month = String((index % 12) + 1).padStart(2, '0');
  const day = String(((index * 7) % 28) + 1).padStart(2, '0');

  return {
    id,
    title: `${titles[index % titles.length]} ${Math.floor(index / titles.length) + 1}`,
    category: categories[(index * 3) % categories.length],
    brand: brands[(index * 5) % brands.length],
    price: Math.round(((index * 37) % 950) + 19.99) + 0.99,
    stock: (index * 13) % 120,
    rating: Math.round((((index * 17) % 41) / 10 + 1) * 10) / 10,
    createdAt: `2025-${month}-${day}`,
  };
});

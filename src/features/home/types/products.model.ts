export namespace ProductsModel {
  export type Product = {
    id: number;
    title: string;
    category: string;
    brand: string;
    price: number;
    stock: number;
    rating: number;
    // ISO date (YYYY-MM-DD) — sorts correctly as a plain string
    createdAt: string;
  };
}

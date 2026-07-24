export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  sizes: string[];
  inStock: boolean;

  image?: {
    bytes: number[];
    type: string;
  };
  imageUrl?: string;

  createdAt?: number;
  imageSrc?: string;
}
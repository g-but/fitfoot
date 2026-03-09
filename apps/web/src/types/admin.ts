// Shared types for admin functionality
export interface ProductVariant {
  id: string;
  size: string;
  sizeSystem: 'US' | 'EU' | 'UK' | 'CM';
  color: string;
  condition: 'new' | 'like-new' | 'good' | 'fair';
  price: number;
  compareAtPrice?: number;
  inventory: number;
  sku: string;
  images: string[];
}

export interface ProductFormData {
  id?: string;
  title: string;
  description: string;
  category: 'shoes' | 'hats' | 'bags';
  brand: string;
  gender: 'men' | 'women' | 'unisex' | 'kids';
  material: string;
  sustainabilityFeatures: string[];
  careInstructions: string;
  variants: ProductVariant[];
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  status: 'draft' | 'active' | 'archived';
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilters {
  search: string;
  category: string;
  status: string;
  condition: string;
  priceRange: [number, number];
  sustainabilityFeatures: string[];
  inStock: boolean | null;
}

export interface ProductListItem {
  id: string;
  title: string;
  category: string;
  brand: string;
  status: 'draft' | 'active' | 'archived';
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
  totalInventory: number;
  minPrice: number;
  maxPrice: number;
}

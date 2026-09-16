import { getApiBaseUrl } from './apiClient';

const apiBase = getApiBaseUrl();

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBase}${path}`);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  return response.json();
}

export type Product = {
  _id: string;
  title: string;
  description: string;
  artistName: string;
  productType?: string;
  category: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
  stock: number;
  isFeatured?: boolean;
  isCustomizable?: boolean;
  enableSizes?: boolean;
  sizes?: string[];
  enableColors?: boolean;
  colors?: string[];
  minDeliveryDays?: number;
  maxDeliveryDays?: number;
  tags?: string[];
};

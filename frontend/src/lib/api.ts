import { getApiBaseUrl } from './apiClient';

const apiBase = getApiBaseUrl();

import { cachedFetch } from './cachedFetch';

export async function apiGet<T>(path: string): Promise<T> {
  return cachedFetch<T>(`${apiBase}${path}`);
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

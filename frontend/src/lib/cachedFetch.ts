const cache = new Map<string, { data: any; time: number }>();
const TTL = 60 * 1000; // 1 minute

export async function cachedFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const method = options?.method || 'GET';

  // Do not cache highly dynamic routes or non-GET requests
  const isDynamicRoute = url.includes('/orders') || url.includes('/cart') || url.includes('/auth') || url.includes('/admin');

  if (method !== 'GET' || isDynamicRoute) {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    return response.json();
  }

  const key = url;
  const cached = cache.get(key);

  if (cached && Date.now() - cached.time < TTL) {
    console.log(`[CACHE HIT] ${url}`);
    return cached.data;
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  const data = await response.json();
  cache.set(key, { data, time: Date.now() });
  return data;
}

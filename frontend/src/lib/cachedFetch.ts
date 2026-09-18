const cache = new Map<string, { data: any; time: number }>();
const TTL = 60 * 1000; // 1 minute

export async function cachedFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const method = options?.method || 'GET';
  if (method !== 'GET') {
    return fetch(url, options).then(r => r.json());
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

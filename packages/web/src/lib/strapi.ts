export type StrapiQueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<string, unknown>
  | Array<unknown>;

export type FetchOptions = {
  method?: string;
  headers?: HeadersInit;
  body?: unknown;
  cache?: RequestCache;
  revalidate?: number;
  authToken?: string;
};

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

if (!STRAPI_URL) {
  throw new Error("Missing NEXT_PUBLIC_STRAPI_URL");
}

function buildQuery(params?: Record<string, StrapiQueryValue>) {
  if (!params) return "";
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((v, i) => {
        search.append(`${key}[${i}]`, String(v));
      });
      return;
    }

    if (typeof value === "object") {
      Object.entries(value).forEach(([k, v]) => {
        search.append(`${key}[${k}]`, String(v));
      });
      return;
    }

    search.append(key, String(value));
  });

  return search.toString() ? `?${search.toString()}` : "";
}

export async function fetchStrapi<T>(
  path: string,
  params?: Record<string, StrapiQueryValue>,
  options: FetchOptions = {}
): Promise<T> {
  const query = buildQuery(params);
  const url = `${STRAPI_URL}${path}${query}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.authToken && {
      Authorization: `Bearer ${options.authToken}`,
    }),
    ...options.headers,
  };

  const res = await fetch(url, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: options.cache,
    next:
      options.revalidate !== undefined
        ? { revalidate: options.revalidate }
        : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Strapi ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

export function getMediaUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${STRAPI_URL}${url}`;
}

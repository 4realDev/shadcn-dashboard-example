// lib/http.ts

type FetchOptions = {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: unknown;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
};

export const createHttpClient = (baseUrl: string, defaultHeaders: Record<string, string> = {}) => {
  return async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
    const url = new URL(`${baseUrl}${endpoint}`);

    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => url.searchParams.append(key, value));
    }

    const response = await fetch(url.toString(), {
      method: options.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        ...defaultHeaders,
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    // Response interceptors → handle errors globally, retry, transform response
    if (!response.ok) {
      // Handle global errors (like axios interceptors)
      // e.g., redirect to login on 401
      if (response.status === 401) {
        throw new Error("Unauthorized - redirect to login");
      }
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  };
};

// usage:
// const httpClient = createHttpClient("https://api.example.com", { Authorization: "Bearer token" });
// const data = await httpClient("/endpoint", { params: { q: "search" } });

// api/deezer.ts — external API
// const deezerClient = createHttpClient("/deezer");

// api/artists.ts — your own backend
// const apiClient = createHttpClient(
//   import.meta.env.VITE_API_URL,  // e.g. "https://your-api.com"
//   {
//     Authorization: `Bearer ${getToken()}`,  // auth header for your backend
//   }
// );

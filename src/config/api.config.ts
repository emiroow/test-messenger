// API Configuration
export const API_CONFIG = {
  baseURL:
    import.meta.env.VITE_API_URL || "https://sample-msg.asclanding.top/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
};

// SignalR Configuration
export const SIGNALR_CONFIG = {
  hubUrl:
    import.meta.env.VITE_SIGNALR_URL ||
    "https://sample-msg.asclanding.top/hubs/chat",
  automaticReconnect: true,
  reconnectDelays: [0, 2000, 5000, 10000, 30000],
};

// React Query Configuration
export const QUERY_CONFIG = {
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex: number) =>
        Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
};

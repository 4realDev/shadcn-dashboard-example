import { QueryClient } from "@tanstack/react-query";

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 0, // is default

      // Definition: If user leaves application, returns and query data is stale, react-query will automatically requests fresh data in background (refetches on windows focus)
      // The default is true, but with refetchOnWindowFocus: false this can be disabled
      refetchOnWindowFocus: false,

      // retry = 3 is the default
      // retry = false will disable retries
      // retry = 6 will retry failing requests 6 times before showing error thrown by function
      // retry = true will infinitely retry failing requests
      retry: false,

      // Definition: duration until inactive queries will be removed from the cache or time until the cached data becomes garbage collected
      // cacheTime in old react-query version -> now "garbage-collector time"
      // The default is 5 minutes
      // Important: Queries transition to inactive state as soon as there are no observers registered -> all components which use that query have unmounted.
      // gcTime: 0 means NO caching at all - everytime component unmounts and remounts, or as soon as user navigates away from page, all queries will be garbage collected and have to be reteched again - defeats one of React Query's main benefits
      // for dashboard showing data, add some limited caching
      gcTime: 1000 * 60 * 5, // 5 minutes (the default)
    },
  },
});

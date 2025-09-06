import { useInfiniteQuery, useQuery, useQueryClient } from 'react-query';
import { fetchNews, fetchNewsSources, refreshNews } from '../services/api';

export const useNews = (options = {}) => {
  return useInfiniteQuery(
    ['news', options],
    ({ pageParam = 1 }) => fetchNews(pageParam, options.perPage),
    {
      getNextPageParam: (lastPage) => lastPage.has_more ? lastPage.page + 1 : undefined,
      refetchInterval: 30 * 60 * 1000, // 30 minutes
      staleTime: 5 * 60 * 1000, // 5 minutes
      ...options.queryOptions,
    }
  );
};

export const useNewsSources = () => {
  return useQuery('newsSources', fetchNewsSources, {
    staleTime: 60 * 60 * 1000, // 1 hour
    cacheTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

export const useRefreshNews = () => {
  const queryClient = useQueryClient();
  
  const refreshMutation = useMutation(refreshNews, {
    onSuccess: () => {
      // Invalidate and refetch news queries
      queryClient.invalidateQueries('news');
    },
    onError: (error) => {
      console.error('Error refreshing news:', error);
    },
  });

  return refreshMutation;
};

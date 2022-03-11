import useSWR from 'swr';
import routes from '../routes';

export default function useTags() {
  const { data, error } = useSWR<string[]>(routes.api.tags.index);

  return {
    tags: data,
    loading: !error && !data,
    error: error,
  };
}

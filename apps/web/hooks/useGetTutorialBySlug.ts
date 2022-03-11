import useSWR from 'swr';
import { Tutorial } from '../types';
import { useDapp } from './useDapp';
import routes from '../routes';

export default function useGetTutorialBySlug(slug: string) {
  const { applicationFetcher } = useDapp();
  const { data, error } = useSWR<Tutorial>(
    routes.fetchers.tutorials.getBySlug(slug),
    async (url, slug) => applicationFetcher.getTutorialBySlug(slug),
  );

  return {
    tutorial: data,
    loading: !error && !data,
    error: error,
  };
}

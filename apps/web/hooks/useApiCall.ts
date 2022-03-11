import axios, { AxiosResponse } from 'axios';
import { useState } from 'react';

interface MutationOptions<D> {
  method?: 'post' | 'put' | 'path';
  data: D;
  onComplete?: (resp: D) => null;
  onError?: (err: Error) => null;
}

interface MutationResponse<R> {
  data: R;
  loading: boolean;
  error: Error | null;
}

type MutationMethod<D, R> = (
  mutationOptions?: MutationOptions<D>,
) => Promise<R>;

export default function useApiCall<D, R>(
  apiRoute,
  defaultOptions = { method: 'post' } as MutationOptions<D>,
): [MutationMethod<D, R>, MutationResponse<R>] {
  const [data, setData] = useState<R | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const mutationMethod: MutationMethod<D, R> = async (
    mutationOptions = {} as MutationOptions<D>,
  ): Promise<R> => {
    try {
      setLoading(true);
      setError(null);

      const options = {
        ...defaultOptions,
        ...mutationOptions,
      };
      const resp = await axios[options.method]<AxiosResponse<R>>(
        apiRoute,
        mutationOptions.data,
      );

      setData(resp.data);

      if (mutationOptions?.onComplete) {
        mutationOptions.onComplete(resp);
      }

      return resp.data;
    } catch (err) {
      setError(err);

      if (mutationOptions?.onError) {
        mutationOptions.onError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return [
    mutationMethod,
    {
      data,
      loading,
      error,
    },
  ];
}

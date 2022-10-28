import { AxiosResponse } from 'axios';
import { QueryKey, useQuery, UseQueryOptions, UseQueryResult } from 'react-query';

import { RequestOptions } from './http';

interface FetcherOptions {
  locale?: string;
  signal?: AbortSignal;
}

export type Fetcher<T, U = Record<string, any>> = (
  options?: FetcherOptions & RequestOptions,
  data?: U
) => Promise<AxiosResponse<T>>;

export type FetcherData<T extends Fetcher<any, any>> = Awaited<ReturnType<T>>['data'];

export type UseTypedQuery<T extends Fetcher<any, any>> = (
  options?: UseQueryOptions<FetcherData<T>>
) => UseQueryResult<FetcherData<T>>;

export const useTypedQuery = <T, U>(
  key: QueryKey,
  fetcher: Fetcher<T, U>,
  options?: Omit<UseQueryOptions<FetcherData<typeof fetcher>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<T>(
    key,
    ({ signal }) => fetcher({ locale: 'en' /* TODO Add loacale */, signal }).then(({ data }) => data),
    options
  );
};

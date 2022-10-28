import { AxiosResponse } from 'axios';
import { useMutation, UseMutationOptions, UseMutationResult } from 'react-query';

interface MutatorOptions {
  locale?: string;
  signal?: AbortSignal;
}

export type Mutator<T, U = any> = (data: T & MutatorOptions) => Promise<AxiosResponse<U>>;

type MutatorData<T extends Mutator<any>> = Awaited<ReturnType<T>>['data'];

export type UseTypedMutation<T extends Mutator<any>> = (
  options?: UseMutationOptions<MutatorData<T>, any, Parameters<T>[0]>
) => UseMutationResult<MutatorData<T>, any, Parameters<T>[0]>;

export const useTypedMutation = <T, U>(
  key: string,
  mutator: Mutator<T, U>,
  options?: UseMutationOptions<MutatorData<typeof mutator>, any, Parameters<typeof mutator>[0]>
) => {
  return useMutation<MutatorData<typeof mutator>, any, Parameters<typeof mutator>[0]>(
    key,
    (params) => mutator({ locale: 'en' /* TODO Add locale */, ...params }).then(({ data }) => data),
    options
  );
};

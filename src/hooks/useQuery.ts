import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';

import type { ApiTypeKeys } from 'constants/urls';

export type QueryParams<Query extends Record<string, unknown>> = Query & {
    apiType: ApiTypeKeys;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    noAI: any | undefined;
    cappNoRefferer: React.HTMLAttributeReferrerPolicy;
};

const defaultQuery: QueryParams<{}> = {
    apiType: 'production',
    noAI: undefined,
    cappNoRefferer: '',
};

type ChangeQueryOptions = {
    replace?: boolean;
    shallow?: boolean;
    scroll?: boolean;
};

type ChangeQuery<Query> = (newQuery: Partial<Query>, options?: ChangeQueryOptions) => Promise<void>;

type QueryResult<Query> = [Query, ChangeQuery<Query>];

export const useQuery = <T extends Record<string, unknown> = {}>(
    additionalQueryDefault: T = {} as T,
): QueryResult<QueryParams<Required<T>>> => {
    const { query, push, replace } = useRouter();

    const queryData = useMemo(() => ({
        ...defaultQuery,
        ...additionalQueryDefault as Required<T>,
        ...query,
    }), [query]);

    const handleChangeQuery: ChangeQuery<QueryParams<Required<T>>> = useCallback(async (newQuery, options = {}) => {
        const { replace: isReplace, shallow, scroll } = options;

        const newQueryData = {
            ...queryData,
            ...newQuery,
        };

        const routeOptions = {
            shallow,
            scroll,
        };

        if (isReplace) {
            await replace({ query: newQueryData }, undefined, routeOptions);

            return;
        }
        await push({ query: newQueryData }, undefined, routeOptions);
    }, [queryData]);

    return [queryData, handleChangeQuery];
};

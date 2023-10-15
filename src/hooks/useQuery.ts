import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { omitBy, isNil } from 'lodash';

import type { ApiTypeKeys } from 'constants/urls';

export type QueryParams<Query extends Record<string, unknown>> = Query & {
    apiType: ApiTypeKeys;
    noAI?: unknown;
    cappNoRefferer?: React.HTMLAttributeReferrerPolicy;
};

const defaultQuery: QueryParams<{}> = {
    apiType: 'production',
    noAI: undefined,
    cappNoRefferer: undefined,
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

        const newQueryData = omitBy({
            ...queryData,
            ...newQuery,
        }, isNil);

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

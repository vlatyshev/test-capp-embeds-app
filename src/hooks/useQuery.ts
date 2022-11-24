import { useRouter } from 'next/router';

import type { ApiTypeKeys } from 'constants/urls';

type UseQuery<Query> = Query & {
    apiType: ApiTypeKeys;
    noAI: any | undefined; // eslint-disable-line @typescript-eslint/no-explicit-any
    cappNoRefferer: React.HTMLAttributeReferrerPolicy;
};

const defaultQuery: UseQuery<{}> = {
    apiType: 'production',
    noAI: undefined,
    cappNoRefferer: '',
};

export const useQuery = <T extends Record<string, unknown>>(
    additionalDefault: T = {} as T,
): UseQuery<T> => {
    const { query } = useRouter();

    return {
        ...{ ...defaultQuery, ...additionalDefault },
        ...query,
    };
};

import { useRouter } from 'next/router';

import { API_URLS } from 'constants/urls';

import type { ApiTypeKeys } from 'constants/urls';

export const useApiTypeQuery = (): ApiTypeKeys => {
    const router = useRouter();

    return router.query.apiType as ApiTypeKeys ?? API_URLS.production;
};

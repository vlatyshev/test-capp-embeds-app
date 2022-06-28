import { useRouter } from 'next/router';

import { APIUrls } from 'constants/urls';

import type { ApiTypeKeys } from 'constants/urls';

export const useApiTypeQuery = (): ApiTypeKeys => {
    const router = useRouter();

    return router.query.apiType as ApiTypeKeys ?? APIUrls.production;
};

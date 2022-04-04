import { API_FILES_LIST, API_URLS } from 'constants/urls';

import type { ApiTypeKeys } from 'constants/urls';

const API_LIMIT_GET_MODELS_COUNT = 100;

const getModels = async (apiType: ApiTypeKeys, owner: string, limit: number, offset: number) => {
    const params = new URLSearchParams({
        offset: String(offset),
        owner: String(owner),
        limit: String(limit ?? '50'),
        sortBy: 'uploadedAt',
        order: 'DESC',
        shallow: '1',
    });

    const res = await fetch(`${API_FILES_LIST(apiType)}?${params}`);

    return await res.json();
};

export const getModelsFromApi = async (apiType: ApiTypeKeys, owner: string, limit: number) => {
    const maxCount = API_LIMIT_GET_MODELS_COUNT;
    const maxRound = Math.ceil(limit / maxCount);
    const minRound = Math.floor(limit / maxCount);

    const countRequests = [...new Array(maxRound)]
        .map((_, index) => index < minRound ? maxCount : limit % maxCount);

    const reqs = countRequests.map(async (limit, index) => (
        getModels(apiType, owner, limit, index === 0 ? 0 : index + API_LIMIT_GET_MODELS_COUNT))
    );

    return Promise.all(reqs);
};

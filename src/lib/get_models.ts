import { API_FILES_LIST } from 'constants/urls';

import type { ApiTypeKeys } from 'constants/urls';

export const API_LIMIT_GET_MODELS_COUNT = 100;

type ListDataResponseDTO = {
    id: string;
    type: 'file',
    links: {},
    attributes: {},
};

export type ListResponseDTO = {
    meta: {
        id: string,
        page: number;
        pages: number;
        cursor: number;
    },
    links: {
        self: string;
        next: string;
    },
    data: ListDataResponseDTO[],
};

export type ListResponseErrorDTO = {
    meta: {
        id: string;
    },
    errors: {
        status: string;
        code: number;
        title: string;
        detail: {},
    }[],
};

export const getModelsFromApi = async (
    apiType: ApiTypeKeys,
    owner: string,
    limit: number,
    offset: number = 0,
): Promise<ListResponseDTO | ListResponseErrorDTO> => {
    const limitCount = Math.min(Math.max(limit, 0), API_LIMIT_GET_MODELS_COUNT);

    const params = new URLSearchParams({
        offset: String(offset),
        owner: String(owner),
        limit: String(limitCount),
        sortBy: 'uploadedAt',
        order: 'DESC',
        shallow: '1',
    });

    const res = await fetch(`${API_FILES_LIST(apiType)}?${params}`);
    const data = await res.json();

    return data;
};

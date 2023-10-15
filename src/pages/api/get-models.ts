import { ApiTypeKeys } from 'constants/urls';

import { getModelsFromApi } from 'lib/get_models';

import type { NextApiRequest, NextApiResponse } from 'next';

type GetModelsQuery = {
    apiType?: ApiTypeKeys;
    owner?: string;
    limit?: number;
    offset?: number;
    playerOptions?: string;
};

type ResponseData = Awaited<ReturnType<typeof getModelsFromApi>>;

const handleModelAPI = async (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
    const { query } = req;
    const {
        owner,
        limit = 10,
        apiType = 'production',
        offset,
    } = query as GetModelsQuery;

    try {
        const responseData = await getModelsFromApi(
            apiType,
            owner as string,
            Number(limit),
            Number(offset),
        );
        res.status(200).json(responseData);
    } catch (e) {
        res.status(500).end(`Unhandled error: ${e}`);
    }
};

export default async function getModels(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>,
) {
    const { method } = req;

    switch (method) {
        case 'GET':
            await handleModelAPI(req, res);
            break;
        default:
            res.setHeader('Allow', ['GET']);
            res.status(405).end(`Method ${method} Not Allowed`);
            break;
    }
}

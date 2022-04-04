export enum API_URLS {
    production = 'https://api.cappasity.com/api/',
    staging = 'https://api.cappasity3d.com/api/',
};

export type ApiTypeKeys = keyof typeof API_URLS;

export const getApiUrl = (apiType: ApiTypeKeys): string => API_URLS[apiType] ?? API_URLS.production;

// Player
export const API_PLAYER_URL = (apiType: ApiTypeKeys) => `${getApiUrl(apiType)}player`;
export const API_PLAYER_AI_URL = (apiType: ApiTypeKeys) => `${API_PLAYER_URL(apiType)}/cappasity-ai`;
export const API_PLAYER_SRC = (apiType: ApiTypeKeys, modelID: string, options: string) => (
    `${API_PLAYER_URL(apiType)}/${modelID}/embedded?${options}`
);

// files
export const API_FILES_LIST = (apiType: ApiTypeKeys) => `${getApiUrl(apiType)}files`;

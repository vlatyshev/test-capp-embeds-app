import Head from 'next/head';
import { useCallback, useState } from 'react';
import clsx from 'clsx';
import { FaSearch } from 'react-icons/fa';
import { formValuesToObject } from 'utils/parseFormData';

import {
    API_LIMIT_GET_MODELS_COUNT, getModelsFromApi, ListResponseDTO, ListResponseErrorDTO,
} from 'lib/get_models';

import { Socials } from 'components/Socials';
import { ApiTypeSelect } from 'components/ApiTypeSelect';
import { Capp3DPlayer, DEFAULT_CAPP3D_PLAYER_OPTIONS } from 'components/Capp3DPlayer';
import { QueryParams, useQuery } from 'hooks/useQuery';
import { Button } from 'components/controls/Button';
import { Pagination } from 'components/Pagination';

import styles from '../../styles/Multipages.module.css';

import type { GetServerSideProps, NextPage } from 'next';

type MultipagesPageProps = {
    data: {
        modelIDs: string[];
        page: number;
        pages: number;
    };
    error?: never;
} | {
    data?: never;
    error: string;
};

type MutlipagesPageQuery = {
    owner?: string;
    limit?: number;
    id: number; // is page
    playerOptions?: string;
};

const MultipagesAsPage: NextPage<MultipagesPageProps> = ({ error, data }) => {
    const [query, setQuery] = useQuery<MutlipagesPageQuery>({
        id: 1,
        limit: 10,
        playerOptions: DEFAULT_CAPP3D_PLAYER_OPTIONS,
    });
    const { owner, limit, playerOptions } = query;

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmitSearch = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formValues = formValuesToObject(e.target as HTMLFormElement);

        setIsLoading(true);
        await setQuery({
            ...formValues,
            id: 1,
        }, { scroll: false });
        setIsLoading(false);
    }, [setQuery]);

    const handleChangePage = useCallback(async (_offset: number, page: number) => {
        setIsLoading(true);
        await setQuery({ id: page }, { scroll: false });
        setIsLoading(false);
    }, [setQuery]);

    return (
        <div className={styles.container}>
            <Head>
                <title>Test Cappasity embeds</title>
                <meta name="description" content="Tesing Cappasity embeds" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    App for testing <a href="https://3d.cappasity.com">Cappasity</a> embeds
                </h1>

                <form
                    id="model-list"
                    className={styles.search}
                    onSubmit={handleSubmitSearch}
                >
                    <ApiTypeSelect name="apiType" id="apiType" form="model-list" />
                    <div className={styles.searchContainer}>
                        <input
                            name="owner"
                            type="text"
                            className={styles.searchTerm}
                            defaultValue={owner}
                            placeholder="Search files of username"
                        />
                        <input
                            name="limit"
                            type="number"
                            className={clsx(styles.searchTerm, styles.number)}
                            max={API_LIMIT_GET_MODELS_COUNT}
                            defaultValue={limit}
                            placeholder="limit"
                        />
                    </div>
                    <div className={styles.searchContainer}>
                        <input
                            name="playerOptions"
                            type="text"
                            className={styles.searchTerm}
                            defaultValue={playerOptions}
                            placeholder="Player options"
                        />
                    </div>
                    <div className={styles.searchContainer}>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className={styles.searchButton}
                        >
                            <FaSearch />
                        </Button>
                    </div>
                </form>
                {error && <span className={styles.error}>{error}</span>}
                {data && data.modelIDs.length > 0 && (
                    <>
                        <Pagination
                            loading={isLoading}
                            currentCount={data.modelIDs.length}
                            limit={limit}
                            page={data.page}
                            pages={data.pages}
                            onPageChange={handleChangePage}
                        />
                        <div className={styles.grid}>
                            {data.modelIDs.map((modelID) => (
                                <div key={modelID} className={styles.card}>
                                    <Capp3DPlayer modelID={modelID} options={playerOptions} />
                                </div>
                            ))}
                        </div>
                        <Pagination
                            loading={isLoading}
                            currentCount={data.modelIDs.length}
                            limit={limit}
                            page={data.page}
                            pages={data.pages}
                            onPageChange={handleChangePage}
                        />
                    </>
                )}
            </main>
            <Socials />
        </div>
    );
};

export const getServerSideProps: GetServerSideProps<MultipagesPageProps> = async (ctx) => {
    const {
        owner,
        limit = 10,
        apiType,
        id,
    } = ctx.query as unknown as QueryParams<MutlipagesPageQuery>;

    try {
        const responseData = await getModelsFromApi(
            apiType,
            owner as string,
            Number(limit),
            Number((id - 1) * limit),
        );

        if ((responseData as ListResponseErrorDTO).errors) {
            const error = (responseData as ListResponseErrorDTO).errors
                .find((err) => err.title)!.title;

            return {
                props: {
                    error,
                },
            };
        }
        const { meta, data } = responseData as ListResponseDTO;
        const { page, pages } = meta;

        const modelIDs = data.map((model) => model.id);

        return {
            props: {
                data: {
                    page,
                    pages,
                    modelIDs,
                },
            },
        };
    } catch (e) {
        return {
            props: {
                error: (e as Error).toString(),
            },
        };
    }
};

export default MultipagesAsPage;

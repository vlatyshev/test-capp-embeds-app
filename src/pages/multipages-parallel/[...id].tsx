import Head from 'next/head';
import { useCallback, useState } from 'react';
import clsx from 'clsx';
import { FaSearch } from 'react-icons/fa';
import { formValuesToObject } from 'utils/parseFormData';

import {
    getParallelModelsFromApi, ListResponseDTO, ListResponseErrorDTO,
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
    };
    error?: never;
} | {
    data?: never;
    error: string;
};

type MutlipagesPageQuery = {
    owner?: string;
    limit?: number;
    playerOptions?: string;
};

const Multipages: NextPage<MultipagesPageProps> = ({ error, data }) => {
    const [query, setQuery] = useQuery<MutlipagesPageQuery>({
        owner: '',
        limit: 10,
        playerOptions: DEFAULT_CAPP3D_PLAYER_OPTIONS,
    });
    const { owner, limit, playerOptions } = query;

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmitSearch = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formValues = formValuesToObject(e.target as HTMLFormElement);

        setIsLoading(true);
        await setQuery({ ...formValues });
        setIsLoading(false);
    }, [setQuery]);

    const handleChangePage = useCallback(() => {}, []);

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
                {isLoading && <span>Loading...</span>}
                {data && data.modelIDs.length > 0 && (
                    <>
                        <Pagination
                            loading={isLoading}
                            currentCount={data.modelIDs.length}
                            limit={limit}
                            page={1}
                            pages={1}
                            onPageChange={handleChangePage}
                        />
                        <div className={styles.grid}>
                            {data.modelIDs.map((modelID) => (
                                <div key={modelID} className={styles.card}>
                                    <Capp3DPlayer modelID={modelID} options={playerOptions} />
                                </div>
                            ))}
                        </div>
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
        apiType = 'production',
    } = ctx.query as unknown as QueryParams<MutlipagesPageQuery>;

    if (owner === undefined) {
        return {
            props: {
                data: {
                    modelIDs: [],
                },
            },
        };
    }
    try {
        const responseDatas = await getParallelModelsFromApi(
            apiType,
            owner as string,
            Number(limit),
        );

        const findErrors = responseDatas.find((responseData) => {
            const respWithError = responseData as ListResponseErrorDTO;

            return respWithError.errors !== undefined;
        });

        if (findErrors) {
            const error = (findErrors as ListResponseErrorDTO).errors.find((err) => err.title);

            return {
                props: {
                    error: error?.title ?? 'Something wrong',
                    modelIDs: [],
                },
            };
        }

        const modelIDs = (responseDatas as ListResponseDTO[])
            .map((resp) => (
                resp.data.map((fileData) => fileData.id)
            )).flat();

        return {
            props: {
                data: {
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

export default Multipages;

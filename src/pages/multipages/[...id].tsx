import Head from 'next/head';
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { formValuesToObject } from 'utils/parseFormData';

import { getModelsFromApi } from 'lib/get_models';

import { Socials } from 'components/Socials';
import { ApiTypeSelect } from 'components/ApiTypeSelect';
import { Capp3DPlayer, DEFAULT_CAPP3D_PLAYER_OPTIONS } from 'components/Capp3DPlayer';
import { useQuery } from 'hooks/useQuery';

import { SearchIcon } from 'icons/search';

import styles from '../../styles/Home.module.css';

import type { ApiTypeKeys } from 'constants/urls';
import type { GetServerSideProps, NextPage } from 'next';

type HomePageProps = {
    modelIDs: string[];
    error?: null | string;
};

type HomePageQuery = {
    owner?: string;
    limit?: number;
    apiType?: ApiTypeKeys;
    playerOptions?: string;
};

const Home: NextPage<HomePageProps> = ({ modelIDs, error }) => {
    const { push, query } = useRouter();
    const { owner, limit, playerOptions } = useQuery<HomePageQuery>({
        owner: '',
        limit: 10,
        playerOptions: DEFAULT_CAPP3D_PLAYER_OPTIONS,
    });

    const handleSubmitSearch = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formValues = formValuesToObject(e.target as HTMLFormElement);

        push({
            query: { ...query, ...formValues },
        });
    }, [query]);

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

                <ApiTypeSelect name="apiType" id="apiType" form="model-list" />

                <form
                    id="model-list"
                    className={styles.search}
                    onSubmit={handleSubmitSearch}
                >
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
                            className={`${styles.searchTerm} ${styles.number}`}
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
                        <button type="submit" className={styles.searchButton}>
                            <SearchIcon />
                        </button>
                    </div>
                </form>
                {error && <div className={styles.error}>{error}</div>}
                {modelIDs.length > 0 && <div>Loaded: {modelIDs.length}</div>}

                <div className={styles.grid}>
                    {modelIDs.map((modelID) => (
                        <div key={modelID} className={styles.card}>
                            <Capp3DPlayer modelID={modelID} options={playerOptions} />
                        </div>
                    ))}
                </div>
            </main>
            <Socials />
        </div>
    );
};

/**
 * @TODO change to reusable component
 */
export const getServerSideProps: GetServerSideProps<HomePageProps> = async (ctx) => {
    const { owner, limit = 50, apiType = 'production' } = ctx.query as HomePageQuery;

    if (!owner) {
        return {
            props: {
                owner: null,
                modelIDs: [],
            },
        };
    }
    try {
        const resps = await getModelsFromApi(apiType, owner as string, Number(limit));
        const findErrors = resps.find((resp) => (
            resp.status !== undefined && resp.status !== 200
        ) || resp.errors !== undefined);

        if (findErrors) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const error = findErrors.errors.find((err: any) => err.title).title;

            return {
                props: {
                    error,
                    owner,
                    modelIDs: [],
                },
            };
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const modelIDs = resps.map((resp) => resp.data.map((fileData: any) => fileData.id)).flat();

        return {
            props: {
                owner,
                modelIDs,
            },
        };
    } catch (e) {
        return {
            props: {
                error: (e as Error).toString(),
                owner,
                modelIDs: [],
            },
        };
    }
};

export default Home;

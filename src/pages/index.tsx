import Head from 'next/head';
import React, { useCallback } from 'react';
import { useRouter } from 'next/router';

import { getModelsFromApi } from 'lib/get_models';
import { API_FILES_LIST } from 'constants/urls';
import { Capp3DPlayer } from 'components/Capp3DPlayer';
import { formValuesToObject } from 'utils/parseFormData';

import styles from '../styles/Home.module.css';

import type { GetServerSideProps, NextPage } from 'next';

type HomePageProps = {
    modelIDs: string[];
    error?: null | string;
};

const Home: NextPage<HomePageProps> = ({ modelIDs, error }) => {
    const router = useRouter();
    const { owner, limit } = router.query;

    const handleSubmitSearch = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formValues = formValuesToObject(e.target as HTMLFormElement);

        await router.push({
            pathname: '/',
            query: formValues,
        }, undefined, { shallow: true });
        router.reload();
    }, [router]);

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

                <form className={styles.search} onSubmit={handleSubmitSearch}>
                    <input
                        name="owner"
                        type="text"
                        className={styles.searchTerm}
                        defaultValue={owner ?? ''}
                        placeholder="Search files of username"
                    />
                    <input
                        name="limit"
                        type="number"
                        className={`${styles.searchTerm} ${styles.number}`}
                        defaultValue={limit ?? 50}
                        placeholder="limit"
                    />
                    <button type="submit" className={styles.searchButton}>
                        <svg width="24px" height="24px" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                            <path d="M 9 2 C 5.1458514 2 2 5.1458514 2 9 C 2 12.854149 5.1458514 16 9 16 C 10.747998 16 12.345009 15.348024 13.574219 14.28125 L 14 14.707031 L 14 16 L 20 22 L 22 20 L 16 14 L 14.707031 14 L 14.28125 13.574219 C 15.348024 12.345009 16 10.747998 16 9 C 16 5.1458514 12.854149 2 9 2 z M 9 4 C 11.773268 4 14 6.2267316 14 9 C 14 11.773268 11.773268 14 9 14 C 6.2267316 14 4 11.773268 4 9 C 4 6.2267316 6.2267316 4 9 4 z" />
                        </svg>
                    </button>
                </form>
                {error && <div className={styles.error}>{error}</div>}
                {modelIDs.length > 0 && <div>Loaded: {modelIDs.length}</div>}

                <div className={styles.grid}>
                    {modelIDs.map((modelID) => (
                        <div key={modelID} className={styles.card}>
                            <Capp3DPlayer modelID={modelID} />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (ctx) => {
    const { owner, limit } = ctx.query;

    if (!owner) {
        return {
            props: {
                owner: null,
                modelIDs: [],
            },
        };
    }
    try {
        const resps = await getModelsFromApi(owner as string, Number(limit));
        const findErrors = resps.find((resp) => (resp.status !== undefined && resp.status !== 200) || resp.errors !== undefined);

        if (findErrors) {
            const error = findErrors.errors.find((error: any) => error.title).title;
            return {
                props: {
                    error,
                    owner,
                    modelIDs: [],
                },
            };
        }

        const modelIDs = resps.map((resp) => resp.data.map((fileData: any) => fileData.id)).flat();

        return {
            props: {
                owner,
                modelIDs,
            }
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

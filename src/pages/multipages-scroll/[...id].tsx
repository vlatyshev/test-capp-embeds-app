import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import { FaSearch } from 'react-icons/fa';
import { formValuesToObject } from 'utils/parseFormData';
import clsx from 'clsx';
import { useInView } from 'react-intersection-observer';

import {
    API_LIMIT_GET_MODELS_COUNT, ListResponseDTO, ListResponseErrorDTO,
} from 'lib/get_models';

import { Socials } from 'components/Socials';
import { ApiTypeSelect } from 'components/ApiTypeSelect';
import { Capp3DPlayer, DEFAULT_CAPP3D_PLAYER_OPTIONS } from 'components/Capp3DPlayer';
import { QueryParams, useQuery } from 'hooks/useQuery';
import { Button } from 'components/controls/Button';
import { Select } from 'components/controls/Select';

import styles from '../../styles/Multipages.module.css';

import type { GetServerSideProps, NextPage } from 'next';

type MultipagesScrollPageProps = {};

type MutlipagesPageQuery = {
    owner?: string;
    limit?: number;
    playerOptions?: string;
    destroyNotInView?: number;
};

const MULTIPAGES_SCROLL_KEY = 'MULTIPAGES_MODELS_SCROLL';

const scrollFetcher = async ({
    apiType,
    owner,
    offset,
    limit,
}: QueryParams<{ owner?: string, offset: number, limit: number }>) => {
    const params = new URLSearchParams({
        offset: String(offset),
        limit: String(limit),
    });

    if (apiType !== undefined) {
        params.append('apiType', apiType);
    }
    if (owner !== undefined) {
        params.append('owner', owner);
    }

    const responseData = await fetch(`/api/get-models?${params}`);
    const jsonData = await responseData.json();

    if ((jsonData as ListResponseErrorDTO).errors) {
        const error = (jsonData as ListResponseErrorDTO).errors
            .find((err) => err.title)!.title;

        throw new Error(error);
    }
    const { meta, data } = jsonData as ListResponseDTO;
    const { page, pages, cursor } = meta;

    const modelIDs = data.map((model) => model.id);

    return {
        modelIDs,
        page,
        pages,
        cursor,
    };
};

const Capp3DPlayerWithDestroy = ({
    modelID,
    playerOptions,
    destroyNotInView,
}: {
    modelID: string;
    playerOptions: string;
    destroyNotInView: number
}) => {
    const [wasInView, setWasInView] = useState(false);
    const { ref: cardModelId, inView } = useInView({
        rootMargin: '100%',
        initialInView: true,
    });

    useEffect(() => {
        if (wasInView === true || inView) {
            return;
        }
        setWasInView(true);
    }, [inView]);

    if (destroyNotInView === 1 && wasInView) {
        // eslint-disable-next-line no-console
        console.log(modelID, 'Card destroyed');

        return null;
    }

    return (
        <div ref={cardModelId} className={styles.card}>
            <Capp3DPlayer modelID={modelID} options={playerOptions} />
        </div>
    );
};

const MultipagesScroll: NextPage<MultipagesScrollPageProps> = () => {
    const [query, setQuery] = useQuery<MutlipagesPageQuery>({
        limit: 10,
        playerOptions: DEFAULT_CAPP3D_PLAYER_OPTIONS,
    });
    const {
        apiType,
        owner,
        limit,
        playerOptions,
    } = query;
    const destroyNotInView = Number(query.destroyNotInView ?? '0');

    const {
        data = [],
        error,
        isLoading,
        size,
        setSize,
        mutate,
    } = useSWRInfinite(
        (index) => ({
            key: MULTIPAGES_SCROLL_KEY,
            apiType,
            owner,
            offset: index * limit,
            limit,
        }),
        scrollFetcher,
        {
            revalidateFirstPage: false,
        },
    );

    const handleSubmitSearch = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formValues = formValuesToObject(e.target as HTMLFormElement);

        await setQuery({ ...formValues }, { scroll: true });
        await setSize(0);
        await mutate();
    }, [setQuery]);

    const handleLoadNextPage = useCallback(() => {
        setSize((storeSize) => storeSize + 1);
    }, [setSize]);

    const modelIDs = data.map((pageData) => pageData.modelIDs).flat();
    const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined');
    const isEmpty = data?.[0]?.modelIDs.length === 0;
    const isReachingEnd = isEmpty || (data && data[data.length - 1]?.page >= data[data.length - 1]?.pages);

    const { ref: buttonRef, inView } = useInView({
        rootMargin: '100%',
    });

    useEffect(() => {
        if (isReachingEnd || isLoading || !inView) {
            return;
        }
        handleLoadNextPage();
    }, [handleLoadNextPage, inView, isLoading, data.length, isReachingEnd]);

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
                    <Select
                        name="destroyNotInView"
                        id="destroyNotInView"
                        form="model-list"
                        label="Destroy not in View"
                        defaultValue={destroyNotInView}
                        options={[
                            {
                                label: 'No',
                                value: '0',
                            },
                            {
                                label: 'Yes',
                                value: '1',
                            },
                        ]}
                    />
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
                <div className={styles.grid}>
                    {modelIDs.map((modelID) => (
                        <Capp3DPlayerWithDestroy
                            key={modelID}
                            destroyNotInView={destroyNotInView}
                            modelID={modelID}
                            playerOptions={playerOptions}
                        />
                    ))}
                </div>
                {error && <span className={styles.error}>{error.message}</span>}
                {!error && isEmpty && <span>List is empty</span>}
                {!error && isLoadingMore && !isReachingEnd && <span>Loading...</span>}
                {!error && !isLoadingMore && isReachingEnd && <span>All loaded</span>}
                <Button
                    disabled={error || isEmpty || isLoadingMore || isReachingEnd}
                    ref={buttonRef}
                    onClick={handleLoadNextPage}
                    className={styles.moreButton}
                >
                    load more
                </Button>
            </main>
            <Socials />
        </div>
    );
};

// @TODO this is bullshit, but need for fix use query params right now on client
export const getServerSideProps: GetServerSideProps<{}> = async (_) => ({
    props: {},
});

export default MultipagesScroll;

import { useCallback, useRef } from 'react';
import Head from 'next/head';
import clsx from 'clsx';

import { getApiUrl } from 'constants/urls';

import { Capp3DPlayer } from 'components/Capp3DPlayer';

import { useApiTypeQuery } from 'hooks/useApiTypeQuery';

import styles from '../styles/Home.module.css';

import type { GetServerSideProps, NextPage } from 'next';

type RotatePageProps = {
    modelIDs: string[];
};

type RotatePageQuery = {
    modelIDs?: string;
};

const Rotate: NextPage<RotatePageProps> = ({ modelIDs }) => {
    const apiTypeQuery = useApiTypeQuery();
    const iframes = useRef<(HTMLIFrameElement | null)[]>([]);

    const handleSlider = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        iframes.current.forEach((iframe) => {
            if (!iframe || !iframe.contentWindow) {
                return;
            }
            iframe.contentWindow.postMessage({ fn: 'rotateToDeg', args: [value] }, getApiUrl(apiTypeQuery));
        });
    }, []);

    const handleIframeRef = useCallback((index: number) => (ref: HTMLIFrameElement | null) => {
        iframes.current[index] = ref;
    }, []);

    return (
        <div className={styles.container}>
            <Head>
                <title>Cappasity embeds</title>
                <meta name="description" content="Cappasity embeds" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <div className={styles.grid}>
                    {modelIDs.map((modelID, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <div key={`${modelID}${index}`} className={styles.card}>
                            <Capp3DPlayer ref={handleIframeRef(index)} modelID={modelID} />
                        </div>
                    ))}
                </div>
                <input
                    type="range"
                    min="0"
                    max="359"
                    step="1"
                    defaultValue={0}
                    className={clsx(styles.rangeSlider, styles.rotateSlider)}
                    onChange={handleSlider}
                />
            </main>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps<RotatePageProps> = async (ctx) => {
    const { modelIDs } = ctx.query as RotatePageQuery;

    if (!modelIDs) {
        return {
            props: {
                modelIDs: [],
            },
        };
    }
    const parsedModelIDs = modelIDs.split(',');

    return {
        props: {
            modelIDs: parsedModelIDs,
        },
    };
};

export default Rotate;

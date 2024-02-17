import { useCallback, useEffect, useRef } from 'react';
import Head from 'next/head';
import clsx from 'clsx';
import { getApiUrl } from 'constants/urls';
import { throttle, ThrottleFunc } from 'utils/trottle';

import { Capp3DPlayer } from 'components/Capp3DPlayer';
import { useQuery } from 'hooks/useQuery';

import stylesHome from '../styles/Multipages.module.css';
import styles from '../styles/Rotate.module.css';

import type { GetServerSideProps, NextPage } from 'next';

type RotatePageProps = {
    modelIDs: string[];
};

type RotatePageQuery = {
    trottle: number;
    modelIDs?: string;
};

const iframeOpts = 'autorun=1&closebutton=0&logo=0&analytics=1&uipadx=0&uipady=0&enablestoreurl=0&storeurl=&hidehints=0&language=&autorotate=0&autorotatetime=10&autorotatedelay=2&autorotatedir=1&hidefullscreen=1&hideautorotateopt=1&hidesettingsbtn=1&enableimagezoom=1&zoomquality=1&hidezoomopt=0&arbutton=1';

const Rotate: NextPage<RotatePageProps> = ({ modelIDs }) => {
    const [query] = useQuery<RotatePageQuery>({
        trottle: 100,
    });
    const { trottle, apiType = 'staging' } = query;

    const iframes = useRef<(HTMLIFrameElement | null)[]>([]);
    const trottleFunc = useRef<ThrottleFunc>();

    const handleSlide = useCallback((value: number) => {
        iframes.current.forEach((iframe) => {
            if (!iframe || !iframe.contentWindow) {
                return;
            }
            iframe.contentWindow.postMessage({ fn: 'rotateToDeg', args: [value] }, getApiUrl(apiType));
        });
    }, []);

    const handleSliderChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        trottleFunc.current?.(parseInt(value));
    }, []);

    useEffect(() => {
        trottleFunc.current = throttle(handleSlide, trottle);
    }, [handleSlide, trottle]);

    const handleIframeRef = useCallback((index: number) => (ref: HTMLIFrameElement | null) => {
        iframes.current[index] = ref;
    }, []);

    return (
        <div className={stylesHome.container}>
            <Head>
                <title>Cappasity embeds</title>
                <meta name="description" content="Cappasity embeds" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={clsx(stylesHome.main, styles.main)}>
                <div className={clsx(stylesHome.grid, styles.grid)}>
                    {modelIDs.map((modelID, index) => (
                        <Capp3DPlayer
                            // eslint-disable-next-line react/no-array-index-key
                            key={`${modelID}${index}`}
                            options={iframeOpts}
                            modelID={modelID}
                            ref={handleIframeRef(index)}
                            className={clsx(stylesHome.card, styles.card)}
                        />
                    ))}
                </div>
                <input
                    type="range"
                    min="0"
                    max="359"
                    step="1"
                    defaultValue={0}
                    className={clsx(styles.rangeSlider, styles.rotateSlider)}
                    onChange={handleSliderChange}
                />
            </main>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps<RotatePageProps> = async (ctx) => {
    const { modelIDs } = ctx.query as Partial<RotatePageQuery>;

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

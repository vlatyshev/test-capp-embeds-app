import {
    forwardRef, memo, useCallback, useEffect, useMemo, useState,
} from 'react';
import Head from 'next/head';
import Script from 'next/script';
import clsx from 'clsx';
import { API_PLAYER_AI_URL, API_PLAYER_SRC, getApiUrl } from 'constants/urls';

import { useQuery } from 'hooks/useQuery';

import styles from './Capp3DPlayer.module.css';

interface Capp3DPlayerProps extends React.DetailedHTMLProps<
React.ButtonHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement
> {
    modelID: string;
    options?: string;
}

export const DEFAULT_CAPP3D_PLAYER_OPTIONS = 'autorun=1&closebutton=1&logo=1&analytics=1&uipadx=0&uipady=0&enablestoreurl=0&storeurl=&hidehints=0&language=&autorotate=0&autorotatetime=10&autorotatedelay=2&autorotatedir=1&hidefullscreen=1&hideautorotateopt=1&hidesettingsbtn=0&enableimagezoom=1&zoomquality=1&hidezoomopt=0&arbutton=1&width=100%&height=350';

export const Capp3DPlayer = memo(forwardRef<
HTMLIFrameElement,
Capp3DPlayerProps
>(({
    modelID,
    options = DEFAULT_CAPP3D_PLAYER_OPTIONS,
    className,
    ...props
}, ref) => {
    const [query] = useQuery();
    const { apiType, noAI, cappNoRefferer } = query;

    const playerOptions = useMemo<Record<string, string | number>>(() => {
        try {
            return Object.fromEntries(new URLSearchParams(options).entries());
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);

            return {};
        }
    }, [options]);

    const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false);

    const handleOnReadyScript = useCallback(() => {
        setIsScriptLoaded(true);
    }, []);

    useEffect(() => {
        if (!noAI) {
            setIsScriptLoaded(true);
        }
    }, [noAI]);

    if (apiType === undefined) {
        return null;
    }

    return (
        <>
            <Head>
                <link key="apicapp_preconnect" rel="preconnect" href={getApiUrl(apiType)} />
            </Head>
            {!noAI && (
                <Script
                    async
                    id={`cappasity-ai-${apiType}`}
                    key={`cappasity-ai-${apiType}`}
                    src={API_PLAYER_AI_URL(apiType)}
                    onReady={handleOnReadyScript}
                />
            )}
            {isScriptLoaded && (
                <iframe
                    ref={ref}
                    loading="lazy"
                    title="capp-player"
                    allowFullScreen
                    referrerPolicy={cappNoRefferer}
                    src={API_PLAYER_SRC(apiType, modelID, options)}
                    width={playerOptions.width ?? '100%'}
                    height={playerOptions.height ?? '350'}
                    className={clsx(styles.capp3dplayer, className)}
                    {...props}
                />
            )}
        </>
    );
}));

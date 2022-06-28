import { forwardRef } from 'react';
import Head from 'next/head';
import Script from 'next/script';

import { API_PLAYER_AI_URL, API_PLAYER_SRC, getApiUrl } from 'constants/urls';

import { useApiTypeQuery } from 'hooks/useApiTypeQuery';

import styles from './Capp3DPlayer.module.css';

interface Capp3DPlayerProps extends React.ComponentPropsWithoutRef<'input'> {
    modelID: string;
    options?: string;
}

const defaultOptions = 'autorun=1&closebutton=1&logo=1&analytics=1&uipadx=0&uipady=0&enablestoreurl=0&storeurl=&hidehints=0&language=&autorotate=0&autorotatetime=10&autorotatedelay=2&autorotatedir=1&hidefullscreen=1&hideautorotateopt=1&hidesettingsbtn=0&enableimagezoom=1&zoomquality=1&hidezoomopt=0&arbutton=1';

export const Capp3DPlayer = forwardRef<HTMLIFrameElement, Capp3DPlayerProps>(({
    modelID,
    options = defaultOptions,
}, ref) => {
    const apiTypeQuery = useApiTypeQuery();

    return (
        <>
            <Head>
                <link key="apicapp_preconnect" rel="preconnect" href={getApiUrl(apiTypeQuery)} />
            </Head>
            <Script
                async
                id={`cappasity-ai-${apiTypeQuery}`}
                key={`cappasity-ai-${apiTypeQuery}`}
                src={API_PLAYER_AI_URL(apiTypeQuery)}
            />
            <iframe
                ref={ref}
                loading="lazy"
                title="capp-player"
                allowFullScreen
                src={API_PLAYER_SRC(apiTypeQuery, modelID, options)}
                className={styles.capp3dplayer}
            />
        </>
    );
});

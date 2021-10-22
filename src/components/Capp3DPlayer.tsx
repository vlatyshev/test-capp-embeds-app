import Head from 'next/head';
import Script from 'next/script';

import { API_URL, API_PLAYER_URL } from 'constants/urls';

import styles from './Capp3DPlayer.module.css';

interface Capp3DPlayerProps {
    modelID: string;
    options?: string;
}

const scriptSrc = `${API_PLAYER_URL}/cappasity-ai`;

const getPlayerSrc = (modelID: string, options: string) => (
    `${API_PLAYER_URL}/${modelID}/embedded?${options}`
);

const defaultOptions = 'autorun=1&closebutton=1&logo=1&analytics=1&uipadx=0&uipady=0&enablestoreurl=0&storeurl=&hidehints=0&language=&autorotate=0&autorotatetime=10&autorotatedelay=2&autorotatedir=1&hidefullscreen=1&hideautorotateopt=1&hidesettingsbtn=0&enableimagezoom=1&zoomquality=1&hidezoomopt=0&arbutton=1';

export const Capp3DPlayer = ({ modelID, options = defaultOptions }: Capp3DPlayerProps) => (
    <>
        <Head>
            <link key="apicapp_preconnect" rel="preconnect" href={API_URL} />
        </Head>
        <Script
            async
            id="cappasity-ai"
            key="cappasity-ai"
            src={scriptSrc}
        />
        <iframe
            loading="lazy"
            allowFullScreen
            src={getPlayerSrc(modelID, options)}
            className={styles.capp3dplayer}
        />
    </>
);

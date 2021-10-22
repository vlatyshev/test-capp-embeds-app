import { Capp3DPlayer } from 'components/Capp3DPlayer';
import type { NextPage } from 'next';
import Head from 'next/head';

import styles from '../styles/Home.module.css';

const modelIDs = [
    '905c81a3-703a-475a-b802-534094f3b1d6',
    '92f888bd-c4a0-4798-9360-a0ed13cb7b83',
];

const Home: NextPage = () => (
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

export default Home;

import Head from 'next/head';
import Link from 'next/link';

import styles from '../styles/Home.module.css';

import type { NextPage } from 'next';

const Home: NextPage = () => (
    <div className={styles.container}>
        <Head>
            <title>Routes</title>
            <meta name="description" content="Tesing Cappasity embeds" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
            <h1 className={styles.title}>
                Routes
            </h1>
            <ul>
                <li>
                    <Link href="/multipages/1" className={styles.url}>Multipages - pages with models of user</Link>
                </li>
                <li>
                    <Link href="/multipages-scroll/1" className={styles.url}>Multipages Infinity Scroll - infinity scroll pages with models of user</Link>
                </li>
                <li>
                    <Link href="rotate" className={styles.url}>Rotate - rotate models by scroll</Link>
                </li>
            </ul>
        </main>
    </div>
);

export default Home;

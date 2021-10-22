import type { NextPage } from 'next'
import Head from 'next/head'

import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Test Cappasity embeds</title>
        <meta name="description" content="Tesing Cappasity embeds" />
        <link rel="icon" href="/favicon.ico" />
        <script async src="https://api.cappasity3d.com/api/player/cappasity-ai"></script>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          App for testing <a href="https://3d.cappasity.com">Cappasity</a> embeds
        </h1>

        <div className={styles.grid}>
          <div className={styles.card}>
            <iframe width="100%" height="400px" frameBorder="0" allowFullScreen style={{ border: 0 }} src="https://api.cappasity3d.com/api/player/905c81a3-703a-475a-b802-534094f3b1d6/embedded?autorun=1&closebutton=1&logo=1&analytics=1&uipadx=0&uipady=0&enablestoreurl=0&storeurl=&hidehints=0&language=&autorotate=0&autorotatetime=6.6347322&autorotatedelay=2&autorotatedir=1&hidefullscreen=1&hideautorotateopt=1&hidesettingsbtn=0" ></iframe>
          </div>
          <div className={styles.card}>
            <iframe width="100%" height="400px" frameBorder="0" allowFullScreen style={{ border: 0 }} src="https://api.cappasity3d.com/api/player/92f888bd-c4a0-4798-9360-a0ed13cb7b83/embedded?autorun=1&closebutton=1&logo=1&analytics=1&uipadx=0&uipady=0&enablestoreurl=0&storeurl=&hidehints=0&language=&autorotate=0&autorotatetime=10&autorotatedelay=2&autorotatedir=1&hidefullscreen=1&hideautorotateopt=1&hidesettingsbtn=0&enableimagezoom=1&zoomquality=1&hidezoomopt=0&arbutton=1" ></iframe>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home

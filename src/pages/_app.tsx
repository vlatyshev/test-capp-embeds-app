import { Socials } from 'components/Socials';

import '../styles/globals.css';

import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Socials />
    </>
  );
}
export default MyApp;

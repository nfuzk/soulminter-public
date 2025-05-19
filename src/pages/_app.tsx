import { AppProps } from "next/app";
import Head from "next/head";
import { FC } from "react";
import { Analytics } from '@vercel/analytics/react';
import { ContextProvider } from "../contexts/ContextProvider";
import { AppBar } from "../components/AppBar";
import { ContentContainer } from "../components/ContentContainer";
import Notifications from "../components/Notification";
import { NotificationsProvider } from "../contexts/NotificationsContext";

import "@solana/wallet-adapter-react-ui/styles.css";
import '../styles/globals.css';

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Solana Token Creator</title>
      </Head>

      <NotificationsProvider>
        <ContextProvider>
          <div className="flex h-screen flex-col">
            <Notifications />
            <AppBar />
            <ContentContainer>
              <Component {...pageProps} />
            </ContentContainer>
          </div>
        </ContextProvider>
      </NotificationsProvider>
      <Analytics />
    </>
  );
};

export default App;

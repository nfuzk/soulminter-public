import { AppProps } from "next/app";
import Head from "next/head";
import { FC } from "react";
import { ContextProvider } from "../contexts/ContextProvider";
import { CookieConsentProvider } from "../contexts/CookieConsentContext";
import { AppBar } from "../components/AppBar";
import { ContentContainer } from "../components/ContentContainer";
import Notifications from "../components/Notification";
import Footer from "../components/Footer";
import { NotificationsProvider } from "../contexts/NotificationsContext";
import CookieConsentManager from "../components/CookieConsentManager";
import ConditionalAnalytics from "../components/ConditionalAnalytics";
import ConditionalGoogleFonts from "../components/ConditionalGoogleFonts";

import "@solana/wallet-adapter-react-ui/styles.css";
import '../styles/globals.css';

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>SoulMinter – Create Solana Tokens Instantly | No-Code Token Creator</title>
        <meta name="description" content="Create Solana tokens instantly with SoulMinter. No coding required. Launch your SPL token in minutes with our secure, fast, and user-friendly platform. Join our affiliate program to earn SOL." />
        <meta name="keywords" content="Solana token creator, SPL token, create Solana token, no-code token creation, crypto token maker, SoulMinter, Solana token launch, token generator, affiliate program, earn SOL" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="author" content="SoulMinter" />
        <meta name="revisit-after" content="7 days" />
        <meta name="theme-color" content="#000000" />
      </Head>

      <CookieConsentProvider>
        <NotificationsProvider>
          <ContextProvider>
            <div className="min-h-screen flex flex-col">
              <Notifications />
              <AppBar />
              <div className="flex-1">
                <ContentContainer>
                  <Component {...pageProps} />
                </ContentContainer>
              </div>
              <Footer />
              <CookieConsentManager />
            </div>
            <ConditionalAnalytics />
            <ConditionalGoogleFonts />
          </ContextProvider>
        </NotificationsProvider>
      </CookieConsentProvider>
    </>
  );
};

export default App;

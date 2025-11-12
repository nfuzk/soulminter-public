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
import GoogleAnalytics from "../components/GoogleAnalytics";
import { AffiliateTracker } from "../components/AffiliateTracker";
import { WalletTracker } from "../components/WalletTracker";

import "@solana/wallet-adapter-react-ui/styles.css";
import '../styles/globals.css';
import { registerMobileWalletAdapter } from '../utils/mobileWalletAdapter';

// Register MWA BEFORE any components render
// This ensures MWA is available when WalletProvider scans for wallets
if (typeof window !== 'undefined') {
  registerMobileWalletAdapter();
}

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        {/* Default meta; individual pages set specific titles & descriptions */}
        <meta name="description" content="SoulMinter – Create Solana tokens instantly with our no-code platform." />
        <meta name="keywords" content="Solana token creator, SPL token, token creation, SoulMinter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="en" />
        <meta name="author" content="SoulMinter" />
        <meta name="revisit-after" content="7 days" />
        <meta name="theme-color" content="#000000" />
      </Head>

      <CookieConsentProvider>
        <NotificationsProvider>
          <ContextProvider>
            <AffiliateTracker />
            <WalletTracker />
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
            <GoogleAnalytics />
            <ConditionalGoogleFonts />
          </ContextProvider>
        </NotificationsProvider>
      </CookieConsentProvider>
    </>
  );
};

export default App;

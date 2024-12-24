import type { AppProps } from 'next/app'
import Head from 'next/head'
import '@/styles/globals.css'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HolyLoader from 'holy-loader'
import { useContext, useState } from 'react'
import { AuthContext, AuthContextProvider } from './providers'
import AuthModal from './components/Auth/AuthModal'
import MUIProvider from './components/MUIProvider'

const APP_NAME = 'AssetWise Careers'

const AppContent = ({ Component, pageProps, router }: AppProps) => {
  const authContext = useContext(AuthContext);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  return (
    <>
      <MUIProvider>
        <Header />
        <HolyLoader color='#123F6D' />
        <Component {...pageProps} />
        <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(data) => {
          setIsAuthModalOpen(false);
          authContext?.refreshAuth;
        }}
        router={router}
          authContext={authContext}
        />
      </MUIProvider>
    </>
  );
};

export default function App(props: AppProps) {
  return (
    <>
      <Head>
        <title>{ APP_NAME }</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="AssetWise Careers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthContextProvider>
        <AppContent {...props} />
      </AuthContextProvider>
      <Footer />
    </>
  );
} 
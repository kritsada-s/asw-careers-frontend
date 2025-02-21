import type { AppProps } from 'next/app'
import Head from 'next/head'
import '@/styles/globals.css'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import HolyLoader from 'holy-loader'
import { useContext, useState } from 'react'
import { AuthContext } from './providers'
import AuthProvider from './providers'
import AuthModal from '../components/Auth/AuthModal'
import MUIProvider from '../components/MUIProvider'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import Script from 'next/script'

const APP_NAME = 'AssetWise Careers'

const AppContent = ({ Component, pageProps, router }: AppProps) => {
  const authContext = useContext(AuthContext);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  return (
    <>
      <Header />
      <HolyLoader color='#123F6D' />
      <Component {...pageProps} />
      <Dialog open={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)}>
        <DialogTitle>กรุณากรอกข้อมูลของคุณ</DialogTitle>
        <DialogContent>
          
        </DialogContent>
      </Dialog>
    </>
  );
};

export default function App(props: AppProps) {
  return (
    <MUIProvider>
      <Head>
        <title>{ APP_NAME }</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="ค้นพบโอกาสงานที่แอสเซทไวส์ ! เว็บไซต์รวมตำแหน่งงานว่างในเครือผู้พัฒนาอสังหาริมทรัพย์ชั้นนำ ทั้งด้านพัฒนาโครงการและขาย  ร่วมเป็นส่วนหนึ่งของทีมงานมืออาชีพกับเรา" />
        <link rel="icon" href="favicon.ico" />
      </Head>
      <AuthProvider>
        <AppContent {...props} />
        <Script src="https://cookiecdn.com/cwc.js" />
        <Script id="cookieWow" type="text/javascript" src="https://cookiecdn.com/configs/y8wWLFhwe78ceFYuZNs2Nb7p" data-cwcid="y8wWLFhwe78ceFYuZNs2Nb7p" />
      </AuthProvider>
      <Footer />
    </MUIProvider>
  );
} 
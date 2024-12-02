import type { Metadata } from "next";
import "./globals.css";
import MUIProvider from './components/MUIProvider';
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HolyLoader from "holy-loader";
import localFont from 'next/font/local';
import { AuthContextProvider } from './providers';

const dbFont = localFont({
  src: [
    { path: '../public/fonts/DBHeavent322/DBHeaventThinv322.ttf', weight: '200', style: 'normal' },
    // { path: '../public/fonts/DBHeavent322/DBHeaventThinv322.woff', weight: '200', style: 'normal' },
    { path: '../public/fonts/DBHeavent322/DBHeaventThinv322.woff2', weight: '200', style: 'normal' },

    { path: '../public/fonts/DBHeavent322/DBHeaventLiv322.ttf', weight: '300', style: 'normal' },
    // { path: '../public/fonts/DBHeavent322/DBHeaventLiv322.woff', weight: '300', style: 'normal' },
    { path: '../public/fonts/DBHeavent322/DBHeaventLiv322.woff2', weight: '300', style: 'normal' },

    { path: '../public/fonts/DBHeavent322/DBHeaventv322.ttf', weight: '400', style: 'normal' },
    // { path: '../public/fonts/DBHeavent322/DBHeaventv322.woff', weight: '400', style: 'normal' },
    { path: '../public/fonts/DBHeavent322/DBHeaventv322.woff2', weight: '400', style: 'normal' },

    { path: '../public/fonts/DBHeavent322/DBHeaventMedv322.ttf', weight: '500', style: 'normal' },
    // { path: '../public/fonts/DBHeavent322/DBHeaventMedv322.woff', weight: '500', style: 'normal' },
    { path: '../public/fonts/DBHeavent322/DBHeaventMedv322.woff2', weight: '500', style: 'normal' },

    { path: '../public/fonts/DBHeavent322/DBHeaventBdv322.ttf', weight: '600', style: 'normal' },
    // { path: '../public/fonts/DBHeavent322/DBHeaventBdv322.woff', weight: '600', style: 'normal' },
    { path: '../public/fonts/DBHeavent322/DBHeaventBdv322.woff2', weight: '600', style: 'normal' },

    { path: '../public/fonts/DBHeavent322/DBHeaventBlkv322.ttf', weight: '700', style: 'normal' },
    // { path: '../public/fonts/DBHeavent322/DBHeaventBlkv322.woff', weight: '700', style: 'normal' },
    { path: '../public/fonts/DBHeavent322/DBHeaventBlkv322.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-db'
});

export const metadata: Metadata = {
  title: "AssetWise Careers",
  description: "Find right jobs at AssetWise.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dbFont.variable}>
      <body className="font-db">
        <AuthContextProvider>
          <MUIProvider>
            <HolyLoader color="#123F6D"/>
            <Header/>
            {children}
            <Footer/>
          </MUIProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}

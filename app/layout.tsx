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
    { path: '../public/fonts/DBHeavent322/DB Heavent Thin v3.2.2.ttf', weight: '200', style: 'normal' },
    { path: '../public/fonts/DBHeavent322/DB Heavent Thin v3.2.2.woff', weight: '200', style: 'normal' },
    { path: '../public/fonts/DBHeavent322/DB Heavent Thin v3.2.2.woff2', weight: '200', style: 'normal' },
    { path: '../public/fonts/DBHeavent322/DB Heavent Li v3.2.2.ttf', weight: '300', style: 'normal' },
    { path: '../public/fonts/DBHeavent322/DB Heavent Li v3.2.2.woff', weight: '300', style: 'normal' },
    { path: '../public/fonts/DBHeavent322/DB Heavent Li v3.2.2.woff2', weight: '300', style: 'normal' },
    { path: '../public/fonts/DBHeavent322/DB Heavent v3.2.2.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/DBHeavent322/DB Heavent v3.2.2.woff', weight: '400', style: 'normal' },
    { path: '../public/fonts/DBHeavent322/DB Heavent v3.2.2.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/DBHeavent322/DB Heavent Med v3.2.2.ttf', weight: '500', style: 'normal' },
    { path: '../public/fonts/DBHeavent322/DB Heavent Med v3.2.2.woff', weight: '500', style: 'normal' },
    { path: '../public/fonts/DBHeavent322/DB Heavent Med v3.2.2.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/DBHeavent322/DB Heavent Bd v3.2.2.ttf', weight: '600', style: 'normal' },
    { path: '../public/fonts/DBHeavent322/DB Heavent Bd v3.2.2.woff', weight: '600', style: 'normal' },
    { path: '../public/fonts/DBHeavent322/DB Heavent Bd v3.2.2.woff2', weight: '600', style: 'normal' },
    { path: '../public/fonts/DBHeavent322/DB Heavent Blk v3.2.2.ttf', weight: '700', style: 'normal' },
    { path: '../public/fonts/DBHeavent322/DB Heavent Blk v3.2.2.woff', weight: '700', style: 'normal' },
    { path: '../public/fonts/DBHeavent322/DB Heavent Blk v3.2.2.woff2', weight: '700', style: 'normal' },
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
  const token = 'test';
  return (
    <html lang="en">
      <AuthContextProvider>
        <MUIProvider>
          <body className={`${dbFont.variable} font-db`}>
            <HolyLoader color="#123F6D"/>
            <Header/>
            {children}
            <Footer/>
          </body>
        </MUIProvider>
      </AuthContextProvider>
    </html>
  );
}

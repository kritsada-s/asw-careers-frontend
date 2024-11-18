import type { Metadata } from "next";
import "./globals.css";
import MUIProvider from './components/MUIProvider';
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HolyLoader from "holy-loader";

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
    <html lang="en">
      <MUIProvider>
        <body >
            <HolyLoader color="#123F6D"/>
            <Header/>
            {children}
            <Footer/>
        </body>
      </MUIProvider>
    </html>
  );
}

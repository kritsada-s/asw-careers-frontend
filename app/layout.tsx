import type { Metadata } from "next";
import "./globals.css";
import MUIProvider from './components/MUIProvider';
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

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
            <Header/>
            {children}
            <Footer/>
        </body>
      </MUIProvider>
    </html>
  );
}

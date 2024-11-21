import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HolyLoader from "holy-loader";
import MantineProviderWrapper from "./providers";

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
        <body>
          <HolyLoader color="#123F6D"/>
          <MantineProviderWrapper>
            <Header/>
            {children}
            <Footer/>
          </MantineProviderWrapper>
        </body>
    </html>
  );
}

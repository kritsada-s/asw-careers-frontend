import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ThemeProvider from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import theme from "./theme";
import MUIProvider from './components/MUIProvider';
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

const fontSans = localFont({
  src: [
    {
      path: "./fonts/DBHeavent.woff2",
      weight: "400",
      style: "normal",
    },
    // {
    //   path: "./fonts/DBHeavent.woff",
    //   weight: "400",
    //   style: "normal",
    // },
    // {
    //   path: "./fonts/DBHeaventBD.woff",
    //   weight: "bold",
    //   style: "normal",
    // },
    {
      path: "./fonts/DBHeaventBD.woff2",
      weight: "bold",
      style: "normal",
    },
    // {
    //   path: "./fonts/DBHeaventThin.woff",
    //   weight: "300",
    //   style: "normal",
    // },
    {
      path: "./fonts/DBHeaventThin.woff2",
      weight: "300",
      style: "normal",
    },
    // {
    //   path: "./fonts/DBHeaventUlLi.woff",
    //   weight: "200",
    //   style: "normal",
    // },
    {
      path: "./fonts/DBHeaventUlLi.woff2",
      weight: "200",
      style: "normal",
    },
  ],
  variable: "--font-sans",
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
    <html lang="en">
      <MUIProvider>
        <body className={fontSans.variable}>
            <Header/>
            {children}
            <Footer/>
        </body>
      </MUIProvider>
    </html>
  );
}

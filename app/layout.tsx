import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ThemeProvider from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import theme from "./theme";
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

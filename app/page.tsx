import Image from "next/image";
import { Button } from "@mui/material";
import x from "../public/images/fb-o.png"
import HomeSearchHeader from "./components/layout/HomeSearchHeader";
import WelfareBenefit from "./components/layout/WelfareBenefit";
import HomeJobsListed from "./components/layout/HomeJobsListed";

export default function Home() {
  return (
    <>
      <HomeSearchHeader/>
      <HomeJobsListed/>
      <WelfareBenefit/>
    </>
  );
}

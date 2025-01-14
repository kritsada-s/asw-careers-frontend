import HomeSearchHeader from "../components/layout/HomeSearchHeader";
import WelfareBenefit from "../components/layout/WelfareBenefit";
import HomeJobsListed from "../components/layout/HomeJobsListed";
import HomeWorksLocation from "../components/layout/HomeWorksLocation";
import { Analytics } from "@vercel/analytics/react";

export default function Home() {
  return (
    <>
      <HomeSearchHeader/>
      <HomeJobsListed/>
      <WelfareBenefit/>
      <HomeWorksLocation/>
      <Analytics />
    </>
  );
}

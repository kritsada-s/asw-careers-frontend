import HomeSearchHeader from "./components/layout/HomeSearchHeader";
import WelfareBenefit from "./components/layout/WelfareBenefit";
import HomeJobsListed from "./components/layout/HomeJobsListed";
import HomeWorksLocation from "./components/layout/HomeWorksLocation";
import Crypt from "@/lib/Crypt";

export default function Home() {
  return (
    <>
      <HomeSearchHeader/>
      <HomeJobsListed/>
      <WelfareBenefit/>
      <HomeWorksLocation/>
    </>
  );
}

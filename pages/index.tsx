import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import HomeJobsListed from "./components/layout/HomeJobsListed";
import HomeSearchHeader from "./components/layout/HomeSearchHeader";
import HomeWorksLocation from "./components/layout/HomeWorksLocation";
import WelfareBenefit from "./components/layout/WelfareBenefit";

export default function Home() {
  return (
    <main>
      <HomeSearchHeader/>
      <HomeJobsListed/>
      <WelfareBenefit/>
      <HomeWorksLocation/>
    </main>
  )
} 
"use client"

import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AuthContext } from "@/pages/providers";
import { useDisclosure } from "@nextui-org/react";
import router from "next/router";
import AuthModal from "../Auth/AuthModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const authContext = useContext(AuthContext);

  const menuItems = [
    "ตำแหน่งงาน",
    "สวัสดิการ",
    "ติดต่อ HRX",
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const checkLogin = () => {
    if (authContext?.CandidateID) {
      router.push('/profile');
    } else {
      console.log(authContext);
      authContext?.setShowAuthModal(true);
    }
  }

  return (
    <section id="header" className="bg-white py-3 md:py-4 shadow fixed w-full top-0 z-20">
      <div className="container flex justify-between px-3 lg:px-0">
        <div className="logo-wrapper flex items-center max-w-[170px]">
          <Link href="/" title="">
            <Image src="/images/logo.png" alt="" width={170} height={34} className="w-24 h-auto md:w-auto" priority/>
          </Link>
        </div>
        <div className="menu-wrapper flex gap-4">
          <nav className="hidden md:flex gap-4 items-center">
            <Link href={{ pathname:'/jobs' }} title="">ตำแหน่งงาน</Link>
            <Link href="/#welfareBenefit" title="">สวัสดิการ</Link>
          </nav>
          <button onClick={()=>checkLogin()} className="leading-none px-4 py-1 font-semibold text-white bg-leadfrog-green hover:bg-kryptonite-green rounded-full">ตรวจสอบสถานะ</button>
        </div>
      </div>
    </section>
  );
};

export default Header;
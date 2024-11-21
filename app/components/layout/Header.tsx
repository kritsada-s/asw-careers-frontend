"use client"

import { useState } from "react";
import { Button } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import AuthModal from "../Auth/AuthModal";
//import { useModal } from "../MUIProvider";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthopen, setIsAuthOpen] = useState(false);
  //const { openModal } = useModal();

  const menuItems = [
    "ตำแหน่งงาน",
    "สวัสดิการ",
    "ติดต่อ HRX",
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const checkLogin = () => {
    if (typeof window !== 'undefined') {
      if (window?.localStorage.getItem('authToken')) {
        window.location.href = '/profile'
      } else {
        setIsAuthOpen(true);
      }
    }
  }

  return (
    <section id="header" className="bg-white py-3 md:py-4 shadow fixed w-full top-0 z-20">
      <div className="container flex justify-between px-3 lg:px-0">
        <div className="logo-wrapper flex items-center max-w-[170px]">
          <Link href="/" title="">
            <Image src="/images/logo.png" alt="" width={170} height={34} className="max-w-28 h-auto w-auto"/>
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
      <AuthModal isOpen={isAuthopen} onClose={()=>setIsAuthOpen(false)}/>
    </section>
  );
};

export default Header;
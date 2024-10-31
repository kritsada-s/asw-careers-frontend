"use client"

import { useState } from "react";
import { Button } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import AuthModal from "../Auth/AuthModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthopen, setIsAuthOpen] = useState(false);

  const menuItems = [
    "ตำแหน่งงาน",
    "สวัสดิการ",
    "ติดต่อ HRX",
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const checkLogin = () => {
    if (localStorage.authToken) {
      window.location.href = '/profile'
    } else {
      setIsAuthOpen(true)
    }
  }

  return (
    <section id="header" className="bg-white py-3 md:py-4 shadow fixed w-full top-0 z-10">
      <div className="container flex justify-between px-3 lg:px-0">
        <div className="logo-wrapper flex items-center">
          <Link href="/" title="">
            <Image src="/images/logo.png" alt="" width={172} height={36} className="w-24 h-auto md:w-auto"/>
          </Link>
        </div>
        <div className="menu-wrapper flex gap-4">
          <nav className="hidden md:flex gap-4 items-center">
            <Link href={{ pathname:'jobs' }} title="">ตำแหน่งงาน</Link>
            <Link href="/#welfareBenefit" title="">สวัสดิการ</Link>
          </nav>
          <Button onClick={()=>checkLogin()} variant="contained" color="success" size="medium" className="leading-none rounded-xl px-4 font-semibold">ตรวจสอบสถานะ</Button>
        </div>
      </div>
      <AuthModal isOpen={isAuthopen} onClose={()=>setIsAuthOpen(false)}/>
    </section>
  );
};

export default Header;
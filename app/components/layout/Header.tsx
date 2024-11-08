"use client"

import { useState } from "react";
import { Button } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import AuthModal from "../Auth/AuthModal";
import { useModal } from "../MUIProvider";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthopen, setIsAuthOpen] = useState(false);
  const { openModal } = useModal();

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
        openModal({
          type: 'auth',
          props: {
            initialStep: 'otp'
        },
        onSuccess: (data) => {
          console.log('Login successful:', data);
        },
        onError: (error) => {
          console.error('Login failed:', error);
          }
        });
      } 
    }
  }

  return (
    <section id="header" className="bg-white py-3 md:py-4 shadow fixed w-full top-0 z-20">
      <div className="container flex justify-between px-3 lg:px-0">
        <div className="logo-wrapper flex items-center">
          <Link href="/" title="">
            <Image src="/images/logo.png" alt="" width={172} height={36} className="w-24 h-auto md:w-auto"/>
          </Link>
        </div>
        <div className="menu-wrapper flex gap-4">
          <nav className="hidden md:flex gap-4 items-center">
            <Link href={{ pathname:'/jobs' }} title="">ตำแหน่งงาน</Link>
            <Link href="/#welfareBenefit" title="">สวัสดิการ</Link>
          </nav>
          <Button onClick={()=>checkLogin()} variant="contained" color="success" size="medium" className="leading-none px-4 font-semibold" sx={{ borderRadius: '30px' }}>ตรวจสอบสถานะ</Button>
        </div>
      </div>
      <AuthModal isOpen={isAuthopen} onClose={()=>setIsAuthOpen(false)}/>
    </section>
  );
};

export default Header;
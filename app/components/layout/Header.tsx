"use client"

import { useState } from "react";
import { Button } from "@mui/material";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    "ตำแหน่งงาน",
    "สวัสดิการ",
    "ติดต่อ HRX",
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <section id="header" className="bg-white py-3 md:py-4 shadow-md">
      <div className="container flex justify-between px-3 lg:px-0">
        <div className="logo-wrapper flex items-center">
          <Link href="#" title="">
            <Image src="/images/logo.png" alt="" width={172} height={36} className="w-24 h-auto md:w-auto"/>
          </Link>
        </div>
        <div className="menu-wrapper flex gap-4">
          <nav className="hidden md:flex gap-4 items-center">
            <a href="#" title="">ตำแหน่งงาน</a>
            <a href="#" title="">สวัสดิการ</a>
          </nav>
          <Button variant="contained" color="success" size="medium" className="leading-none rounded-xl px-4 font-semibold">ตรวจสอบสถานะ</Button>
        </div>
      </div>
    </section>
  );
};

export default Header;
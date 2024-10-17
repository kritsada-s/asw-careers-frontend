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
    <section id="header" className="bg-white py-4 shadow-md">
      <div className="container flex justify-between">
        <div className="logo-wrapper">
          <Link href="#" title="">
            <Image src="/images/logo.png" alt="" width={172} height={36} className="h-auto w-auto"/>
          </Link>
        </div>
        <div className="menu-wrapper flex gap-4">
          <nav className="flex gap-4 items-center">
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
"use client"

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image src="/logo.png" alt="Logo" width={120} height={40} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4">
            <Link href="/positions" className="text-gray-600 hover:text-gray-900">
              ตำแหน่งงาน
            </Link>
            <Link href="/benefits" className="text-gray-600 hover:text-gray-900">
              สวัสดิการ
            </Link>
          </nav>

          {/* Application Status Button */}
          <button
            className="hidden md:block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => {/* Open modal logic here */}}
          >
            ตรวจสอบสถานะการสมัคร
          </button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-500 hover:text-gray-700"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-2">
            <Link href="/positions" className="block text-gray-600 hover:text-gray-900 py-2">
              ตำแหน่งงาน
            </Link>
            <Link href="/benefits" className="block text-gray-600 hover:text-gray-900 py-2">
              สวัสดิการ
            </Link>
            <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-2"
              onClick={() => {/* Open modal logic here */}}
            >
              ตรวจสอบสถานะการสมัคร
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
// components/HomeWorksLocation.tsx
"use client";

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface LocationData {
  id: number;
  title: string;
  address: string;
  imagePath: string;
  mapUrl: string;
}

const locationData: LocationData[] = [
  {
    id: 1,
    title: "สำนักงานใหญ่",
    address: "อาคาร กรุงเทพประกันภัย ชั้น 18-19 เลขที่ 25 ถนนสาธรใต้ แขวงทุ่งมหาเมฆ เขตสาทร กทม.",
    imagePath: "/images/location-1.jpg",
    mapUrl: "https://maps.google.com/?q=bangkok"
  },
  {
    id: 2,
    title: "สำนักงานสาขาอโศก",
    address: "อาคาร Exchange Tower ชั้น 10 เลขที่ 388 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กทม.",
    imagePath: "/images/location-2.jpg",
    mapUrl: "https://maps.google.com/?q=asoke"
  },
  {
    id: 3,
    title: "สำนักงานสาขาพัทยา",
    address: "เลขที่ 99/99 หมู่ 9 ถนนสุขุมวิท ตำบลหนองปรือ อำเภอบางละมุง จังหวัดชลบุรี",
    imagePath: "/images/location-3.jpg",
    mapUrl: "https://maps.google.com/?q=pattaya"
  },
  {
    id: 4,
    title: "สำนักงานสาขาระยอง",
    address: "เลขที่ 88/88 ถนนสุขุมวิท ตำบลเนินพระ อำเภอเมืองระยอง จังหวัดระยอง",
    imagePath: "/images/location-4.jpg",
    mapUrl: "https://maps.google.com/?q=rayong"
  }
];

export default function HomeWorksLocation() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side - Image */}
        <div className="w-full md:w-1/2 h-[500px] relative">
          <Image
            src={locationData[activeIndex].imagePath}
            alt={locationData[activeIndex].title}
            fill
            className="object-cover rounded-lg transition-opacity duration-500"
            priority
          />
        </div>

        {/* Right side - Content */}
        <div className="w-full md:w-1/2">
          <h3 className="text-2xl md:text-3xl font-bold mb-8">สถานที่ทำงาน</h3>
          
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            onSlideChange={handleSlideChange}
            className="h-[300px]"
            loop={true}
            // breakpoints={{
            //   640: { slidesPerView: 2 },
            //   768: { slidesPerView: 3 },
            //   1024: { slidesPerView: 4 },
            // }}
          >
            {locationData.map((location) => (
              <SwiperSlide key={location.id}>
                <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
                  <h4 className="font-semibold text-lg mb-3">
                    {location.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    {location.address}
                  </p>
                  <a
                    href={location.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors w-full"
                  >
                    Google Maps
                  </a>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
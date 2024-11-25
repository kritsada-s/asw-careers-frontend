// components/HomeWorksLocation.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import Image from 'next/image';
import { MapPinned } from 'lucide-react';

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
    title: "แอสเซทไวส์ สำนักงานใหญ่",
    address: "9 ซอยรามอินทรา 5 แยก 23 แขวงอนุสาวรีย์ เขตบางเขน กรุงเทพฯ 10220",
    imagePath: "/images/asw-hq.webp",
    mapUrl: "https://maps.app.goo.gl/Mv5XcAy6nChG2RMS9"
  },
  {
    id: 2,
    title: "The Title สำนักงานกรุงเทพฯ",
    address: "444 - 444/1 ถนนประชาอุทิศ ห้วยขวาง เขตห้วยขวาง กรุงเทพฯ 10310",
    imagePath: "/images/thetitle_hkt.webp",
    mapUrl: "https://maps.app.goo.gl/as3GJUcwTs8BiMcb7"
  },
  {
    id: 3,
    title: "The Title สำนักงานภูเก็ต",
    address: "469 หมู่ 6 ถ.วิเศษ ต.ราไวย์ อ.เมือง ภูเก็ต 83130",
    imagePath: "/images/thetitle_hkt2.webp",
    mapUrl: "https://maps.app.goo.gl/iA57QeWNbKVFbqTFA"
  },
  {
    id: 4,
    title: "บ้านใร่กาแฟ",
    address: "สาขารามอินทรา 5, สาขาบางเขน, สาขาท่าอิฐ ฯลฯ",
    imagePath: "/images/baanrai.webp",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B9%83%E0%B8%A3%E0%B9%88%E0%B8%81%E0%B8%B2%E0%B9%81%E0%B8%9F/"
  }
];

export default function HomeWorksLocation() {
    const [realIndex, setRealIndex] = useState(0);

    const handleSlideChange = (swiper: SwiperType) => {
        setRealIndex(swiper.realIndex);
    };

  return (
    <section id='homeWorksLocation' className='bg-custom-light-gray'>
        <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
            {/* Left side - Image */}
            <div className="w-full md:w-3/5 relative">
            <div className="image-wrapper h-[400px]">
              { locationData.map((img, index)=>(
                <Image
                  src={img.imagePath}
                  alt={img.title}
                  fill
                  className={`object-cover rounded-lg transition-all duration-500 ease-in-out shadow-xl h-full w-full ${ realIndex+1 === img.id ? 'opacity-100':'opacity-0' }`}
                  priority
                  key={index}
                />
              )) }
            </div>
            </div>

            {/* Right side - Content */}
            <div className="w-full md:w-2/5 lg:px-10 flex items-center">
                <div className="inner w-full h-auto">
                    <h3 className='text-3xl font-semibold text-primary-700 mb-1'>สถานที่ทำงาน</h3>
                    <Swiper
                        modules={[Pagination , Autoplay, EffectFade]}
                        spaceBetween={20}
                        slidesPerView={1}
                        effect={'fade'}
                        fadeEffect={{ crossFade: true }}
                        pagination={{ el: '.custom-pagination', type: 'bullets', clickable: true }}
                        onSlideChange={handleSlideChange}
                        className=""
                        autoplay={{
                            delay: 5000,
                        }}
                        watchSlidesProgress={true}
                        speed={400}
                        
                        // breakpoints={{
                        //   640: { slidesPerView: 2 },
                        //   768: { slidesPerView: 3 },
                        //   1024: { slidesPerView: 4 },
                        // }}
                    >
                        {locationData.map((location) => (
                        <SwiperSlide key={location.id}>
                            <div className="h-full flex flex-col gap-2">
                            <h4 className='text-primary-700 font-semibold text-2xl'>
                                {location.title}
                            </h4>
                            <p className='text-neutral-600 leading-none'>{location.address}</p>
                            <a
                                href={location.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex w-fit items-center justify-center px-5 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors gap-2 leading-none"
                            >
                                <MapPinned size={18} />
                                ค้นหาเส้นทาง
                            </a>
                            </div>
                        </SwiperSlide>
                        ))}
                        <div className="custom-pagination pt-3"></div>
                    </Swiper>
                </div>
            </div>
        </div>
        </div>
    </section>
  );
}
import React, { use, useEffect } from 'react';
import banner_d from '/public/images/hero-banner_d.jpg';
import banner_m from '/public/images/hero-banner_m.jpg';
import Image from 'next/image';
import WelfareBenefit from '@/components/layout/WelfareBenefit';
import gallery_img01 from '/public/images/image29.jpg';
import gallery_img02 from '/public/images/image30.jpg';
import gallery_img03 from '/public/images/image31.jpg';
import gallery_img04 from '/public/images/image32.jpg';
import gallery_img05 from '/public/images/image33.jpg';
import positionsSectionBG from '/public/images/positions-sec-left-img.jpg';
import { useFetchPositions } from '@/hooks/useDataFetching';
import Link from 'next/link';

const LifePage: React.FC = () => {

  const { jobs, isLoading, error } = useFetchPositions();

  useEffect(() => {
    //console.log(jobs);
  }, [jobs]);

  return (
    <div>
      <Image src={banner_d} alt="Hero Banner" layout="responsive" placeholder="blur" loading='lazy' className='hidden md:block' />
      <Image src={banner_m} alt="Hero Banner" layout="responsive" placeholder="blur" loading='lazy' className='md:hidden' />
      <section id="intro_text" className='py-10 bg-[url(https://assetwise.co.th/wp-content/uploads/2022/12/circle.png)] bg-no-repeat bg-left '>
        <div className="container px-2">
          <h1 className='uppercase text-center text-2xl text-[#0C3F6C] font-medium text-[42px] mb-2'>Life at AssetWise</h1>
          <div className='text-center font-light text-neutral-900 leading-tight text-[20px] xl:text-[24px]'>
            <p>มาร่วมเป็นส่วนหนึ่งกับ AssetWise ที่ซึ่งเราไม่ได้เป็นแค่บริษัทพัฒนาอสังหาริมทรัพย์ แต่เราคือครอบครัวที่พร้อมเติบโตไปด้วยกัน</p>
            <p>ที่นี่ คุณจะได้ทำงานในสภาพแวดล้อมที่เปิดกว้างทางความคิด พร้อมรับฟังไอเดียใหม่ๆ จากทุกคน เพราะเราเชื่อว่านวัตกรรมเกิดขึ้นได้จากทุกระดับ</p>
            <div className="h-4"></div>
            <p>เรามุ่งมั่นในการสร้างคุณภาพชีวิตที่ดีให้กับพนักงานทุกคน ด้วยสวัสดิการที่ครอบคลุม</p>
            <p>โอกาสในการเติบโตก้าวหน้า และการพัฒนาศักยภาพอย่างต่อเนื่องผ่านโครงการฝึกอบรมที่หลากหลาย
            นอกจากนี้ เรายังส่งเสริมความสมดุลระหว่างชีวิตและการทำงาน</p>
            <p>ด้วยนโยบายการทำงานที่ยืดหยุ่น และกิจกรรมสร้างความสัมพันธ์ระหว่างพนักงาน</p>
            <div className="h-4"></div>
            <p>ที่ AssetWise คุณจะได้ร่วมงานกับทีมมืออาชีพ ที่พร้อมแบ่งปันความรู้และประสบการณ์</p>
            <p>เราภูมิใจในการเป็นองค์กรที่มีการเติบโตอย่างต่อเนื่อง และพร้อมที่จะสร้างโอกาสให้คุณได้พัฒนาความสามารถไปพร้อมกับความก้าวหน้าขององค์กร </p>
            <p>เพราะเราเชื่อว่าความสำเร็จของพนักงานคือความสำเร็จของบริษัท</p>
          </div>
        </div>
      </section>
      <section id="life_at_asw_gallery" className='py-4 px-2 lg:py-20 bg-gray-100'>
        <div className="container">
          <div className="grid md:grid-cols-3 md:grid-rows-2 auto-rows-[250px] gap-4 md:grid-flow-col">
            <div className="relative">
              <Image src={gallery_img01} alt="Gallery Image 01" fill/>
            </div>
            <div className="relative">
              <Image src={gallery_img02} alt="Gallery Image 02" fill/>
            </div>
            <div className="relative row-span-2 overflow-hidden">
              <Image src={gallery_img04} alt="Gallery Image 04"/>
            </div>
            <div className="relative">
              <Image src={gallery_img03} alt="Gallery Image 03" fill/>
            </div>
            <div className="relative">
              <Image src={gallery_img05} alt="Gallery Image 05" fill/>
            </div>
          </div>
        </div>
      </section>
      <WelfareBenefit />
      <section id="positions" className='bg-primary-700 flex flex-col md:flex-row'>
        <div className="md:w-1/2 min-h-[300px] md:min-h-[400px] bg-cover bg-right" style={{ backgroundImage: `url(${positionsSectionBG.src})`}}></div>
        <div className="md:w-1/2 px-8 py-11">
          <div className="content-box">
            <h4 className='text-white text-[42px] font-medium mb-3'>ตำแหน่งงานที่เปิดรับ</h4>
            { isLoading ? <p>Loading...</p> : error ? <p>Error: {error}</p> : jobs.splice(0, 5).map((job) => (
              <div className='border-b last:border-none border-white py-2' key={job.jobID}>
                <p className='text-[20px] font-light'>
                  <Link href={{ pathname: 'jobs', query: { id: job.jobID } }} className='text-white hover:text-neutral-300'>{job.jobPosition} { job.urgently && <span className='bg-red-700 text-white text-sm px-2 rounded-lg ml-2'>เร่งด่วน</span>}</Link>
                </p>
              </div>
              ))}
            <div className="h-7"></div>
            <Link href="/jobs" className="px-5 py-1 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
            >
              ตำแหน่งงานทั้งหมด
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LifePage;
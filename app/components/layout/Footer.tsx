import Image from "next/image";
import Link from "next/link";

const footerMenus = {
    "menu1": [
      {
        "id": 1,
        "name": "คอนโดมิเนียม",
        "link": "https://assetwise.co.th/th/condominium"
      },
      {
        "id": 2,
        "name": "บ้านและทาวน์โฮม",
        "link": "https://assetwise.co.th/th/house"
      },
      {
        "id": 3,
        "name": "โปรโมชั่น",
        "link": "https://assetwise.co.th/th/house"
      },
      {
        "id": 4,
        "name": "รู้จักแอสเซทไวส์",
        "link": "https://assetwise.co.th/th/about-us"
      },
      {
        "id": 5,
        "name": "นักลงทุนสัมพันธ์",
        "link": "https://investor.assetwise.co.th/th/home"
      },
      {
        "id": 6,
        "name": "แอสเซทไวส์คลับ",
        "link": "https://assetwise.co.th/th/club"
      },
      {
        "id": 7,
        "name": "ข่าวสาร",
        "link": "https://assetwise.co.th/th/news"
      },
      {
        "id": 8,
        "name": "บล็อก",
        "link": "https://assetwise.co.th/th/blog"
      }
    ],
    "menu2": [
      {
        "id": 1,
        "name": "Bank Matching",
        "link": "https://aswinno.assetwise.co.th/bankmatching"
      }
    ],
    "menu3": [
      {
        "id": 1,
        "name": "เสนอขายที่ดิน",
        "link": "https://aswland.assetwise.co.th/"
      },
      {
        "id": 2,
        "name": "เสนอขายสินค้าและบริการ",
        "link": "https://procurement.assetwise.co.th/"
      },
      {
        "id": 3,
        "name": "ฝากขาย-ฝากเช่า",
        "link": "https://www.assetaplus.com/"
      }
    ],
    "menu4": [
      {
        "id": 1,
        "name": "ติดต่อเรา",
        "link": "https://assetwise.co.th/th/contact"
      },
      {
        "id": 2,
        "name": "ร้องเรียนธรรมาภิบาล",
        "link": "https://assetwise.co.th/th/appeal-form"
      },
      {
        "id": 3,
        "name": "ติดต่อผู้คุ้มครองข้อมูลส่วนบุคคล",
        "link": "https://services.assetwise.co.th/DSRM/DSRForm"
      },
      {
        "id": 4,
        "name": "นโยบายข้อมูลส่วนบุคคล",
        "link": "https://assetwise.co.th/privacy-policy/"
      }
    ],
}

function Footer() {
    return (
        <footer className="bg-neutral-800 pt-9 pb-4">
            <div className="container px-4 lg:px-0">
                <div className="w-full flex flex-col md:flex-row">
                    <div className="w-full md:w-4/12 flex flex-col gap-3 mb-5 md:mb-0">
                        <Image src='/images/logo-asw-footer.png' alt="" width={160} height={35} />
                        <h4 className="text-white text-[30px]">ติดตามแอสเซทไวส์</h4>
                        <div className="social-listed flex w-2/3 gap-3">
                            <Link href={{ pathname: 'https://th-th.facebook.com/AssetWiseThailand/', query: '' }} title="Facebook">
                                <Image src="/images/fb-o.png" alt="Facbook" width={80} height={80}></Image>
                            </Link>
                            <Link href={{ pathname: 'https://page.line.me/assetwise', query: '' }} title="Line">
                                <Image src="/images/line-o.png" alt="Line" width={80} height={80}></Image>
                            </Link>
                            <Link href={{ pathname: 'https://www.instagram.com/assetwisethailand', query: '' }} title="Instagram">
                                <Image src="/images/ig-o.png" alt="Instagram" width={80} height={80}></Image>
                            </Link>
                            <Link href={{ pathname: 'https://www.youtube.com/c/AssetwiseChannel', query: '' }} title="Youtube">
                                <Image src="/images/yt-o.png" alt="Youtube" width={80} height={80}></Image>
                            </Link>
                            <Link href={{ pathname: 'https://www.tiktok.com/@assetwise', query: '' }} title="Tiktok">
                                <Image src="/images/tt-o.png" alt="Tiktok" width={80} height={80}></Image>
                            </Link>
                        </div>
                    </div>
                    <div className="w-full md:w-8/12 grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-0 md:flex-row justify-between">
                        <div className="menu">
                            <h4 className="text-white text-[22px]">แอสเซทไวส์</h4>
                            <ul>
                                { footerMenus.menu1.map((menu, key)=>(
                                    <li key={key}>
                                        <Link href={menu.link} className="text-neutral-400 text-[18px] hover:text-white transition">{menu.name}</Link>
                                    </li>
                                )) }
                            </ul>
                        </div>
                        <div className="menu">
                            <h4 className="text-white text-[22px]">บริการ</h4>
                            <ul>
                                { footerMenus.menu2.map((menu, key)=>(
                                    <li key={key}>
                                        <Link href={menu.link} className="text-neutral-400 text-[18px] hover:text-white transition">{menu.name}</Link>
                                    </li>
                                )) }
                            </ul>
                        </div>
                        <div className="menu">
                            <h4 className="text-white text-[22px]">สนใจทำธุรกิจกับเรา</h4>
                            <ul>
                                { footerMenus.menu3.map((menu, key)=>(
                                    <li key={key}>
                                        <Link href={menu.link} className="text-neutral-400 text-[18px] hover:text-white transition">{menu.name}</Link>
                                    </li>
                                )) }
                            </ul>
                        </div>
                        <div className="menu">
                            <h4 className="text-white text-[22px]">ติดต่อ</h4>
                            <ul>
                                { footerMenus.menu4.map((menu, key)=>(
                                    <li key={key}>
                                        <Link href={menu.link} className="text-neutral-400 text-[18px] hover:text-white transition">{menu.name}</Link>
                                    </li>
                                )) }
                            </ul>
                        </div>
                    </div>
                </div>
                <p className="text-neutral-400 text-sm text-center pt-4 mt-4 border-t border-t-neutral-400">© สงวนลิขสิทธิ์ พ.ศ. 2567 บริษัท แอสเซทไวส์ จำกัด (มหาชน)</p>
            </div>
        </footer>
    );
}

export default Footer;
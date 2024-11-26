import Image from "next/image";

function WelfareBenefit() {
    const iconW = 52;
    const benefits = [
        {
            "icon": "heart-icon",
            "items": ["ประกันสุขภาพ (IPD/OPD/ทันตกรรม)", "ประกันชีวิต", "ประกันอุบัติเหตุ"],
        },
        {
            "icon": "income-icon",
            "items": ["คอมมิชชั่น", "ปรับเงินเดือนประจำปี", "โบนัสประจำปี", "เบี้ยเลี้ยง/ค่าเดินทาง/ค่าที่พัก"],
        },
        {
            "icon": "vacation-icon",
            "items": ["วันหยุดประเพณี", "วันหยุดพักผ่อนประจำปี", "วันหยุดวันเกิด","งานเลี้ยงสังสรรค์ ตามเทศกาล"],
        },
        {
            "icon": "more-icon",
            "items": ["ทุนการศึกษาบุตร", "ชุดยูนิฟอร์ม อุปกรณ์ทำงาน", "เงินช่วยเหลือ/เงินกู้ยืม", "รถรับส่งตามจุด"],
        },
    ]
    return (
        <section id="welfareBenefit" className="flex lg:min-h-[600px] lg:pb-16">
            <div className="content-wrapper w-full lg:max-w-[1440px] 2xl:mx-auto flex flex-col lg:flex-row justify-end">
                <Image src="/images/welfare_benefit-bg_1-5x.webp" alt="" width={480} height={280} className="lg:hidden w-auto h-auto"/>
                <div className="welfare-benefit-box w-full lg:w-1/2 py-7 px-4 lg:px-8 bg-primary-700 h-full rounded-tl-3xl lg:rounded-tl-none -mt-4 lg:mt-0 lg:rounded-bl-3xl flex flex-col justify-center items-center">
                    <h2 className="text-3xl font-semibold text-white leading-none">สวัสดิการ</h2>
                    <p className="font-light text-[20px] text-neutral-300 mb-5">เงื่อนไขตามรายละเอียดแต่ละบริษัท</p>
                    <div className="core-benefit-boxes grid md:grid-cols-2 md:grid-rows-2 gap-y-5 gap-x-6 lg:gap-x-7">
                    { benefits.map((item, key)=>(
                        <div className="benefit-box flex items-start gap-4" key={key}>
                            <Image src={`/images/${item.icon}.png`} alt="" width={iconW} height={iconW}/>
                            <ul>
                                { item.items.map((b, key)=>(
                                    <li key={key} className="text-white font-light text-[17px] leading-tight">{b}</li>
                                )) }
                            </ul>
                        </div>
                    )) }
                    </div>
                </div>
            </div>
        </section>
    );
}

export default WelfareBenefit;
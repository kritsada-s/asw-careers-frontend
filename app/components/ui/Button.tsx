import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { Url } from "url";

interface ButtonProps {
    varient?: string;
    children: ReactNode;
    link?: string;
}

function CustomButton(props: ButtonProps) {
    if (props?.varient === 'bordered') {
        return (
            <Link className="w-[145px] text-center inline-block border-2 border-primary rounded-[30px] px-[27px] py-[10px] leading-[24px] text-[28px] text-primary hover:bg-primary hover:text-white transition-all" href={`${props.link}`} title="">
                {props.children}
            </Link>
        )
    } else {
        return (
            <Link href={`${props.link}`} title="">{props.children}</Link>
        )
    }
}

export default CustomButton;
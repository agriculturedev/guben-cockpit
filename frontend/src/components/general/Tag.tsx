import {PropsWithChildren} from "react";
import {cn} from "@/utilities/twMerge";

export interface TagProps extends PropsWithChildren {
  bgColor?: string;
  textColor?: string;
}

export const Tag = ({children, ...props}: TagProps) => {
  const hexRegex = /^#[a-fA-F\d]{6}$/

  const bgIsHex = hexRegex.test(props.bgColor ?? "");
  const bgColorClass = bgIsHex ? `bg-[${props.bgColor}]` : (props.bgColor ?? "bg-gubenAccent");

  const textIsHex = hexRegex.test(props.textColor ?? "");
  const textColorClass = textIsHex ? `text-[${props.textColor}]` : (props.textColor ?? "text-gubenAccent-foreground");

  return (
    <div className={cn("py-1 px-4 rounded-full", bgColorClass, textColorClass)}>{children}</div>
  )
}

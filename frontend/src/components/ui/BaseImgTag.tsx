import * as React from "react";
import fallbackImage from "@/assets/images/pngegg.png";
import { cn } from "@/lib/utils";

export const BaseImgTag = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, alt, ...props }, ref) => (
  <img
    ref={ref}
    alt={alt}
    onError={({ currentTarget }) => {
      currentTarget.onerror = null; // prevents looping
      currentTarget.src=fallbackImage;
    }}
    className={cn(className)}
    {...props}
  />
))

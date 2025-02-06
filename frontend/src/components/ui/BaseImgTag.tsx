import * as React from "react";
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
      currentTarget.src="/public/images/image-not-found.png";
    }}
    className={cn(className)}
    {...props}
  />
))

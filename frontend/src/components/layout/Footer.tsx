import { useFooterItemsGetAll } from "@/endpoints/gubenComponents";
import { LoadingIndicator } from "../loadingIndicator/loadingIndicator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { isNullOrUndefinedOrWhiteSpace } from "@/utilities/nullabilityUtils";
import sanitizeHtml from "sanitize-html";
import { FooterItemResponse } from "@/endpoints/gubenSchemas";
import { BaseImgTag } from "@/components/ui/BaseImgTag";
import React from "react";

export const Footer = () => {
  const {data: footerItemResponse, isPending} = useFooterItemsGetAll({});

  return (
    <footer className="bg-gubenAccent relative text-gubenAccent-foreground p-4 h-14 flex justify-center items-center">
      <BaseImgTag src="/images/guben-logo.jpg" alt="logo" className={"h-full left-2 absolute"}/>
      <ul className={"flex flex-row gap-10"}>
        {
          isPending
            ? <LoadingIndicator/>
            : footerItemResponse?.footerItems?.map((item, index) => (
              <li key={index}>
                <FooterItemDialog footerItem={item}/>
              </li>
            ))
        }
      </ul>
    </footer>
  )
}

interface FooterItemDialogProps {
  footerItem: FooterItemResponse;
}

// TODO: customize the sanitize html so it allows for inline styling for colored text, images etc
export default function FooterItemDialog({footerItem}: FooterItemDialogProps) {
  return (
    <Dialog>
      <DialogTrigger>{footerItem.name}</DialogTrigger>
      <DialogContent className={cn(
        "bg-white rounded-lg text-lg",
        "flex flex-col gap-4 p-16",
        "min-w-[100svw] max-w-[100svw] min-h-[100svh] max-h-[100svh] md:min-w-[80svw] md:max-w-[80svw] md:min-h-[80svh] md:max-h-[80svh]"
      )}>
        <DialogHeader className="gap-4">
          <DialogTitle className="text-4xl">{footerItem.name}</DialogTitle>
        </DialogHeader>

        {!isNullOrUndefinedOrWhiteSpace(footerItem.content) &&
          <DialogDescription>
            {/*<div className="text-neutral-800" dangerouslySetInnerHTML={{ __html: sanitizeHtml(footerItem.content!) }} />*/}
            <div className="text-neutral-800" dangerouslySetInnerHTML={{__html: footerItem.content!}}/>
          </DialogDescription>
        }
      </DialogContent>
    </Dialog>
  )
}

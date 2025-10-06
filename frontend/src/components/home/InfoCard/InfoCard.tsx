import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { Button } from "@/components/ui/button";
import { InformationCardResponse } from "@/endpoints/gubenSchemas";
import { Card } from "@/components/ui/card";
import { BaseImgTag } from "@/components/ui/BaseImgTag";
import { WithClassName } from "@/types/WithClassName";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Props extends WithClassName {
  card: InformationCardResponse;
}

export const InfoCard = ({ card, className }: Props) => {
  const [open, setOpen] = useState(false);

  const ImageBlock = () =>
    card.imageUrl ? (
      <div className="relative w-full aspect-video rounded overflow-hidden">
        <BaseImgTag
          src={card.imageUrl}
          alt={card.imageAlt ?? undefined}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    ) : null;

  const infoContent = (fullText: boolean) => (
    <>
      <ImageBlock />

      <h1 className="text-xl font-bold text-gubenAccent text-center font-rubik mt-2">
        {card.title}
      </h1>

      <Markdown
        className={cn(
          "[&_*]:font-rubik text-gray-500",
          !fullText && "line-clamp-2 leading-relaxed overflow-hidden pb-1",
        )}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {card.description}
      </Markdown>

      {card.button?.url && card.button?.title && (
        <div className={"flex justify-center mt-4"}>
          <Button
            variant={"destructive"}
            onClick={(e) => {
              e.stopPropagation();
              if (card.button?.url) {
                if (card.button.openInNewTab) {
                  window.open(card.button.url, "_blank");
                } else {
                  window.location.href = card.button.url;
                }
              }
            }}
          >
            <p className="font-rubik">{card.button?.title}</p>
          </Button>
        </div>
      )}
    </>
  );

  return (
    <>
      <Card
        onClick={() => setOpen(true)}
        className={cn(
          "flex flex-col bg-white p-4 gap-1 mb-4 rounded-lg shadow-lg break-inside-avoid h-[20rem]",
          className,
        )}
      >
        {infoContent(false)}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0">
          <Card
            className={cn(
              "flex flex-col bg-none p-2 rounded-lg shadow-none break-inside-avoid",
              className,
            )}
          >
            {infoContent(true)}
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
};

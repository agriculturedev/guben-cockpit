import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { Button } from "@/components/ui/button";
import { InformationCardResponse } from "@/endpoints/gubenSchemas";
import { Card } from "@/components/ui/card";
import { BaseImgTag } from "@/components/ui/BaseImgTag";
import { WithClassName } from "@/types/WithClassName";
import { cn } from "@/lib/utils";

interface Props extends WithClassName {
  card: InformationCardResponse;
}

export const InfoCard = ({ card, className }: Props) => {
  return (
    <Card
      className={cn(
        "flex flex-col bg-white p-4 gap-1 mb-4 rounded-lg shadow-lg break-inside-avoid h-[18rem]",
        className,
      )}
    >
      {card.imageUrl && (
        <BaseImgTag
          src={card.imageUrl}
          alt={card.imageAlt ?? undefined}
          className={"rounded h-[8rem]"}
        />
      )}

      <h1 className="text-xl font-bold text-gubenAccent text-center font-rubik">
        {card.title}
      </h1>

      <p className="text-gray-500 leading-relaxed line-clamp-2 overflow-hidden">
        <Markdown className="[&_*]:font-rubik" remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {card.description}
        </Markdown>
      </p>

      {card.button?.url && card.button?.title && (
        <div className={"flex justify-center"}>
          <Button variant={"destructive"}>
            <a
              href={card.button?.url}
              target={card.button.openInNewTab ? "_blank" : "_self"}
              className="font-rubik"
            >
              {card.button?.title}
            </a>
          </Button>
        </div>
      )}
    </Card>
  );
};

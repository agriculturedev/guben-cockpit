import { Button } from "@/components/ui/button";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { InformationCardResponse } from "@/endpoints/gubenSchemas";
import { Card } from "@/components/ui/card";
import { BaseImgTag } from "@/components/ui/BaseImgTag";

interface Props {
  card: InformationCardResponse;
}

export const InfoCard = ({card}: Props) => {
  return (
    <Card className="flex flex-col bg-white p-4 gap-1 rounded-lg shadow-lg mb-4 break-inside-avoid">
      {card.imageUrl &&
        <BaseImgTag src={card.imageUrl} alt={card.imageAlt ?? undefined} className={"rounded"}/>
      }
      <h1 className="text-xl font-bold text-gubenAccent text-center">{card.title}</h1>
      <p className="text-gray-500">
        <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{card.description}</Markdown>
      </p>

      {card.button?.url && card.button?.title && <div className={"flex justify-center"}>
        <Button variant={"destructive"}><a href={card.button?.url} target={card.button.openInNewTab ? "_blank" : "_self"}> {card.button?.title}</a></Button>
      </div>}
    </Card>
  );
}

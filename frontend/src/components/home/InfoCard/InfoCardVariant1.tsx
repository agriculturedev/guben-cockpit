import {CardsInformationCardVariant1Component} from "@/endpoints/gubenProdSchemas";
import {Button} from "@/components/ui/button";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface Props {
    card: CardsInformationCardVariant1Component;
}

export const InfoCardVariant1 = ({card}: Props) => {
    return (
      <div className="flex flex-col bg-white p-4 gap-1 rounded-lg shadow-lg mb-4 break-inside-avoid">
            <img src={card.imgSrc} alt={card.imgAlt} className={"rounded"} />
            <h1 className="text-xl font-bold text-gubenAccent text-center">{card.title}</h1>
            <p className="text-gray-500">
                <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{card.description}</Markdown>
            </p>

            {card.button?.url && card.button?.text && <div className={"flex justify-center"}>
	            <Button variant={"destructive"}><a href={card.button?.url} target={"_blank"}>{card.button?.text}</a></Button>
            </div>}
        </div>
    );
}

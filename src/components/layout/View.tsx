import {ReactNode} from "@tanstack/react-router";
import {Skeleton} from "@/components/ui/skeleton";
import Markdown from "react-markdown";

interface Props {
    title?: string;
    description?: string;
    isLoading?: boolean;
    children?: ReactNode;
}

export const View  = ({children, title, description, isLoading}: Props) => {
    return (
        <main className={"w-full h-full flex flex-1 flex-col items-center"}>
            <article className={"w-full max-w-[1200px] pt-5 pb-5"}>
                {!isLoading && (
                    <div className={"flex gap-3 flex-col"}>
                      <h1 className={"text-gubenAccent text-h1 font-bold"}>{title}</h1>
                      <Markdown>{description}</Markdown>
                    </div>
                )}
                {isLoading && (
                    <div className={"flex flex-col gap-2"}>
                        <Skeleton className="w-[200px] h-[20px] rounded-full" />
                        <Skeleton className="w-[400px] h-[14px] rounded-full" />
                        <Skeleton className="w-[350px] h-[14px] rounded-full" />
                        <Skeleton className="w-[300px] h-[14px] rounded-full" />
                    </div>
                )}
            </article>
            <section className={"w-full max-w-[1200px]"}>
                {children}
            </section>
        </main>
    );
}

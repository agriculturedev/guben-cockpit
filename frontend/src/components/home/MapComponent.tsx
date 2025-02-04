import { WithClassName } from "@/types/WithClassName";
import { cn } from "@/lib/utils";

interface Props extends WithClassName {
    src: string;
}

export const MapComponent = ({src, className}: Props) => {
    return <div className={cn("w-screen h-auto flex-1", className)}>
      <iframe
          className="overflow-hidden border-none h-full w-full"
          src={src}
          height="100%"
          width="100%"
      ></iframe>
    </div>
}

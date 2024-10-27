
interface Props {
    src: string;
}

export const MapComponent = ({src}: Props) => {
    return <div className="w-screen h-auto flex-1">
      <iframe
          className="overflow-hidden border-none h-full w-full"
          src={src}
          height="100%"
          width="100%"
      ></iframe>
    </div>
}

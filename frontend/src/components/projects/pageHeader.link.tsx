import { ExternalLinkIcon } from "lucide-react";

interface IProps {
  to: string;
  newWindow: boolean;
  text: string;
}

export default function PageHeaderLink(props: IProps) {
  return (
    <a
      href={props.to}
      target={props.newWindow ? "_blank" : "_self"}
      className='border-b-[var(--text-color)] border-b-2 w-min text-nowrap flex gap-4 p-2 hover:bg-gubenAccent hover:border-transparent hover:text-white hover:rounded-md'
    >
      <p>{props.text}</p>
      <ExternalLinkIcon />
    </a>
  )
}

interface IProps {
  to: string;
  newWindow: boolean;
  text: string;
}

export default function PageIntroLink(props: IProps) {
  return (
    <a
      className="text-gubenAccent underline visited:text-red-800"
      href={props.to}
      target={props.newWindow ? "_blank" : "_self"}
    >
      {props.text}
    </a>
  )
}

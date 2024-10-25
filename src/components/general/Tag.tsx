import {PropsWithChildren} from "react";

interface TagProps extends PropsWithChildren {}

export const Tag = ({children}: TagProps) => {
  return (
    <div className={"py-1 px-4 rounded-full bg-primary text-white"}>
      {children}
    </div>
  )
}
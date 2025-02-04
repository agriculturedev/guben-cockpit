import { PropsWithChildren } from "react";

export const FloatingCardButtons = ({children}: PropsWithChildren) => {
  return (
    <div className="flex relative">
      {children}
    </div>
  )
}

FloatingCardButtons.Buttons = ({children}: PropsWithChildren) => {
  return (
    <div className="flex flex-col gap-2 absolute right-0 top-4 translate-x-[45%]">
      {children}
    </div>
  )
}

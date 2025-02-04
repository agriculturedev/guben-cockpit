import { PropsWithChildren } from "react";

export const FloatingCardButtons2 = ({children}: PropsWithChildren) => {
  return (
    <div className="flex relative">
      {children}
    </div>
  )
}

export FloatingCardButtons2.Buttons = ({children}: PropsWithChildren) => {
  return (
    <div className="flex flex-col gap-2 absolute right-0 top-4 translate-x-[45%]">
      {children}
    </div>
  )
}

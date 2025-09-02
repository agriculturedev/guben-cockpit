import { ArrowBigRightDash } from "lucide-react"
import BookingDivider from "./bookingDivider"
import { GlassesIcon } from "lucide-react"
import { useTranslation } from "react-i18next"

export default function() {
  const { t } = useTranslation("booking");

  const steps = t("howItWorks.steps", { returnObjects: true}) as { number: number; title: string; description: string }[];

  return (
    <div>
      <BookingDivider icon={GlassesIcon} text={t("howItWorks.title")} />
      <div className="m-5 flex flex-row justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 place-items-center">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div>
                <div className="flex flex-col justify-start items-center max-w-xs min-h-72 text-center">
                  <div className="font-bold text-7xl text-gray-500">{step.number}</div>
                  <hr className="border-gubenAccent border-2 w-8 mx-auto" />
                  <div className="font-bold text-4xl">{step.title}</div>
                  <div className="text-gray-700">{step.description}</div>
                </div>
              </div>
              {index < steps.length -1 && (
                <ArrowBigRightDash className="text-gubenAccent size-12 ml-3" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
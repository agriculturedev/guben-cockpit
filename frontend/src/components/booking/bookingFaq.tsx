import BookingDivider from "./bookingDivider"
import { BookOpenIcon } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

export default function BookingFaq() {
  const { t } = useTranslation("booking");

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const faqs = t("faq.items", { returnObjects: true }) as { question: string; answer: string }[];

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <div>
      <BookingDivider icon={BookOpenIcon} text={t("faq.title")} />
      <div className="my-5 mx-10 mb-10 grid grid-cols-1 md:grid-cols-2 gap-5">
        {faqs.map((faq, index) => {
          const isExpanded = expandedIndex === index
          return (
            <div key={index}>
              <div className="text-gubenAccent font-bold">{faq.question}</div>
              <p className={`${isExpanded ? "" : "line-clamp-2"} text-gray-700 break-words`}>
                {faq.answer}
              </p>
              <button
                className="text-gubenAccent hover:underline"
                onClick={() => toggleExpand(index)} >
                {isExpanded ? t("faq.showLess") : t("faq.showMore") }
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
import { CircleCheckIcon } from "lucide-react";
import { Card } from "../ui/card";
import { useTranslation } from "react-i18next";

type PriceCardProps = {
  bookingUrl: string;
  price: string;
  title: string;
  flags?: string[];
}

export default function ({ bookingUrl, price, title, flags }: PriceCardProps) {
  const { t } = useTranslation("booking");

  return (
    <div className="p-14">
      <a 
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer" >
        <Card className="hover:shadow-xl cursor-pointer">
          <div className="grid grid-cols-3 gap-5 h-full">
            <div className="col-span-2 bg-gubenAccent-foreground h-full">
              <div className="p-5 font-bold text-xl">
                {title}
              </div>
              <hr className="border-2 border-gubenAccent w-2/3" />
              { flags && flags.length > 0 && (
                <div className="p-5">
                  <div className="font-bold">
                    {t("priceCard.included")}
                  </div>
                  <div className="flex flex-col gap-2">
                    {flags.map((flag) => (
                      <div className="flex items-center" key={flag}>
                        <CircleCheckIcon className="mr-1 size-4 text-green-700" />
                        <div className="text-gray-700">
                          {flag}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
            <div className="col-span-1 bg-red-600/70 h-full font-bold place-content-center px-5 text-gubenAccent-foreground">
              {t("priceCard.price")}: {price}
            </div>
          </div>
        </Card>
      </a>
    </div>
  )
}
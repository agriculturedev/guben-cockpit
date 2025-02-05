import { Link } from '@tanstack/react-router'
import { HomeIcon, ListBulletIcon, MapIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { CustomTooltip } from "@/components/general/Tooltip";
import { IceCreamConeIcon, LogOutIcon } from "lucide-react";
import { useAuth } from 'react-oidc-context';
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { BaseImgTag } from "@/components/ui/BaseImgTag";
import { Language } from "@/utilities/i18n/Languages";
import i18next from "i18next";

const linkStyle = "h-full p-3 flex items-center justify-center w-auto rounded-xl group hover:bg-[#cd1421]";
const iconStyle = "icon h-5 w-5 text-[#cd1421] group-hover:text-white";

export const Navigation = () => {
  const auth = useAuth();
  const {t} = useTranslation("navigation");

  return (
    <div className="w-full h-20 bg-white sticky top-0 z-10 shadow p-0 pr-2 rounded-b flex items-center justify-between">
      <div id="logo" className="flex-1 flex justify-start items-center h-full pl-5">
        <Link to="/" className="h-full flex justify-center items-center">
          <BaseImgTag src="/guben-logo.jpg" alt="logo" className={"h-2/3"}/>
        </Link>
        <BaseImgTag src="/smart-city-guben-logo.svg" alt="logo" className={"h-2/3"}/>
      </div>
      <ul className="flex-1 flex gap-1 h-full items-center justify-center self-center">
        <li>
          <CustomTooltip text={t("Dashboard")}>
            <Link to="/" className={linkStyle}>
              <HomeIcon className={iconStyle}/>
            </Link>
          </CustomTooltip>
        </li>
        <li>
          <CustomTooltip text={t("Projects")}>
            <Link to="/projects" className={linkStyle}>
              <Squares2X2Icon className={iconStyle}/>
            </Link>
          </CustomTooltip>
        </li>
        <li>
          <CustomTooltip text={t("Map")}>
            <Link to="/map" className={linkStyle}>
              <MapIcon className={iconStyle}/>
            </Link>
          </CustomTooltip>
        </li>
        <li>
          <CustomTooltip text={t("Events")}>
            <Link to="/events" className={linkStyle}>
              <ListBulletIcon className={iconStyle}/>
            </Link>
          </CustomTooltip>
        </li>
      </ul>

      <AuthSection />
      <LanguageSection />
    </div>
  )
}

const LanguageSection = () => {
  return (
    <div className="relative flex items-center justify-center">
      <div className="group">
        {/* Display current language */}
        <button className="p-2 rounded-lg text-[#cd1421] group-hover:bg-[#cd1421] group-hover:text-white">
          {i18next.language === Language.de ? "DE" : "EN"}
        </button>

        {/* Dropdown Menu */}
        <div className="absolute right-0 hidden rounded-lg shadow-lg group-hover:block bg-white border ">
          {Object.values(Language).map((lang) => (
            <button
              key={lang}
              className="w-full text-left px-3 py-2 rounded-lg text-[#cd1421] hover:bg-[#cd1421] hover:text-white"
              onClick={async () => await i18next.changeLanguage(lang)}
            >
              {lang === Language.de ? "DE" : "EN"}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const AuthSection = () => {
  const auth = useAuth();
  const {t} = useTranslation("navigation");

  return (
    <div className="flex-1 w-full">
      <div className="flex gap-2 float-end items-center">
        {auth.isAuthenticated &&
          <Label className={"text-medium text-md"}>
            {auth.user?.profile.name}
          </Label>
        }

        <ul className="gap-1 flex h-full items-center justify-center self-center">
          <li>
            <CustomTooltip text={t("Admin")}>
              <Link to="/admin" className={linkStyle}>
                <IceCreamConeIcon className={iconStyle}/>
              </Link>
            </CustomTooltip>
          </li>

          {auth.isAuthenticated &&
            <li>
              <CustomTooltip text={t("LogOut")}>
                <div className={linkStyle} onClick={() => auth.signoutRedirect(
                  {
                    redirectMethod: "assign",
                    redirectTarget: "self",
                    post_logout_redirect_uri: window.location.origin
                  },
                )}>
                  <LogOutIcon className={iconStyle}/>
                </div>
              </CustomTooltip>
            </li>
          }
        </ul>
      </div>
    </div>
  )
}

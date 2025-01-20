import { Link } from '@tanstack/react-router'
import { HomeIcon, ListBulletIcon, MapIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { CustomTooltip } from "@/components/general/Tooltip";
import { IceCreamConeIcon, LogOutIcon } from "lucide-react";
import { useAuth } from 'react-oidc-context';
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

export const Navigation = () => {
  const linkStyle = "h-full p-3 flex items-center justify-center w-auto rounded-xl group hover:bg-[#cd1421]";
  const iconStyle = "icon h-5 w-5 text-[#cd1421] group-hover:text-white";
  const auth = useAuth();
  const {t} = useTranslation();

  return (
    <div className="w-full h-20 bg-white sticky top-0 z-10 shadow p-0 rounded-b flex items-center justify-between">
      <div id="logo" className="flex-1 flex justify-start items-center h-full pl-5">
        <Link to="/" className="h-full flex justify-center items-center">
          <img src="/guben-logo.jpg" alt="logo" className={"h-2/3"}/>
        </Link>
        <img src="/smart-city-guben-logo.svg" alt="logo" className={"h-2/3"}/>
      </div>
      <ul className="flex-1 flex gap-1 h-full items-center justify-center self-center">
        <li>
          <CustomTooltip text="Dashboard">
            <Link to="/" className={linkStyle}>
              <HomeIcon className={iconStyle}/>
            </Link>
          </CustomTooltip>
        </li>
        <li>
          <CustomTooltip text="Projekte">
            <Link to="/projects" className={linkStyle}>
              <Squares2X2Icon className={iconStyle}/>
            </Link>
          </CustomTooltip>
        </li>
        <li>
          <CustomTooltip text="Karte">
            <Link to="/map" className={linkStyle}>
              <MapIcon className={iconStyle}/>
            </Link>
          </CustomTooltip>
        </li>
        <li>
          <CustomTooltip text="Veranstaltungen">
            <Link to="/events" className={linkStyle}>
              <ListBulletIcon className={iconStyle}/>
            </Link>
          </CustomTooltip>
        </li>
      </ul>
      <div className="flex-1 w-full">
        <div className="flex gap-1 float-end">
          {auth.isAuthenticated &&
            <div className="flex gap-2 items-center">
              <Label className={"text-medium text-md"}>
                {auth.user?.profile.name}
              </Label>
            </div>
          }

          <ul className="gap-1 flex h-full items-center justify-center self-center">
            <li>
              <CustomTooltip text="Admin">
                <Link to="/admin" className={linkStyle}>
                  <IceCreamConeIcon className={iconStyle}/>
                </Link>
              </CustomTooltip>
            </li>

            {auth.isAuthenticated &&
              <li>
                <CustomTooltip text={t("LogOut")}>
                  <Link className={linkStyle}>
                    <LogOutIcon className={iconStyle}
                                onClick={() => auth.signoutRedirect(
                                  {
                                    redirectMethod: "assign",
                                    redirectTarget: "self",
                                    post_logout_redirect_uri: import.meta.env.VITE_REDIRECT_URI
                                  },
                                )}/>
                  </Link>
                </CustomTooltip>
              </li>
            }
          </ul>
        </div>
      </div>


    </div>
  )
}

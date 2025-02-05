import { CustomTooltip } from "@/components/general/Tooltip";
import { BaseImgTag } from "@/components/ui/BaseImgTag";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Link, useLocation } from '@tanstack/react-router';
import { CalendarDaysIcon, ExternalLink, HomeIcon, Icon, LayoutGridIcon, LogOutIcon, MapIcon, ShieldIcon } from "lucide-react";
import React, { createContext, HtmlHTMLAttributes, useCallback, useContext, useMemo } from 'react';
import { useTranslation } from "react-i18next";
import { useAuth } from 'react-oidc-context';
import { ServicePortalIcon, SmartCityGubenLogoIcon } from "../icons";

type TNavContext = { location: string }
const NavContext = createContext<TNavContext>({ location: "/" });

const NavLink = (props: { name: string, to: string, children: React.ReactNode, target?: "_blank" | "_self"}) => {
  const { location } = useContext(NavContext);

  const isActive = useMemo(() => {
    if(props.to == "/") return location == props.to;
    return location.startsWith(props.to);
  }, [location]);

  return (
    <li>
      <CustomTooltip text={props.name}>
        <Link to={props.to} target={props.target} className={cn(
          'h-full p-3 flex items-center justify-center w-auto rounded-xl',
          isActive
            ? "hover:bg-red-400 bg-gubenAccent text-gubenAccent-foreground"
            : "text-gubenAccent stroke-gubenAccent hover:stroke-gubenAccent-foreground hover:bg-gubenAccent hover:text-gubenAccent-foreground"
        )}>
          {props.children ?? props.name}
        </Link>
      </CustomTooltip>
    </li>
  )
}

const NavList = ({ children }: { children: React.ReactNode }) => (
  <ul className='flex-1 flex gap-2 h-full items-center justify-center self-center'>
    {children}
  </ul>
);

const NavButton = (props: { name: string } & HtmlHTMLAttributes<HTMLButtonElement>) => (
  <li>
    <CustomTooltip text={props.name}>
      <button {...props} className='h-full p-3 flex items-center justify-center w-auto rounded-xl text-gubenAccent hover:bg-gubenAccent hover:text-gubenAccent-foreground'>
        {props.children}
      </button>
    </CustomTooltip>
  </li>
)

export const Navbar = () => {
  const iconStyle = "icon size-5";
  const auth = useAuth();
  const { t } = useTranslation("navigation");
  const location = useLocation();

  const handleSignout = useCallback(() => {
    auth.signoutRedirect({
      redirectMethod: "assign",
      redirectTarget: "self",
      post_logout_redirect_uri: window.location.origin
    })
  }, []);

  return (
    <NavContext.Provider value={{ location: location.pathname }}>
      <div className="w-full h-20 bg-white sticky top-0 z-10 shadow p-0 pr-2 rounded-b flex items-center justify-between">
        <div id="logo" className="flex-1 flex justify-start items-center h-full pl-5">
          <Link to="/" className="h-full flex justify-center items-center">
            <BaseImgTag src="/public/images/guben-logo.jpg" alt="logo" className={"h-2/3"} />
          </Link>
          <SmartCityGubenLogoIcon className="w-[128px] h-auto" />
        </div>

        <NavList>
          <NavLink to="/" name={t("Dashboard")}>
            <HomeIcon className={iconStyle} />
          </NavLink>
          <NavLink to="/projects" name={t("Projects")}>
            <LayoutGridIcon className={iconStyle} />
          </NavLink>
          <NavLink to="/map" name={t("Map")}>
            <MapIcon className={iconStyle} />
          </NavLink>
          <NavLink to="/events" name={t("Events")}>
            <CalendarDaysIcon className={iconStyle} />
          </NavLink>
          <NavLink name={t("ServicePortal")} to="https://serviceportal.dikom-bb.de/stadt-guben" target="_blank">
            <ServicePortalIcon className={cn(iconStyle, "size-5 stroke-gubenAccent")} />
          </NavLink>
        </NavList>

        <NavList>
          {auth.isAuthenticated &&
            <Label className='text-medium text-md mr-8'>
              {auth.user?.profile.name}
            </Label>
          }

          <NavLink to={"/admin"} name={t("Admin")}>
            <ShieldIcon className={iconStyle} />
          </NavLink>

          {auth.isAuthenticated &&
            <NavButton name={t("LogOut")} onClick={handleSignout}>
              <LogOutIcon className={iconStyle} />
            </NavButton>
          }
        </NavList>
      </div>
    </NavContext.Provider>
  )
}

import { View } from '@/components/layout/View'
import { AuthGuard } from '@/guards/authGuard'
import { cn } from '@/lib/utils'
import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router'
import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/admin/_layout')({
  component: Layout,
})

function Layout() {
  const {t} = useTranslation(["dashboard", "projects", "users", "events", "pages"]);

  return (
    <AuthGuard>
      <View>
        <div className="grid grid-cols-12 gap-4">
          <Nav className="col-span-2">
            <Nav.Item href={"/admin/dashboard"} label={t("Title", {ns: "dashboard"})} />
            <Nav.Item href={"/admin/users"} label={t("Title", {ns: "users"})} />
            <Nav.Item href={"/admin/pages"} label={t("Title", {ns: "pages"})} />
            <Nav.Item href={"/admin/projects"} label={t("Title", {ns: "projects"})} />
            <Nav.Item href={"/admin/events"} label={t("Title", {ns: "events"})} />
          </Nav>

          <div className='col-span-10 p-6 bg-white rounded-lg max-h-[1000px]'>
            <Outlet />
          </div>
        </div>
      </View>
    </AuthGuard>
  )
}

type NavProps = {
  className?: string;
} & PropsWithChildren;

function Nav({ children, ...props }: NavProps) {
  return (
    <div className={cn("bg-white rounded-lg p-4 flex flex-col max-h-fit", props.className ?? "")}>
      <ul className='flex flex-col gap-2'>
        {children}
      </ul>
    </div>
  )
}

type NavItemProps = {
  href: string;
  label: string;
}

Nav.Item = (props: NavItemProps) => {
  const location = useLocation();

  return (
    <li>
      <Link
        className={cn(
          "py-2 px-1 flex justify-center items-center rounded-lg hover:bg-gray-100 hover:cursor-pointer",
          props.href == location.pathname ? "text-white bg-gubenAccent hover:bg-gubenAccent" : ""
        )}
        to={props.href}
      >
        {props.label}
      </Link>
    </li>
  )
}

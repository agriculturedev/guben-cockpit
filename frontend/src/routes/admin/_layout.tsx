import { View2 } from '@/components/layout/View'
import { AuthGuard } from '@/guards/authGuard'
import { cn } from '@/lib/utils'
import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router'
import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminNavigation } from "@/components/admin/AdminNavigation";

export const Route = createFileRoute('/admin/_layout')({
  component: Layout,
})

function Layout() {
  const {t} = useTranslation(["dashboard", "projects", "users", "events", "pages", "locations"]);

  return (
    <AuthGuard>
      <View2>
        <View2.Content>
          <div className="grid grid-cols-12 gap-4">
            <AdminNavigation/>

            <div className='col-span-10 p-6 bg-white rounded-lg'>
              <Outlet/>
            </div>
          </div>
        </View2.Content>
      </View2>
    </AuthGuard>
  )
}

type NavProps = {
  className?: string;
} & PropsWithChildren;

function Nav({children, ...props}: NavProps) {
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

/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as MapImport } from './routes/map'
import { Route as EventsImport } from './routes/events'
import { Route as IndexImport } from './routes/index'
import { Route as AdminIndexImport } from './routes/admin/index'
import { Route as AdminLayoutImport } from './routes/admin/_layout'
import { Route as AdminLayoutUsersImport } from './routes/admin/_layout/users'
import { Route as AdminLayoutProjectsImport } from './routes/admin/_layout/projects'
import { Route as AdminLayoutPagesImport } from './routes/admin/_layout/pages'
import { Route as AdminLayoutLocationsImport } from './routes/admin/_layout/locations'
import { Route as AdminLayoutEventsImport } from './routes/admin/_layout/events'
import { Route as AdminLayoutDashboardImport } from './routes/admin/_layout/dashboard'

// Create Virtual Routes

const AdminImport = createFileRoute('/admin')()
const ProjectsLazyImport = createFileRoute('/projects')()

// Create/Update Routes

const AdminRoute = AdminImport.update({
  path: '/admin',
  getParentRoute: () => rootRoute,
} as any)

const ProjectsLazyRoute = ProjectsLazyImport.update({
  path: '/projects',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/projects.lazy').then((d) => d.Route))

const MapRoute = MapImport.update({
  path: '/map',
  getParentRoute: () => rootRoute,
} as any)

const EventsRoute = EventsImport.update({
  path: '/events',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const AdminIndexRoute = AdminIndexImport.update({
  path: '/',
  getParentRoute: () => AdminRoute,
} as any)

const AdminLayoutRoute = AdminLayoutImport.update({
  id: '/_layout',
  getParentRoute: () => AdminRoute,
} as any)

const AdminLayoutUsersRoute = AdminLayoutUsersImport.update({
  path: '/users',
  getParentRoute: () => AdminLayoutRoute,
} as any)

const AdminLayoutProjectsRoute = AdminLayoutProjectsImport.update({
  path: '/projects',
  getParentRoute: () => AdminLayoutRoute,
} as any)

const AdminLayoutPagesRoute = AdminLayoutPagesImport.update({
  path: '/pages',
  getParentRoute: () => AdminLayoutRoute,
} as any)

const AdminLayoutLocationsRoute = AdminLayoutLocationsImport.update({
  path: '/locations',
  getParentRoute: () => AdminLayoutRoute,
} as any)

const AdminLayoutEventsRoute = AdminLayoutEventsImport.update({
  path: '/events',
  getParentRoute: () => AdminLayoutRoute,
} as any)

const AdminLayoutDashboardRoute = AdminLayoutDashboardImport.update({
  path: '/dashboard',
  getParentRoute: () => AdminLayoutRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/events': {
      id: '/events'
      path: '/events'
      fullPath: '/events'
      preLoaderRoute: typeof EventsImport
      parentRoute: typeof rootRoute
    }
    '/map': {
      id: '/map'
      path: '/map'
      fullPath: '/map'
      preLoaderRoute: typeof MapImport
      parentRoute: typeof rootRoute
    }
    '/projects': {
      id: '/projects'
      path: '/projects'
      fullPath: '/projects'
      preLoaderRoute: typeof ProjectsLazyImport
      parentRoute: typeof rootRoute
    }
    '/admin': {
      id: '/admin'
      path: '/admin'
      fullPath: '/admin'
      preLoaderRoute: typeof AdminImport
      parentRoute: typeof rootRoute
    }
    '/admin/_layout': {
      id: '/admin/_layout'
      path: '/admin'
      fullPath: '/admin'
      preLoaderRoute: typeof AdminLayoutImport
      parentRoute: typeof AdminRoute
    }
    '/admin/': {
      id: '/admin/'
      path: '/'
      fullPath: '/admin/'
      preLoaderRoute: typeof AdminIndexImport
      parentRoute: typeof AdminImport
    }
    '/admin/_layout/dashboard': {
      id: '/admin/_layout/dashboard'
      path: '/dashboard'
      fullPath: '/admin/dashboard'
      preLoaderRoute: typeof AdminLayoutDashboardImport
      parentRoute: typeof AdminLayoutImport
    }
    '/admin/_layout/events': {
      id: '/admin/_layout/events'
      path: '/events'
      fullPath: '/admin/events'
      preLoaderRoute: typeof AdminLayoutEventsImport
      parentRoute: typeof AdminLayoutImport
    }
    '/admin/_layout/locations': {
      id: '/admin/_layout/locations'
      path: '/locations'
      fullPath: '/admin/locations'
      preLoaderRoute: typeof AdminLayoutLocationsImport
      parentRoute: typeof AdminLayoutImport
    }
    '/admin/_layout/pages': {
      id: '/admin/_layout/pages'
      path: '/pages'
      fullPath: '/admin/pages'
      preLoaderRoute: typeof AdminLayoutPagesImport
      parentRoute: typeof AdminLayoutImport
    }
    '/admin/_layout/projects': {
      id: '/admin/_layout/projects'
      path: '/projects'
      fullPath: '/admin/projects'
      preLoaderRoute: typeof AdminLayoutProjectsImport
      parentRoute: typeof AdminLayoutImport
    }
    '/admin/_layout/users': {
      id: '/admin/_layout/users'
      path: '/users'
      fullPath: '/admin/users'
      preLoaderRoute: typeof AdminLayoutUsersImport
      parentRoute: typeof AdminLayoutImport
    }
  }
}

// Create and export the route tree

interface AdminLayoutRouteChildren {
  AdminLayoutDashboardRoute: typeof AdminLayoutDashboardRoute
  AdminLayoutEventsRoute: typeof AdminLayoutEventsRoute
  AdminLayoutLocationsRoute: typeof AdminLayoutLocationsRoute
  AdminLayoutPagesRoute: typeof AdminLayoutPagesRoute
  AdminLayoutProjectsRoute: typeof AdminLayoutProjectsRoute
  AdminLayoutUsersRoute: typeof AdminLayoutUsersRoute
}

const AdminLayoutRouteChildren: AdminLayoutRouteChildren = {
  AdminLayoutDashboardRoute: AdminLayoutDashboardRoute,
  AdminLayoutEventsRoute: AdminLayoutEventsRoute,
  AdminLayoutLocationsRoute: AdminLayoutLocationsRoute,
  AdminLayoutPagesRoute: AdminLayoutPagesRoute,
  AdminLayoutProjectsRoute: AdminLayoutProjectsRoute,
  AdminLayoutUsersRoute: AdminLayoutUsersRoute,
}

const AdminLayoutRouteWithChildren = AdminLayoutRoute._addFileChildren(
  AdminLayoutRouteChildren,
)

interface AdminRouteChildren {
  AdminLayoutRoute: typeof AdminLayoutRouteWithChildren
  AdminIndexRoute: typeof AdminIndexRoute
}

const AdminRouteChildren: AdminRouteChildren = {
  AdminLayoutRoute: AdminLayoutRouteWithChildren,
  AdminIndexRoute: AdminIndexRoute,
}

const AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/events': typeof EventsRoute
  '/map': typeof MapRoute
  '/projects': typeof ProjectsLazyRoute
  '/admin': typeof AdminLayoutRouteWithChildren
  '/admin/': typeof AdminIndexRoute
  '/admin/dashboard': typeof AdminLayoutDashboardRoute
  '/admin/events': typeof AdminLayoutEventsRoute
  '/admin/locations': typeof AdminLayoutLocationsRoute
  '/admin/pages': typeof AdminLayoutPagesRoute
  '/admin/projects': typeof AdminLayoutProjectsRoute
  '/admin/users': typeof AdminLayoutUsersRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/events': typeof EventsRoute
  '/map': typeof MapRoute
  '/projects': typeof ProjectsLazyRoute
  '/admin': typeof AdminIndexRoute
  '/admin/dashboard': typeof AdminLayoutDashboardRoute
  '/admin/events': typeof AdminLayoutEventsRoute
  '/admin/locations': typeof AdminLayoutLocationsRoute
  '/admin/pages': typeof AdminLayoutPagesRoute
  '/admin/projects': typeof AdminLayoutProjectsRoute
  '/admin/users': typeof AdminLayoutUsersRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/events': typeof EventsRoute
  '/map': typeof MapRoute
  '/projects': typeof ProjectsLazyRoute
  '/admin': typeof AdminRouteWithChildren
  '/admin/_layout': typeof AdminLayoutRouteWithChildren
  '/admin/': typeof AdminIndexRoute
  '/admin/_layout/dashboard': typeof AdminLayoutDashboardRoute
  '/admin/_layout/events': typeof AdminLayoutEventsRoute
  '/admin/_layout/locations': typeof AdminLayoutLocationsRoute
  '/admin/_layout/pages': typeof AdminLayoutPagesRoute
  '/admin/_layout/projects': typeof AdminLayoutProjectsRoute
  '/admin/_layout/users': typeof AdminLayoutUsersRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/events'
    | '/map'
    | '/projects'
    | '/admin'
    | '/admin/'
    | '/admin/dashboard'
    | '/admin/events'
    | '/admin/locations'
    | '/admin/pages'
    | '/admin/projects'
    | '/admin/users'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/events'
    | '/map'
    | '/projects'
    | '/admin'
    | '/admin/dashboard'
    | '/admin/events'
    | '/admin/locations'
    | '/admin/pages'
    | '/admin/projects'
    | '/admin/users'
  id:
    | '__root__'
    | '/'
    | '/events'
    | '/map'
    | '/projects'
    | '/admin'
    | '/admin/_layout'
    | '/admin/'
    | '/admin/_layout/dashboard'
    | '/admin/_layout/events'
    | '/admin/_layout/locations'
    | '/admin/_layout/pages'
    | '/admin/_layout/projects'
    | '/admin/_layout/users'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  EventsRoute: typeof EventsRoute
  MapRoute: typeof MapRoute
  ProjectsLazyRoute: typeof ProjectsLazyRoute
  AdminRoute: typeof AdminRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  EventsRoute: EventsRoute,
  MapRoute: MapRoute,
  ProjectsLazyRoute: ProjectsLazyRoute,
  AdminRoute: AdminRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/events",
        "/map",
        "/projects",
        "/admin"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/events": {
      "filePath": "events.tsx"
    },
    "/map": {
      "filePath": "map.tsx"
    },
    "/projects": {
      "filePath": "projects.lazy.tsx"
    },
    "/admin": {
      "filePath": "admin",
      "children": [
        "/admin/_layout",
        "/admin/"
      ]
    },
    "/admin/_layout": {
      "filePath": "admin/_layout.tsx",
      "parent": "/admin",
      "children": [
        "/admin/_layout/dashboard",
        "/admin/_layout/events",
        "/admin/_layout/locations",
        "/admin/_layout/pages",
        "/admin/_layout/projects",
        "/admin/_layout/users"
      ]
    },
    "/admin/": {
      "filePath": "admin/index.tsx",
      "parent": "/admin"
    },
    "/admin/_layout/dashboard": {
      "filePath": "admin/_layout/dashboard.tsx",
      "parent": "/admin/_layout"
    },
    "/admin/_layout/events": {
      "filePath": "admin/_layout/events.tsx",
      "parent": "/admin/_layout"
    },
    "/admin/_layout/locations": {
      "filePath": "admin/_layout/locations.tsx",
      "parent": "/admin/_layout"
    },
    "/admin/_layout/pages": {
      "filePath": "admin/_layout/pages.tsx",
      "parent": "/admin/_layout"
    },
    "/admin/_layout/projects": {
      "filePath": "admin/_layout/projects.tsx",
      "parent": "/admin/_layout"
    },
    "/admin/_layout/users": {
      "filePath": "admin/_layout/users.tsx",
      "parent": "/admin/_layout"
    }
  }
}
ROUTE_MANIFEST_END */

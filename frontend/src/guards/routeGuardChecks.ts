import { getUserFromAuth, userHasPermissions } from "@/utilities/userUtils";
import { Permissions } from "@/auth/permissions";
import { redirect } from "@tanstack/react-router";
import { AuthContextProps } from "react-oidc-context";

export const routePermissionCheck = (auth: AuthContextProps, permissions: Permissions[]) => {
  const user = getUserFromAuth(auth);
  if (!user || !userHasPermissions(user, permissions)){
    throw redirect({
      to: '/'
    });
  }
}

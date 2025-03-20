import { PropsWithChildren} from "react";
import { Permissions } from "@/auth/permissions";
import { useUser } from "@/hooks/useUser";
import { userHasPermissions } from "@/utilities/userUtils";

interface Props extends PropsWithChildren {
  permissions: Permissions[];
}

export const PermissionGuard = ({children, permissions}: Props) => {
  const user = useUser();

  if (!user || !userHasPermissions(user, permissions))
    return null;

  return children;
}

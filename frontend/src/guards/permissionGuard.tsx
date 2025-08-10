import { PropsWithChildren} from "react";
import { Permissions } from "@/auth/permissions";
import { useUser } from "@/hooks/useUser";
import { userHasPermissions } from "@/utilities/userUtils";

interface Props extends PropsWithChildren {
  permissions: Permissions[];
}

export const PermissionGuard = ({children, permissions}: Props) => {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    // Optionally show a loader while checking permissions
    return <div>Loading...</div>;
  }
  console.log(user);
  if (!user || !userHasPermissions(user, permissions)) {
    // Optionally show an "access denied" message
    return null;
  }

  return <>{children}</>;
}

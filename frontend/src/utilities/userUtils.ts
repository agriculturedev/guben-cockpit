import { AuthContextProps } from "react-oidc-context";
import { jwtDecode } from "jwt-decode";
import { Permissions } from "@/auth/permissions";

type CustomTokenPayload = {
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
  store: string[]; // This is an optional custom claim, some users will have it, some not...
  realm_access: {
    roles: string[];
  };
}

type TokenBaseDetails = Omit<CustomTokenPayload, 'realm_access'>;

type TokenRoles = {
  roles: string[];
}

type TokenDetails = TokenBaseDetails & TokenRoles;

// this is required because react-oidc-context uses the ID token, not the access token, so accessing user roles requires some custom logic with the access token
export const getUserFromAuth = (auth: AuthContextProps): TokenDetails | null => {

  if (auth.isAuthenticated && auth.user?.access_token) {
    try {
      const decoded = jwtDecode<CustomTokenPayload>(auth.user.access_token);
      return {
        ...decoded,
        roles: decoded.realm_access.roles,
      };
    } catch (error) {
      console.error("Token parsing error:", error);
      return null;
    }
  }

  return null;
};

export const userHasPermission = (user: TokenDetails, permission: Permissions) => {
  return user?.roles.includes(permission);
}

export const userHasPermissions = (user: TokenDetails, permissions: Permissions[]) => {
  return permissions.some(permission => userHasPermission(user, permission));
}


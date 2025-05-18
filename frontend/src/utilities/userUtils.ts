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

export type TokenDetails = TokenBaseDetails & TokenRoles;

// tiomeout at 100 to go through faster because
export const waitForAuthToLoad = async (auth: AuthContextProps, timeoutMs = 100): Promise<void> => {
  const start = Date.now();

  return new Promise((resolve, reject) => {
    const check = async () => {
      if (!auth.isLoading) {
        resolve();
      } else if (Date.now() - start > timeoutMs) {
        reject(new Error("Timed out waiting for auth to finish loading"));
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
};

// this is required because react-oidc-context uses the ID token, not the access token, so accessing user roles requires some custom logic with the access token
export const getUserFromAuth = async (auth: AuthContextProps): Promise<TokenDetails | null> => {
  try {
    await waitForAuthToLoad(auth);

    if (auth.isAuthenticated && auth.user?.access_token) {
      const decoded = jwtDecode<CustomTokenPayload>(auth.user.access_token);
      return {
        ...decoded,
        roles: decoded.realm_access.roles,
      };
    }

    return null;
  } catch (error) {
    console.error("Error while getting user from auth:", error);
    return null;
  }
};

export const userHasPermission = (user: TokenDetails, permission: Permissions) => {
  return user?.roles.includes(permission);
}

export const userHasPermissions = (user: TokenDetails, permissions: Permissions[]) => {
  return permissions.some(permission => userHasPermission(user, permission));
}


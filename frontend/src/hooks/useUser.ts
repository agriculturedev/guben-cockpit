import { useAuth } from "react-oidc-context";
import { getUserFromAuth } from "@/utilities/userUtils";

// this is required because react-oidc-context uses the ID token, not the access token, so accessing user roles requires some custom logic with the access token
export const useUser = () => {
  const auth = useAuth();
  return getUserFromAuth(auth)
};

import i18next from "i18next";
import { useAuth } from "react-oidc-context";

export const useAuthHeaders = () => {
  const auth = useAuth();
  return {
    headers: {
      "Authorization": `Bearer ${auth.user!.access_token}`,
      "Accept-Language": i18next.language
    }
  };
}

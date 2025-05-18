import { useAuth } from "react-oidc-context";
import { getUserFromAuth, TokenDetails } from "@/utilities/userUtils";
import { useEffect, useState } from "react";

export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<TokenDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      if (!auth.isLoading) {
        const u = await getUserFromAuth(auth);
        if (isMounted) {
          setUser(u);
          setIsLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [auth]);

  return { data: user, isLoading };
}

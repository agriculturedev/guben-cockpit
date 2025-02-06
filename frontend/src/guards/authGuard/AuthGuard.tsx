import { FetchInterceptor } from "@/utilities/fetchApiExtensions";
import { PropsWithChildren, useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

export const AuthGuard = ({children}: PropsWithChildren) => {
  const auth = useAuth();
  const [authHeaderSet, setAuthHeaderSet] = useState<boolean>(FetchInterceptor.hasHeader("Auhorization"));

  useEffect(() => {
    if (!auth.isAuthenticated && !auth.error && !auth.isLoading) {
      void auth.signinRedirect( {redirect_uri: `${window.location}`} );
    }
  }, [auth]);

  useEffect(() => {
    if(auth.user?.access_token) {
      FetchInterceptor.setHeader(
        "Authorization",
        `Bearer ${auth.user.access_token}`
      );
      setAuthHeaderSet(true);
    }
  }, [auth]);

  if(!auth.isLoading && auth.error) throw new Error("Cannot authenticate");
  if(authHeaderSet && auth.isAuthenticated) return children;
}

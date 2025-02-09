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
    const params = new URLSearchParams(window.location.search);

    if (params.has("state") || params.has("code") || params.has("iss") || params.has("session_state")) {

      if (params.has("state")) params.delete("state");
      if (params.has("code")) params.delete("code");
      if (params.has("iss")) params.delete("iss");
      if (params.has("session_state")) params.delete("session_state");

      const newUrl = window.location.origin + window.location.pathname + (params.toString() ? `?${params.toString()}` : "");
      window.history.replaceState({}, "", newUrl);
    }

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

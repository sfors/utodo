import {useAuth} from "./AuthContext.tsx";
import {type ReactNode, useEffect} from "react";
import {navigateTo} from "./router/util.tsx";

const RequireAuth = ({children}: { children: ReactNode }) => {
  const {isAuthenticated, isLoading, user} = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigateTo("/login");
    } else if (isAuthenticated && user && !(user.firstName && user.lastName)) {
      navigateTo("/profile");
    }
  }, [isAuthenticated, isLoading, user]);

  if (isAuthenticated) {
    return children;
  } else {
    return null;
  }
}

export default RequireAuth;
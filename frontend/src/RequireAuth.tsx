import {useAuth} from "./AuthContext.tsx";
import {type ReactNode, useEffect} from "react";
import {navigateTo} from "./router/util.tsx";

const RequireAuth = ({children}: {children: ReactNode}) => {
    const {isAuthenticated, isLoading} = useAuth();

    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            navigateTo("/login");
        }
    }, [isAuthenticated, isLoading]);

    if (!isAuthenticated) {
        return null;
    } else {
        return children;
    }
}

export default RequireAuth;
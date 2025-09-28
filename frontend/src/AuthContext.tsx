import React, {createContext, useContext, useEffect, useState} from "react";
import type {User} from "./model.ts";
import {type IWebSocketContext, useWebSocket} from "./websocket/WebSocketContext.tsx";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

interface IAuthContext {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Could not find auth context");
  }
  return context;
};

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [state, setState] = useState<AuthState>({
    user: null, isAuthenticated: false, token: null
  });

  const [isLoading, setIsLoading] = useState(true);

  const webSocketCtx: IWebSocketContext = useWebSocket();

  function login(user: User, token: string) {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    setState({...state, user, token, isAuthenticated: true});
    webSocketCtx.connect();
  }

  function updateUser(user: User) {
    localStorage.setItem("user", JSON.stringify(user));
    setState({...state, user});
  }

  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setState({...state, user: null, token: null, isAuthenticated: false});
    webSocketCtx.disconnect();
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        login(JSON.parse(user), token);
      } catch (e) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const value: IAuthContext = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading,
    login,
    updateUser,
    logout
  };

  return (
    <AuthContext value={value}>
      {children}
    </AuthContext>
  );
};
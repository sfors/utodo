import React, {createContext, useSyncExternalStore} from "react";
import type {ReactNode} from "react";

const RouterContext = createContext<string>("/");

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener("router:navigate", callback);

  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener("router:navigate", callback);
  }
}

function getSnapshot(): string {
  return window.location.pathname + "";
}

interface RouteProviderProps {
  default: ReactNode

  [key: string]: ReactNode
}

const RouteProvider: React.FC<RouteProviderProps> = (props: RouteProviderProps) => {
  const path = useSyncExternalStore(subscribe, getSnapshot)

  console.log("Path: ", path);

  const nodeToRender: ReactNode = props[path] || props.default;

  return (
    <RouterContext value={path}>
      {nodeToRender}
    </RouterContext>
  );
}


export default RouteProvider;
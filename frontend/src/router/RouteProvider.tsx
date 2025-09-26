import React, {createContext, useContext, useMemo, useSyncExternalStore} from "react";
import type {ReactNode} from "react";

interface IRouteContext {
  path: string;
  params: any;
}

const RouterContext = createContext<IRouteContext>({path: "/", params: {}});

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

export function usePathParams<T>(): T {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("Could not find router context");
  }
  return context.params as T;
}

export function usePath(): String {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("Could not find router context");
  }
  return context.path;
}

interface RouteProviderProps {
  default: ReactNode

  [key: string]: ReactNode
}

interface SegmentConfig {
  type: "param" | "static";
  name: string;
}

function getSegmentConfig(path: string): SegmentConfig[] {
  const segments = path.split("/");
  return segments.map((segment: string) => {
    if (segment.startsWith(":")) {
      const name = segment.slice(1);
      return {type: "param", name}
    } else {
      return {type: "static", name: segment}
    }
  });
}

interface DefaultRoute {
  node: ReactNode;
}

interface SegmentRoute {
  segmentConfigs: SegmentConfig[];
  node: ReactNode;
}

interface RouteConfig {
  defaultRoute: DefaultRoute,
  routes: SegmentRoute[],
}

function getRouteConfig(props: RouteProviderProps): RouteConfig {
  const defaultRoute: DefaultRoute = {node: props.default};

  const routes: SegmentRoute[] = Object.entries(props)
    .filter(([key, _]) => key !== "default")
    .map(([path, node]) => {
      const segmentConfigs = getSegmentConfig(path);
      return {type: "segments", node, segmentConfigs};
    });

  return {defaultRoute, routes};
}

interface Match {
  path: string;
  params: any
  node: ReactNode;
}

function isMatch(path: string, route: SegmentRoute): boolean {
  const segments = path.split("/");
  if (segments.length !== route.segmentConfigs.length) {
    return false;
  }

  return route.segmentConfigs.every((segmentConfig: SegmentConfig, index: number) => {
    const segment = segments[index];

    if (segmentConfig.type === "static") {
      return segment === segmentConfig.name;
    } else {
      return true;
    }
  });
}

function getMatch(path: string, route: SegmentRoute): Match {
  const segments = path.split("/");
  const params = route.segmentConfigs.reduce((result, segmentConfig, index) => {
    if (segmentConfig.type === "param") {
      return {...result, [segmentConfig.name]: segments[index]};
    } else {
      return result;
    }
  }, {});

  return {params: params, path: path, node: route.node};
}


function route(path: string, routeConfig: RouteConfig): Match {
  const matchingRoute = routeConfig.routes.find(route => isMatch(path, route));

  if (matchingRoute) {
    return getMatch(path, matchingRoute);
  } else {
    return {
      path: path,
      params: {},
      node: routeConfig.defaultRoute.node
    };
  }
}

const RouteProvider: React.FC<RouteProviderProps> = (props: RouteProviderProps) => {
  const routeConfig = useMemo(() => getRouteConfig(props), [props]);
  const path = useSyncExternalStore(subscribe, getSnapshot);
  const routeMatch: Match = route(path, routeConfig);
  const nodeToRender: ReactNode = routeMatch.node;

  console.log("Route match", routeMatch.path, "params:", routeMatch.params);

  return (
    <RouterContext value={{path: routeMatch.path, params: routeMatch.params}}>
      {nodeToRender}
    </RouterContext>
  );
}


export default RouteProvider;
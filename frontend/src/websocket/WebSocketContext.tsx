import React, {createContext, useContext, useEffect} from "react";
import type {WebSocketHandler} from "./websocket.ts";
import {useMessageHandler} from "./messageHandler.tsx";
import type {QueryClient} from "@tanstack/react-query";

export interface IWebSocketContext {
  connect: () => void;
  disconnect: () => void;
  subscribe: (channel: string) => void;
  unsubscribe: (channel: string) => void;
}

const WebSocketContext = createContext<IWebSocketContext | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("Could not find websocket context.");
  }
  return context;
};

export const useSubscription = (channel: string) => {
  const {subscribe, unsubscribe} = useWebSocket();

  useEffect(() => {
    subscribe(channel);
    return () => {
      unsubscribe(channel);
    };
  }, []);
};

interface WebSocketProviderProps {
  webSocketHandler: WebSocketHandler;
  queryClient: QueryClient;
  children: React.ReactNode;
}

export const WebSocketProvider = ({webSocketHandler, queryClient, children}: WebSocketProviderProps) => {
  const messageCallback = useMessageHandler({queryClient});

  function connect() {
    webSocketHandler.connect(messageCallback);
  }

  function disconnect() {
    webSocketHandler.disconnect();
  }

  function subscribe(channel: string) {
    webSocketHandler.subscribe(channel);
  }

  function unsubscribe(channel: string) {
    webSocketHandler.unsubscribe(channel);
  }

  return (
    <WebSocketContext value={{connect, disconnect, subscribe, unsubscribe}}>
      {children}
    </WebSocketContext>
  );
};
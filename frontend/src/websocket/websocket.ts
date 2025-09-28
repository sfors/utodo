import type {ClientMessage, ServerMessage} from "./model.ts";

type MessageCallback = (message: ServerMessage) => void;

export interface WebSocketHandler {
  connect: (cb: MessageCallback) => void;
  disconnect: () => void;
  isConnected: () => boolean;
  send: (message: ClientMessage) => void;
  subscribe: (channel: string) => void;
  unsubscribe: (channel: string) => void;
}

function createWebSocketHandler(): WebSocketHandler {
  let socket: WebSocket | null = null;
  let shouldReconnect = false;
  let connectTimeoutId: number | undefined = undefined;
  let messageCallback: MessageCallback | null = null;
  const subscriptions: Set<string> = new Set();
  let authenticated = false;

  function _connect() {
    console.log("Opening WebSocket connection...");

    shouldReconnect = true;
    clearTimeout(connectTimeoutId);
    connectTimeoutId = undefined;

    const host = window.location.hostname;
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const port = window.location.port;

    try {
      socket = new WebSocket(`${protocol}//${host}:${port}/api/websocket`);
    } catch (e) {
      console.error("Failed to open WebSocket: ", e);
      scheduleReconnect();
      return;
    }

    socket.onmessage = (event) => {
      console.log("WebSocket received message", event.data);
      const message: ServerMessage = JSON.parse(event.data);

      if (message.type === "confirmAuthentication") {
        authenticated = true;
        subscriptions.forEach((channel) => {
          send({type: "subscribe", channel: channel});
        });
      } else if (message.type === "ping") {
        send({type: "pong"});
      }

      if (messageCallback) {
        messageCallback(message);
      }
    };

    socket.onopen = () => {
      console.log("WebSocket Connected");
      send({type: "ping"});
      const token = localStorage.getItem("token");
      if (token) {
        send({type: "auth", token});
      } else {
        throw new Error("WebSocket unable to authenticate");
      }
    };

    socket.onerror = (event) => {
      console.log("WebSocket error:", event);
      if (shouldReconnect) {
        scheduleReconnect();
      }
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
      authenticated = false;
      if (shouldReconnect) {
        scheduleReconnect();
      }
    };
  }

  function connect(cb: MessageCallback) {
    messageCallback = cb;

    if (!connectTimeoutId) {
      connectTimeoutId = setTimeout(_connect, 10);
    }
  }

  function disconnect() {
    console.log("Closing websocket connection...");
    authenticated = false;
    subscriptions.clear();
    shouldReconnect = false;
    clearTimeout(connectTimeoutId);
    connectTimeoutId = undefined;
    if (socket) {
      socket.close();
    }
    socket = null;
    messageCallback = null;
  }

  function send(data: ClientMessage) {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    }
  }

  function isConnected(): boolean {
    if (socket) {
      return socket.readyState === WebSocket.OPEN;
    } else {
      return false;
    }
  }

  function scheduleReconnect() {
    if (shouldReconnect && !connectTimeoutId) {
      console.log("WebSocket reconnecting in 5 seconds...");
      connectTimeoutId = setTimeout(() => {
        if (shouldReconnect) {
          _connect();
        }
      }, 5000);
    }
  }

  function subscribe(channel: string) {
    subscriptions.add(channel);
    if (authenticated) {
      send({type: "subscribe", channel: channel});
    }
  }

  function unsubscribe(channel: string) {
    subscriptions.delete(channel);
    if (authenticated) {
      send({type: "unsubscribe", channel: channel});
    }
  }

  return {
    connect,
    disconnect,
    isConnected,
    send,
    subscribe,
    unsubscribe
  };
}

export default createWebSocketHandler;
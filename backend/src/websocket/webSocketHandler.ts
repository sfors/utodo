import type {Server} from "http";
import WebSocket, {WebSocketServer} from "ws";
import {v7 as uuidv7} from "uuid";
import type {ClientMessage, ServerMessage} from "./model.js";
import type {IncomingMessage} from "node:http";
import jwt from "../auth/jwt.js";

interface Connection {
  userId: string | null;
  ws: WebSocket;
}

type ConnectionId = string;
type ChannelId = string;

const connections = new Map<ConnectionId, Connection>();
const channelSubscriptions = new Map<ChannelId, Set<ConnectionId>>;
let cleanupTimeout: NodeJS.Timeout | undefined = undefined

function send(connectionId: ConnectionId, message: ServerMessage) {
  const connection = connections.get(connectionId);
  if (connection) {
    connection.ws.send(JSON.stringify(message));
  }
}

function subscribe(channel: ChannelId, connectionId: ConnectionId) {
  const subscription = channelSubscriptions.get(channel);
  if (subscription) {
    subscription.add(connectionId);
  } else {
    channelSubscriptions.set(channel, new Set([connectionId]));
  }
  console.log(`Connection ${connectionId} subscribed to ${channel}`)
}

function unsubscribe(channel: ChannelId, connectionId: ConnectionId) {
  const subscription = channelSubscriptions.get(channel);
  if (subscription) {
    subscription.delete(connectionId);
  }
  console.log(`Connection ${connectionId} unsubscribed from ${channel}`)
  scheduleSubscriptionCleanup();
}

function unsubscribeAll(connectionId: ConnectionId) {
  channelSubscriptions.forEach(subscribers => {
    subscribers.delete(connectionId);
  });
  scheduleSubscriptionCleanup();
}

function clearEmptyChannels() {
  [...channelSubscriptions.keys()]
    .forEach(channel => {
      const subscribers = channelSubscriptions.get(channel);
      if (subscribers && subscribers.size === 0) {
        channelSubscriptions.delete(channel);
      }
    });
}

function scheduleSubscriptionCleanup() {
  if (!cleanupTimeout) {
    cleanupTimeout = setTimeout(() => {
      cleanupTimeout = undefined;
      clearEmptyChannels();
    }, 5000);
  }
}

function handleMessage(connectionId: string, message: ClientMessage) {
  if (message.type === "ping") {
    send(connectionId, {type: "pong"});
  } else if (message.type === "auth") {
    const token = message.token;
    jwt.verify(token)
      .then((claims) => {
        const connection = connections.get(connectionId);
        if (connection) {
          connection.userId = claims.userId;
          console.log(`${connectionId} authenticated as ${claims.userId}`);
          send(connectionId, {type: "confirmAuthentication"});
        }
      })
      .catch((err) => {
        console.error(`WebSocket auth failed for connection ${connectionId}`, err);
      });
  } else if (message.type === "subscribe") {
    const channel: ChannelId = message.channel;
    subscribe(channel, connectionId);
  } else if (message.type === "unsubscribe") {
    const channel: ChannelId = message.channel;
    unsubscribe(channel, connectionId);
  }
}

export function handleConnection(ws: WebSocket, request: IncomingMessage) {
  console.log(`WebSocket connection established: ${request.url}`);

  const connectionId = uuidv7();

  connections.set(connectionId, {userId: null, ws: ws});

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });

  ws.on("close", () => {
    console.log("WebSocket closed", connectionId);
    connections.delete(connectionId);
    unsubscribeAll(connectionId);
  });

  ws.on("message", (rawData) => {
    try {
      const data: ClientMessage = JSON.parse(rawData.toString());
      console.log("WebSocket received message: ", data);
      handleMessage(connectionId, data);
    } catch (e) {
      console.error("WebSocket failed to parse message", e);
    }
  });
}

export function initializeWebSocketServer(server: Server) {
  const wss = new WebSocketServer({server, path: "/api/websocket"});

  function close(cb: () => void) {
    console.log("Closing websocket server...");
    [...connections.keys()].forEach(connectionId => {
      const connection = connections.get(connectionId);
      if (connection) {
        connection.ws.close();
        connections.delete(connectionId);
      }
    });
    wss.close(cb);
  }

  wss.on("connection", handleConnection);

  return {
    close
  };
}
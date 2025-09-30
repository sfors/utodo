import express from "express";
import http from "http";
import listRoutes from "./routes/lists.js";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import changeRoutes from "./routes/changes.js";
import healthRoutes from "./routes/health.js";
import {authenticate} from "./auth/middleware.js";
import {initializeWebSocketServer} from "./websocket/webSocketHandler.js";

const port = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);

const webSocketHandler = initializeWebSocketServer(server);

app.use(authenticate);

app.use("/api/lists", listRoutes);
app.use("/api/changes", changeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/health", healthRoutes);

server.listen(port);

server.on("error", (err) => {
  console.error(`Error: ${err}`);
  throw err;
});

server.on("listening", () => {
  console.log("Listening on port " + port);
});

function shutdown() {
  const forceShutdownTimeout = setTimeout(() => {
    console.log("Shutdown timeout reached, forcing exit.");
    process.exit(1);
  }, 30000);

  webSocketHandler.close(() => {
    console.log("WebSocketServer closed. Shutting down server...");
    server.close(() => {
      clearTimeout(forceShutdownTimeout);
      console.log("Server closed gracefully.");
      process.exit(0);
    });
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

import express from "express";
import {WebSocketServer} from "ws";
import http from "http";
import itemRoutes from "./routes/items.js"
import listRoutes from "./routes/lists.js"
import userRoutes from "./routes/users.js"
import authRoutes from "./routes/auth.js"
import {authenticate} from "./auth/middleware.js";

const port = 3001;
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({server, path: "/websocket"})

wss.on('connection', (ws, request) => {
    console.log(`Connection ${JSON.stringify(request, null, 2)}`);

    ws.on('error', console.error);

    ws.on('message', (data) => {
        console.log('received: %s', data);
    });

    ws.send('something');
});

app.use(authenticate);

app.use("/api/items", itemRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

server.listen(port);

server.on("error", (err) => {
    console.error(`Error: ${err}`);
    throw err;
});

server.on("listening", () => {
    console.log("Listening on port " + port);
});

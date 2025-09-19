import express from "express";
import {WebSocketServer, WebSocket} from "ws";
import http from "http";
import itemRoutes from "./routes/items.js"
import listRoutes from "./routes/lists.js"
import userRoutes from "./routes/users.js"

// import jwt from "./auth/jwt.js";
//
// const jwt1 = await jwt.sign({userId: 1});
// console.log("jwt1: ", jwt1)
// const payload = await jwt.verify(jwt1);
// console.log("payload: ", payload);

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

app.use(itemRoutes);
app.use(listRoutes);
app.use(userRoutes);

server.listen(port);

server.on("error", (err) => {
    console.error(`Error: ${err}`);
    throw err;
});

server.on("listening", () => {
    console.log("Listening on port " + port);
});

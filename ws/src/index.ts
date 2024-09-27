import ws, { WebSocketServer } from "ws"

const wss = new WebSocketServer({port: 3001});

wss.on('connection', function () {
    UserManager.getInstance().addUser(ws);
})
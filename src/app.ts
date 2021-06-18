import * as express from "express";
import * as socketio from "socket.io";
import * as path from "path"; 

const app = express();
app.set("port", process.env.PORT || 3000);

let http = require("http").Server(app);
// set up socket.io and bind it to our
// http server.
let io = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"],
        credentials: true
    }
}
);

app.get("/", (req: any, res: any) => {
    
});

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", (socket: any) => {
    console.log("user connected");

    let countdown = 30;
    let timerSub: any;
    socket.on('timer', (data: any) => {
        timerSub = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                socket.emit('timer', { timer: countdown });
            } else if (countdown === 0) {
                socket.emit('end',  { timer: countdown });
                clearInterval(timerSub);
            }
        }, 1000);
    });

    socket.on('reset', (data: any) => {
        countdown = 30;
        clearInterval(timerSub);
    });

    socket.on('stop', (data: any) => {
        clearInterval(timerSub);
    });
});

const server = http.listen(3000, () => {
    console.log("listening on * :3000");
});

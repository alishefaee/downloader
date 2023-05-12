import http from "http";
import dotenv from "dotenv";
dotenv.config()
import {app} from "./app";
const server = http.createServer(app);
const port = process.env.PORT || 4000;

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
/**
 * Event listener for HTTP server "error" event.
 */

function onError(error:any) {
    if (error.syscall !== "listen") {
        throw error;
    }

    const bind = "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
    console.log("Listening on " + bind);
}

export { server };
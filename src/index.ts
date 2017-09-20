import * as http from "http";
import serverMain from "./server";

const config = require("./server.json");
const hostname = process.env.HOSTNAME || config.hostname || "127.0.0.1";
const port = process.env.PORT || config.port || 3000;

const server = http.createServer(serverMain)
    .listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });

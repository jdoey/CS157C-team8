import { io } from "socket.io-client";

const URL = "http://localhost:3001";
const socket = io(URL, { autoConnect: false, transports: ["websocket"], jsonp: false });

export default socket;
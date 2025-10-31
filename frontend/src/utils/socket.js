import { io } from "socket.io-client";

const socket = io("https://grooviti-backend.onrender.com"); // Backend server URL

export default socket;

import { io, Socket } from "socket.io-client";

let socket: Socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_EVENTS_SERVER_URL!, {
      transports: ["websocket"],
    });
  }

  return socket;
};



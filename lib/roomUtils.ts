import { socket } from "./socket";

export async function createNewRoom(gameId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // 5 second safety timeout
    const timeout = setTimeout(() => {
      socket.off("room-created", handleCreated);
      socket.off("connect", onConnect);
      socket.off("error", handleError);
      reject(new Error("⏱️ Room creation timed out. Is the backend server running?"));
    }, 5000);

    const handleCreated = (data: { roomId: string }) => {
      clearTimeout(timeout);
      socket.off("room-created", handleCreated);
      socket.off("connect", onConnect);
      socket.off("error", handleError);
      resolve(data.roomId);
    };

    const handleError = (err: any) => {
      clearTimeout(timeout);
      socket.off("room-created", handleCreated);
      socket.off("connect", onConnect);
      socket.off("error", handleError);
      reject(new Error("❌ Connection failed. Check backend server."));
    };

    const onConnect = () => {
      socket.off("connect", onConnect);
      socket.emit("create-room", { gameId });
    };

    socket.on("room-created", handleCreated);
    socket.on("error", handleError);
    socket.on("connect", onConnect);

    socket.connect();
  });
}

import { socket } from "./socket";

export async function createNewRoom(gameId: string): Promise<string> {
  return new Promise((resolve, reject) => {
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
      reject(new Error("❌ Connection failed. Check your internet connection or try again."));
    };

    const onConnect = () => {
      socket.off("connect", onConnect);
      socket.emit("create-room", { gameId });
    };

    // Safety timeout to allow Render free tier wakeups (defined after functions to avoid TDZ warnings)
    const timeout = setTimeout(() => {
      socket.off("room-created", handleCreated);
      socket.off("connect", onConnect);
      socket.off("error", handleError);
      reject(new Error("⏱️ Room creation timed out. Please try again. The server takes about 30 seconds to wake up from sleep."));
    }, 45000);

    socket.on("room-created", handleCreated);
    socket.on("error", handleError);

    if (socket.connected) {
      socket.emit("create-room", { gameId });
    } else {
      socket.on("connect", onConnect);
      socket.connect();
    }
  });
}

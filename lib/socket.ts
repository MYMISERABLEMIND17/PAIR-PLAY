class SocketEmulator {
  private ws: WebSocket | null = null;
  private listeners: Record<string, Function[]> = {};
  private reconnectInterval: any = null;
  private isAttemptingConnection = false;

  get connected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  connect() {
    if (this.ws || this.isAttemptingConnection) return;
    this.isAttemptingConnection = true;

    const isBrowser = typeof window !== "undefined";
    const getSocketUrl = () => {
      if (!isBrowser) return "ws://localhost:3001";
      if (process.env.NEXT_PUBLIC_SOCKET_URL) {
        return process.env.NEXT_PUBLIC_SOCKET_URL;
      }
      const host = window.location.hostname;
      if (host === "localhost" || host === "127.0.0.1" || host.startsWith("192.168.")) {
        return `ws://${host}:3001`;
      }
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      return `${protocol}//winkd-backend.up.railway.app`; // Production fallback or similar
    };

    const url = getSocketUrl();
    console.log(`Connecting to WebSocket server at: ${url}`);
    
    try {
      this.ws = new WebSocket(url);
      
      this.ws.onopen = () => {
        console.log("WebSocket connection established successfully.");
        this.isAttemptingConnection = false;
        clearInterval(this.reconnectInterval);
        this.reconnectInterval = null;
        this.trigger("connect", null);
      };
      
      this.ws.onmessage = (event) => {
        try {
          const { event: eventName, data } = JSON.parse(event.data);
          this.trigger(eventName, data);
        } catch (err) {
          console.warn("Failed to parse websocket message", err);
        }
      };
      
      this.ws.onclose = () => {
        console.log("WebSocket connection closed.");
        this.ws = null;
        this.isAttemptingConnection = false;
        this.trigger("disconnect", null);
        this.startReconnection();
      };

      this.ws.onerror = (err: any) => {
        console.warn("WebSocket connection state:", err);
        this.trigger("error", err);
      };
    } catch (error) {
      console.warn("Failed to instantiate WebSocket:", error);
      this.isAttemptingConnection = false;
      this.startReconnection();
    }
  }

  private startReconnection() {
    if (this.reconnectInterval) return;
    console.log("Attempting automatic reconnection in 3 seconds...");
    this.reconnectInterval = setInterval(() => {
      this.connect();
    }, 3000);
  }

  private trigger(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  emit(event: string, data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ event, data }));
    } else {
      console.warn(`Cannot emit '${event}': WebSocket is not open. State: ${this.ws?.readyState}`);
    }
  }
  
  disconnect() {
    clearInterval(this.reconnectInterval);
    this.reconnectInterval = null;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isAttemptingConnection = false;
    console.log("WebSocket manually disconnected.");
  }
}

export const socket = new SocketEmulator();
export default socket;

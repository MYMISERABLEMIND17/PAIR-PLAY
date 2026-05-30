class SocketEmulator {
  private ws: WebSocket | null = null;
  private listeners: Record<string, Function[]> = {};
  private reconnectTimeout: any = null;
  private reconnectAttempts = 0;
  private isAttemptingConnection = false;
  private lastHeartbeat: number = Date.now();
  private heartbeatTimeoutCheck: any = null;

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
      return `${protocol}//pair-play-piaa.onrender.com`; // Production fallback to new Render backend
    };

    const url = getSocketUrl();
    console.log(`Connecting to WebSocket server at: ${url}`);
    
    try {
      this.ws = new WebSocket(url);
      
      this.ws.onopen = () => {
        console.log("WebSocket connection established successfully.");
        this.isAttemptingConnection = false;
        this.lastHeartbeat = Date.now();
        this.reconnectAttempts = 0; // Reset connection attempts count on success
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
        this.startHeartbeatWatcher();
        this.trigger("connect", null);
      };
      
      this.ws.onmessage = (event) => {
        try {
          const { event: eventName, data } = JSON.parse(event.data);
          if (eventName === "ping") {
            this.lastHeartbeat = Date.now();
            this.emit("pong", {});
            return;
          }
          if (eventName === "superseded") {
            console.warn("[Socket] This connection has been superseded by a newer tab or device session. Disabling automatic reconnection.");
            this.disconnect();
            return;
          }
          this.trigger(eventName, data);
        } catch (err) {
          console.warn("Failed to parse websocket message", err);
        }
      };
      
      this.ws.onclose = () => {
        console.log("WebSocket connection closed.");
        this.ws = null;
        this.isAttemptingConnection = false;
        clearInterval(this.heartbeatTimeoutCheck);
        this.heartbeatTimeoutCheck = null;
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
    if (this.reconnectTimeout) return;
    
    this.reconnectAttempts++;
    
    // Exact delay mapping from required reconnect strategy
    let backoffDelay = 1000;
    if (this.reconnectAttempts === 2) {
      backoffDelay = 2000;
    } else if (this.reconnectAttempts === 3) {
      backoffDelay = 5000;
    } else if (this.reconnectAttempts === 4) {
      backoffDelay = 10000;
    } else if (this.reconnectAttempts >= 5) {
      backoffDelay = 15000;
    }
    
    // Incorporate small jitter to prevent concurrent reconnect storms
    const jitter = Math.random() * 500;
    const delay = backoffDelay + jitter;
    
    console.log(`[Socket Reconnect] Attempt #${this.reconnectAttempts} scheduled in ${Math.round(delay)}ms (Backoff: ${backoffDelay}ms, Jitter: ${Math.round(jitter)}ms)...`);
    
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      this.connect();
    }, delay);
  }

  private startHeartbeatWatcher() {
    clearInterval(this.heartbeatTimeoutCheck);
    this.heartbeatTimeoutCheck = setInterval(() => {
      if (this.connected && Date.now() - this.lastHeartbeat > 30000) {
        console.warn("[Heartbeat] Lost connection to server (heartbeat timeout). Reconnecting...");
        this.lastHeartbeat = Date.now();
        if (this.ws) {
          this.ws.close();
        }
      }
    }, 5000);
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
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.reconnectAttempts = 0;
    clearInterval(this.heartbeatTimeoutCheck);
    this.heartbeatTimeoutCheck = null;
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

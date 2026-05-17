import { useEffect, useState } from "react";
import { socket } from "./socket";

export interface RoomState {
  gameId: string;
  currentPromptIndex: number;
  isFlipped: boolean;
  players: string[];
  lastReaction?: { type: string; timestamp: number; by: string };
  answers?: Record<string, string>;
  hasSubmitted?: Record<string, boolean>;
}

export function useRoom(roomId: string) {
  const [state, setState] = useState<RoomState | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<'not_found' | 'full' | 'network_blocked' | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Initialize unique local user identity (cached in localStorage)
  useEffect(() => {
    if (typeof window !== "undefined") {
      let cachedId = localStorage.getItem("pairplay_userid");
      if (!cachedId) {
        cachedId = `user_${Math.random().toString(36).substring(2, 12)}`;
        localStorage.setItem("pairplay_userid", cachedId);
      }
      setUserId(cachedId);
    }
  }, []);

  // WebSockets Real-Time Sync Listener Lifecycle
  useEffect(() => {
    if (!userId || isOfflineMode) return;

    // Safety timeout to flag network blocks if server doesn't respond
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn("WebSocket connection timeout: server is unreachable");
        setError('network_blocked');
        setLoading(false);
      }
    }, 8000);

    const onConnect = () => {
      console.log("Socket connected, joining room:", roomId);
      socket.emit("join-room", { roomId, userId });
    };

    const onStateUpdate = (newState: RoomState) => {
      console.log("Sync game-state received:", newState);
      setState(newState);
      setLoading(false);
      clearTimeout(timeoutId);
      setError(null);
    };

    const onRoomError = (err: { code: 'not_found' | 'full' }) => {
      console.error("Room error received:", err.code);
      setError(err.code);
      setLoading(false);
      clearTimeout(timeoutId);
    };

    const onError = () => {
      console.error("WebSocket server connection error.");
      setError('network_blocked');
      setLoading(false);
      clearTimeout(timeoutId);
    };

    // Register listeners
    socket.on("connect", onConnect);
    socket.on("game-state-update", onStateUpdate);
    socket.on("room-error", onRoomError);
    socket.on("error", onError);

    // Initial connection or join trigger if already connected
    socket.connect();
    socket.emit("join-room", { roomId, userId });

    return () => {
      socket.off("connect", onConnect);
      socket.off("game-state-update", onStateUpdate);
      socket.off("room-error", onRoomError);
      socket.off("error", onError);
      clearTimeout(timeoutId);
    };
  }, [roomId, userId, loading, isOfflineMode]);

  // Actions
  const enableOfflineMode = (gameId: string) => {
    setIsOfflineMode(true);
    setError(null);
    setLoading(false);
    
    const localId = userId || "offline_user_1";
    setUserId(localId);
    setState({
      gameId,
      currentPromptIndex: 0,
      isFlipped: false,
      players: [localId],
      answers: {},
    });
  };

  const simulatePartnerJoin = () => {
    if (!state || !isOfflineMode) return;
    setState({
      ...state,
      players: [...state.players, "mock_partner_2"]
    });
  };

  const flipCard = () => {
    if (!state) return;
    if (isOfflineMode) {
      setState({ ...state, isFlipped: true });
      return;
    }
    socket.emit("flip-card", { roomId });
  };

  const nextPrompt = (totalPrompts: number) => {
    if (!state) return;
    if (isOfflineMode) {
      setState({
        ...state,
        isFlipped: false,
        answers: {},
        currentPromptIndex: (state.currentPromptIndex + 1) % totalPrompts
      });
      return;
    }
    socket.emit("next-prompt", { roomId, totalPrompts });
  };

  const submitAnswer = (text: string) => {
    if (!userId || !state) return;
    if (isOfflineMode) {
      setState({
        ...state,
        answers: { ...state.answers, [userId]: text }
      });
      return;
    }
    socket.emit("submit-answer", { roomId, userId, text });
  };

  const sendReaction = (type: string) => {
    if (!userId || !state) return;
    if (isOfflineMode) {
      setState({
        ...state,
        lastReaction: { type, timestamp: Date.now(), by: userId }
      });
      return;
    }
    socket.emit("reaction", { roomId, userId, type });
  };

  return { 
    state, userId, loading, error, isOfflineMode, 
    flipCard, nextPrompt, sendReaction, submitAnswer, 
    enableOfflineMode, simulatePartnerJoin 
  };
}

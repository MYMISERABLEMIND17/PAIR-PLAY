import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";
import { db, auth } from "./firebase";

export interface RoomState {
  gameId: string;
  currentPromptIndex: number;
  isFlipped: boolean;
  players: string[];
  lastReaction?: { type: string; timestamp: number; by: string };
  answers?: Record<string, string>;
}


export function useRoom(roomId: string) {
  const [state, setState] = useState<RoomState | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<'not_found' | 'full' | 'network_blocked' | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  useEffect(() => {
    // 1. Authenticate the user anonymously
    signInAnonymously(auth)
      .then((userCredential) => {
        setUserId(userCredential.user.uid);
      })
      .catch((error) => {
        console.error("Auth failed:", error);
      });
  }, []);

  useEffect(() => {
    if (!userId || isOfflineMode) return;

    // Set a timeout to detect if Firebase is blocked by the network/adblocker
    const timeoutId = setTimeout(() => {
      if (loading) {
        setError('network_blocked');
        setLoading(false);
      }
    }, 10000);

    const roomRef = doc(db, "rooms", roomId);

    // 2. Listen to Firestore changes
    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as RoomState;

        // Check if the room is full and we are not already in it
        if (data.players.length >= 2 && !data.players.includes(userId)) {
          setError('full');
          setLoading(false);
          return;
        }

        setState(data);
        
        // If we are not in the players array, join the room
        if (!data.players.includes(userId)) {
           updateDoc(roomRef, {
             players: [...data.players, userId]
           });
        }
      } else {
        setError('not_found');
      }
      setLoading(false);
      clearTimeout(timeoutId);
    }, (error) => {
      console.error("Firestore Error:", error);
      setError('network_blocked');
      setLoading(false);
      clearTimeout(timeoutId);
    });

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [roomId, userId, loading]);

  // Actions
  const enableOfflineMode = (gameId: string) => {
    setIsOfflineMode(true);
    setError(null);
    setLoading(false);
    // Setup local dummy state
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
    updateDoc(doc(db, "rooms", roomId), { isFlipped: true });
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
    updateDoc(doc(db, "rooms", roomId), {
      isFlipped: false,
      answers: {},
      currentPromptIndex: (state.currentPromptIndex + 1) % totalPrompts
    });
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
    updateDoc(doc(db, "rooms", roomId), {
      [`answers.${userId}`]: text
    });
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
    updateDoc(doc(db, "rooms", roomId), {
      lastReaction: { type, timestamp: Date.now(), by: userId }
    });
  };

  return { 
    state, userId, loading, error, isOfflineMode, 
    flipCard, nextPrompt, sendReaction, submitAnswer, 
    enableOfflineMode, simulatePartnerJoin 
  };
}

import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { signInAnonymously } from "firebase/auth";

// Generates a random 5-character string (e.g., "X9K4B")
function generateRoomId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function createNewRoom(gameId: string): Promise<string> {
  // Ensure the user is authenticated anonymously first
  let userId = auth.currentUser?.uid;
  if (!userId) {
    const cred = await signInAnonymously(auth);
    userId = cred.user.uid;
  }

  const roomId = generateRoomId();
  const roomRef = doc(db, "rooms", roomId);

  await setDoc(roomRef, {
    gameId,
    currentPromptIndex: 0,
    isFlipped: false,
    players: [userId]
  });

  return roomId;
}

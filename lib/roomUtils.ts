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
  try {
    // Validate gameId
    if (!gameId || gameId.trim() === '') {
      throw new Error("Invalid game ID provided");
    }

    // Ensure the user is authenticated anonymously first
    let userId = auth.currentUser?.uid;
    if (!userId) {
      const cred = await signInAnonymously(auth);
      userId = cred.user.uid;
    }

    const roomId = generateRoomId();
    const roomRef = doc(db, "rooms", roomId);

    // Attempt to create room with timeout
    const createPromise = setDoc(roomRef, {
      gameId,
      currentPromptIndex: 0,
      isFlipped: false,
      players: [userId],
      createdAt: new Date().toISOString(),
    });

    // 15 second timeout for Firestore operation
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Firestore connection timeout. Check internet and Firebase config.")), 15000)
    );

    await Promise.race([createPromise, timeoutPromise]);
    return roomId;
  } catch (error) {
    const err = error as Error;
    console.error("Room creation error:", err);
    
    // Provide specific error messages
    if (err.message.includes("auth/invalid-api-key")) {
      throw new Error("Firebase is not properly configured. Check your .env.local file.");
    }
    if (err.message.includes("timeout")) {
      throw new Error("Connection timeout. Firebase may be blocked. Try disabling VPN/Adblocker.");
    }
    if (err.message.includes("PERMISSION_DENIED")) {
      throw new Error("Database permission denied. Check Firebase Firestore rules.");
    }
    
    throw new Error(err.message || "Failed to create room. Please try again.");
  }
}

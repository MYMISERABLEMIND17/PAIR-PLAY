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
    const errorStr = err.message || '';
    console.error("Room creation error:", err);
    
    // Provide specific error messages for known issues
    if (errorStr.includes("ERR_BLOCKED_BY_CLIENT")) {
      throw new Error(
        "🔒 Firestore is being blocked by your browser, VPN, or adblocker.\n\n" +
        "Quick fix:\n" +
        "1. Disable uBlock, Adblocker, or other extensions\n" +
        "2. Disable VPN if using one\n" +
        "3. If on school/work WiFi, ask your IT admin to allow firestore.googleapis.com\n\n" +
        "Then refresh and try again."
      );
    }
    if (errorStr.includes("auth/invalid-api-key")) {
      throw new Error("Firebase is not properly configured. Check your .env.local file.");
    }
    if (errorStr.includes("timeout")) {
      throw new Error(
        "⏱️ Connection timeout. Firebase may be blocked.\n\n" +
        "Try disabling VPN/Adblocker and ensure firestore.googleapis.com is not blocked."
      );
    }
    if (errorStr.includes("PERMISSION_DENIED")) {
      throw new Error("Database permission denied. Check Firebase Firestore rules.");
    }
    if (errorStr.includes("Failed to get document from cache")) {
      throw new Error(
        "Firestore connection blocked.\n\n" +
        "Disable adblocker, VPN, or school/work network filters, then try again."
      );
    }
    
    throw new Error(errorStr || "Failed to create room. Please try again.");
  }
}

import { createClient } from "@supabase/supabase-js";

// We use the anon key for client-side subscription, but for server-side broadcasting
// we need the service role key to bypass RLS when dispatching system events.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Server-side realtime client for broadcasting events securely.
 * DO NOT expose this to the frontend.
 */
export const realtimeAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Broadcasts an emotional/game event to a specific couple's private room.
 */
export async function broadcastToCouple(coupleId: string, event: string, payload: any) {
  const channel = realtimeAdmin.channel(`room:${coupleId}`);
  
  await channel.send({
    type: "broadcast",
    event: event,
    payload: {
      timestamp: new Date().toISOString(),
      ...payload
    }
  });
}

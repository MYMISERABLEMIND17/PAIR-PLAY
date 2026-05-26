# WINKD

Winkd is a real-time social games platform for couples, friends, and parties. The publishable MVP focuses on public game discovery, anonymous share-link rooms, offline demo play, and a separate lightweight WebSocket realtime server.

## Current Production Shape

- Next.js 16 App Router frontend
- React 19 client gameplay components
- Tailwind CSS 4 styling
- Native WebSocket realtime server in `server/index.js`
- Optional Supabase auth for account-only areas such as dashboard and journey
- Drizzle/Postgres schema reserved for authenticated relationship features

Anonymous game rooms are intentionally public. Users can create a room, share the room code or link, and play without logging in.

## Requirements

- Node.js 20.9 or newer, required by Next.js 16
- npm
- A deployed WebSocket backend for multiplayer rooms
- Optional Supabase and Postgres credentials if account features are enabled

## Environment Variables

Create `.env.local` for the frontend:

```bash
NEXT_PUBLIC_SOCKET_URL=ws://localhost:3001

# Optional account features
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
```

For production, set `NEXT_PUBLIC_SOCKET_URL` to your deployed realtime server URL. Use `wss://` when the frontend is served over HTTPS.

## Local Development

Run the frontend and realtime server in two terminals:

```bash
npm install
npm run dev
```

```bash
npm run dev:socket
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev          # Start the Next.js app
npm run dev:socket   # Start the local WebSocket server on port 3001
npm run build        # Build the Next.js app
npm run start        # Start the built Next.js app
npm run start:socket # Start the WebSocket server for deployment
npm run lint         # Run ESLint
```

## Deployment

Deploy this as two services:

1. Frontend: deploy the Next.js app to Vercel or another Next-compatible host.
2. Realtime backend: deploy `server/index.js` to a Node host that supports WebSockets, such as Railway, Render, Fly.io, or a VPS.

After deploying the backend, set `NEXT_PUBLIC_SOCKET_URL` on the frontend to the backend WebSocket URL. Example:

```bash
NEXT_PUBLIC_SOCKET_URL=wss://your-winkd-realtime.example.com
```

The current realtime server stores active rooms in memory. That is acceptable for a small MVP, but production scale requires sticky sessions or a shared store such as Redis/Postgres.

## App Map

- `app/page.tsx` - landing page and featured games
- `app/games/page.tsx` - game discovery
- `app/room/[roomId]/page.tsx` - live multiplayer room
- `app/components/GameCard.tsx` - create/join/offline game entry
- `app/components/games/*` - gameplay UIs
- `lib/socket.ts` - browser WebSocket client
- `lib/useRoom.ts` - room state hook
- `server/index.js` - realtime room server
- `proxy.ts` - auth guard for account-only routes

## Important Notes

- `/room/*` is public by design for anonymous share-link play.
- `/dashboard` and `/journey` are protected account routes.
- The dashboard, journey, explore, and mobile pages are polished product surfaces but still need real data integration before they should be marketed as complete account features.
- Firebase is no longer part of the active room flow.

## Production Checklist

Before launch, run:

```bash
npm run lint
npm run build
```

Then manually verify:

- Create room from a game card
- Join room from a second browser/device
- Advance prompts and submit answers
- Send reactions
- Use offline demo mode
- Confirm protected pages redirect when logged out
- Confirm production `NEXT_PUBLIC_SOCKET_URL` uses `wss://`

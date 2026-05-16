This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# PAIR-PLAY

Interactive social games platform for couples, friends, and parties. Play Truth or Dare, Would You Rather, Conversation Starters, and more in real-time rooms!

## ⚡ Quick Start

### 1. Setup Firebase

You **must** configure Firebase for the app to work. Room creation and joining require Firebase Firestore and Authentication.

**Steps:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Firestore Database** (start in test mode for development)
4. Enable **Authentication** → Sign-in method → **Anonymous**
5. Go to **Project Settings** and copy your config

**Configure Firestore Rules** (Security tab):
```
match /rooms/{roomId} {
  allow create, read, update: if request.auth != null;
}
```

6. Copy the config values to `.env.local`:
```bash
cp .env.local.example .env.local
# Edit .env.local and add your Firebase credentials
```

### 2. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🎮 Features

- **Truth or Dare** - Classic party game with truths & dares
- **Would You Rather** - Choose between two scenarios
- **Conversation Starters** - Break the ice with fun questions
- **Deep Connection** - Deepen your bond with meaningful questions
- **Real-time Sync** - Firebase Firestore powers live multiplayer rooms
- **Anonymous Play** - No login required (Firebase Anonymous Auth)

## 📝 Development

- Edit game data in `app/data/*.json`
- Add new games in `app/components/games/*.tsx`
- Game routing in `app/games/page.tsx`
- Room logic in `lib/useRoom.ts`

### Available Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🔧 Troubleshooting

### 🔒 "Connection Blocked" Error (ERR_BLOCKED_BY_CLIENT)

**This is the #1 issue!** Your browser or network is blocking Firebase.

**Causes:**
- Adblocker extension enabled (uBlock Origin, Adblock Plus, etc.)
- VPN active
- School/Work network firewall
- Firefox Enhanced Tracking Protection

**Fix:**
1. **Disable your adblocker** - Whitelist `pairplay.app` or disable it temporarily
2. **Disable VPN** if you're using one
3. **Refresh the page** (F5 or Cmd+R)
4. Try creating the room again

If you can't disable your adblocker, use the **Demo Mode** button to play offline locally.

### ⏱️ "Connection Timeout" Error

Your internet is too slow or Firebase is still blocked.

**Fix:**
1. Check your internet connection
2. Disable VPN/Adblocker
3. Ask your network admin to allow `firestore.googleapis.com`
4. Try again in 30 seconds

### "Room Not Found"?
- Double-check the room code is correct
- Both users need an active internet connection
- Verify Firestore Rules allow anonymous access

### "Room is Full"?
- Rooms are limited to 2 players for privacy
- Create a new room or refresh the page

### Demo Mode (Offline)
If you can't get Firebase working, click **"Play in Demo Mode"** to play locally with a simulated partner.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# PAIR-PLAY

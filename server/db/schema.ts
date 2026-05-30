import { pgTable, text, timestamp, uuid, jsonb, boolean, integer, primaryKey, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. USERS
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(), // Maps to Supabase Auth User ID
  email: text("email").notNull().unique(),
  username: text("username").unique(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  onboarded: boolean("onboarded").default(false).notNull(),
  timezone: text("timezone").default("UTC").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. COUPLES (The Core Relationship)
export const couples = pgTable("couples", {
  id: uuid("id").primaryKey().defaultRandom(),
  status: text("status", { enum: ["pending", "active", "broken"] }).default("pending").notNull(),
  streakDays: integer("streak_days").default(0).notNull(),
  lastInteractionAt: timestamp("last_interaction_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. COUPLE MEMBERS (Relating Users to Couples)
export const coupleMembers = pgTable("couple_members", {
  coupleId: uuid("couple_id").references(() => couples.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  role: text("role", { enum: ["initiator", "partner"] }).notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.coupleId, t.userId] }),
}));

// 4. GAMES & CATEGORIES
export const gameCategories = pgTable("game_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  colorTheme: text("color_theme"),
});

export const games = pgTable("games", {
  id: uuid("id").primaryKey().defaultRandom(),
  categoryId: uuid("category_id").references(() => gameCategories.id),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  description: text("description"),
  premium: boolean("premium").default(false).notNull(),
  contentData: jsonb("content_data").notNull(), // Questions, Prompts, Rules
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 5. GAME SESSIONS
export const gameSessions = pgTable("game_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  coupleId: uuid("couple_id").references(() => couples.id, { onDelete: "cascade" }).notNull(),
  gameId: uuid("game_id").references(() => games.id).notNull(),
  status: text("status", { enum: ["active", "completed", "abandoned"] }).default("active").notNull(),
  state: jsonb("state").default({}).notNull(), // Current turn, scores, seeded random state
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// 6. CHALLENGES & PROGRESSION
export const challenges = pgTable("challenges", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  xpReward: integer("xp_reward").default(0).notNull(),
  type: text("type", { enum: ["daily", "weekly", "milestone"] }).notNull(),
});

export const coupleChallenges = pgTable("couple_challenges", {
  id: uuid("id").primaryKey().defaultRandom(),
  coupleId: uuid("couple_id").references(() => couples.id, { onDelete: "cascade" }).notNull(),
  challengeId: uuid("challenge_id").references(() => challenges.id).notNull(),
  status: text("status", { enum: ["active", "completed", "failed"] }).default("active").notNull(),
  progress: integer("progress").default(0).notNull(),
  target: integer("target").notNull(),
  completedAt: timestamp("completed_at"),
});

// 7. MEMORIES & TIMELINE
export const memories = pgTable("memories", {
  id: uuid("id").primaryKey().defaultRandom(),
  coupleId: uuid("couple_id").references(() => couples.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  mediaUrl: text("media_url"),
  type: text("type", { enum: ["user_generated", "game_moment", "milestone"] }).notNull(),
  metadata: jsonb("metadata").default({}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 8. ACTIVITIES (Event Feed)
export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  coupleId: uuid("couple_id").references(() => couples.id, { onDelete: "cascade" }).notNull(),
  actorId: uuid("actor_id").references(() => users.id).notNull(),
  type: text("type", { enum: ["game_played", "milestone_reached", "reaction_sent", "memory_saved", "challenge_completed"] }).notNull(),
  metadata: jsonb("metadata").default({}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 9. NOTIFICATIONS
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type", { enum: ["system", "partner_action", "ai_insight"] }).notNull(),
  read: boolean("read").default(false).notNull(),
  actionUrl: text("action_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 10. REALTIME ROOMS & MULTIPLAYER SESSIONS
export const realtimeRooms = pgTable("realtime_rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  coupleId: uuid("couple_id").references(() => couples.id, { onDelete: "cascade" }).notNull(),
  type: text("type", { enum: ["persistent_couple", "temporary_game", "challenge"] }).default("persistent_couple").notNull(),
  activeSessionId: uuid("active_session_id").references(() => gameSessions.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const roomMembers = pgTable("room_members", {
  roomId: uuid("room_id").references(() => realtimeRooms.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  role: text("role", { enum: ["host", "participant"] }).notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.roomId, t.userId] }),
}));

// 11. PRESENCE & ONLINE STATE (Historical tracking for analytics/streaks)
export const presenceLog = pgTable("presence_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  roomId: uuid("room_id").references(() => realtimeRooms.id),
  status: text("status", { enum: ["online", "idle", "offline", "in_game"] }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// 12. LIVE EVENTS & REACTIONS (Historical ledger for memory curation)
export const liveEvents = pgTable("live_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  roomId: uuid("room_id").references(() => realtimeRooms.id, { onDelete: "cascade" }).notNull(),
  actorId: uuid("actor_id").references(() => users.id).notNull(),
  eventType: text("event_type", { enum: ["reaction", "answer_revealed", "typing", "state_sync"] }).notNull(),
  payload: jsonb("payload").default({}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 13. AI MEMORY & VECTOR EMBEDDINGS (pgvector)
export const memoryEmbeddings = pgTable("memory_embeddings", {
  id: uuid("id").primaryKey().defaultRandom(),
  coupleId: uuid("couple_id").references(() => couples.id, { onDelete: "cascade" }).notNull(),
  sourceType: text("source_type", { enum: ["memory", "activity", "game_session", "insight"] }).notNull(),
  sourceId: uuid("source_id").notNull(),
  content: text("content").notNull(), // The string that was embedded
  // Using generic JSONB for vectors if pgvector is not explicitly typed in this drizzle version
  // Ideally this is vector("embedding", { dimensions: 1536 }) 
  embedding: jsonb("embedding").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 14. RECOMMENDATION PROFILES & PERSONALIZATION
export const personalizationProfiles = pgTable("personalization_profiles", {
  coupleId: uuid("couple_id").primaryKey().references(() => couples.id, { onDelete: "cascade" }),
  preferredMoods: jsonb("preferred_moods").default([]).notNull(),
  interactionPacing: text("interaction_pacing", { enum: ["frequent", "relaxed", "weekend_only"] }).default("relaxed").notNull(),
  activeInsights: jsonb("active_insights").default([]).notNull(), // Curated AI takeaways
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 15. SOCIAL GRAPH (Friend Couples)
export const socialGraph = pgTable("social_graph", {
  id: uuid("id").primaryKey().defaultRandom(),
  coupleAId: uuid("couple_a_id").references(() => couples.id, { onDelete: "cascade" }).notNull(),
  coupleBId: uuid("couple_b_id").references(() => couples.id, { onDelete: "cascade" }).notNull(),
  status: text("status", { enum: ["pending", "friends", "blocked"] }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 16. BACKGROUND JOBS & ASYNC QUEUE
export const backgroundJobs = pgTable("background_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type", { enum: ["process_memory", "calculate_streak", "generate_recap", "send_notification"] }).notNull(),
  payload: jsonb("payload").default({}).notNull(),
  status: text("status", { enum: ["queued", "processing", "completed", "failed"] }).default("queued").notNull(),
  runAt: timestamp("run_at").defaultNow().notNull(),
  attempts: integer("attempts").default(0).notNull(),
  errorLog: text("error_log"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 17. ANALYTICS & AUDIT LOGGING (Observability)
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorId: uuid("actor_id").references(() => users.id),
  action: text("action").notNull(),
  resourceType: text("resource_type").notNull(),
  resourceId: text("resource_id").notNull(),
  payload: jsonb("payload").default({}).notNull(),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  event: text("event").notNull(),
  properties: jsonb("properties").default({}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 18. MODERATION & ABUSE PREVENTION
export const moderationReports = pgTable("moderation_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  reporterId: uuid("reporter_id").references(() => users.id).notNull(),
  targetUserId: uuid("target_user_id").references(() => users.id),
  reason: text("reason").notNull(),
  status: text("status", { enum: ["pending", "investigating", "resolved", "dismissed"] }).default("pending").notNull(),
  resolutionNote: text("resolution_note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const rateLimits = pgTable("rate_limits", {
  identifier: text("identifier").primaryKey(), // IP address or UserID
  endpoint: text("endpoint").notNull(),
  requests: integer("requests").default(1).notNull(),
  resetAt: timestamp("reset_at").notNull(),
});

// 19. BILLING & MONETIZATION
export const billingProfiles = pgTable("billing_profiles", {
  coupleId: uuid("couple_id").primaryKey().references(() => couples.id, { onDelete: "cascade" }),
  stripeCustomerId: text("stripe_customer_id").unique(),
  subscriptionPlan: text("subscription_plan", { enum: ["free", "premium", "lifetime"] }).default("free").notNull(),
  subscriptionStatus: text("subscription_status", { enum: ["active", "past_due", "canceled", "none"] }).default("none").notNull(),
  currentPeriodEnd: timestamp("current_period_end"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 20. PLATFORM OPERATIONS
export const featureFlags = pgTable("feature_flags", {
  key: text("key").primaryKey(),
  enabled: boolean("enabled").default(false).notNull(),
  percentageRollout: integer("percentage_rollout").default(100).notNull(),
  updatedBy: text("updated_by"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// =======================
// RELATIONS
// =======================

export const usersRelations = relations(users, ({ many }) => ({
  coupleMemberships: many(coupleMembers),
  activities: many(activities),
  notifications: many(notifications),
}));

export const couplesRelations = relations(couples, ({ many }) => ({
  members: many(coupleMembers),
  activities: many(activities),
  sessions: many(gameSessions),
  memories: many(memories),
  challenges: many(coupleChallenges),
  savedMoments: many(savedMoments),
}));

export const coupleMembersRelations = relations(coupleMembers, ({ one }) => ({
  couple: one(couples, { fields: [coupleMembers.coupleId], references: [couples.id] }),
  user: one(users, { fields: [coupleMembers.userId], references: [users.id] }),
}));

export const gameCategoriesRelations = relations(gameCategories, ({ many }) => ({
  games: many(games),
}));

export const gamesRelations = relations(games, ({ one, many }) => ({
  category: one(gameCategories, { fields: [games.categoryId], references: [gameCategories.id] }),
  sessions: many(gameSessions),
}));

export const gameSessionsRelations = relations(gameSessions, ({ one }) => ({
  couple: one(couples, { fields: [gameSessions.coupleId], references: [couples.id] }),
  game: one(games, { fields: [gameSessions.gameId], references: [games.id] }),
}));

export const challengesRelations = relations(challenges, ({ many }) => ({
  coupleChallenges: many(coupleChallenges),
}));

export const coupleChallengesRelations = relations(coupleChallenges, ({ one }) => ({
  couple: one(couples, { fields: [coupleChallenges.coupleId], references: [couples.id] }),
  challenge: one(challenges, { fields: [coupleChallenges.challengeId], references: [challenges.id] }),
}));

export const memoriesRelations = relations(memories, ({ one }) => ({
  couple: one(couples, { fields: [memories.coupleId], references: [couples.id] }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  couple: one(couples, { fields: [activities.coupleId], references: [couples.id] }),
  actor: one(users, { fields: [activities.actorId], references: [users.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const savedMoments = pgTable("saved_moments", {
  id: uuid("id").primaryKey().defaultRandom(),
  relationshipId: uuid("relationship_id").references(() => couples.id, { onDelete: "cascade" }).notNull(),
  sessionId: uuid("session_id").references(() => gameSessions.id, { onDelete: "set null" }),
  roomId: text("room_id").notNull(),
  gameId: text("game_id").notNull(),
  promptText: text("prompt_text").notNull(),
  answerA: text("answer_a").notNull(),
  answerB: text("answer_b").notNull(),
  savedBy: uuid("saved_by").references(() => users.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  unq: unique().on(t.relationshipId, t.sessionId, t.promptText),
}));

export const savedMomentsRelations = relations(savedMoments, ({ one }) => ({
  relationship: one(couples, { fields: [savedMoments.relationshipId], references: [couples.id] }),
  session: one(gameSessions, { fields: [savedMoments.sessionId], references: [gameSessions.id] }),
  savedByUser: one(users, { fields: [savedMoments.savedBy], references: [users.id] }),
}));



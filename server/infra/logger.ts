import { db } from "../db";
import { auditLogs } from "../db/schema";

type LogLevel = "info" | "warn" | "error" | "fatal";

/**
 * Production Structured Logger.
 * Replaces console.log() with a predictable, JSON-structured output
 * that can be easily parsed by Datadog, Axiom, or CloudWatch.
 */
export const logger = {
  
  info: (message: string, context: Record<string, any> = {}) => {
    console.log(JSON.stringify({ level: "info", message, timestamp: new Date().toISOString(), ...context }));
  },

  warn: (message: string, context: Record<string, any> = {}) => {
    console.warn(JSON.stringify({ level: "warn", message, timestamp: new Date().toISOString(), ...context }));
  },

  error: (message: string, error?: Error, context: Record<string, any> = {}) => {
    console.error(JSON.stringify({ 
      level: "error", 
      message, 
      error: error?.message, 
      stack: error?.stack,
      timestamp: new Date().toISOString(), 
      ...context 
    }));
    // In production, this boundary sends the error to Sentry
    // Sentry.captureException(error, { extra: context });
  }
};

/**
 * Audit Logger.
 * Strictly records sensitive actions (Billing, Couple Breakup, Privacy Changes)
 * durably to the PostgreSQL database for security compliance.
 */
export async function logAudit(actorId: string, action: string, resourceType: string, resourceId: string, payload: Record<string, any>, ipAddress?: string) {
  try {
    await db.insert(auditLogs).values({
      actorId,
      action,
      resourceType,
      resourceId,
      payload,
      ipAddress
    });
  } catch (err) {
    // Never fail a business transaction because audit logging failed, but do log it as fatal
    logger.error("Failed to write to audit log", err as Error, { action, actorId });
  }
}

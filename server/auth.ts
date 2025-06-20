import { storage } from "./storage";
import crypto from "crypto";

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function generateSessionId(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function createAdminSession(adminId: number): Promise<string> {
  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  await storage.createSession({
    id: sessionId,
    adminId,
    expiresAt
  });
  
  return sessionId;
}

export async function validateSession(sessionId: string): Promise<number | null> {
  if (!sessionId) return null;
  
  const session = await storage.getSession(sessionId);
  if (!session) return null;
  
  if (new Date() > session.expiresAt) {
    await storage.deleteSession(sessionId);
    return null;
  }
  
  return session.adminId;
}

export async function deleteSession(sessionId: string): Promise<void> {
  await storage.deleteSession(sessionId);
}
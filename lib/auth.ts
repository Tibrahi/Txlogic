import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "txlogic-super-secret-key-2024-enterprise-logistics";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

function generateToken(user: AuthUser): string {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
}

function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getSession(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("tx_session");
    if (!token) return null;

    const payload = verifyToken(token.value);
    if (!payload) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) return null;

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatar: user.avatar || undefined,
    };
  } catch {
    return null;
  }
}

export async function createSession(
  user: AuthUser,
  ipAddress?: string,
  userAgent?: string
): Promise<string> {
  const token = generateToken(user);
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      ipAddress,
      userAgent,
      expiresAt,
    },
  });

  return token;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get("tx_session");
  if (token) {
    await prisma.session.deleteMany({ where: { token: token.value } });
  }
  cookieStore.delete("tx_session");
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("tx_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION / 1000,
  });
}

export function hasPermission(userRole: string, requiredRoles: string[]): boolean {
  if (userRole === "SUPER_ADMIN") return true;
  return requiredRoles.includes(userRole);
}

export async function logAuditAction(
  userId: string,
  action: string,
  entity: string,
  entityId?: string,
  oldValues?: object,
  newValues?: object,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      entity,
      entityId,
      oldValues: oldValues ? JSON.stringify(oldValues) : null,
      newValues: newValues ? JSON.stringify(newValues) : null,
      ipAddress,
      userAgent,
    },
  });
}

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR" | "SHIPMENT_UPDATE" | "DELIVERY_UPDATE" | "SYSTEM_ALERT",
  link?: string
): Promise<void> {
  await prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
      link,
    },
  });
}
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export type UserRole = 'guest' | 'student' | 'instructor' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

const JWT_SECRET = process.env.QWIK_JWT_SECRET || 'dev-secret-change-me';
const JWT_COOKIE = 'qa_session';
const JWT_EXPIRES_SECONDS = 60 * 60 * 24 * 7; // 7 days

export function signToken(user: AuthUser): string {
  return jwt.sign({ sub: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: JWT_EXPIRES_SECONDS,
  });
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const data = jwt.verify(token, JWT_SECRET) as any;
    return { id: data.sub, email: data.email, name: data.name, role: data.role } satisfies AuthUser;
  } catch {
    return null;
  }
}

export function hashPassword(plain: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(plain, salt);
}

export function verifyPassword(plain: string, hash: string): boolean {
  return bcrypt.compareSync(plain, hash);
}

export const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const rbac = {
  canViewCourse(role: UserRole) {
    return role === 'student' || role === 'instructor' || role === 'admin';
  },
  canEditCourse(role: UserRole) {
    return role === 'instructor' || role === 'admin';
  },
  isAdmin(role: UserRole) {
    return role === 'admin';
  },
};

export function cookieHeaderForToken(token: string): string {
  const maxAge = JWT_EXPIRES_SECONDS;
  const sameSite = 'Lax';
  return `${JWT_COOKIE}=${token}; Path=/; HttpOnly; SameSite=${sameSite}; Max-Age=${maxAge}`;
}

export function clearAuthCookieHeader(): string {
  return `${JWT_COOKIE}=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`;
}



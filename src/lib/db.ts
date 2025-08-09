import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { hashPassword } from './auth';

export interface DbUserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: 'student' | 'instructor' | 'admin';
}

export interface DbCourseRecord {
  id: string;
  slug: string;
  title: string;
  description: string;
  isPremium: boolean;
  lessons: DbLessonRecord[];
}

export interface DbLessonRecord {
  id: string;
  slug: string;
  title: string;
  contentMd: string;
  freePreview: boolean;
}

export interface DatabaseShape {
  users: DbUserRecord[];
  courses: DbCourseRecord[];
}

const DATA_DIR = join(process.cwd(), 'data');
const DATA_PATH = join(DATA_DIR, 'db.json');

async function ensureSeed(): Promise<void> {
  try {
    await fs.access(DATA_PATH);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const initial: DatabaseShape = {
      users: [
        {
          id: randomUUID(),
          email: 'admin@example.com',
          name: 'Admin',
          passwordHash: hashPassword('admin123'),
          role: 'admin',
        },
      ],
      courses: [
        {
          id: randomUUID(),
          slug: 'qwik-city-foundations',
          title: 'Qwik City Foundations',
          description: 'Resumability, routing, server functions va real loyihalar',
          isPremium: false,
          lessons: [
            {
              id: randomUUID(),
              slug: 'welcome',
              title: 'Kirish',
              freePreview: true,
              contentMd: '# Xush kelibsiz\n\nUshbu darsda Qwik City asoslari bilan tanishamiz.\n\n```tsx\nexport const Hello = () => <div>Salom Qwik!</div>\n```',
            },
          ],
        },
        {
          id: randomUUID(),
          slug: 'mojo-for-ml',
          title: 'Mojo for AI/ML',
          description: 'Mojo tilida yuqori unumdor AI/ML amaliyoti',
          isPremium: true,
          lessons: [
            {
              id: randomUUID(),
              slug: 'intro',
              title: 'Mojo kirish',
              freePreview: true,
              contentMd: '# Mojo nima?\n\nMojo — Python’ga mos, HPC uchun yaratilgan til.',
            },
          ],
        },
      ],
    };
    await fs.writeFile(DATA_PATH, JSON.stringify(initial, null, 2), 'utf-8');
  }
}

export async function readDb(): Promise<DatabaseShape> {
  await ensureSeed();
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(raw) as DatabaseShape;
}

export async function writeDb(db: DatabaseShape): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

export async function findUserByEmail(email: string): Promise<DbUserRecord | undefined> {
  const db = await readDb();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function createUser(user: Omit<DbUserRecord, 'id'>): Promise<DbUserRecord> {
  const db = await readDb();
  const record: DbUserRecord = { id: randomUUID(), ...user };
  db.users.push(record);
  await writeDb(db);
  return record;
}

export async function listUsers(): Promise<DbUserRecord[]> {
  const db = await readDb();
  return db.users;
}

export async function updateUserRole(userId: string, role: DbUserRecord['role']): Promise<DbUserRecord | undefined> {
  const db = await readDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return undefined;
  user.role = role;
  await writeDb(db);
  return user;
}

export async function listCourses(): Promise<DbCourseRecord[]> {
  const db = await readDb();
  return db.courses;
}

export async function createCourse(course: Omit<DbCourseRecord, 'id' | 'lessons'> & { lessons?: DbLessonRecord[] }): Promise<DbCourseRecord> {
  const db = await readDb();
  const record: DbCourseRecord = { id: randomUUID(), lessons: course.lessons ?? [], ...course };
  db.courses.push(record);
  await writeDb(db);
  return record;
}

export async function getCourseBySlug(slug: string): Promise<DbCourseRecord | undefined> {
  const db = await readDb();
  return db.courses.find((c) => c.slug === slug);
}

export async function getLesson(courseSlug: string, lessonSlug: string): Promise<{ course: DbCourseRecord; lesson: DbLessonRecord } | undefined> {
  const course = await getCourseBySlug(courseSlug);
  if (!course) return undefined;
  const lesson = course.lessons.find((l) => l.slug === lessonSlug);
  if (!lesson) return undefined;
  return { course, lesson };
}



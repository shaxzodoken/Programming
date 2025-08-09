import { Client } from 'pg';

let client: Client | null = null;

export function getPgClient(): Client {
  if (client) return client;
  const url = process.env.DATABASE_URL || '';
  const host = process.env.PGHOST || 'localhost';
  const port = Number(process.env.PGPORT || '5432');
  const database = process.env.PGDATABASE || 'Programming';
  const user = process.env.PGUSER || 'postgres';
  const password = process.env.PGPASSWORD || '';

  client = new Client(
    url
      ? { connectionString: url }
      : { host, port, database, user, password }
  );
  return client;
}

export async function ensurePg(): Promise<Client> {
  const c = getPgClient();
  // connect only once
  // @ts-ignore
  if ((c as any)._connected) return c;
  await c.connect();
  // @ts-ignore
  (c as any)._connected = true;
  await seed(c);
  return c;
}

async function seed(c: Client) {
  await c.query(`
    create table if not exists courses (
      id uuid primary key default gen_random_uuid(),
      slug text unique not null,
      title text not null,
      description text not null,
      is_premium boolean not null default false
    );
  `);
  await c.query(`
    create table if not exists lessons (
      id uuid primary key default gen_random_uuid(),
      course_slug text not null references courses(slug) on delete cascade,
      slug text not null,
      title text not null,
      content_md text not null,
      free_preview boolean not null default false,
      unique(course_slug, slug)
    );
  `);

  // seed minimal if empty
  const { rows } = await c.query('select count(*)::int as n from courses');
  if (rows[0]?.n === 0) {
    await c.query(
      `insert into courses (slug, title, description, is_premium)
       values ($1,$2,$3,$4), ($5,$6,$7,$8)
       on conflict do nothing`,
      [
        'qwik-city-foundations',
        'Qwik City Foundations',
        'Resumability, routing va amaliy loyihalar',
        false,
        'mojo-for-ml',
        'Mojo for AI/ML',
        'Mojo tilida yuqori unumdor AI/ML amaliyoti',
        true,
      ],
    );
    await c.query(
      `insert into lessons (course_slug, slug, title, content_md, free_preview)
       values ($1,$2,$3,$4,$5), ($6,$7,$8,$9,$10)
       on conflict do nothing`,
      [
        'qwik-city-foundations', 'welcome', 'Kirish', '# Qwik City\n\nStart here.', true,
        'mojo-for-ml', 'intro', 'Mojo kirish', '# Mojo nima?\n\nAI uchun tez.', true,
      ],
    );
  }
}



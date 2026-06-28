import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const dbDir = join(process.cwd(), 'data');
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

const sqlite = new Database(join(dbDir, 'reviews.db'));
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });

migrate(db, { migrationsFolder: join(process.cwd(), 'drizzle') });

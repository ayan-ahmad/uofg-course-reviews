import { db } from '@/db/index';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateName } from './words';
import { randomUUID } from 'crypto';

export async function getOrCreateUser(
  userId: string | undefined,
): Promise<{ id: string; displayName: string; isNew: boolean }> {
  if (userId) {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (existing.length > 0) {
      return { id: existing[0].id, displayName: existing[0].displayName, isNew: false };
    }
  }

  const id = randomUUID();
  const displayName = generateName();
  await db.insert(users).values({
    id,
    displayName,
    createdAt: Math.floor(Date.now() / 1000),
  });
  return { id, displayName, isNew: true };
}

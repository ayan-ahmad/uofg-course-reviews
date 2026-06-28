import type { APIRoute } from 'astro';
import { db } from '@/db/index';
import { reviews } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export const DELETE: APIRoute = async ({ params, cookies }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return new Response(JSON.stringify({ error: 'Invalid review ID' }), { status: 400 });
  }

  const userId = cookies.get('user_id')?.value;
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }

  const result = await db
    .delete(reviews)
    .where(and(eq(reviews.id, id), eq(reviews.userId, userId)));

  if (result.changes === 0) {
    return new Response(JSON.stringify({ error: 'Review not found or not yours' }), { status: 404 });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

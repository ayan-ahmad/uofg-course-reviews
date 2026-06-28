import type { APIRoute } from 'astro';
import { db } from '@/db/index';
import { reviews } from '@/db/schema';
import { getOrCreateUser } from '@/lib/user';
import { and, eq } from 'drizzle-orm';

export const POST: APIRoute = async ({ request, cookies }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const {
    courseCode,
    lecturerRating,
    workloadRating,
    difficultyRating,
    usefulnessRating,
    markingFairnessRating,
    enjoymentRating,
    overallRating,
    reviewText,
  } = body;

  const ratingFields = [
    lecturerRating, workloadRating, difficultyRating,
    usefulnessRating, markingFairnessRating, enjoymentRating, overallRating,
  ];

  const validRating = (r: unknown) =>
    typeof r === 'number' && Number.isInteger(r) && r >= 1 && r <= 5;

  if (!courseCode || !ratingFields.every(validRating)) {
    return new Response(
      JSON.stringify({ error: 'All ratings must be integers 1–5 and courseCode is required' }),
      { status: 400 },
    );
  }

  const userId = cookies.get('user_id')?.value;
  const user = await getOrCreateUser(userId);

  if (user.isNew) {
    cookies.set('user_id', user.id, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
  }

  const existing = await db
    .select({ id: reviews.id })
    .from(reviews)
    .where(and(eq(reviews.userId, user.id), eq(reviews.courseCode, courseCode as string)))
    .limit(1);

  if (existing.length > 0) {
    return new Response(
      JSON.stringify({ error: 'You have already reviewed this course.' }),
      { status: 409, headers: { 'Content-Type': 'application/json' } },
    );
  }

  await db.insert(reviews).values({
    userId: user.id,
    courseCode: courseCode as string,
    lecturerRating: lecturerRating as number,
    workloadRating: workloadRating as number,
    difficultyRating: difficultyRating as number,
    usefulnessRating: usefulnessRating as number,
    markingFairnessRating: markingFairnessRating as number,
    enjoymentRating: enjoymentRating as number,
    overallRating: overallRating as number,
    reviewText: typeof reviewText === 'string' && reviewText.trim() ? reviewText.trim() : null,
    createdAt: Math.floor(Date.now() / 1000),
  });

  return new Response(
    JSON.stringify({ success: true, displayName: user.displayName }),
    { headers: { 'Content-Type': 'application/json' } },
  );
};

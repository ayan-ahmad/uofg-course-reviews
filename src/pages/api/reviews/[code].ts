import type { APIRoute } from 'astro';
import { db } from '@/db/index';
import { reviews, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export const GET: APIRoute = async ({ params, cookies }) => {
  const { code } = params;
  if (!code) return new Response('Not found', { status: 404 });

  const rows = await db
    .select({
      id: reviews.id,
      userId: reviews.userId,
      displayName: users.displayName,
      lecturerRating: reviews.lecturerRating,
      workloadRating: reviews.workloadRating,
      difficultyRating: reviews.difficultyRating,
      usefulnessRating: reviews.usefulnessRating,
      markingFairnessRating: reviews.markingFairnessRating,
      enjoymentRating: reviews.enjoymentRating,
      overallRating: reviews.overallRating,
      reviewText: reviews.reviewText,
      createdAt: reviews.createdAt,
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.courseCode, code))
    .orderBy(desc(reviews.createdAt));

  const currentUserId = cookies.get('user_id')?.value ?? null;
  const myReview = currentUserId ? rows.find((r) => r.userId === currentUserId) : undefined;
  const myReviewId = myReview?.id ?? null;

  const count = rows.length;

  const avg = (field: keyof (typeof rows)[0]) =>
    count > 0
      ? Math.round(
          (rows.reduce((s, r) => s + (r[field] as number), 0) / count) * 10,
        ) / 10
      : null;

  const publicRows = rows.map(({ userId: _userId, ...rest }) => rest);

  return new Response(
    JSON.stringify({
      reviews: publicRows,
      myReviewId,
      count,
      averages: count > 0
        ? {
            lecturer: avg('lecturerRating'),
            workload: avg('workloadRating'),
            difficulty: avg('difficultyRating'),
            usefulness: avg('usefulnessRating'),
            markingFairness: avg('markingFairnessRating'),
            enjoyment: avg('enjoymentRating'),
            overall: avg('overallRating'),
          }
        : null,
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );
};

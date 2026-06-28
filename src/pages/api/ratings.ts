import type { APIRoute } from 'astro';
import { db } from '@/db/index';
import { reviews } from '@/db/schema';
import { sql } from 'drizzle-orm';

export const GET: APIRoute = async () => {
  const rows = await db
    .select({
      courseCode: reviews.courseCode,
      avg: sql<number>`AVG(${reviews.overallRating})`,
      count: sql<number>`COUNT(*)`,
    })
    .from(reviews)
    .groupBy(reviews.courseCode);

  const result: Record<string, { overall: number; count: number }> = {};
  for (const row of rows) {
    result[row.courseCode] = {
      overall: Math.round(row.avg * 10) / 10,
      count: Number(row.count),
    };
  }

  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' },
  });
};

import type { APIRoute } from "astro";
import { db } from "@/db/index";
import { reviews } from "@/db/schema";
import { eq } from 'drizzle-orm';
import { getOrCreateUser } from "@/lib/user";

export const GET: APIRoute = async ({ request, cookies }) => {
  const userId = cookies.get("user_id")?.value;
  const user = await getOrCreateUser(userId);

  if (user.isNew) {
    cookies.set("user_id", user.id, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  const personallyRated = await db
    .select({ courseCode: reviews.courseCode })
    .from(reviews)
    .where(
        eq(reviews.userId, user.id)
    );

  return new Response(JSON.stringify(personallyRated.map(review => review.courseCode)), {
    headers: { "Content-Type": "application/json" },
  });
};

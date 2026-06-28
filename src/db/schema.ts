import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  displayName: text('display_name').notNull(),
  createdAt: integer('created_at').notNull(),
});

export const reviews = sqliteTable('reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => users.id),
  courseCode: text('course_code').notNull(),
  lecturerRating: integer('lecturer_rating').notNull(),
  workloadRating: integer('workload_rating').notNull(),
  difficultyRating: integer('difficulty_rating').notNull(),
  usefulnessRating: integer('usefulness_rating').notNull(),
  markingFairnessRating: integer('marking_fairness_rating').notNull(),
  enjoymentRating: integer('enjoyment_rating').notNull(),
  overallRating: integer('overall_rating').notNull(),
  reviewText: text('review_text'),
  createdAt: integer('created_at').notNull(),
}, (t) => [uniqueIndex('user_course_unique').on(t.userId, t.courseCode)]);

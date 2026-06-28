CREATE TABLE IF NOT EXISTS `users` (
	`id` text PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`course_code` text NOT NULL,
	`lecturer_rating` integer NOT NULL,
	`workload_rating` integer NOT NULL,
	`difficulty_rating` integer NOT NULL,
	`usefulness_rating` integer NOT NULL,
	`marking_fairness_rating` integer NOT NULL,
	`enjoyment_rating` integer NOT NULL,
	`overall_rating` integer NOT NULL,
	`review_text` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DELETE FROM reviews WHERE id NOT IN (SELECT MAX(id) FROM reviews GROUP BY user_id, course_code);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `user_course_unique` ON `reviews` (`user_id`,`course_code`);

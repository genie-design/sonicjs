CREATE TABLE `features` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`body` text,
	`link` text,
	`image` text,
	`createdBy` text,
	`updatedBy` text,
	`createdOn` integer,
	`updatedOn` integer
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`description` text,
	`nutrition` text,
	`images` text,
	`sizes` text,
	`prices` text,
	`createdBy` text,
	`updatedBy` text,
	`createdOn` integer,
	`updatedOn` integer
);
--> statement-breakpoint
CREATE TABLE `socials` (
	`id` text PRIMARY KEY NOT NULL,
	`facebook` text,
	`twitter` text,
	`instagram` text,
	`youtube` text,
	`tiktok` text,
	`createdBy` text,
	`updatedBy` text,
	`createdOn` integer,
	`updatedOn` integer
);
--> statement-breakpoint
DROP TABLE `categories`;--> statement-breakpoint
DROP TABLE `categoriesToPosts`;--> statement-breakpoint
DROP TABLE `comments`;--> statement-breakpoint
DROP TABLE `posts`;--> statement-breakpoint
ALTER TABLE user_keys ADD `createdBy` text;--> statement-breakpoint
ALTER TABLE user_keys ADD `updatedBy` text;--> statement-breakpoint
ALTER TABLE user_sessions ADD `createdBy` text;--> statement-breakpoint
ALTER TABLE user_sessions ADD `updatedBy` text;--> statement-breakpoint
ALTER TABLE users ADD `createdBy` text;--> statement-breakpoint
ALTER TABLE users ADD `updatedBy` text;
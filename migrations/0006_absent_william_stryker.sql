CREATE TABLE `skus` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`description` text,
	`images` text,
	`quantity` text,
	`size` text,
	`price` text,
	`product_id` text NOT NULL,
	`createdBy` text,
	`updatedBy` text,
	`createdOn` integer,
	`updatedOn` integer,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `sizes`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `prices`;
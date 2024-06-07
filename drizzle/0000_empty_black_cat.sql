CREATE TABLE `admin` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	`password` varchar(255),
	`full_name` varchar(255) DEFAULT 'admin',
	`refresh_token` varchar(255),
	`created_at` date,
	CONSTRAINT `admin_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_name_unique` UNIQUE(`name`)
);

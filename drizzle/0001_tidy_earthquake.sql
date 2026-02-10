CREATE TABLE `authCodes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(64) NOT NULL,
	`featureType` enum('boneWeight','nameAvatar','yearFortune','monthFortune') NOT NULL,
	`status` enum('unused','active','expired') NOT NULL DEFAULT 'unused',
	`activatedAt` timestamp,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `authCodes_id` PRIMARY KEY(`id`),
	CONSTRAINT `authCodes_code_unique` UNIQUE(`code`)
);

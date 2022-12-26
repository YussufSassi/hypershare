-- CreateTable
CREATE TABLE `File` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `filename` VARCHAR(191) NOT NULL,
    `hash` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `downloads` INTEGER NOT NULL,
    `deleteAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `File_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReportedFile` (
    `reportId` VARCHAR(191) NOT NULL,
    `hash` VARCHAR(191) NOT NULL,
    `reportedBy` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `banned` BOOLEAN NOT NULL,

    PRIMARY KEY (`reportId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ReportedFile` ADD CONSTRAINT `ReportedFile_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `File`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

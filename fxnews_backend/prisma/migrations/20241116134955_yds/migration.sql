-- CreateTable
CREATE TABLE `BuySellHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `buySellId` INTEGER NOT NULL,
    `name` VARCHAR(191) NULL,
    `sell` DOUBLE NULL,
    `buy` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BuySellHistory` ADD CONSTRAINT `BuySellHistory_buySellId_fkey` FOREIGN KEY (`buySellId`) REFERENCES `BuySell`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

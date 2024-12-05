-- CreateTable
CREATE TABLE `BankCard` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `cardNumber` VARCHAR(191) NOT NULL,
    `cardHolderName` VARCHAR(191) NOT NULL,
    `expiryDate` DATETIME(3) NOT NULL,
    `cvv` INTEGER NOT NULL,
    `bankName` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `BankCard_cardNumber_key`(`cardNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BankCard` ADD CONSTRAINT `BankCard_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

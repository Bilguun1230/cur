-- AlterTable
ALTER TABLE `Wallet` ADD COLUMN `balanceType` ENUM('WITHDRAW', 'DEPOSIT') NULL;

-- AlterTable
ALTER TABLE `WalletHistory` ADD COLUMN `balanceType` ENUM('WITHDRAW', 'DEPOSIT') NULL;

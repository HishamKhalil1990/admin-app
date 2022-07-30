-- CreateTable
CREATE TABLE `countRequest` (
    `id` INTEGER NOT NULL,
    `ItemCode` VARCHAR(191) NOT NULL,
    `ItemName` VARCHAR(191) NOT NULL,
    `CodeBars` VARCHAR(191) NOT NULL DEFAULT 'no bar code',
    `WhsCode` VARCHAR(191) NOT NULL,
    `BuyUnitMsr` VARCHAR(191) NOT NULL DEFAULT 'Piece',
    `Selected` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `countRequest_id_key`(`id`),
    UNIQUE INDEX `countRequest_ItemCode_key`(`ItemCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

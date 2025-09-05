/*
  Warnings:

  - You are about to alter the column `userStatus` on the `Recipient` table. The data in that column could be lost. The data in that column will be cast from `String` to `Boolean`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Recipient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "emailValid" BOOLEAN NOT NULL,
    "email" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "noOfEmailSent" INTEGER NOT NULL,
    "userStatus" BOOLEAN NOT NULL,
    "industry" TEXT NOT NULL
);
INSERT INTO "new_Recipient" ("companyName", "email", "emailValid", "id", "industry", "name", "noOfEmailSent", "userStatus") SELECT "companyName", "email", "emailValid", "id", "industry", "name", "noOfEmailSent", "userStatus" FROM "Recipient";
DROP TABLE "Recipient";
ALTER TABLE "new_Recipient" RENAME TO "Recipient";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

/*
  Warnings:

  - Added the required column `emailValid` to the `Recipient` table without a default value. This is not possible if the table is not empty.

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
    "userStatus" TEXT NOT NULL,
    "industry" TEXT NOT NULL
);
INSERT INTO "new_Recipient" ("companyName", "email", "id", "industry", "name", "noOfEmailSent", "userStatus") SELECT "companyName", "email", "id", "industry", "name", "noOfEmailSent", "userStatus" FROM "Recipient";
DROP TABLE "Recipient";
ALTER TABLE "new_Recipient" RENAME TO "Recipient";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

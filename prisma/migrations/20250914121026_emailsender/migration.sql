/*
  Warnings:

  - The primary key for the `Recipient` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Recipient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "emailValid" BOOLEAN NOT NULL,
    "email" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "noOfEmailSent" INTEGER NOT NULL,
    "userStatus" BOOLEAN NOT NULL,
    "industry" TEXT NOT NULL,
    "isFirstMail" BOOLEAN NOT NULL
);
INSERT INTO "new_Recipient" ("companyName", "email", "emailValid", "id", "industry", "isFirstMail", "name", "noOfEmailSent", "userStatus") SELECT "companyName", "email", "emailValid", "id", "industry", "isFirstMail", "name", "noOfEmailSent", "userStatus" FROM "Recipient";
DROP TABLE "Recipient";
ALTER TABLE "new_Recipient" RENAME TO "Recipient";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

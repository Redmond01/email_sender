-- CreateTable
CREATE TABLE "Recipient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "noOfEmailSent" INTEGER NOT NULL,
    "userStatus" TEXT NOT NULL,
    "industry" TEXT NOT NULL
);

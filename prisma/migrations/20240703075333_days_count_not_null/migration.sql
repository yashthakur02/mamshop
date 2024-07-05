/*
  Warnings:

  - Made the column `days_count` on table `Game` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "days_count" SET NOT NULL;

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED');

-- AlterTable: add nullable updatedAt first so existing rows are unaffected
ALTER TABLE "Project"
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "priority" "Priority",
ADD COLUMN     "startDate" DATE,
ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "targetDate" DATE,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- Backfill existing rows with createdAt so updatedAt is never null
UPDATE "Project" SET "updatedAt" = "createdAt" WHERE "updatedAt" IS NULL;

-- Now enforce NOT NULL
ALTER TABLE "Project" ALTER COLUMN "updatedAt" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

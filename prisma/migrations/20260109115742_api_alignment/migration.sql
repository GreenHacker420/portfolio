/*
  Warnings:

  - You are about to drop the column `githubUrl` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `liveUrl` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `technologies` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "githubUrl",
DROP COLUMN "liveUrl",
DROP COLUMN "technologies",
ADD COLUMN     "projectUrl" TEXT,
ADD COLUMN     "repoUrl" TEXT,
ADD COLUMN     "techStack" TEXT[],
ALTER COLUMN "category" SET DEFAULT 'Other';

-- Add structured JSON storage directly on resumes
ALTER TABLE "resumes"
ADD COLUMN "structured" JSONB;

-- Immutable snapshot history for resume changes
CREATE TABLE "resume_versions" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "latex" TEXT NOT NULL,
    "structured" JSONB,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resume_versions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "resume_versions_resumeId_createdAt_idx" ON "resume_versions"("resumeId", "createdAt");

ALTER TABLE "resume_versions"
ADD CONSTRAINT "resume_versions_resumeId_fkey"
FOREIGN KEY ("resumeId")
REFERENCES "resumes"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

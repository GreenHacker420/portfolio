CREATE TABLE "proposals" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "program" TEXT NOT NULL DEFAULT 'GSOC',
    "organization" TEXT,
    "projectIdea" TEXT,
    "tone" TEXT NOT NULL DEFAULT 'academic',
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "proposal_versions" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proposal_versions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "proposal_versions_proposalId_createdAt_idx" ON "proposal_versions"("proposalId", "createdAt");

ALTER TABLE "proposal_versions"
ADD CONSTRAINT "proposal_versions_proposalId_fkey"
FOREIGN KEY ("proposalId")
REFERENCES "proposals"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

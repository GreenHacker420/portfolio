-- AlterTable
ALTER TABLE "personal_info" ADD COLUMN     "githubUsername" TEXT;

-- CreateTable
CREATE TABLE "analytics_sessions" (
    "id" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL,
    "country" TEXT,
    "city" TEXT,
    "referrer" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "device" TEXT,
    "userAgent" TEXT,
    "hashedIp" TEXT,

    CONSTRAINT "analytics_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "page" TEXT,
    "ctaId" TEXT,
    "scrollPct" INTEGER,
    "durationMs" INTEGER,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_rollups" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "metric" TEXT NOT NULL,
    "label" TEXT,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_rollups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "github_stats" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "github_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_checkpoints" (
    "thread_id" TEXT NOT NULL,
    "checkpoint_ns" TEXT NOT NULL,
    "checkpoint_id" TEXT NOT NULL,
    "parent_checkpoint_id" TEXT,
    "type" TEXT,
    "checkpoint" JSONB NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "chat_checkpoints_pkey" PRIMARY KEY ("thread_id","checkpoint_ns","checkpoint_id")
);

-- CreateTable
CREATE TABLE "knowledge_snippets" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "source" TEXT,
    "tags" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "knowledge_snippets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_writes" (
    "thread_id" TEXT NOT NULL,
    "checkpoint_ns" TEXT NOT NULL,
    "checkpoint_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "idx" INTEGER NOT NULL,
    "channel" TEXT NOT NULL,
    "type" TEXT,
    "blob" TEXT,
    "value" JSONB,

    CONSTRAINT "chat_writes_pkey" PRIMARY KEY ("thread_id","checkpoint_ns","checkpoint_id","task_id","idx")
);

-- CreateTable
CREATE TABLE "resumes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "latex" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_sources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "kind" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_leads" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT,
    "url" TEXT,
    "description" TEXT,
    "tags" TEXT,
    "seniority" TEXT,
    "remote" BOOLEAN NOT NULL DEFAULT false,
    "salary" TEXT,
    "postedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'new',
    "matchScore" DOUBLE PRECISION,
    "missingSkills" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_enrichments" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_enrichments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recruiter_contacts" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "company" TEXT,
    "role" TEXT,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recruiter_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "recruiterId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "cvVersionId" TEXT,
    "sentAt" TIMESTAMP(3),
    "followupAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_events" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_campaigns" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "templateId" TEXT,
    "fromAddress" TEXT,
    "warmupScore" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_events" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT,
    "applicationId" TEXT,
    "toAddress" TEXT,
    "type" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "analytics_sessions_startedAt_idx" ON "analytics_sessions"("startedAt");

-- CreateIndex
CREATE INDEX "analytics_sessions_utmSource_utmCampaign_idx" ON "analytics_sessions"("utmSource", "utmCampaign");

-- CreateIndex
CREATE INDEX "analytics_events_type_idx" ON "analytics_events"("type");

-- CreateIndex
CREATE INDEX "analytics_events_page_idx" ON "analytics_events"("page");

-- CreateIndex
CREATE INDEX "analytics_events_createdAt_idx" ON "analytics_events"("createdAt");

-- CreateIndex
CREATE INDEX "analytics_rollups_date_metric_idx" ON "analytics_rollups"("date", "metric");

-- CreateIndex
CREATE UNIQUE INDEX "github_stats_username_key" ON "github_stats"("username");

-- CreateIndex
CREATE INDEX "job_leads_sourceId_idx" ON "job_leads"("sourceId");

-- CreateIndex
CREATE INDEX "job_leads_status_idx" ON "job_leads"("status");

-- CreateIndex
CREATE INDEX "lead_enrichments_leadId_idx" ON "lead_enrichments"("leadId");

-- CreateIndex
CREATE INDEX "recruiter_contacts_company_idx" ON "recruiter_contacts"("company");

-- CreateIndex
CREATE INDEX "applications_leadId_idx" ON "applications"("leadId");

-- CreateIndex
CREATE INDEX "applications_status_idx" ON "applications"("status");

-- CreateIndex
CREATE INDEX "application_events_applicationId_idx" ON "application_events"("applicationId");

-- CreateIndex
CREATE INDEX "application_events_type_idx" ON "application_events"("type");

-- CreateIndex
CREATE INDEX "email_events_campaignId_idx" ON "email_events"("campaignId");

-- CreateIndex
CREATE INDEX "email_events_applicationId_idx" ON "email_events"("applicationId");

-- CreateIndex
CREATE INDEX "email_events_type_idx" ON "email_events"("type");

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "analytics_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_leads" ADD CONSTRAINT "job_leads_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "job_sources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_enrichments" ADD CONSTRAINT "lead_enrichments_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "job_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "job_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "recruiter_contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_events" ADD CONSTRAINT "application_events_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_events" ADD CONSTRAINT "email_events_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "email_campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_events" ADD CONSTRAINT "email_events_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

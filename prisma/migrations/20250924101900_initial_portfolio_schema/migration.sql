-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateEnum
CREATE TYPE "public"."ProjectStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "public"."ContactStatus" AS ENUM ('pending', 'responded', 'archived', 'spam');

-- CreateEnum
CREATE TYPE "public"."ContactPriority" AS ENUM ('low', 'normal', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "public"."MotiaExecutionStatus" AS ENUM ('pending', 'running', 'completed', 'failed', 'cancelled');

-- CreateTable
CREATE TABLE "public"."admin_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "oldData" TEXT,
    "newData" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."personal_info" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "fullName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bio" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "location" TEXT,
    "website" TEXT,
    "avatar" TEXT,
    "resume" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personal_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT,
    "logo" TEXT,
    "experience" INTEGER,
    "projects" TEXT,
    "strengths" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."projects" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "longDescription" TEXT,
    "category" TEXT NOT NULL,
    "technologies" TEXT,
    "status" "public"."ProjectStatus" NOT NULL DEFAULT 'draft',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "githubUrl" TEXT,
    "liveUrl" TEXT,
    "imageUrl" TEXT,
    "gallery" TEXT,
    "highlights" TEXT,
    "challenges" TEXT,
    "learnings" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "teamSize" INTEGER,
    "role" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."work_experience" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "description" TEXT,
    "achievements" TEXT,
    "technologies" TEXT,
    "companyLogo" TEXT,
    "companyUrl" TEXT,
    "location" TEXT,
    "employmentType" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."education" (
    "id" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "fieldOfStudy" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "gpa" TEXT,
    "honors" TEXT,
    "description" TEXT,
    "activities" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."certifications" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "credentialId" TEXT,
    "credentialUrl" TEXT,
    "description" TEXT,
    "skills" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."achievements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "issuer" TEXT,
    "url" TEXT,
    "imageUrl" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contacts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "status" "public"."ContactStatus" NOT NULL DEFAULT 'pending',
    "priority" "public"."ContactPriority" NOT NULL DEFAULT 'normal',
    "source" TEXT,
    "tags" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contact_replies" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isAiGenerated" BOOLEAN NOT NULL DEFAULT false,
    "aiMode" TEXT,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_replies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."social_links" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "username" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."media" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "category" TEXT,
    "tags" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."faqs" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tags" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "helpful" INTEGER NOT NULL DEFAULT 0,
    "notHelpful" INTEGER NOT NULL DEFAULT 0,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chat_interactions" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userMessage" TEXT NOT NULL,
    "botResponse" TEXT NOT NULL,
    "context" TEXT,
    "responseTime" INTEGER,
    "helpful" BOOLEAN,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."github_profile_cache" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "profileData" TEXT NOT NULL,
    "dataHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastFetch" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fetchCount" INTEGER NOT NULL DEFAULT 1,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "isStale" BOOLEAN NOT NULL DEFAULT false,
    "rateLimit" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "github_profile_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."github_repo_cache" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "page" INTEGER NOT NULL DEFAULT 1,
    "perPage" INTEGER NOT NULL DEFAULT 30,
    "repoData" TEXT NOT NULL,
    "dataHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastFetch" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fetchCount" INTEGER NOT NULL DEFAULT 1,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "isStale" BOOLEAN NOT NULL DEFAULT false,
    "rateLimit" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "github_repo_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."github_contribution_cache" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "contributionData" TEXT NOT NULL,
    "dataHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastFetch" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fetchCount" INTEGER NOT NULL DEFAULT 1,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "isStale" BOOLEAN NOT NULL DEFAULT false,
    "rateLimit" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "github_contribution_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."github_stats_cache" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "statsData" TEXT NOT NULL,
    "dataHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastFetch" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fetchCount" INTEGER NOT NULL DEFAULT 1,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "isStale" BOOLEAN NOT NULL DEFAULT false,
    "rateLimit" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "github_stats_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."github_cache_analytics" (
    "id" TEXT NOT NULL,
    "cacheType" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "responseTime" INTEGER,
    "cacheAge" INTEGER,
    "dataSize" INTEGER,
    "errorMessage" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "github_cache_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."motia_workflows" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "config" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "schedule" TEXT,
    "lastRun" TIMESTAMP(3),
    "nextRun" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "motia_workflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."motia_executions" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "status" "public"."MotiaExecutionStatus" NOT NULL DEFAULT 'pending',
    "input" TEXT,
    "output" TEXT,
    "error" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "duration" INTEGER,

    CONSTRAINT "motia_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."motia_automations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "config" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "lastTrigger" TIMESTAMP(3),
    "triggerCount" INTEGER NOT NULL DEFAULT 0,
    "successCount" INTEGER NOT NULL DEFAULT 0,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "motia_automations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."motia_analytics" (
    "id" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "data" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "motia_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."system_settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'string',
    "category" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "public"."admin_users"("email");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "public"."audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_resource_idx" ON "public"."audit_logs"("resource");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "public"."audit_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "skills_name_key" ON "public"."skills"("name");

-- CreateIndex
CREATE INDEX "skills_category_idx" ON "public"."skills"("category");

-- CreateIndex
CREATE INDEX "skills_isVisible_idx" ON "public"."skills"("isVisible");

-- CreateIndex
CREATE INDEX "skills_displayOrder_idx" ON "public"."skills"("displayOrder");

-- CreateIndex
CREATE INDEX "projects_status_idx" ON "public"."projects"("status");

-- CreateIndex
CREATE INDEX "projects_featured_idx" ON "public"."projects"("featured");

-- CreateIndex
CREATE INDEX "projects_category_idx" ON "public"."projects"("category");

-- CreateIndex
CREATE INDEX "projects_isVisible_idx" ON "public"."projects"("isVisible");

-- CreateIndex
CREATE INDEX "projects_displayOrder_idx" ON "public"."projects"("displayOrder");

-- CreateIndex
CREATE INDEX "work_experience_isVisible_idx" ON "public"."work_experience"("isVisible");

-- CreateIndex
CREATE INDEX "work_experience_displayOrder_idx" ON "public"."work_experience"("displayOrder");

-- CreateIndex
CREATE INDEX "education_isVisible_idx" ON "public"."education"("isVisible");

-- CreateIndex
CREATE INDEX "education_displayOrder_idx" ON "public"."education"("displayOrder");

-- CreateIndex
CREATE INDEX "certifications_isVisible_idx" ON "public"."certifications"("isVisible");

-- CreateIndex
CREATE INDEX "certifications_displayOrder_idx" ON "public"."certifications"("displayOrder");

-- CreateIndex
CREATE INDEX "achievements_category_idx" ON "public"."achievements"("category");

-- CreateIndex
CREATE INDEX "achievements_isVisible_idx" ON "public"."achievements"("isVisible");

-- CreateIndex
CREATE INDEX "achievements_displayOrder_idx" ON "public"."achievements"("displayOrder");

-- CreateIndex
CREATE INDEX "contacts_status_idx" ON "public"."contacts"("status");

-- CreateIndex
CREATE INDEX "contacts_priority_idx" ON "public"."contacts"("priority");

-- CreateIndex
CREATE INDEX "contacts_createdAt_idx" ON "public"."contacts"("createdAt");

-- CreateIndex
CREATE INDEX "contact_replies_contactId_idx" ON "public"."contact_replies"("contactId");

-- CreateIndex
CREATE INDEX "contact_replies_userId_idx" ON "public"."contact_replies"("userId");

-- CreateIndex
CREATE INDEX "social_links_platform_idx" ON "public"."social_links"("platform");

-- CreateIndex
CREATE INDEX "social_links_isVisible_idx" ON "public"."social_links"("isVisible");

-- CreateIndex
CREATE INDEX "social_links_displayOrder_idx" ON "public"."social_links"("displayOrder");

-- CreateIndex
CREATE INDEX "media_category_idx" ON "public"."media"("category");

-- CreateIndex
CREATE INDEX "media_isPublic_idx" ON "public"."media"("isPublic");

-- CreateIndex
CREATE INDEX "faqs_category_idx" ON "public"."faqs"("category");

-- CreateIndex
CREATE INDEX "faqs_isVisible_idx" ON "public"."faqs"("isVisible");

-- CreateIndex
CREATE INDEX "faqs_displayOrder_idx" ON "public"."faqs"("displayOrder");

-- CreateIndex
CREATE INDEX "chat_interactions_sessionId_idx" ON "public"."chat_interactions"("sessionId");

-- CreateIndex
CREATE INDEX "chat_interactions_createdAt_idx" ON "public"."chat_interactions"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "github_profile_cache_username_key" ON "public"."github_profile_cache"("username");

-- CreateIndex
CREATE INDEX "github_profile_cache_username_idx" ON "public"."github_profile_cache"("username");

-- CreateIndex
CREATE INDEX "github_profile_cache_expiresAt_idx" ON "public"."github_profile_cache"("expiresAt");

-- CreateIndex
CREATE INDEX "github_repo_cache_username_idx" ON "public"."github_repo_cache"("username");

-- CreateIndex
CREATE INDEX "github_repo_cache_expiresAt_idx" ON "public"."github_repo_cache"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "github_repo_cache_username_page_perPage_key" ON "public"."github_repo_cache"("username", "page", "perPage");

-- CreateIndex
CREATE INDEX "github_contribution_cache_username_idx" ON "public"."github_contribution_cache"("username");

-- CreateIndex
CREATE INDEX "github_contribution_cache_year_idx" ON "public"."github_contribution_cache"("year");

-- CreateIndex
CREATE INDEX "github_contribution_cache_expiresAt_idx" ON "public"."github_contribution_cache"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "github_contribution_cache_username_year_key" ON "public"."github_contribution_cache"("username", "year");

-- CreateIndex
CREATE UNIQUE INDEX "github_stats_cache_username_key" ON "public"."github_stats_cache"("username");

-- CreateIndex
CREATE INDEX "github_stats_cache_username_idx" ON "public"."github_stats_cache"("username");

-- CreateIndex
CREATE INDEX "github_stats_cache_expiresAt_idx" ON "public"."github_stats_cache"("expiresAt");

-- CreateIndex
CREATE INDEX "github_cache_analytics_cacheType_idx" ON "public"."github_cache_analytics"("cacheType");

-- CreateIndex
CREATE INDEX "github_cache_analytics_operation_idx" ON "public"."github_cache_analytics"("operation");

-- CreateIndex
CREATE INDEX "github_cache_analytics_username_idx" ON "public"."github_cache_analytics"("username");

-- CreateIndex
CREATE INDEX "github_cache_analytics_createdAt_idx" ON "public"."github_cache_analytics"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "motia_workflows_name_key" ON "public"."motia_workflows"("name");

-- CreateIndex
CREATE INDEX "motia_workflows_isActive_idx" ON "public"."motia_workflows"("isActive");

-- CreateIndex
CREATE INDEX "motia_workflows_nextRun_idx" ON "public"."motia_workflows"("nextRun");

-- CreateIndex
CREATE INDEX "motia_executions_workflowId_idx" ON "public"."motia_executions"("workflowId");

-- CreateIndex
CREATE INDEX "motia_executions_status_idx" ON "public"."motia_executions"("status");

-- CreateIndex
CREATE INDEX "motia_executions_startedAt_idx" ON "public"."motia_executions"("startedAt");

-- CreateIndex
CREATE INDEX "motia_automations_type_idx" ON "public"."motia_automations"("type");

-- CreateIndex
CREATE INDEX "motia_automations_isEnabled_idx" ON "public"."motia_automations"("isEnabled");

-- CreateIndex
CREATE INDEX "motia_analytics_event_idx" ON "public"."motia_analytics"("event");

-- CreateIndex
CREATE INDEX "motia_analytics_createdAt_idx" ON "public"."motia_analytics"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_key_key" ON "public"."system_settings"("key");

-- CreateIndex
CREATE INDEX "system_settings_category_idx" ON "public"."system_settings"("category");

-- CreateIndex
CREATE INDEX "system_settings_isPublic_idx" ON "public"."system_settings"("isPublic");

-- AddForeignKey
ALTER TABLE "public"."audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."admin_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contact_replies" ADD CONSTRAINT "contact_replies_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "public"."contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contact_replies" ADD CONSTRAINT "contact_replies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."admin_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."motia_executions" ADD CONSTRAINT "motia_executions_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "public"."motia_workflows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

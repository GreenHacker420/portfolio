# Full Stack Portfolio Platform

![Hero Banner](public/images/hero.png)

This project is a comprehensive, production-grade full-stack portfolio and Content Management System (CMS) designed for modern software engineers and AI developers. It integrates advanced frontend presentation, real-time analytics, automated workflows, and a robust administrative backend into a single unified platform.

---

## Technical Overview

The platform is architected to serve as both a high-impact personal brand showcase and an operational headquarters for professional workflows. Built with a focus on performance, scalability, and technical depth, it leverages current industry standards across the entire stack.

---

## Core Infrastructure

### Public Interface
An immersive frontend experience optimized for conversion and engagement.
- **Interactive Visuals**: Integration of Three.js and React Three Fiber for 3D state management and interactive elements.
- **Data-Driven Insights**: Real-time GitHub contribution analysis, including private repository activity via GraphQL, with persistence layers for performance.
- **Design Systems**: A custom design language implemented with Tailwind CSS v4, featuring glassmorphism and motion systems via Framer Motion.

### Administrative Command Center
A secure, authenticated environment for end-to-end data management.
- **Unified CMS**: Complete control over projects, technical skills, professional experience, and academic background.
- **Communication Layer**: Transactional email integration via Microsoft Graph API for automated lead capture and response.
- **Analytics Engine**: Internal, privacy-focused tracking system for session monitoring and engagement metrics.

### AI and Automation Layer
Native orchestration of LLM-based workflows to streamline professional operations.
- **Document Optimization**: Automated resume and proposal drafting with version control and iterative refinement loops.
- **Agentic Workflows**: Integration of LangChain and LangGraph for persistent, context-aware AI interactions and job lead scoring.
- **Grounding Strategies**: RAG-based knowledge injection utilizing personal project data for hallucination-free AI responses.

---

## Architecture and Data Modeling

The application follows a strictly normalized relational schema optimized for auditability and complex state management.

### Primary Domain Models
- **Portfolio Domains**: Project, Skill, WorkExperience, Education, Certification.
- **Analytics Domains**: AnalyticsSession, AnalyticsEvent, AnalyticsRollup.
- **Intelligence Domains**: Resume, ResumeVersion, Proposal, ProposalVersion, KnowledgeSnippet.
- **Operational Domains**: JobLead, RecruiterContact, Application, EmailCampaign.

---

## API Specification

The backend exposes a tiered API architecture with role-based access control (RBAC).

### Public Services
- **Contact API**: Form ingestion and automated notification triggers.
- **GitHub Service**: Retrieval of synchronized and mapped contribution data.
- **Analytics Collector**: Client-side event ingestion for session monitoring.
- **Agent API**: Streaming interface for LangGraph-powered AI interactions.

### Administrative Services
Accessible only to authorized accounts with administrative privileges.
- **Analytics Management**: Dedicated endpoints for rolling up metrics and exporting session data.
- **Automation Services**: Pipelines for job lead ingestion, document rewriting, and recruiter discovery.
- **Knowledge Orchestration**: Synchronization tools for grounding AI agents with current portfolio state.

---

## Implementation Details

### Stack Composition
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4.
- **Backend Orchestration**: LangChain, LangGraph, Google Gemini, MS Graph API.
- **Persistence**: PostgreSQL, Prisma ORM, Redis for caching.
- **Infrastructure**: GitHub Actions, Docker, AWS/GCP deployment readiness.

### Setup and Configuration
Refer to the environment matrix for required configuration keys, including Azure credentials for Microsoft Graph integration and GitHub tokens for contribution mapping.

---

## Professional Standards

This platform is licensed under the MIT License and is maintained with a commitment to technical excellence and professional representation.

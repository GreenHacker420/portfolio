import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { findRecruiterEmails, verifyEmail } from "@/lib/osint/recruiter";
import { withTimeout } from "@/lib/utils/timeout";

export const recruiterTool = new DynamicStructuredTool({
    name: "find_recruiters",
    description: "Find recruiter emails for a company domain and verify deliverability",
    schema: z.object({
        domain: z.string().describe("Company domain, e.g., example.com")
    }),
    func: async ({ domain }) => {
        try {
            const emails = await withTimeout(findRecruiterEmails(domain), 10000, "Recruiter Search");
            const verified = await withTimeout(Promise.all(emails.map(verifyEmail)), 10000, "Email Verification");
            return verified;
        } catch (e) {
            console.error("[RecruiterTool] Error:", e);
            return `Failed to find recruiters: ${e.message}`;
        }
    }
});

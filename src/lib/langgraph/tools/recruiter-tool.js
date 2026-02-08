import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { findRecruiterEmails, verifyEmail } from "@/lib/osint/recruiter";

export const recruiterTool = new DynamicStructuredTool({
    name: "find_recruiters",
    description: "Find recruiter emails for a company domain and verify deliverability",
    schema: z.object({
        domain: z.string().describe("Company domain, e.g., example.com")
    }),
    func: async ({ domain }) => {
        const emails = await findRecruiterEmails(domain);
        const verified = await Promise.all(emails.map(verifyEmail));
        return verified;
    }
});

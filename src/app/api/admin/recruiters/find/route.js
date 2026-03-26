import { findRecruiterEmails, verifyEmail } from "@/lib/osint/recruiter";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/guard";

export const POST = withApiHandler(async (req) => {
    await requireAdmin();
    const { domain } = await req.json();
    if (!domain) throw new Error("domain required");
    const emails = await findRecruiterEmails(domain);
    const verified = await Promise.all(emails.map(verifyEmail));
    return apiOk({ emails: verified });
});

import { logEmailEvent } from "@/lib/mail.events";
import { withApiHandler, apiOk } from "@/lib/apiResponse";

export const POST = withApiHandler(async (req) => {
    const body = await req.json();
    const { type, campaignId, applicationId, toAddress, metadata } = body;
    if (!type) throw new Error("type required");
    await logEmailEvent({ campaignId, applicationId, toAddress, type, metadata });
    return apiOk({ success: true });
});

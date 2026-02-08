import { logEmailEvent } from "@/lib/mail.events";

const PIXEL = Buffer.from(
    "47494638396101000100910000ffffff00000021f90401000001002c00000000010001000002024401003b",
    "hex"
);

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const campaignId = searchParams.get("campaignId");
        const applicationId = searchParams.get("applicationId");
        const toAddress = searchParams.get("to");
        await logEmailEvent({ campaignId, applicationId, toAddress, type: "open", metadata: { pixel: true } });
    } catch (e) {
        // ignore
    }
    return new Response(PIXEL, {
        status: 200,
        headers: {
            "Content-Type": "image/gif",
            "Content-Length": PIXEL.length.toString(),
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
        }
    });
}

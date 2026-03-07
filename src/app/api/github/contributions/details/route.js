import { NextResponse } from "next/server";
import { getContributionDetails } from "@/services/github/github.service";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get("date");
        const username = searchParams.get("username") || "GreenHacker420";

        if (!date) {
            return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
        }

        const details = await getContributionDetails(username, date);

        return NextResponse.json({ details }, { status: 200 });
    } catch (error) {
        console.error("[Contribution Details API] Error:", error);
        return NextResponse.json({ error: "Failed to fetch contribution details" }, { status: 500 });
    }
}

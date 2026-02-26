import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const settings = await prisma.setting.findMany();
    return NextResponse.json(settings);
}

export async function POST(req) {
    try {
        const body = await req.json();
        if (!Array.isArray(body)) return NextResponse.json({ error: "Expected array of {key,value}" }, { status: 400 });
        const ops = body.map(({ key, value }) => prisma.setting.upsert({
            where: { key },
            update: { value },
            create: { key, value }
        }));
        await prisma.$transaction(ops);
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

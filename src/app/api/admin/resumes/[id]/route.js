import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const resume = await prisma.resume.findUnique({
            where: { id }
        });

        if (!resume) {
            return NextResponse.json({ error: "Resume not found" }, { status: 404 });
        }

        return NextResponse.json(resume);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch resume" }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { title, latex, isDefault } = body;

        // If setting as default, unset others (transaction)
        if (isDefault) {
            await prisma.resume.updateMany({
                where: { id: { not: id } },
                data: { isDefault: false }
            });
        }

        const resume = await prisma.resume.update({
            where: { id },
            data: {
                title,
                latex,
                isDefault
            }
        });

        return NextResponse.json(resume);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update resume" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        await prisma.resume.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete resume" }, { status: 500 });
    }
}

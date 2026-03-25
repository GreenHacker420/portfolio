
import prisma from "@/lib/db";

export async function getSettings() {
    return prisma.setting.findMany();
}

export async function upsertSettings(settings) {
    const ops = settings.map(({ key, value }) => prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
    }));
    return prisma.$transaction(ops);
}

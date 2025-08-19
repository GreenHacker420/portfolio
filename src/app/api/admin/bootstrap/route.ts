import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST() {
  try {
    const count = await prisma.adminUser.count()
    if (count > 0) {
      return NextResponse.json({ ok: true, message: 'Admin user(s) already exist' })
    }

    const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin@greenhacker.tech'
    const password = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123'
    const hash = await bcrypt.hash(password, 10)

    const user = await prisma.adminUser.create({
      data: { email: email.toLowerCase(), password: hash, name: 'Administrator', role: 'admin' }
    })

    return NextResponse.json({ ok: true, created: { id: user.id, email: user.email } })
  } catch (e: any) {
    console.error('Bootstrap admin failed', e)
    return NextResponse.json({ ok: false, error: e?.message || 'Failed to bootstrap admin' }, { status: 500 })
  }
}


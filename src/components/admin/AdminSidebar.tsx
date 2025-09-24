'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  LayoutDashboard,
  Briefcase,
  User,
  Settings,
  FileText,
  BarChart3,
  Menu,
  Shield,
  Database,
  Image,
  Link as LinkIcon,
  GraduationCap,
  Building,
  MessageSquare,
  MessageCircle,
  Award,
  Trophy
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Skills', href: '/admin/skills', icon: BarChart3 },
  { name: 'Projects', href: '/admin/projects', icon: Briefcase },
  { name: 'Contacts', href: '/admin/contacts', icon: MessageSquare },
  { name: 'Chat Interactions', href: '/admin/chat-interactions', icon: MessageCircle },
  { name: 'Personal Info', href: '/admin/personal', icon: User },
  { name: 'Social Links', href: '/admin/social', icon: LinkIcon },
  { name: 'Experience', href: '/admin/experience', icon: Building },
  { name: 'Education', href: '/admin/education', icon: GraduationCap },
  { name: 'Achievements', href: '/admin/achievements', icon: Trophy },
  { name: 'Certifications', href: '/admin/certifications', icon: Award },
  { name: 'Media', href: '/admin/media', icon: Image },
  { name: 'System Settings', href: '/admin/system-settings', icon: Database },
  { name: 'Audit Logs', href: '/admin/audit', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

function SidebarContent() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center px-6">
        <Shield className="h-8 w-8 text-primary" />
        <span className="ml-2 text-xl font-bold">Admin Panel</span>
      </div>
      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-1 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
    </div>
  )
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-40"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-background px-0">
          <SidebarContent />
        </div>
      </div>
    </>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  BarChart3,
  Briefcase,
  User,
  Activity,
  TrendingUp,
  Plus,
  Eye,
  Edit
} from 'lucide-react'
import Link from 'next/link'

import { GlassCard } from '@/components/admin/ui/GlassCard'
import { AnimatedTable } from '@/components/admin/ui/AnimatedTable'

interface DashboardStats {
  totalSkills: number
  totalProjects: number
  publishedProjects: number
  draftProjects: number
  recentActivity: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSkills: 0,
    totalProjects: 0,
    publishedProjects: 0,
    draftProjects: 0,
    recentActivity: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Skills',
      value: stats.totalSkills,
      description: 'Skills in portfolio',
      icon: BarChart3,
      href: '/admin/skills',
      color: 'text-blue-600'
    },
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      description: 'All projects',
      icon: Briefcase,
      href: '/admin/projects',
      color: 'text-green-600'
    },
    {
      title: 'Published Projects',
      value: stats.publishedProjects,
      description: 'Live on portfolio',
      icon: Eye,
      href: '/admin/projects?status=published',
      color: 'text-purple-600'
    },
    {
      title: 'Recent Activity',
      value: stats.recentActivity,
      description: 'Actions this week',
      icon: Activity,
      href: '/admin/audit',
      color: 'text-orange-600'
    }
  ]

  const quickActions = [
    {
      title: 'Add New Skill',
      description: 'Add a new skill to your portfolio',
      href: '/admin/skills/new',
      icon: Plus,
      color: 'bg-blue-500'
    },
    {
      title: 'Create Project',
      description: 'Add a new project to showcase',
      href: '/admin/projects/new',
      icon: Plus,
      color: 'bg-green-500'
    },
    {
      title: 'Update Profile',
      description: 'Edit your personal information',
      href: '/admin/personal',
      icon: Edit,
      color: 'bg-purple-500'
    },
    {
      title: 'View Portfolio',
      description: 'See your live portfolio',
      href: '/',
      icon: Eye,
      color: 'bg-orange-500',
      external: true
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your portfolio.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? '...' : card.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
              <Button variant="link" size="sm" className="p-0 h-auto mt-2" asChild>
                <Link href={card.href}>View all →</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Card key={action.title} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-2`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-lg">{action.title}</CardTitle>
              <CardDescription>{action.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={action.href}
                  {...(action.external && { target: '_blank', rel: 'noopener noreferrer' })}
                >
                  {action.external ? 'Open' : 'Go'}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest changes to your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Portfolio updated</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <Badge variant="secondary">Update</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New skill added</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
              <Badge variant="secondary">Create</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Project published</p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
              <Badge variant="secondary">Publish</Badge>
            </div>
          </div>
          <Button variant="link" size="sm" className="p-0 mt-4" asChild>
            <Link href="/admin/audit">View all activity →</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

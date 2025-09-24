'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Trophy,
  Calendar,
  EyeOff,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface Achievement {
  id: string
  title: string
  description: string
  category: string
  date: string
  issuer?: string
  url?: string
  icon?: string
  isVisible: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [pagination, setPagination] = useState<{ currentPage: number; totalPages: number; totalCount: number; hasNextPage: boolean; hasPrevPage: boolean; limit: number } | null>(null)

  useEffect(() => {
    fetchAchievements()
  }, [])

  const fetchAchievements = async (page = 1) => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' })
      if (searchTerm) params.set('search', searchTerm)
      if (selectedCategory) params.set('category', selectedCategory)
      const response = await fetch(`/api/admin/achievements?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setAchievements(data.achievements || [])
        setPagination(data.pagination)
      } else {
        toast.error('Failed to fetch achievements')
      }
    } catch (error) {
      console.error('Error fetching achievements:', error)
      toast.error('Failed to fetch achievements')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this achievement?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/achievements/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setAchievements(achievements.filter(achievement => achievement.id !== id))
        toast.success('Achievement deleted successfully')
      } else {
        toast.error('Failed to delete achievement')
      }
    } catch (error) {
      console.error('Error deleting achievement:', error)
      toast.error('Failed to delete achievement')
    }
  }

  const toggleVisibility = async (id: string, isVisible: boolean) => {
    try {
      const response = await fetch(`/api/admin/achievements/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isVisible: !isVisible }),
      })

      if (response.ok) {
        setAchievements(achievements.map(achievement =>
          achievement.id === id ? { ...achievement, isVisible: !isVisible } : achievement
        ))
        toast.success(`Achievement ${!isVisible ? 'shown' : 'hidden'} successfully`)
      } else {
        toast.error('Failed to update achievement visibility')
      }
    } catch (error) {
      console.error('Error updating achievement:', error)
      toast.error('Failed to update achievement visibility')
    }
  }

  const filteredAchievements = achievements.filter(achievement =>
    achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    achievement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (achievement.issuer && achievement.issuer.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'award': 'bg-yellow-100 text-yellow-800',
      'recognition': 'bg-blue-100 text-blue-800',
      'milestone': 'bg-green-100 text-green-800',
      'certification': 'bg-purple-100 text-purple-800',
      'competition': 'bg-red-100 text-red-800',
      'publication': 'bg-indigo-100 text-indigo-800',
    }
    return colors[category.toLowerCase()] || 'bg-gray-100 text-gray-800'
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Achievements</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Achievements</h1>
          <p className="text-muted-foreground">
            Manage your professional achievements and recognitions
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/achievements/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Achievement
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Achievements</CardTitle>
          <CardDescription>
            A list of all your professional achievements and recognitions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search achievements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => { if ((e as any).key === 'Enter') fetchAchievements(1) }}
                className="pl-10"
                aria-label="Search achievements"
              />
            </div>
            {pagination && (
              <div className="ml-auto flex gap-2">
                <Button variant="outline" size="sm" disabled={!pagination.hasPrevPage} onClick={() => fetchAchievements(pagination.currentPage - 1)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={!pagination.hasNextPage} onClick={() => fetchAchievements(pagination.currentPage + 1)}>Next</Button>
              </div>
            )}
          </div>
          {pagination && (
            <div className="-mt-4 mb-2 text-sm text-muted-foreground">Page {pagination.currentPage} of {pagination.totalPages} • Total {pagination.totalCount}</div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Achievement</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Issuer</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAchievements.length > 0 ? (
                  filteredAchievements.map((achievement) => (
                    <TableRow key={achievement.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {achievement.icon ? (
                            <img
                              src={achievement.icon}
                              alt={achievement.title}
                              className="w-10 h-10 rounded object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                              <Trophy className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{achievement.title}</div>
                            <div className="text-sm text-muted-foreground line-clamp-2">
                              {achievement.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(achievement.category)}>
                          {achievement.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(achievement.date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {achievement.issuer || <span className="text-muted-foreground">-</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        {achievement.url ? (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={achievement.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleVisibility(achievement.id, achievement.isVisible)}
                        >
                          {achievement.isVisible ? (
                            <Eye className="h-4 w-4 text-green-600" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{achievement.displayOrder}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/achievements/${achievement.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => toggleVisibility(achievement.id, achievement.isVisible)}
                            >
                              {achievement.isVisible ? (
                                <>
                                  <EyeOff className="mr-2 h-4 w-4" />
                                  Hide
                                </>
                              ) : (
                                <>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Show
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(achievement.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {searchTerm
                          ? 'No achievements found matching your search'
                          : 'No achievements yet. Add your first achievement!'
                        }
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

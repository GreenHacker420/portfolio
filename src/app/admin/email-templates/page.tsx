'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit, Trash2, Mail, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent?: string
  variables: string[]
  isActive: boolean
  description?: string
  category: string
  createdAt: string
  updatedAt: string
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalCount: number
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10
  })

  const categories = ['all', 'contact', 'marketing', 'system']

  const fetchTemplates = async (page = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory !== 'all' && { category: selectedCategory })
      })

      const response = await fetch(`/api/admin/email-templates?${params}`)
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates)
        setPagination(data.pagination)
      } else {
        toast.error('Failed to fetch email templates')
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
      toast.error('Failed to fetch email templates')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the template "${name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/email-templates/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Email template deleted successfully')
        fetchTemplates(pagination.currentPage)
      } else {
        toast.error('Failed to delete email template')
      }
    } catch (error) {
      console.error('Error deleting template:', error)
      toast.error('Failed to delete email template')
    }
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/email-templates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      })

      if (response.ok) {
        toast.success(`Template ${!currentStatus ? 'activated' : 'deactivated'}`)
        fetchTemplates(pagination.currentPage)
      } else {
        toast.error('Failed to update template status')
      }
    } catch (error) {
      console.error('Error updating template:', error)
      toast.error('Failed to update template status')
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [searchTerm, selectedCategory])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchTemplates(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
          <p className="text-muted-foreground">
            Manage and customize email templates for your contact system
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/email-templates/generate">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Generate
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/email-templates/new">
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {template.subject}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={template.isActive ? 'default' : 'secondary'}>
                        {template.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">{template.category}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {template.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {template.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-1">
                      {template.variables.slice(0, 3).map((variable) => (
                        <Badge key={variable} variant="outline" className="text-xs">
                          {`{{${variable}}}`}
                        </Badge>
                      ))}
                      {template.variables.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.variables.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleActive(template.id, template.isActive)}
                        >
                          {template.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/email-templates/${template.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(template.id, template.name)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {templates.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No email templates found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Get started by creating your first email template or use AI to generate one.
                </p>
                <div className="flex gap-2">
                  <Button asChild>
                    <Link href="/admin/email-templates/generate">
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI Generate
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/admin/email-templates/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Manually
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {templates.length} of {pagination.totalCount} templates
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchTemplates(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchTemplates(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

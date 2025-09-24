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
  Award,
  Calendar,
  EyeOff,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialId?: string
  credentialUrl?: string
  description?: string
  logo?: string
  isVisible: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
}

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [pagination, setPagination] = useState<{ currentPage: number; totalPages: number; totalCount: number; hasNextPage: boolean; hasPrevPage: boolean; limit: number } | null>(null)

  useEffect(() => {
    fetchCertifications()
  }, [])

  const fetchCertifications = async (page = 1) => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' })
      if (searchTerm) params.set('search', searchTerm)
      const response = await fetch(`/api/admin/certifications?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setCertifications(data.certifications || [])
        setPagination(data.pagination)
      } else {
        toast.error('Failed to fetch certifications')
      }
    } catch (error) {
      console.error('Error fetching certifications:', error)
      toast.error('Failed to fetch certifications')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/certifications/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setCertifications(certifications.filter(cert => cert.id !== id))
        toast.success('Certification deleted successfully')
      } else {
        toast.error('Failed to delete certification')
      }
    } catch (error) {
      console.error('Error deleting certification:', error)
      toast.error('Failed to delete certification')
    }
  }

  const toggleVisibility = async (id: string, isVisible: boolean) => {
    try {
      const response = await fetch(`/api/admin/certifications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isVisible: !isVisible }),
      })

      if (response.ok) {
        setCertifications(certifications.map(cert =>
          cert.id === id ? { ...cert, isVisible: !isVisible } : cert
        ))
        toast.success(`Certification ${!isVisible ? 'shown' : 'hidden'} successfully`)
      } else {
        toast.error('Failed to update certification visibility')
      }
    } catch (error) {
      console.error('Error updating certification:', error)
      toast.error('Failed to update certification visibility')
    }
  }

  const filteredCertifications = certifications.filter(cert =>
    cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.issuer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false
    return new Date(expiryDate) < new Date()
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Certifications</h1>
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
          <h1 className="text-2xl font-bold">Certifications</h1>
          <p className="text-muted-foreground">
            Manage your professional certifications and credentials
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/certifications/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Certification
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Certifications</CardTitle>
          <CardDescription>
            A list of all your professional certifications and credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search certifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => { if ((e as any).key === 'Enter') fetchCertifications(1) }}
                className="pl-10"
                aria-label="Search certifications"
              />
            </div>
            {pagination && (
              <div className="ml-auto flex gap-2">
                <Button variant="outline" size="sm" disabled={!pagination.hasPrevPage} onClick={() => fetchCertifications(pagination.currentPage - 1)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={!pagination.hasNextPage} onClick={() => fetchCertifications(pagination.currentPage + 1)}>Next</Button>
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
                  <TableHead>Certification & Issuer</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Credential</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCertifications.length > 0 ? (
                  filteredCertifications.map((certification) => (
                    <TableRow key={certification.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {certification.logo ? (
                            <img
                              src={certification.logo}
                              alt={certification.issuer}
                              className="w-10 h-10 rounded object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                              <Award className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{certification.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {certification.issuer}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(certification.issueDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {certification.expiryDate ? (
                            <span className={isExpired(certification.expiryDate) ? 'text-red-600' : ''}>
                              {formatDate(certification.expiryDate)}
                              {isExpired(certification.expiryDate) && (
                                <Badge variant="destructive" className="ml-2 text-xs">Expired</Badge>
                              )}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">No expiry</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {certification.credentialUrl ? (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={certification.credentialUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        ) : certification.credentialId ? (
                          <div className="text-xs text-muted-foreground font-mono">
                            {certification.credentialId}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleVisibility(certification.id, certification.isVisible)}
                        >
                          {certification.isVisible ? (
                            <Eye className="h-4 w-4 text-green-600" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{certification.displayOrder}</Badge>
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
                              <Link href={`/admin/certifications/${certification.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => toggleVisibility(certification.id, certification.isVisible)}
                            >
                              {certification.isVisible ? (
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
                              onClick={() => handleDelete(certification.id)}
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
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {searchTerm
                          ? 'No certifications found matching your search'
                          : 'No certifications yet. Add your first certification!'
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

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search, 
  FileText, 
  Calendar,
  User,
  Activity,
  Download,
  Filter
} from 'lucide-react'
import { toast } from 'sonner'

interface AuditLog {
  id: string
  action: string
  resource: string
  resourceId: string | null
  oldData: string | null
  newData: string | null
  createdAt: string
  user: {
    name: string
    email: string
  }
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [resourceFilter, setResourceFilter] = useState<string>('all')

  useEffect(() => {
    fetchAuditLogs()
  }, [])

  const fetchAuditLogs = async () => {
    try {
      const response = await fetch('/api/admin/audit')
      if (response.ok) {
        const data = await response.json()
        setLogs(data.logs || [])
      } else {
        toast.error('Failed to fetch audit logs')
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error)
      toast.error('Failed to fetch audit logs')
    } finally {
      setIsLoading(false)
    }
  }

  const exportLogs = async () => {
    try {
      const response = await fetch('/api/admin/audit/export')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        toast.success('Audit logs exported successfully')
      } else {
        toast.error('Failed to export audit logs')
      }
    } catch (error) {
      console.error('Error exporting logs:', error)
      toast.error('Failed to export audit logs')
    }
  }

  const filteredLogs = logs.filter(log => {
    const searchableContent = [
      log.resource,
      log.resourceId,
      log.user.name,
      log.oldData,
      log.newData
    ].filter(Boolean).join(' ').toLowerCase()

    const matchesSearch = searchableContent.includes(searchTerm.toLowerCase())
    const matchesAction = actionFilter === 'all' || log.action === actionFilter
    const matchesResource = resourceFilter === 'all' || log.resource === resourceFilter

    return matchesSearch && matchesAction && matchesResource
  })

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'DELETE':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const uniqueActions = Array.from(new Set(logs.map(log => log.action)))
  const uniqueResources = Array.from(new Set(logs.map(log => log.resource)))

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Audit Logs</h1>
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
          <h1 className="text-2xl font-bold">Audit Logs</h1>
          <p className="text-muted-foreground">
            Track all administrative actions and changes
          </p>
        </div>
        <Button onClick={exportLogs} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>System Activity Log</span>
          </CardTitle>
          <CardDescription>
            Complete history of all administrative actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="flex h-10 w-[140px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">All Actions</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>

            <select
              value={resourceFilter}
              onChange={(e) => setResourceFilter(e.target.value)}
              className="flex h-10 w-[140px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">All Resources</option>
              {uniqueResources.map(resource => (
                <option key={resource} value={resource}>{resource}</option>
              ))}
            </select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Badge className={getActionColor(log.action)}>
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          <span>{log.resource}</span>
                          {log.resourceId && (
                            <span className="text-xs text-muted-foreground">
                              ({log.resourceId.slice(0, 8)}...)
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-md">
                          {log.newData ? (
                            <div className="text-sm">
                              <span className="text-green-600">Created/Updated</span>
                            </div>
                          ) : log.oldData ? (
                            <div className="text-sm">
                              <span className="text-red-600">Deleted</span>
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">
                              No details
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{log.user.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {log.user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm">
                              {new Date(log.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(log.createdAt).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {searchTerm || actionFilter !== 'all' || resourceFilter !== 'all'
                          ? 'No audit logs found matching your criteria'
                          : 'No audit logs yet'
                        }
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {filteredLogs.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredLogs.length} of {logs.length} total logs
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

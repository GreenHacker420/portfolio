'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Search,
  MoreHorizontal,
  Eye,
  Trash2,
  Download,
  Mail,
  Calendar,
  User,
  MessageSquare,
  Filter,
  Reply
} from 'lucide-react'
import ContactReplyDialog from '@/components/admin/ContactReplyDialog'

interface Contact {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'pending' | 'responded' | 'archived'
  ipAddress?: string
  userAgent?: string
  createdAt: string
  updatedAt: string
}

interface Pagination {
  currentPage: number
  totalPages: number
  totalCount: number
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [replyContact, setReplyContact] = useState<Contact | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const selectedIds = Object.keys(selected).filter(id => selected[id])


  useEffect(() => {
    fetchContacts()
  }, [searchTerm, selectedStatus])

  const fetchContacts = async (page = 1) => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(selectedStatus !== 'all' && { status: selectedStatus }),
        ...(searchTerm && { search: searchTerm }),
      })

      const response = await fetch(`/api/admin/contacts?${params}`)
      if (response.ok) {
        const data = await response.json()
        setContacts(data.contacts)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateContactStatus = async (contactId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        fetchContacts(pagination?.currentPage)
      }
    } catch (error) {
      console.error('Failed to update contact status:', error)
    }
  }

  const deleteContact = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return

    try {
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchContacts(pagination?.currentPage)
      }
    } catch (error) {
      console.error('Failed to delete contact:', error)
    }
  }

  const exportContacts = async () => {
    try {
      setIsExporting(true)
      const response = await fetch('/api/admin/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'export',
          filters: {
            status: selectedStatus !== 'all' ? selectedStatus : undefined,
          }
        })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `contacts-export-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Failed to export contacts:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'responded': return 'bg-green-100 text-green-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Calendar className="h-3 w-3" />
      case 'responded': return <Mail className="h-3 w-3" />
      case 'archived': return <Eye className="h-3 w-3" />
      default: return <MessageSquare className="h-3 w-3" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">
            Manage contact form submissions and inquiries
          </p>
        </div>
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between bg-muted/40 border rounded-md p-3 mb-4">
            <div className="text-sm">{selectedIds.length} selected</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={async () => {
                const res = await fetch('/api/admin/contacts/bulk', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'export', ids: selectedIds }) })
                if (res.ok) { const blob = await res.blob(); const url = window.URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'contacts-export.csv'; a.click(); window.URL.revokeObjectURL(url) }
              }}>Export CSV</Button>
              <Button variant="outline" size="sm" onClick={async () => {
                await fetch('/api/admin/contacts/bulk', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'status', ids: selectedIds, payload: { status: 'responded' } }) });
                fetchContacts(pagination?.currentPage || 1)
              }}>Mark Responded</Button>
              <Button variant="outline" size="sm" onClick={async () => {
                await fetch('/api/admin/contacts/bulk', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'status', ids: selectedIds, payload: { status: 'archived' } }) });
                fetchContacts(pagination?.currentPage || 1)
              }}>Archive</Button>
              <Button variant="destructive" size="sm" onClick={async () => {
                if (!confirm('Delete selected contacts?')) return; await fetch('/api/admin/contacts/bulk', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', ids: selectedIds }) });
                fetchContacts(pagination?.currentPage || 1); setSelected({})
              }}>Delete</Button>
            </div>
          </div>
        )}

        <Button
          onClick={exportContacts}
          disabled={isExporting}
          variant="outline"
        >
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export CSV'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Submissions</CardTitle>
          <CardDescription>
            {pagination ? `${pagination.totalCount} total contacts` : 'Loading...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="responded">Responded</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Checkbox
                      aria-label="Select all"
                      checked={contacts.length > 0 && contacts.every(c => selected[c.id])}
                      onCheckedChange={(c) => {
                        const next: Record<string, boolean> = {}
                        if (c) contacts.forEach(s => next[s.id] = true)
                        setSelected(c ? next : {})
                      }}
                    />
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading contacts...
                    </TableCell>
                  </TableRow>
                ) : contacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No contacts found
                    </TableCell>
                  </TableRow>
                ) : (
                  contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <Checkbox
                          aria-label={`Select ${contact.email}`}
                          checked={!!selected[contact.id]}
                          onCheckedChange={(c) => setSelected({ ...selected, [contact.id]: !!c })}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{contact.name}</div>
                          <div className="text-sm text-muted-foreground">{contact.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={contact.subject}>
                          {contact.subject}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(contact.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(contact.status)}
                            {contact.status}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedContact(contact)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setReplyContact(contact)}>
                              <Reply className="mr-2 h-4 w-4" />
                              Reply
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateContactStatus(contact.id, 'responded')}>
                              <Mail className="mr-2 h-4 w-4" />
                              Mark as Responded
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateContactStatus(contact.id, 'archived')}>
                              <Eye className="mr-2 h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => deleteContact(contact.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of{' '}
                {pagination.totalCount} contacts
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchContacts(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchContacts(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Details Dialog */}
      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Details</DialogTitle>
            <DialogDescription>
              Full contact information and message
            </DialogDescription>
          </DialogHeader>

          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <p className="text-sm text-muted-foreground">{selectedContact.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-muted-foreground">
                    <a href={`mailto:${selectedContact.email}`} className="text-blue-600 hover:underline">
                      {selectedContact.email}
                    </a>
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Subject</label>
                <p className="text-sm text-muted-foreground">{selectedContact.subject}</p>
              </div>

              <div>
                <label className="text-sm font-medium">Message</label>
                <div className="bg-muted p-3 rounded-md text-sm whitespace-pre-wrap">
                  {selectedContact.message}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div>
                  <label className="font-medium">Submitted</label>
                  <p>{new Date(selectedContact.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="font-medium">Status</label>
                  <p className="capitalize">{selectedContact.status}</p>
                </div>
              </div>

              {selectedContact.ipAddress && (
                <div className="text-xs text-muted-foreground">
                  <label className="font-medium">IP Address:</label> {selectedContact.ipAddress}
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => setReplyContact(selectedContact)}
                  size="sm"
                >
                  <Reply className="mr-2 h-4 w-4" />
                  Reply with AI
                </Button>
                <Button
                  onClick={() => window.open(`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`, '_blank')}
                  variant="outline"
                  size="sm"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Reply via Email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateContactStatus(selectedContact.id, 'responded')}
                >
                  Mark as Responded
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Contact Reply Dialog */}
      <ContactReplyDialog
        contact={replyContact}
        isOpen={!!replyContact}
        onClose={() => setReplyContact(null)}
        onReplySent={() => {
          fetchContacts(pagination?.currentPage)
          setReplyContact(null)
        }}
      />
    </div>
  )
}

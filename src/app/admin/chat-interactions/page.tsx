'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, MessageCircle, Search, Trash2, Calendar, Clock, User } from 'lucide-react'
import { toast } from 'sonner'

interface ChatInteraction {
  id: string
  sessionId: string
  userMessage: string
  botResponse: string
  responseTime?: number
  createdAt: string
  updatedAt: string
}

interface SessionStat {
  sessionId: string
  messageCount: number
}

export default function ChatInteractionsPage() {
  const [interactions, setInteractions] = useState<ChatInteraction[]>([])
  const [sessionStats, setSessionStats] = useState<SessionStat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })

  useEffect(() => {
    fetchInteractions()
  }, [pagination.page, selectedSession])

  const fetchInteractions = async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })

      if (searchTerm) {
        params.append('search', searchTerm)
      }

      if (selectedSession) {
        params.append('sessionId', selectedSession)
      }

      const response = await fetch(`/api/admin/chat-interactions?${params}`)
      if (response.ok) {
        const data = await response.json()
        setInteractions(data.interactions || [])
        setSessionStats(data.sessionStats || [])
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          pages: data.pagination.pages
        }))
      } else {
        toast.error('Failed to fetch chat interactions')
      }
    } catch (error) {
      console.error('Error fetching interactions:', error)
      toast.error('Failed to fetch chat interactions')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchInteractions()
  }

  const deleteInteraction = async (id: string) => {
    if (!confirm('Are you sure you want to delete this interaction?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/chat-interactions?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Interaction deleted successfully')
        fetchInteractions()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to delete interaction')
      }
    } catch (error) {
      console.error('Error deleting interaction:', error)
      toast.error('Failed to delete interaction')
    }
  }

  const deleteSession = async (sessionId: string) => {
    if (!confirm(`Are you sure you want to delete all interactions for session ${sessionId}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/chat-interactions?sessionId=${sessionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Session interactions deleted successfully')
        setSelectedSession(null)
        fetchInteractions()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to delete session')
      }
    } catch (error) {
      console.error('Error deleting session:', error)
      toast.error('Failed to delete session')
    }
  }

  const cleanupOldInteractions = async () => {
    const days = prompt('Delete interactions older than how many days?', '30')
    if (!days || isNaN(Number(days))) {
      return
    }

    const cutoffDate = new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000)
    
    if (!confirm(`Are you sure you want to delete all interactions older than ${days} days (before ${cutoffDate.toLocaleDateString()})?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/chat-interactions?olderThan=${cutoffDate.toISOString()}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(`Deleted ${data.deleted} old interactions`)
        fetchInteractions()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to cleanup interactions')
      }
    } catch (error) {
      console.error('Error cleaning up interactions:', error)
      toast.error('Failed to cleanup interactions')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Chat Interactions</h1>
        </div>
        <Button onClick={cleanupOldInteractions} variant="outline">
          <Trash2 className="h-4 w-4 mr-2" />
          Cleanup Old
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={handleSearch}>Search</Button>
            {selectedSession && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedSession(null)
                  setPagination(prev => ({ ...prev, page: 1 }))
                  fetchInteractions()
                }}
              >
                Clear Filter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Session Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active Sessions</CardTitle>
            <CardDescription>Most active chat sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sessionStats.slice(0, 10).map((stat) => (
                <div
                  key={stat.sessionId}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-muted ${
                    selectedSession === stat.sessionId ? 'bg-muted' : ''
                  }`}
                  onClick={() => {
                    setSelectedSession(stat.sessionId === selectedSession ? null : stat.sessionId)
                    setPagination(prev => ({ ...prev, page: 1 }))
                  }}
                >
                  <span className="text-xs font-mono truncate">
                    {stat.sessionId.slice(0, 8)}...
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {stat.messageCount}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Interactions List */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                Chat Interactions 
                {selectedSession && (
                  <Badge variant="outline" className="ml-2">
                    Session: {selectedSession.slice(0, 8)}...
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Total: {pagination.total} interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {interactions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No chat interactions found.
                </p>
              ) : (
                <div className="space-y-4">
                  {interactions.map((interaction) => (
                    <div key={interaction.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span className="font-mono">{interaction.sessionId.slice(0, 12)}...</span>
                          <Calendar className="h-4 w-4 ml-2" />
                          <span>{new Date(interaction.createdAt).toLocaleString()}</span>
                          {interaction.responseTime && (
                            <>
                              <Clock className="h-4 w-4 ml-2" />
                              <span>{interaction.responseTime}ms</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteInteraction(interaction.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          {selectedSession !== interaction.sessionId && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteSession(interaction.sessionId)}
                            >
                              Delete Session
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="text-sm font-medium text-blue-900 mb-1">User:</p>
                          <p className="text-sm text-blue-800">{interaction.userMessage}</p>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-sm font-medium text-gray-900 mb-1">Bot:</p>
                          <p className="text-sm text-gray-800">{interaction.botResponse}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Page {pagination.page} of {pagination.pages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page <= 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page >= pagination.pages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

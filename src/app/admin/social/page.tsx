'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, Link as LinkIcon, Eye, EyeOff, ExternalLink } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface SocialLink {
  id: string
  platform: string
  url: string
  username?: string
  icon?: string
  isVisible: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
}

const PLATFORM_OPTIONS = [
  { value: 'github', label: 'GitHub', icon: '🐙' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { value: 'twitter', label: 'Twitter/X', icon: '🐦' },
  { value: 'instagram', label: 'Instagram', icon: '📷' },
  { value: 'youtube', label: 'YouTube', icon: '📺' },
  { value: 'facebook', label: 'Facebook', icon: '📘' },
  { value: 'discord', label: 'Discord', icon: '🎮' },
  { value: 'telegram', label: 'Telegram', icon: '✈️' },
  { value: 'website', label: 'Website', icon: '🌐' },
  { value: 'blog', label: 'Blog', icon: '📝' },
  { value: 'portfolio', label: 'Portfolio', icon: '💼' },
  { value: 'other', label: 'Other', icon: '🔗' },
]

export default function SocialLinksPage() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null)
  const [formData, setFormData] = useState({
    platform: '',
    url: '',
    username: '',
    icon: '',
    isVisible: true,
    displayOrder: 0,
  })

  useEffect(() => {
    fetchSocialLinks()
  }, [])

  const fetchSocialLinks = async () => {
    try {
      const response = await fetch('/api/admin/social')
      if (response.ok) {
        const data = await response.json()
        setSocialLinks(data.socialLinks || [])
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch social links',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error fetching social links:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch social links',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingLink 
        ? `/api/admin/social/${editingLink.id}`
        : '/api/admin/social'
      
      const method = editingLink ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          displayOrder: Number(formData.displayOrder),
        }),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Social link ${editingLink ? 'updated' : 'created'} successfully`,
        })
        setIsDialogOpen(false)
        resetForm()
        fetchSocialLinks()
      } else {
        const errorData = await response.json()
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to save social link',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error saving social link:', error)
      toast({
        title: 'Error',
        description: 'Failed to save social link',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = (link: SocialLink) => {
    setEditingLink(link)
    setFormData({
      platform: link.platform,
      url: link.url,
      username: link.username || '',
      icon: link.icon || '',
      isVisible: link.isVisible,
      displayOrder: link.displayOrder,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/social/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Social link deleted successfully',
        })
        fetchSocialLinks()
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete social link',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error deleting social link:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete social link',
        variant: 'destructive',
      })
    }
  }

  const resetForm = () => {
    setFormData({
      platform: '',
      url: '',
      username: '',
      icon: '',
      isVisible: true,
      displayOrder: 0,
    })
    setEditingLink(null)
  }

  const getPlatformInfo = (platform: string) => {
    return PLATFORM_OPTIONS.find(p => p.value === platform) || { label: platform, icon: '🔗' }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Social Links Management</h1>
          <p className="text-muted-foreground">
            Manage your social media profiles and external links
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Social Link
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingLink ? 'Edit Social Link' : 'Add New Social Link'}
              </DialogTitle>
              <DialogDescription>
                {editingLink 
                  ? 'Update the social link information below.'
                  : 'Add a new social media profile or external link.'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform *</Label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value) => {
                      const platformInfo = getPlatformInfo(value)
                      setFormData({ 
                        ...formData, 
                        platform: value,
                        icon: formData.icon || platformInfo.icon
                      })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLATFORM_OPTIONS.map((platform) => (
                        <SelectItem key={platform.value} value={platform.value}>
                          <div className="flex items-center gap-2">
                            <span>{platform.icon}</span>
                            <span>{platform.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="@yourusername"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="url">URL *</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://github.com/yourusername"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon (emoji or text)</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="🐙"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    min="0"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isVisible"
                  checked={formData.isVisible}
                  onCheckedChange={(checked) => setFormData({ ...formData, isVisible: checked })}
                />
                <Label htmlFor="isVisible">Visible on portfolio</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingLink ? 'Update' : 'Create'} Social Link
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {socialLinks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <LinkIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No social links found</h3>
              <p className="text-muted-foreground text-center mb-4">
                Get started by adding your social media profiles
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Social Link
              </Button>
            </CardContent>
          </Card>
        ) : (
          socialLinks.map((link) => {
            const platformInfo = getPlatformInfo(link.platform)
            return (
              <Card key={link.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-lg">{link.icon || platformInfo.icon}</span>
                        {platformInfo.label}
                        {link.username && (
                          <Badge variant="outline">@{link.username}</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:underline"
                        >
                          {link.url}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {link.isVisible ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Button variant="outline" size="sm" onClick={() => handleEdit(link)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Social Link</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this social link? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(link.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Display Order: {link.displayOrder}</span>
                    <span>•</span>
                    <span>Created: {new Date(link.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

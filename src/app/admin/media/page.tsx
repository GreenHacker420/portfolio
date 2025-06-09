'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { Upload, Edit, Trash2, Image as ImageIcon, File, Eye, EyeOff, Download, Copy } from 'lucide-react'
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

interface Media {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  alt?: string
  category: string
  isVisible: boolean
  uploadedBy?: string
  createdAt: string
  updatedAt: string
}

const CATEGORY_OPTIONS = [
  { value: 'profile', label: 'Profile Images' },
  { value: 'project', label: 'Project Images' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'documents', label: 'Documents' },
  { value: 'icons', label: 'Icons' },
  { value: 'general', label: 'General' },
]

export default function MediaPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMedia, setEditingMedia] = useState<Media | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    alt: '',
    category: 'general',
    isVisible: true,
  })

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      const response = await fetch('/api/admin/media')
      if (response.ok) {
        const data = await response.json()
        setMedia(data.media || [])
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch media files',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error fetching media:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch media files',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('category', selectedCategory === 'all' ? 'general' : selectedCategory)

        const response = await fetch('/api/admin/media/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }
      }

      toast({
        title: 'Success',
        description: `${files.length} file(s) uploaded successfully`,
      })
      fetchMedia()
    } catch (error) {
      console.error('Error uploading files:', error)
      toast({
        title: 'Error',
        description: 'Failed to upload files',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingMedia) return
    
    try {
      const response = await fetch(`/api/admin/media/${editingMedia.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Media updated successfully',
        })
        setIsDialogOpen(false)
        resetForm()
        fetchMedia()
      } else {
        const errorData = await response.json()
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to update media',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error updating media:', error)
      toast({
        title: 'Error',
        description: 'Failed to update media',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = (mediaItem: Media) => {
    setEditingMedia(mediaItem)
    setFormData({
      alt: mediaItem.alt || '',
      category: mediaItem.category,
      isVisible: mediaItem.isVisible,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Media deleted successfully',
        })
        fetchMedia()
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete media',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error deleting media:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete media',
        variant: 'destructive',
      })
    }
  }

  const resetForm = () => {
    setFormData({
      alt: '',
      category: 'general',
      isVisible: true,
    })
    setEditingMedia(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: 'Copied',
      description: 'URL copied to clipboard',
    })
  }

  const filteredMedia = selectedCategory === 'all' 
    ? media 
    : media.filter(item => item.category === selectedCategory)

  const isImage = (mimeType: string) => mimeType.startsWith('image/')

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
          <h1 className="text-3xl font-bold">Media Management</h1>
          <p className="text-muted-foreground">
            Upload and manage images, documents, and other media files
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,application/pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? 'Uploading...' : 'Upload Files'}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Label htmlFor="category-filter">Filter by category:</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORY_OPTIONS.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="outline">
          {filteredMedia.length} file{filteredMedia.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredMedia.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No media files found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Upload your first media file to get started
                </p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Files
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredMedia.map((mediaItem) => (
            <Card key={mediaItem.id} className="overflow-hidden">
              <div className="aspect-square relative bg-muted">
                {isImage(mediaItem.mimeType) ? (
                  <img
                    src={mediaItem.url}
                    alt={mediaItem.alt || mediaItem.originalName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <File className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  {mediaItem.isVisible ? (
                    <Badge variant="default" className="text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      Visible
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      <EyeOff className="h-3 w-3 mr-1" />
                      Hidden
                    </Badge>
                  )}
                </div>
              </div>
              <CardHeader className="p-3">
                <CardTitle className="text-sm truncate" title={mediaItem.originalName}>
                  {mediaItem.originalName}
                </CardTitle>
                <CardDescription className="text-xs">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {CATEGORY_OPTIONS.find(c => c.value === mediaItem.category)?.label || mediaItem.category}
                    </Badge>
                    <span>{formatFileSize(mediaItem.size)}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(mediaItem)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => copyToClipboard(mediaItem.url)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                  >
                    <a href={mediaItem.url} download target="_blank" rel="noopener noreferrer">
                      <Download className="h-3 w-3" />
                    </a>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Media</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this media file? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(mediaItem.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Media</DialogTitle>
            <DialogDescription>
              Update the media file information below.
            </DialogDescription>
          </DialogHeader>
          {editingMedia && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alt">Alt Text (for images)</Label>
                <Input
                  id="alt"
                  value={formData.alt}
                  onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                  placeholder="Describe the image for accessibility"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isVisible"
                  checked={formData.isVisible}
                  onCheckedChange={(checked) => setFormData({ ...formData, isVisible: checked })}
                />
                <Label htmlFor="isVisible">Visible in gallery</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Update Media
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

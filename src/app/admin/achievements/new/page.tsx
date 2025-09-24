'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ChevronLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

const achievementSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required').max(50, 'Category must be less than 50 characters'),
  date: z.string().min(1, 'Date is required'),
  issuer: z.string().optional(),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
  icon: z.string().url('Invalid URL').optional().or(z.literal('')),
  isVisible: z.boolean(),
  displayOrder: z.number().min(0),
})

type AchievementFormData = z.infer<typeof achievementSchema>

const achievementCategories = [
  { value: 'award', label: 'Award' },
  { value: 'recognition', label: 'Recognition' },
  { value: 'milestone', label: 'Milestone' },
  { value: 'certification', label: 'Certification' },
  { value: 'competition', label: 'Competition' },
  { value: 'publication', label: 'Publication' },
  { value: 'speaking', label: 'Speaking' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'other', label: 'Other' },
]

export default function NewAchievementPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<AchievementFormData>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      isVisible: true,
      displayOrder: 0,
    }
  })

  const onSubmit = async (data: AchievementFormData) => {
    setIsSubmitting(true)

    try {
      const achievementData = {
        ...data,
        issuer: data.issuer || undefined,
        url: data.url || undefined,
        icon: data.icon || undefined,
      }

      const response = await fetch('/api/admin/achievements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(achievementData),
      })

      if (response.ok) {
        toast.success('Achievement created successfully')
        router.push('/admin/achievements')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to create achievement')
      }
    } catch (error) {
      console.error('Error creating achievement:', error)
      toast.error('Failed to create achievement')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/achievements">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Achievements
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Add Achievement</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details of your achievement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Achievement Title</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Employee of the Year 2023"
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe the achievement, what it recognizes, and its significance..."
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => setValue('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {achievementCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="issuer">Issuing Organization</Label>
                <Input
                  id="issuer"
                  {...register('issuer')}
                  placeholder="Acme Corporation"
                />
                {errors.issuer && (
                  <p className="text-sm text-red-600">{errors.issuer.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Achievement Date</Label>
              <Input
                id="date"
                type="date"
                {...register('date')}
              />
              {errors.date && (
                <p className="text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="url">Achievement URL</Label>
                <Input
                  id="url"
                  {...register('url')}
                  placeholder="https://example.com/achievement"
                />
                <p className="text-xs text-muted-foreground">
                  Link to certificate, article, or more details
                </p>
                {errors.url && (
                  <p className="text-sm text-red-600">{errors.url.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon/Image URL</Label>
                <Input
                  id="icon"
                  {...register('icon')}
                  placeholder="https://example.com/icon.png"
                />
                {errors.icon && (
                  <p className="text-sm text-red-600">{errors.icon.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Display Settings</CardTitle>
            <CardDescription>
              Configure how this achievement appears on your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  {...register('displayOrder', { valueAsNumber: true })}
                  min="0"
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">
                  Lower numbers appear first (0 = highest priority)
                </p>
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="isVisible"
                  onCheckedChange={(checked) => setValue('isVisible', checked)}
                  defaultChecked={true}
                />
                <Label htmlFor="isVisible">Visible on portfolio</Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" asChild>
              <Link href="/admin/achievements">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Achievement
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

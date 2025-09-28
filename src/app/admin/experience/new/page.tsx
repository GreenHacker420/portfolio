'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ChevronLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

const experienceSchema = z.object({
  company: z.string().min(1, 'Company name is required').max(100, 'Company name must be less than 100 characters'),
  position: z.string().min(1, 'Position is required').max(100, 'Position must be less than 100 characters'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  description: z.string().optional(),
  companyLogo: z.string().url('Invalid URL').optional().or(z.literal('')),
  companyUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  location: z.string().optional(),
  employmentType: z.string().optional(),
  isVisible: z.boolean(),
  displayOrder: z.number().min(0),
})

type ExperienceFormData = z.infer<typeof experienceSchema>

export default function NewExperiencePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [achievements, setAchievements] = useState<string[]>([])
  const [newAchievement, setNewAchievement] = useState('')
  const [technologies, setTechnologies] = useState<string[]>([])
  const [newTechnology, setNewTechnology] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      isVisible: true,
      displayOrder: 0,
    }
  })

  const watchEndDate = watch('endDate')

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setAchievements([...achievements, newAchievement.trim()])
      setNewAchievement('')
    }
  }

  const removeAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index))
  }

  const addTechnology = () => {
    if (newTechnology.trim() && !technologies.includes(newTechnology.trim())) {
      setTechnologies([...technologies, newTechnology.trim()])
      setNewTechnology('')
    }
  }

  const removeTechnology = (index: number) => {
    setTechnologies(technologies.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: ExperienceFormData) => {
    setIsSubmitting(true)

    try {
      const experienceData = {
        ...data,
        achievements,
        technologies,
        companyLogo: data.companyLogo || undefined,
        companyUrl: data.companyUrl || undefined,
        location: data.location || undefined,
        employmentType: data.employmentType || undefined,
        description: data.description || undefined,
        endDate: data.endDate || undefined,
      }

      const response = await fetch('/api/admin/experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(experienceData),
      })

      if (response.ok) {
        toast.success('Work experience created successfully')
        router.push('/admin/experience')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to create work experience')
      }
    } catch (error) {
      console.error('Error creating experience:', error)
      toast.error('Failed to create work experience')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/experience">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Experience
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Add Work Experience</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details of your work experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  {...register('company')}
                  placeholder="Acme Corporation"
                />
                {errors.company && (
                  <p className="text-sm text-red-600">{errors.company.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position/Title</Label>
                <Input
                  id="position"
                  {...register('position')}
                  placeholder="Senior Software Engineer"
                />
                {errors.position && (
                  <p className="text-sm text-red-600">{errors.position.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe your role, responsibilities, and achievements..."
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyLogo">Company Logo URL</Label>
              <Input
                id="companyLogo"
                {...register('companyLogo')}
                placeholder="https://example.com/logo.png"
              />
              {errors.companyLogo && (
                <p className="text-sm text-red-600">{errors.companyLogo.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employment Period</CardTitle>
            <CardDescription>
              Specify the duration of your employment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register('startDate')}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-600">{errors.startDate.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register('endDate')}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty if this is your current position
                </p>
                {errors.endDate && (
                  <p className="text-sm text-red-600">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            {!watchEndDate && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💼 This will be marked as your current position
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Display Settings</CardTitle>
            <CardDescription>
              Configure how this experience appears on your portfolio
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
              <Link href="/admin/experience">Cancel</Link>
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
                  Create Experience
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

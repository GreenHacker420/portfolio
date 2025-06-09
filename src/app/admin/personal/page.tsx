'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Save, Loader2, User, Mail, Phone, MapPin, FileText, Camera } from 'lucide-react'
import { toast } from 'sonner'

const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100),
  title: z.string().min(1, 'Title is required').max(100),
  bio: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  location: z.string().optional(),
  profilePhoto: z.string().url('Invalid URL').optional().or(z.literal('')),
  resumeUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
})

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>

export default function PersonalInfoPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [personalInfo, setPersonalInfo] = useState<any>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
  })

  useEffect(() => {
    fetchPersonalInfo()
  }, [])

  const fetchPersonalInfo = async () => {
    try {
      const response = await fetch('/api/admin/personal')
      if (response.ok) {
        const data = await response.json()
        if (data.personalInfo) {
          setPersonalInfo(data.personalInfo)
          reset({
            fullName: data.personalInfo.fullName || '',
            title: data.personalInfo.title || '',
            bio: data.personalInfo.bio || '',
            email: data.personalInfo.email || '',
            phone: data.personalInfo.phone || '',
            location: data.personalInfo.location || '',
            profilePhoto: data.personalInfo.profilePhoto || '',
            resumeUrl: data.personalInfo.resumeUrl || '',
          })
        }
      }
    } catch (error) {
      console.error('Error fetching personal info:', error)
      toast.error('Failed to fetch personal information')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: PersonalInfoFormData) => {
    setIsSubmitting(true)

    try {
      const personalInfoData = {
        ...data,
        bio: data.bio || undefined,
        phone: data.phone || undefined,
        location: data.location || undefined,
        profilePhoto: data.profilePhoto || undefined,
        resumeUrl: data.resumeUrl || undefined,
      }

      const method = personalInfo ? 'PUT' : 'POST'
      const url = personalInfo ? `/api/admin/personal/${personalInfo.id}` : '/api/admin/personal'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(personalInfoData),
      })

      if (response.ok) {
        toast.success('Personal information updated successfully')
        fetchPersonalInfo() // Refresh data
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to update personal information')
      }
    } catch (error) {
      console.error('Error updating personal info:', error)
      toast.error('Failed to update personal information')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Personal Information</h1>
          <p className="text-muted-foreground">
            Manage your personal details and contact information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Basic Information</span>
            </CardTitle>
            <CardDescription>
              Your basic personal and professional details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  {...register('fullName')}
                  placeholder="John Doe"
                />
                {errors.fullName && (
                  <p className="text-sm text-red-600">{errors.fullName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Full Stack Developer"
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio/About</Label>
              <Textarea
                id="bio"
                {...register('bio')}
                placeholder="Tell us about yourself, your passion, and what drives you..."
                rows={4}
              />
              {errors.bio && (
                <p className="text-sm text-red-600">{errors.bio.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Contact Information</span>
            </CardTitle>
            <CardDescription>
              How people can reach you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...register('location')}
                placeholder="San Francisco, CA"
              />
              {errors.location && (
                <p className="text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="h-5 w-5" />
              <span>Media & Documents</span>
            </CardTitle>
            <CardDescription>
              Profile photo and resume links
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profilePhoto">Profile Photo URL</Label>
              <Input
                id="profilePhoto"
                {...register('profilePhoto')}
                placeholder="https://example.com/profile-photo.jpg"
              />
              {errors.profilePhoto && (
                <p className="text-sm text-red-600">{errors.profilePhoto.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="resumeUrl">Resume/CV URL</Label>
              <Input
                id="resumeUrl"
                {...register('resumeUrl')}
                placeholder="https://example.com/resume.pdf"
              />
              {errors.resumeUrl && (
                <p className="text-sm text-red-600">{errors.resumeUrl.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

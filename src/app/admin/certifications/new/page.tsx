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

const certificationSchema = z.object({
  name: z.string().min(1, 'Certification name is required').max(200, 'Name must be less than 200 characters'),
  issuer: z.string().min(1, 'Issuer is required').max(100, 'Issuer must be less than 100 characters'),
  issueDate: z.string().min(1, 'Issue date is required'),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  description: z.string().optional(),
  logo: z.string().url('Invalid URL').optional().or(z.literal('')),
  isVisible: z.boolean(),
  displayOrder: z.number().min(0),
})

type CertificationFormData = z.infer<typeof certificationSchema>

export default function NewCertificationPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      isVisible: true,
      displayOrder: 0,
    }
  })

  const watchExpiryDate = watch('expiryDate')

  const onSubmit = async (data: CertificationFormData) => {
    setIsSubmitting(true)

    try {
      const certificationData = {
        ...data,
        credentialId: data.credentialId || undefined,
        credentialUrl: data.credentialUrl || undefined,
        description: data.description || undefined,
        logo: data.logo || undefined,
        expiryDate: data.expiryDate || undefined,
      }

      const response = await fetch('/api/admin/certifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(certificationData),
      })

      if (response.ok) {
        toast.success('Certification created successfully')
        router.push('/admin/certifications')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to create certification')
      }
    } catch (error) {
      console.error('Error creating certification:', error)
      toast.error('Failed to create certification')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/certifications">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Certifications
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Add Certification</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details of your certification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Certification Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="AWS Certified Solutions Architect"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="issuer">Issuing Organization</Label>
                <Input
                  id="issuer"
                  {...register('issuer')}
                  placeholder="Amazon Web Services"
                />
                {errors.issuer && (
                  <p className="text-sm text-red-600">{errors.issuer.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Brief description of the certification and what it validates..."
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="credentialId">Credential ID</Label>
                <Input
                  id="credentialId"
                  {...register('credentialId')}
                  placeholder="ABC123XYZ789"
                />
                {errors.credentialId && (
                  <p className="text-sm text-red-600">{errors.credentialId.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  {...register('logo')}
                  placeholder="https://example.com/logo.png"
                />
                {errors.logo && (
                  <p className="text-sm text-red-600">{errors.logo.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="credentialUrl">Credential Verification URL</Label>
              <Input
                id="credentialUrl"
                {...register('credentialUrl')}
                placeholder="https://www.credly.com/badges/..."
              />
              {errors.credentialUrl && (
                <p className="text-sm text-red-600">{errors.credentialUrl.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Certification Period</CardTitle>
            <CardDescription>
              Specify when the certification was issued and when it expires
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input
                  id="issueDate"
                  type="date"
                  {...register('issueDate')}
                />
                {errors.issueDate && (
                  <p className="text-sm text-red-600">{errors.issueDate.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  {...register('expiryDate')}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty if the certification doesn't expire
                </p>
                {errors.expiryDate && (
                  <p className="text-sm text-red-600">{errors.expiryDate.message}</p>
                )}
              </div>
            </div>

            {!watchExpiryDate && (
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-md">
                <p className="text-sm text-green-800 dark:text-green-200">
                  🏆 This certification will be marked as non-expiring
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Display Settings</CardTitle>
            <CardDescription>
              Configure how this certification appears on your portfolio
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
              <Link href="/admin/certifications">Cancel</Link>
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
                  Create Certification
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

interface SettingsForm {
  siteTitle: string
  heroSubtitle: string
  seo: { description?: string; keywords?: string[] }
  features: { enableBlog?: boolean; enableContactAutoReply?: boolean; enableDarkMode?: boolean }
}

export default function SettingsPage() {
  const [form, setForm] = useState<SettingsForm>({
    siteTitle: '',
    heroSubtitle: '',
    seo: { description: '', keywords: [] },
    features: { enableBlog: false, enableContactAutoReply: false, enableDarkMode: true },
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/admin/settings')
        if (!res.ok) throw new Error('Failed to load settings')
        const body = await res.json()
        setForm(body.settings)
      } catch (e: any) {
        toast.error(e.message || 'Failed to fetch settings')
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      if (!form.siteTitle || form.siteTitle.trim().length < 1) {
        toast.error('Site title is required')
        return
      }
      const payload: SettingsForm = {
        siteTitle: form.siteTitle.trim().slice(0, 120),
        heroSubtitle: (form.heroSubtitle || '').slice(0, 240),
        seo: {
          description: (form.seo?.description || '').slice(0, 300),
          keywords: (form.seo?.keywords || []).map(k => k.trim()).filter(Boolean).slice(0, 25),
        },
        features: {
          enableBlog: !!form.features?.enableBlog,
          enableContactAutoReply: !!form.features?.enableContactAutoReply,
          enableDarkMode: !!form.features?.enableDarkMode,
        },
      }
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to save settings')
      toast.success('Settings updated')
    } catch (e: any) {
      toast.error(e.message || 'Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage site-wide configuration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Global site information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteTitle">Site Title</Label>
            <Input
              id="siteTitle"
              value={form.siteTitle}
              onChange={(e) => setForm({ ...form, siteTitle: e.target.value })}
              placeholder="My Portfolio"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
            <Input
              id="heroSubtitle"
              value={form.heroSubtitle}
              onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
              placeholder="Building web experiences"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
          <CardDescription>Search Engine Optimization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seoDescription">Meta Description</Label>
            <Textarea
              id="seoDescription"
              value={form.seo?.description || ''}
              onChange={(e) => setForm({ ...form, seo: { ...form.seo, description: e.target.value } })}
              placeholder="Describe your site in one or two sentences"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seoKeywords">Keywords (comma separated)</Label>
            <Input
              id="seoKeywords"
              value={(form.seo?.keywords || []).join(', ')}
              onChange={(e) => setForm({ ...form, seo: { ...form.seo, keywords: e.target.value.split(',').map(s => s.trim()) } })}
              placeholder="portfolio, developer, react"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
          <CardDescription>Toggle optional features</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <Switch
              id="enableBlog"
              checked={!!form.features?.enableBlog}
              onCheckedChange={(checked) => setForm({ ...form, features: { ...form.features, enableBlog: checked } })}
            />
            <Label htmlFor="enableBlog">Enable Blog</Label>
          </div>
          <div className="flex items-center space-x-3">
            <Switch
              id="enableContactAutoReply"
              checked={!!form.features?.enableContactAutoReply}
              onCheckedChange={(checked) => setForm({ ...form, features: { ...form.features, enableContactAutoReply: checked } })}
            />
            <Label htmlFor="enableContactAutoReply">Contact Auto-Reply</Label>
          </div>
          <div className="flex items-center space-x-3">
            <Switch
              id="enableDarkMode"
              checked={!!form.features?.enableDarkMode}
              onCheckedChange={(checked) => setForm({ ...form, features: { ...form.features, enableDarkMode: checked } })}
            />
            <Label htmlFor="enableDarkMode">Dark Mode</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}


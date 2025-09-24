'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Save, Loader2, Settings, Plus, Trash2, Edit } from 'lucide-react'
import { toast } from 'sonner'

interface SystemSetting {
  id: string
  key: string
  value: string
  description?: string
  updatedAt: string
}

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState<Record<string, SystemSetting>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newSetting, setNewSetting] = useState({
    key: '',
    value: '',
    description: ''
  })
  const [editingSetting, setEditingSetting] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/system-settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings || {})
      } else {
        toast.error('Failed to fetch system settings')
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Failed to fetch system settings')
    } finally {
      setIsLoading(false)
    }
  }

  const createSetting = async () => {
    if (!newSetting.key || !newSetting.value) {
      toast.error('Key and value are required')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/admin/system-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSetting),
      })

      if (response.ok) {
        toast.success('Setting created successfully')
        setNewSetting({ key: '', value: '', description: '' })
        fetchSettings()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to create setting')
      }
    } catch (error) {
      console.error('Error creating setting:', error)
      toast.error('Failed to create setting')
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateSetting = async (key: string, value: string, description?: string) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/admin/system-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, value, description }),
      })

      if (response.ok) {
        toast.success('Setting updated successfully')
        setEditingSetting(null)
        fetchSettings()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to update setting')
      }
    } catch (error) {
      console.error('Error updating setting:', error)
      toast.error('Failed to update setting')
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteSetting = async (key: string) => {
    if (!confirm('Are you sure you want to delete this setting?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/system-settings?key=${encodeURIComponent(key)}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Setting deleted successfully')
        fetchSettings()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to delete setting')
      }
    } catch (error) {
      console.error('Error deleting setting:', error)
      toast.error('Failed to delete setting')
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
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-2xl font-bold">System Settings</h1>
      </div>

      {/* Create New Setting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Setting
          </CardTitle>
          <CardDescription>
            Create a new system setting key-value pair
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-key">Key</Label>
              <Input
                id="new-key"
                value={newSetting.key}
                onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
                placeholder="setting.key.name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-value">Value</Label>
              <Input
                id="new-value"
                value={newSetting.value}
                onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
                placeholder="Setting value"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-description">Description</Label>
              <Input
                id="new-description"
                value={newSetting.description}
                onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })}
                placeholder="Optional description"
              />
            </div>
          </div>
          <Button onClick={createSetting} disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Create Setting
          </Button>
        </CardContent>
      </Card>

      {/* Existing Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Current Settings</CardTitle>
          <CardDescription>
            Manage existing system settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(settings).length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No system settings found. Create your first setting above.
            </p>
          ) : (
            <div className="space-y-4">
              {Object.entries(settings).map(([key, setting]) => (
                <div key={key} className="border rounded-lg p-4">
                  {editingSetting === key ? (
                    <EditSettingForm
                      setting={setting}
                      onSave={(value, description) => updateSetting(key, value, description)}
                      onCancel={() => setEditingSetting(null)}
                      isSubmitting={isSubmitting}
                    />
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="font-mono text-sm bg-muted px-2 py-1 rounded inline-block">
                          {key}
                        </div>
                        <p className="text-sm">{setting.value}</p>
                        {setting.description && (
                          <p className="text-xs text-muted-foreground">{setting.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Updated: {new Date(setting.updatedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingSetting(key)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteSetting(key)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function EditSettingForm({
  setting,
  onSave,
  onCancel,
  isSubmitting
}: {
  setting: SystemSetting
  onSave: (value: string, description?: string) => void
  onCancel: () => void
  isSubmitting: boolean
}) {
  const [value, setValue] = useState(setting.value)
  const [description, setDescription] = useState(setting.description || '')

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Value</Label>
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => onSave(value, description)}
          disabled={isSubmitting}
          size="sm"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          size="sm"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}

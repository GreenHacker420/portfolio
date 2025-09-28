'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ChevronLeft, Sparkles, Loader2, Save } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function GenerateEmailTemplatePage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [generatedTemplate, setGeneratedTemplate] = useState<any>(null)
  const [formData, setFormData] = useState({
    type: 'auto-reply' as 'auto-reply' | 'notification' | 'welcome' | 'follow-up' | 'custom',
    purpose: '',
    tone: 'professional' as 'professional' | 'friendly' | 'casual' | 'formal',
    includePersonalization: true,
    brandVoice: '',
    additionalInstructions: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const generateTemplate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    try {
      const response = await fetch('/api/admin/email-templates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setGeneratedTemplate(data.template)
        toast.success('Email template generated successfully!')
      } else {
        toast.error(data.error || 'Failed to generate template')
      }
    } catch (error) {
      console.error('Error generating template:', error)
      toast.error('Failed to generate template')
    } finally {
      setIsGenerating(false)
    }
  }

  const saveTemplate = async () => {
    if (!generatedTemplate) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/email-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generatedTemplate)
      })

      if (response.ok) {
        toast.success('Template saved successfully!')
        router.push('/admin/email-templates')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to save template')
      }
    } catch (error) {
      console.error('Error saving template:', error)
      toast.error('Failed to save template')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/admin/email-templates">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Email Template Generator</h1>
          <p className="text-muted-foreground">
            Use AI to generate professional email templates for your contact system
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generation Form */}
        <Card>
          <CardHeader>
            <CardTitle>Template Configuration</CardTitle>
            <CardDescription>
              Describe what kind of email template you need
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={generateTemplate} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="type">Template Type</Label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="auto-reply">Auto-Reply</option>
                  <option value="notification">Notification</option>
                  <option value="welcome">Welcome</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose & Context</Label>
                <Textarea
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  placeholder="Describe the purpose of this email template. What should it accomplish? When will it be used?"
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <select
                  id="tone"
                  name="tone"
                  value={formData.tone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="includePersonalization"
                  checked={formData.includePersonalization}
                  onCheckedChange={(checked) => handleSwitchChange('includePersonalization', checked)}
                />
                <Label htmlFor="includePersonalization">Include personalization variables</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brandVoice">Brand Voice (Optional)</Label>
                <Input
                  id="brandVoice"
                  name="brandVoice"
                  value={formData.brandVoice}
                  onChange={handleChange}
                  placeholder="e.g., innovative, approachable, technical expert"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInstructions">Additional Instructions (Optional)</Label>
                <Textarea
                  id="additionalInstructions"
                  name="additionalInstructions"
                  value={formData.additionalInstructions}
                  onChange={handleChange}
                  placeholder="Any specific requirements, style preferences, or content to include"
                  className="min-h-[80px]"
                />
              </div>

              <Button type="submit" disabled={isGenerating} className="w-full">
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Template
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Generated Template Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Template</CardTitle>
            <CardDescription>
              Preview and save your AI-generated email template
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedTemplate ? (
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium">Subject Line</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md">
                    {generatedTemplate.subject}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                    {generatedTemplate.description}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Variables</Label>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {generatedTemplate.variables.map((variable: string) => (
                      <span
                        key={variable}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                      >
                        {`{{${variable}}}`}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">HTML Preview</Label>
                  <div className="mt-1 border rounded-md max-h-96 overflow-auto">
                    <div
                      className="p-4"
                      dangerouslySetInnerHTML={{ __html: generatedTemplate.htmlContent }}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Plain Text Version</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md text-sm whitespace-pre-wrap max-h-32 overflow-auto">
                    {generatedTemplate.textContent}
                  </div>
                </div>

                <Button onClick={saveTemplate} disabled={isSaving} className="w-full">
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Template
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No template generated yet</h3>
                <p className="text-muted-foreground">
                  Fill out the form and click "Generate Template" to create your AI-powered email template.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

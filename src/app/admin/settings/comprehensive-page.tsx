'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2, Settings, Save, Globe, Palette, Mail, Shield, Phone, MapPin, Users } from 'lucide-react'

interface ComprehensiveSettings {
  siteTitle: string
  heroSubtitle: string
  seo: {
    title: string
    description: string
    keywords: string[]
    ogTitle: string
    ogDescription: string
    ogImage: string
    twitterCard: 'summary' | 'summary_large_image'
    twitterSite: string
    twitterCreator: string
    canonicalUrl: string
    robots: string
    author: string
    language: string
    themeColor: string
  }
  features: {
    enableBlog: boolean
    enableContactAutoReply: boolean
    enableDarkMode: boolean
    enableAnalytics: boolean
    enableChatbot: boolean
  }
  contact: {
    email: string
    phone: string
    location: string
    availability: string
  }
  social: {
    github: string
    linkedin: string
    twitter: string
    instagram: string
    youtube: string
    website: string
  }
  emailTemplates: {
    contactReply: string
    welcomeMessage: string
    signature: string
  }
}

export default function ComprehensiveSettingsPage() {
  const [settings, setSettings] = useState<ComprehensiveSettings>({
    siteTitle: '',
    heroSubtitle: '',
    seo: {
      title: '',
      description: '',
      keywords: [],
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      twitterCard: 'summary',
      twitterSite: '',
      twitterCreator: '',
      canonicalUrl: '',
      robots: 'index, follow',
      author: '',
      language: 'en',
      themeColor: '#000000'
    },
    features: {
      enableBlog: false,
      enableContactAutoReply: false,
      enableDarkMode: true,
      enableAnalytics: false,
      enableChatbot: true
    },
    contact: {
      email: '',
      phone: '',
      location: '',
      availability: ''
    },
    social: {
      github: '',
      linkedin: '',
      twitter: '',
      instagram: '',
      youtube: '',
      website: ''
    },
    emailTemplates: {
      contactReply: '',
      welcomeMessage: '',
      signature: ''
    }
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [newKeyword, setNewKeyword] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      } else {
        toast.error('Failed to fetch settings')
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Failed to fetch settings')
    } finally {
      setIsLoading(false)
    }
  }

  const saveSettings = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        toast.success('Settings saved successfully')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !settings.seo.keywords.includes(newKeyword.trim())) {
      setSettings(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          keywords: [...prev.seo.keywords, newKeyword.trim()]
        }
      }))
      setNewKeyword('')
    }
  }

  const removeKeyword = (keyword: string) => {
    setSettings(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: prev.seo.keywords.filter(k => k !== keyword)
      }
    }))
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
          <Settings className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Comprehensive Settings</h1>
        </div>
        <Button onClick={saveSettings} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save All Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Site Information
              </CardTitle>
              <CardDescription>
                Basic information about your portfolio site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteTitle">Site Title</Label>
                <Input
                  id="siteTitle"
                  value={settings.siteTitle}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteTitle: e.target.value }))}
                  placeholder="Your Portfolio"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                <Textarea
                  id="heroSubtitle"
                  value={settings.heroSubtitle}
                  onChange={(e) => setSettings(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                  placeholder="A brief description about yourself"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                SEO & Meta Tags
              </CardTitle>
              <CardDescription>
                Complete SEO configuration for better search engine visibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    value={settings.seo.title}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      seo: { ...prev.seo, title: e.target.value }
                    }))}
                    placeholder="Portfolio | Your Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={settings.seo.author}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      seo: { ...prev.seo, author: e.target.value }
                    }))}
                    placeholder="Your Full Name"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="seoDescription">Meta Description</Label>
                <Textarea
                  id="seoDescription"
                  value={settings.seo.description}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    seo: { ...prev.seo, description: e.target.value }
                  }))}
                  placeholder="A brief description of your portfolio for search engines"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>SEO Keywords</Label>
                <div className="flex gap-2">
                  <Input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Add a keyword"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addKeyword()
                      }
                    }}
                  />
                  <Button type="button" onClick={addKeyword}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {settings.seo.keywords.map((keyword, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeKeyword(keyword)}
                    >
                      {keyword} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ogTitle">Open Graph Title</Label>
                  <Input
                    id="ogTitle"
                    value={settings.seo.ogTitle}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      seo: { ...prev.seo, ogTitle: e.target.value }
                    }))}
                    placeholder="Social media title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ogImage">Open Graph Image URL</Label>
                  <Input
                    id="ogImage"
                    value={settings.seo.ogImage}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      seo: { ...prev.seo, ogImage: e.target.value }
                    }))}
                    placeholder="https://example.com/og-image.jpg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogDescription">Open Graph Description</Label>
                <Textarea
                  id="ogDescription"
                  value={settings.seo.ogDescription}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    seo: { ...prev.seo, ogDescription: e.target.value }
                  }))}
                  placeholder="Description for social media sharing"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="twitterCard">Twitter Card Type</Label>
                  <Select
                    value={settings.seo.twitterCard}
                    onValueChange={(value: 'summary' | 'summary_large_image') => 
                      setSettings(prev => ({
                        ...prev,
                        seo: { ...prev.seo, twitterCard: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Summary</SelectItem>
                      <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    value={settings.seo.language}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      seo: { ...prev.seo, language: e.target.value }
                    }))}
                    placeholder="en"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="themeColor">Theme Color</Label>
                  <Input
                    id="themeColor"
                    type="color"
                    value={settings.seo.themeColor}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      seo: { ...prev.seo, themeColor: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription>
                Your contact details displayed on the site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contact.email}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      contact: { ...prev.contact, email: e.target.value }
                    }))}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone</Label>
                  <Input
                    id="contactPhone"
                    value={settings.contact.phone}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      contact: { ...prev.contact, phone: e.target.value }
                    }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactLocation">Location</Label>
                <Input
                  id="contactLocation"
                  value={settings.contact.location}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    contact: { ...prev.contact, location: e.target.value }
                  }))}
                  placeholder="City, Country"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Textarea
                  id="availability"
                  value={settings.contact.availability}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    contact: { ...prev.contact, availability: e.target.value }
                  }))}
                  placeholder="Available for freelance work, full-time positions, etc."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Social Media Links
              </CardTitle>
              <CardDescription>
                Your social media profiles and website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    value={settings.social.github}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      social: { ...prev.social, github: e.target.value }
                    }))}
                    placeholder="https://github.com/username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={settings.social.linkedin}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      social: { ...prev.social, linkedin: e.target.value }
                    }))}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={settings.social.twitter}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      social: { ...prev.social, twitter: e.target.value }
                    }))}
                    placeholder="https://twitter.com/username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={settings.social.instagram}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      social: { ...prev.social, instagram: e.target.value }
                    }))}
                    placeholder="https://instagram.com/username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    value={settings.social.youtube}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      social: { ...prev.social, youtube: e.target.value }
                    }))}
                    placeholder="https://youtube.com/@username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Personal Website</Label>
                  <Input
                    id="website"
                    value={settings.social.website}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      social: { ...prev.social, website: e.target.value }
                    }))}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Templates
              </CardTitle>
              <CardDescription>
                Customize automated email responses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactReply">Contact Form Auto-Reply</Label>
                <Textarea
                  id="contactReply"
                  value={settings.emailTemplates.contactReply}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    emailTemplates: { ...prev.emailTemplates, contactReply: e.target.value }
                  }))}
                  placeholder="Thank you for your message! I'll get back to you soon."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="welcomeMessage">Welcome Message</Label>
                <Textarea
                  id="welcomeMessage"
                  value={settings.emailTemplates.welcomeMessage}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    emailTemplates: { ...prev.emailTemplates, welcomeMessage: e.target.value }
                  }))}
                  placeholder="Welcome to my portfolio! Feel free to explore my work."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signature">Email Signature</Label>
                <Textarea
                  id="signature"
                  value={settings.emailTemplates.signature}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    emailTemplates: { ...prev.emailTemplates, signature: e.target.value }
                  }))}
                  placeholder="Best regards,\nYour Name\nYour Title"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Feature Toggles
              </CardTitle>
              <CardDescription>
                Enable or disable various features of your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableBlog">Enable Blog</Label>
                  <p className="text-sm text-muted-foreground">Show blog section on your portfolio</p>
                </div>
                <Switch
                  id="enableBlog"
                  checked={settings.features.enableBlog}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    features: { ...prev.features, enableBlog: checked }
                  }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableContactAutoReply">Auto-Reply to Contacts</Label>
                  <p className="text-sm text-muted-foreground">Automatically reply to contact form submissions</p>
                </div>
                <Switch
                  id="enableContactAutoReply"
                  checked={settings.features.enableContactAutoReply}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    features: { ...prev.features, enableContactAutoReply: checked }
                  }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableDarkMode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Enable dark mode theme</p>
                </div>
                <Switch
                  id="enableDarkMode"
                  checked={settings.features.enableDarkMode}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    features: { ...prev.features, enableDarkMode: checked }
                  }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableAnalytics">Analytics</Label>
                  <p className="text-sm text-muted-foreground">Enable website analytics tracking</p>
                </div>
                <Switch
                  id="enableAnalytics"
                  checked={settings.features.enableAnalytics}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    features: { ...prev.features, enableAnalytics: checked }
                  }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableChatbot">AI Chatbot</Label>
                  <p className="text-sm text-muted-foreground">Enable AI-powered chatbot for visitors</p>
                </div>
                <Switch
                  id="enableChatbot"
                  checked={settings.features.enableChatbot}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    features: { ...prev.features, enableChatbot: checked }
                  }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

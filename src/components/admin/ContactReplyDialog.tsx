'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Brain, 
  Send, 
  Sparkles, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  Mail,
  Wand2
} from 'lucide-react'

interface Contact {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
}

interface ContactReplyDialogProps {
  contact: Contact | null
  isOpen: boolean
  onClose: () => void
  onReplySent: () => void
}

export default function ContactReplyDialog({ 
  contact, 
  isOpen, 
  onClose, 
  onReplySent 
}: ContactReplyDialogProps) {
  const [replySubject, setReplySubject] = useState('')
  const [replyMessage, setReplyMessage] = useState('')
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [aiError, setAiError] = useState('')
  const [sendError, setSendError] = useState('')
  const [sendSuccess, setSendSuccess] = useState(false)

  // Reset form when contact changes
  useState(() => {
    if (contact) {
      setReplySubject(`Re: ${contact.subject}`)
      setReplyMessage('')
      setAiError('')
      setSendError('')
      setSendSuccess(false)
    }
  }, [contact])

  const generateAIReply = async (mode: 'auto-generate' | 'enhance-draft') => {
    if (!contact) return

    setIsGeneratingAI(true)
    setAiError('')

    try {
      const response = await fetch('/api/ai/contact-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactId: contact.id,
          mode,
          draftReply: mode === 'enhance-draft' ? replyMessage : undefined,
        }),
      })

      const data = await response.json()

      if (data.success && data.reply) {
        setReplyMessage(data.reply)
        setAiError('')
      } else {
        setAiError(data.error || 'Failed to generate AI reply')
      }
    } catch (error) {
      setAiError('Network error occurred while generating reply')
      console.error('AI reply error:', error)
    } finally {
      setIsGeneratingAI(false)
    }
  }

  const sendReply = async () => {
    if (!contact || !replyMessage.trim() || !replySubject.trim()) return

    setIsSending(true)
    setSendError('')
    setSendSuccess(false)

    try {
      const response = await fetch(`/api/admin/contacts/${contact.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: replySubject,
          replyMessage: replyMessage,
          isAiGenerated: false, // We'll track this separately if needed
          aiMode: 'manual',
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSendSuccess(true)
        setTimeout(() => {
          onReplySent()
          onClose()
        }, 1500)
      } else {
        setSendError(data.error || 'Failed to send reply')
      }
    } catch (error) {
      setSendError('Network error occurred while sending reply')
      console.error('Send reply error:', error)
    } finally {
      setIsSending(false)
    }
  }

  if (!contact) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Reply to {contact.name}
          </DialogTitle>
          <DialogDescription>
            Compose and send a reply to this contact form submission
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Original Message */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Original Message
            </h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">From:</span> {contact.name} ({contact.email})</p>
              <p><span className="font-medium">Subject:</span> {contact.subject}</p>
              <p><span className="font-medium">Date:</span> {new Date(contact.createdAt).toLocaleString()}</p>
              <div className="mt-3 p-3 bg-white dark:bg-gray-700 rounded border">
                <p className="whitespace-pre-wrap">{contact.message}</p>
              </div>
            </div>
          </div>

          {/* AI Generation Section */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h4 className="font-medium text-gray-900 dark:text-white">
                AI-Powered Reply Assistant
              </h4>
              <Sparkles className="h-4 w-4 text-yellow-500" />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => generateAIReply('auto-generate')}
                disabled={isGeneratingAI}
                variant="outline"
                size="sm"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {isGeneratingAI ? 'Generating...' : 'Auto-Generate Reply'}
              </Button>
              
              <Button
                onClick={() => generateAIReply('enhance-draft')}
                disabled={isGeneratingAI || !replyMessage.trim()}
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isGeneratingAI ? 'Enhancing...' : 'Enhance Draft'}
              </Button>
            </div>

            {aiError && (
              <div className="mt-3 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="h-4 w-4" />
                {aiError}
              </div>
            )}
          </div>

          {/* Reply Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject
              </label>
              <Input
                value={replySubject}
                onChange={(e) => setReplySubject(e.target.value)}
                placeholder="Reply subject..."
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reply Message
              </label>
              <Textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply here..."
                rows={12}
                className="w-full resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {replyMessage.length} characters
              </p>
            </div>
          </div>

          {/* Error/Success Messages */}
          {sendError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <p className="text-red-800 dark:text-red-200 text-sm">{sendError}</p>
            </div>
          )}

          {sendSuccess && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <p className="text-green-800 dark:text-green-200 text-sm">
                Reply sent successfully! Contact status updated to "responded".
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              onClick={onClose}
              variant="outline"
              disabled={isSending}
            >
              Cancel
            </Button>
            
            <Button
              onClick={sendReply}
              disabled={isSending || !replyMessage.trim() || !replySubject.trim() || sendSuccess}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Reply
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

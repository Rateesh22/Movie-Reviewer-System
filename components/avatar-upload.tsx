"use client"

import { useState, useRef } from "react"
import { Camera, Upload, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"

interface AvatarUploadProps {
  currentAvatar: string
  onAvatarChange: (newAvatar: string) => void
  userName: string
}

export function AvatarUpload({ currentAvatar, onAvatarChange, userName }: AvatarUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (JPG, PNG, GIF).",
        variant: "destructive"
      })
      return
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 2MB.",
        variant: "destructive"
      })
      return
    }

    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreviewUrl(result)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!previewUrl) return

    setIsUploading(true)
    try {
      // Simulate upload delay (in real app, this would upload to server)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, you would upload to a server and get back a URL
      // For now, we'll use the data URL directly
      onAvatarChange(previewUrl)
      
      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated successfully.",
      })
      
      setIsOpen(false)
      setPreviewUrl(null)
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to update avatar. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveAvatar = () => {
    onAvatarChange('/placeholder-user.jpg')
    toast({
      title: "Avatar Removed",
      description: "Your profile picture has been reset to default.",
    })
    setIsOpen(false)
    setPreviewUrl(null)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleCancel = () => {
    setPreviewUrl(null)
    setIsOpen(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="relative group cursor-pointer">
          <Avatar className="h-20 w-20">
            <AvatarImage src={currentAvatar || "/placeholder-user.jpg"} alt={userName} />
            <AvatarFallback className="text-lg">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
            <Camera className="h-6 w-6 text-white" />
          </div>
        </div>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change Profile Picture</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current/Preview Avatar */}
          <div className="flex justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage 
                src={previewUrl || currentAvatar || "/placeholder-user.jpg"} 
                alt={userName} 
              />
              <AvatarFallback className="text-2xl">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* File Input (Hidden) */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Upload Options */}
          <div className="space-y-3">
            <Button
              onClick={triggerFileInput}
              variant="outline"
              className="w-full flex items-center gap-2"
              disabled={isUploading}
            >
              <Upload className="h-4 w-4" />
              Choose New Photo
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {previewUrl ? (
              <>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="flex-1"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Uploading...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  disabled={isUploading}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleRemoveAvatar}
                  variant="outline"
                  className="flex-1"
                  disabled={isUploading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove Photo
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  disabled={isUploading}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

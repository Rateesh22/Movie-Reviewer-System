"use client"

import { useState, useEffect } from "react"
import { Settings, User, Bell, Shield, Monitor, RotateCcw, Save, Moon, Sun, Laptop } from 'lucide-react'
import { useTheme } from "next-themes"
import { useLanguage } from "@/lib/language-context"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import { AvatarUpload } from "@/components/avatar-upload"
import { SettingsManager, type UserSettings } from "@/lib/settings"
import { toast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(SettingsManager.getSettings())
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    const handleSettingsUpdate = (event: CustomEvent) => {
      setSettings(event.detail)
      setHasChanges(false)
    }

    window.addEventListener('settingsUpdated', handleSettingsUpdate as EventListener)
    return () => window.removeEventListener('settingsUpdated', handleSettingsUpdate as EventListener)
  }, [])

  // Sync theme from settings on component mount
  useEffect(() => {
    if (settings.theme && settings.theme !== theme) {
      setTheme(settings.theme)
    }
  }, [settings.theme, theme, setTheme])

  // Sync language from settings on component mount
  useEffect(() => {
    if (settings.language && settings.language !== language) {
      setLanguage(settings.language as any)
    }
  }, [settings.language, language, setLanguage])

  const updateSetting = (path: string, value: any) => {
    const keys = path.split('.')
    const newSettings = { ...settings }
    
    let current: any = newSettings
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value
    
    setSettings(newSettings)
    setHasChanges(true)
  }

  const handleAvatarChange = (newAvatar: string) => {
    updateSetting('account.avatar', newAvatar)
    // Auto-save avatar changes
    const newSettings = { ...settings }
    newSettings.account.avatar = newAvatar
    SettingsManager.updateSettings(newSettings)
  }

  const saveSettings = async () => {
    setIsLoading(true)
    try {
      const success = SettingsManager.updateSettings(settings)
      if (success) {
        toast({
          title: "Settings Saved",
          description: "Your preferences have been updated successfully.",
        })
        setHasChanges(false)
      } else {
        throw new Error("Failed to save settings")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) {
      SettingsManager.resetSettings()
      toast({
        title: "Settings Reset",
        description: "All settings have been reset to default values.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-900 to-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="h-8 w-8 text-blue-400" />
              <h1 className="text-4xl font-bold">Settings</h1>
            </div>
            <p className="text-xl opacity-90 mb-6">
              Customize your MovieDB experience with personalized preferences and account settings.
            </p>
            {hasChanges && (
              <div className="bg-yellow-600/20 border border-yellow-600/30 rounded-lg p-4 mb-4">
                <p className="text-yellow-200">
                  You have unsaved changes. Don't forget to save your settings!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Settings Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Tabs defaultValue="account" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Account
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="display" className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Display
              </TabsTrigger>
            </TabsList>

            {/* Account Settings */}
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <AvatarUpload
                      currentAvatar={settings.account.avatar}
                      onAvatarChange={handleAvatarChange}
                      userName={settings.account.name}
                    />
                    <div className="space-y-2">
                      <h3 className="font-medium">Profile Picture</h3>
                      <p className="text-sm text-muted-foreground">
                        Click on your avatar to change your profile picture.
                        JPG, PNG or GIF. Max size 2MB.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Display Name</Label>
                      <Input
                        id="name"
                        value={settings.account.name}
                        onChange={(e) => updateSetting('account.name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.account.email}
                        onChange={(e) => updateSetting('account.email', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      value={settings.account.bio}
                      onChange={(e) => updateSetting('account.bio', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme">{t('settings.theme')}</Label>
                    <Select 
                      value={theme || "system"} 
                      onValueChange={(value) => {
                        setTheme(value)
                        updateSetting('theme', value)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4" />
                            {t('settings.light')}
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4" />
                            {t('settings.dark')}
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="flex items-center gap-2">
                            <Laptop className="h-4 w-4" />
                            {t('settings.system')}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">{t('settings.language')}</Label>
                    <Select 
                      value={language} 
                      onValueChange={(value) => {
                        setLanguage(value as any)
                        updateSetting('language', value)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="it">Italiano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={settings.notifications.email}
                        onCheckedChange={(checked) => updateSetting('notifications.email', checked)}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive push notifications in your browser
                        </p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={settings.notifications.push}
                        onCheckedChange={(checked) => updateSetting('notifications.push', checked)}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="review-notifications">Review Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when someone likes or comments on your reviews
                        </p>
                      </div>
                      <Switch
                        id="review-notifications"
                        checked={settings.notifications.reviews}
                        onCheckedChange={(checked) => updateSetting('notifications.reviews', checked)}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="watchlist-notifications">Watchlist Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about new releases from movies in your watchlist
                        </p>
                      </div>
                      <Switch
                        id="watchlist-notifications"
                        checked={settings.notifications.watchlist}
                        onCheckedChange={(checked) => updateSetting('notifications.watchlist', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Settings */}
            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="profile-visible">Public Profile</Label>
                        <p className="text-sm text-muted-foreground">
                          Make your profile visible to other users
                        </p>
                      </div>
                      <Switch
                        id="profile-visible"
                        checked={settings.privacy.profileVisible}
                        onCheckedChange={(checked) => updateSetting('privacy.profileVisible', checked)}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="reviews-visible">Public Reviews</Label>
                        <p className="text-sm text-muted-foreground">
                          Show your reviews to other users
                        </p>
                      </div>
                      <Switch
                        id="reviews-visible"
                        checked={settings.privacy.reviewsVisible}
                        onCheckedChange={(checked) => updateSetting('privacy.reviewsVisible', checked)}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="watchlist-visible">Public Watchlist</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow others to see your watchlist
                        </p>
                      </div>
                      <Switch
                        id="watchlist-visible"
                        checked={settings.privacy.watchlistVisible}
                        onCheckedChange={(checked) => updateSetting('privacy.watchlistVisible', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Display Settings */}
            <TabsContent value="display">
              <Card>
                <CardHeader>
                  <CardTitle>Display Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="movies-per-page">Movies Per Page</Label>
                      <Select 
                        value={settings.display.moviesPerPage.toString()} 
                        onValueChange={(value) => updateSetting('display.moviesPerPage', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 movies</SelectItem>
                          <SelectItem value="20">20 movies</SelectItem>
                          <SelectItem value="50">50 movies</SelectItem>
                          <SelectItem value="100">100 movies</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="show-trailers">Show Trailers</Label>
                        <p className="text-sm text-muted-foreground">
                          Display trailer buttons on movie cards
                        </p>
                      </div>
                      <Switch
                        id="show-trailers"
                        checked={settings.display.showTrailers}
                        onCheckedChange={(checked) => updateSetting('display.showTrailers', checked)}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="autoplay-trailers">Autoplay Trailers</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically play trailers when hovering over movies
                        </p>
                      </div>
                      <Switch
                        id="autoplay-trailers"
                        checked={settings.display.autoplayTrailers}
                        onCheckedChange={(checked) => updateSetting('display.autoplayTrailers', checked)}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="show-spoilers">Show Spoilers</Label>
                        <p className="text-sm text-muted-foreground">
                          Display spoiler content in reviews and descriptions
                        </p>
                      </div>
                      <Switch
                        id="show-spoilers"
                        checked={settings.display.showSpoilers}
                        onCheckedChange={(checked) => updateSetting('display.showSpoilers', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2">
                  <Button
                    onClick={saveSettings}
                    disabled={!hasChanges || isLoading}
                    className="flex items-center gap-2"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={resetSettings}
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset to Default
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

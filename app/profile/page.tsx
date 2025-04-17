"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { user, updateProfile, logout, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState(user?.name || "")
  const [successMessage, setSuccessMessage] = useState("")
  const [error, setError] = useState("")

  // Redirect if not logged in
  if (!user && !isLoading) {
    router.push("/login")
    return null
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    )
  }

  const handleUpdateProfile = async () => {
    setError("")
    setSuccessMessage("")

    if (!name.trim()) {
      setError("Name is required")
      return
    }

    const result = await updateProfile({ name })
    if (result.success) {
      setSuccessMessage("Profile updated successfully")
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
    } else {
      setError(result.error || "Failed to update profile")
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {successMessage && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email} disabled />
            <p className="text-sm text-gray-500">Your email cannot be changed</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleLogout}>
            Log Out
          </Button>
          <Button onClick={handleUpdateProfile}>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

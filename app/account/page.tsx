"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, Bell, Lock, LogOut, Shield, Mail, Home } from "lucide-react"

export default function AccountPage() {
  const { user, updateProfile, logout } = useAuth()
  const router = useRouter()
  const [successMessage, setSuccessMessage] = useState("")

  // Redirect if not logged in
  if (!user) {
    router.push("/login")
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleSaveChanges = () => {
    setSuccessMessage("Your changes have been saved successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  // Mock data for payment methods
  const paymentMethods = [
    {
      id: "pm_1",
      type: "Visa",
      last4: "4242",
      expMonth: 12,
      expYear: 2024,
      isDefault: true,
    },
    {
      id: "pm_2",
      type: "Mastercard",
      last4: "5555",
      expMonth: 8,
      expYear: 2025,
      isDefault: false,
    },
  ]

  // Mock data for addresses
  const addresses = [
    {
      id: "addr_1",
      type: "Shipping",
      line1: "123 Main St",
      line2: "Apt 4B",
      city: "New York",
      state: "NY",
      postal_code: "10001",
      country: "United States",
      isDefault: true,
    },
    {
      id: "addr_2",
      type: "Billing",
      line1: "456 Market St",
      line2: "",
      city: "San Francisco",
      state: "CA",
      postal_code: "94103",
      country: "United States",
      isDefault: true,
    },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      {successMessage && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="notifications" className="hidden md:flex">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="hidden lg:flex">
            Privacy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and profile picture</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.avatar || ""} alt={user?.name || ""} />
                  <AvatarFallback>{user?.name?.charAt(0) || user.email.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium mb-2">Profile Picture</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Upload New
                    </Button>
                    <Button variant="outline" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue={user.email} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="Enter your phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    aria-label="Language selection"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="es">Spanish</option>
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Lock className="h-5 w-5" /> Password
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
                <Button size="sm">Update Password</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Shield className="h-5 w-5" /> Two-Factor Authentication
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-factor authentication is disabled</p>
                    <p className="text-sm text-gray-500">
                      Add an extra layer of security to your account by enabling 2FA
                    </p>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <LogOut className="h-5 w-5" /> Active Sessions
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-gray-500">Chrome on Windows • New York, USA • Now</p>
                    </div>
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Mobile App</p>
                      <p className="text-sm text-gray-500">iOS • San Francisco, USA • 2 days ago</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Revoke
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" className="ml-auto">
                Log Out of All Devices
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods and billing preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between border p-4 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-100 p-2 rounded-md">
                        <CreditCard className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {method.type} •••• {method.last4}
                        </p>
                        <p className="text-sm text-gray-500">
                          Expires {method.expMonth}/{method.expYear}
                          {method.isDefault && " • Default"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button className="w-full sm:w-auto">Add Payment Method</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses">
          <Card>
            <CardHeader>
              <CardTitle>Addresses</CardTitle>
              <CardDescription>Manage your shipping and billing addresses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div key={address.id} className="flex items-center justify-between border p-4 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-100 p-2 rounded-md">
                        <Home className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {address.type}: {address.line1}
                        </p>
                        <p className="text-sm text-gray-500">
                          {address.city}, {address.state} {address.postal_code}
                          {address.isDefault && " • Default"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button className="w-full sm:w-auto">Add New Address</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Bell className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Order Updates</p>
                      <p className="text-sm text-gray-500">Receive notifications about your orders</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Bell className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Product Recommendations</p>
                      <p className="text-sm text-gray-500">Get personalized product recommendations</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Mail className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Marketing Emails</p>
                      <p className="text-sm text-gray-500">Receive promotional emails and offers</p>
                    </div>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Bell className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Account Activity</p>
                      <p className="text-sm text-gray-500">Get notified about account activity and security</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveChanges}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Manage your privacy preferences and data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Data Collection</p>
                    <p className="text-sm text-gray-500">Allow us to collect usage data to improve your experience</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Personalized Ads</p>
                    <p className="text-sm text-gray-500">Allow us to show personalized ads based on your activity</p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="font-medium">Data Export</p>
                  <p className="text-sm text-gray-500">Download a copy of your personal data</p>
                  <Button variant="outline" size="sm">
                    Request Data Export
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="font-medium">Account Deletion</p>
                  <p className="text-sm text-gray-500">Permanently delete your account and all associated data</p>
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-end">
        <Button variant="destructive" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </div>
  )
}

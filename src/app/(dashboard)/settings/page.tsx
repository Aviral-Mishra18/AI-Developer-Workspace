"use client";

import { useState } from "react";
import { currentUser, billingPlan, invoices } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Bell, CreditCard, Paintbrush, Loader2, Key, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  // Profile Form State
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileBio, setProfileBio] = useState(currentUser.bio);

  const handleSaveProfile = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Profile settings updated!");
    }, 1000);
  };

  const handleSaveSecurity = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Password updated successfully!");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customize profile metadata, security parameters, notifications, and billings.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-muted w-full md:w-auto flex md:inline-flex border border-border overflow-x-auto h-auto py-1 justify-start">
          <TabsTrigger value="profile" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-1">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-1">
            <Paintbrush className="h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        {/* PROFILE TAB */}
        <TabsContent value="profile" className="mt-4 space-y-4">
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Public Profile</CardTitle>
              <CardDescription>Configure details visible to fellow workspace collaborators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <Button variant="outline" size="sm" className="h-8">Change Avatar</Button>
                  <p className="text-[10px] text-muted-foreground">JPG, PNG or SVG. Max size 800KB.</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="prof-name">Display Name</Label>
                  <Input
                    id="prof-name"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="border-border bg-card"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prof-email">Email Address (Read-only)</Label>
                  <Input
                    id="prof-email"
                    value={currentUser.email}
                    disabled
                    className="border-border bg-muted/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prof-bio">Biography</Label>
                <Textarea
                  id="prof-bio"
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  className="border-border bg-card min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prof-tz">Timezone</Label>
                <Select defaultValue={currentUser.timezone}>
                  <SelectTrigger className="border-border bg-card max-w-xs">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                    <SelectItem value="Asia/Kolkata">India Standard Time (IST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border/40 p-6 flex justify-end">
              <Button onClick={handleSaveProfile} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Profile
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* SECURITY TAB */}
        <TabsContent value="security" className="mt-4 space-y-4">
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Change Password</CardTitle>
              <CardDescription>Ensure your credential combinations remain secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sec-curr">Current Password</Label>
                <Input id="sec-curr" type="password" placeholder="••••••••" className="border-border bg-card max-w-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sec-new">New Password</Label>
                <Input id="sec-new" type="password" placeholder="••••••••" className="border-border bg-card max-w-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sec-conf">Confirm New Password</Label>
                <Input id="sec-conf" type="password" placeholder="••••••••" className="border-border bg-card max-w-sm" />
              </div>
            </CardContent>
            <CardFooter className="border-t border-border/40 p-6 flex justify-end">
              <Button onClick={handleSaveSecurity} disabled={isLoading}>
                Change Password
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Two-Factor Authentication (2FA)</CardTitle>
              <CardDescription>Secure your profile using external TOTP token inputs</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold">TOTP Authenticator Apps</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed max-w-md">
                  Require token validation from mobile apps (Google Authenticator, Authy) on every login sequence.
                </p>
              </div>
              <Switch />
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="mt-4 space-y-4">
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Notification Channels</CardTitle>
              <CardDescription>Configure where and when you receive update alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold">Email Summary Updates</p>
                  <p className="text-[11px] text-muted-foreground">Receive weekly analytics, velocity reports, and project updates.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold">Browser Push Notifications</p>
                  <p className="text-[11px] text-muted-foreground">Real-time alerts for code reviews, task cards transfers and mentions.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold">Slack Integrations alerts</p>
                  <p className="text-[11px] text-muted-foreground">Dispatch system telemetry failure logs directly to Slack channels.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BILLING TAB */}
        <TabsContent value="billing" className="mt-4 space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Current Plan info */}
            <Card className="border-border bg-card shadow-sm md:col-span-1">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Subscription Plan</CardTitle>
                <CardDescription>Current features allocation details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-xl space-y-1 border border-primary/20">
                  <span className="text-xs text-primary font-bold uppercase tracking-wider">Enterprise Plan</span>
                  <div className="text-2xl font-black">{billingPlan.price}</div>
                </div>
                <div className="space-y-2 text-xs">
                  {billingPlan.features.slice(0, 4).map((feat) => (
                    <div key={feat} className="flex items-center gap-1.5 font-medium">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      {feat}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Plan Meters */}
            <Card className="border-border bg-card shadow-sm md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Resource Allocation Usage</CardTitle>
                <CardDescription>Meter metrics monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span>AI Requests</span>
                    <span>{billingPlan.usage.aiRequests.label}</span>
                  </div>
                  <Progress value={80} className="h-1.5" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Storage Volume</span>
                    <span>{billingPlan.usage.storage.label}</span>
                  </div>
                  <Progress value={(billingPlan.usage.storage.used / billingPlan.usage.storage.limit) * 100} className="h-1.5" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Workspace Members (Seats)</span>
                    <span>{billingPlan.usage.members.label}</span>
                  </div>
                  <Progress value={(billingPlan.usage.members.used / billingPlan.usage.members.limit) * 100} className="h-1.5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invoicing Table */}
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Invoice History</CardTitle>
              <CardDescription>Review past payment details</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Billing Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id} className="border-border">
                      <TableCell className="font-mono text-xs font-semibold">{inv.id}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{inv.date}</TableCell>
                      <TableCell className="text-xs font-bold">{inv.amount}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 capitalize border-0 font-bold text-[10px]">
                          {inv.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* APPEARANCE TAB */}
        <TabsContent value="appearance" className="mt-4 space-y-4">
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Layout Preferences</CardTitle>
              <CardDescription>Personalize active dashboard layout themes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Interface Theme Mode</Label>
                <div className="grid grid-cols-3 gap-3 max-w-sm">
                  <Button variant={theme === "light" ? "default" : "outline"} onClick={() => setTheme("light")} className="h-10 text-xs">
                    Light Mode
                  </Button>
                  <Button variant={theme === "dark" ? "default" : "outline"} onClick={() => setTheme("dark")} className="h-10 text-xs">
                    Dark Mode
                  </Button>
                  <Button variant={theme === "system" ? "default" : "outline"} onClick={() => setTheme("system")} className="h-10 text-xs">
                    System
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Accent Color Preset</Label>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-primary cursor-pointer" />
                  <div className="w-6 h-6 rounded-full bg-blue-600 border border-transparent hover:border-border cursor-pointer" />
                  <div className="w-6 h-6 rounded-full bg-emerald-600 border border-transparent hover:border-border cursor-pointer" />
                  <div className="w-6 h-6 rounded-full bg-indigo-600 border border-transparent hover:border-border cursor-pointer" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

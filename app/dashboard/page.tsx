"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  LogOut, 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  CheckCircle, 
  Clock, 
  Bookmark,
  Activity,
  Settings,
  Bell,
  HelpCircle
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  email: string;
  full_name: string;
  created_at: string;
  role?: string;
  last_login?: string;
  email_verified?: boolean;
}

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tokenType, setTokenType] = useState<'session' | 'local' | null>(null);

  useEffect(() => {
    // Check both localStorage and sessionStorage for tokens
    const localToken = localStorage.getItem("token");
    const sessionToken = sessionStorage.getItem("token");
    const token = localToken || sessionToken;
    
    if (!token) {
      toast({
        title: "Session expired",
        description: "Please login again to continue",
        variant: "destructive",
      });
      router.push("/auth/login");
      return;
    }

    // Remember which storage we found the token in
    setTokenType(localToken ? 'local' : 'session');

    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:8000/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user profile: ${response.status}`);
        }

        const data = await response.json();
        
        // Enhance the user data with some additional properties
        // In a real app, these might come from the API
        setUser({
          ...data,
          role: "User",
          last_login: new Date().toISOString(),
          email_verified: true,
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast({
          title: "Authentication error",
          description: "Your session is invalid or expired",
          variant: "destructive",
        });
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [router, toast]);

  const handleLogout = () => {
    try {
      // Clear from both storages to be safe
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Something went wrong during logout",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-24" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64 col-span-1" />
            <Skeleton className="h-64 col-span-1 lg:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // This shouldn't happen as we redirect to login, but TypeScript needs this
  }

  const initials = user.full_name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user.full_name}!</h1>
            <p className="text-muted-foreground mt-1">
              Here&apos;s an overview of your account
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Settings className="h-4 w-4" />
              <span className="hidden md:inline">Settings</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">Notifications</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card - 1/3 width on desktop */}
          <Card className="col-span-1 border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Profile Information
              </CardTitle>
              <CardDescription>Your personal account details</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-col items-center text-center mb-6">
                <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
                  <AvatarImage 
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.full_name)}`} 
                    alt={user.full_name}
                  />
                  <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{user.full_name}</h2>
                  <div className="flex items-center justify-center mt-1">
                    <Badge variant="outline" className="text-xs font-normal">
                      {user.role || "User"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mt-2">
                    Member since {format(new Date(user.created_at), "MMMM yyyy")}
                  </p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                  {user.email_verified && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span className="text-sm">
                    Joined {format(new Date(user.created_at), "PPP")}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span className="text-sm">
                    Last login {format(new Date(user.last_login || new Date()), "PPP")}
                  </span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span className="text-sm">
                    {tokenType === 'local' ? 'Persistent session' : 'Session expires when browser closes'}
                  </span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-center border-t pt-4">
              <Button variant="outline" size="sm" className="w-full">
                Edit Profile
              </Button>
            </CardFooter>
          </Card>

          {/* Main Content Area - 2/3 width on desktop */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            {/* Account Activity Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Account Activity
                </CardTitle>
                <CardDescription>Overview of your recent activity</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border bg-card p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Last login</span>
                        </div>
                        <span className="text-sm">{format(new Date(), "PPP, p")}</span>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border bg-card p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Account status</span>
                        </div>
                        <span className="inline-flex items-center text-sm text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </span>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border bg-card p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Email verification</span>
                        </div>
                        <span className="inline-flex items-center text-sm text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </span>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border bg-card p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bookmark className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Subscription</span>
                        </div>
                        <Badge>Free Plan</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Actions Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks you might want to perform</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-auto py-6 flex flex-col gap-2 justify-center items-center">
                    <User className="h-6 w-6" />
                    <span>Update Profile</span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto py-6 flex flex-col gap-2 justify-center items-center">
                    <Shield className="h-6 w-6" />
                    <span>Security</span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto py-6 flex flex-col gap-2 justify-center items-center">
                    <Settings className="h-6 w-6" />
                    <span>Preferences</span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto py-6 flex flex-col gap-2 justify-center items-center">
                    <HelpCircle className="h-6 w-6" />
                    <span>Help</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
  rememberMe: z.boolean().optional(),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: { email: string | Blob; password: string | Blob; }) {
    try {
      setIsLoading(true);
      setErrorMessage("");
      
      const formData = new FormData();
      formData.append("username", values.email);
      formData.append("password", values.password);

      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle different error cases based on status codes
        if (response.status === 401) {
          setErrorMessage("Invalid email or password. Please try again.");
        } else if (response.status === 429) {
          setErrorMessage("Too many login attempts. Please try again later.");
        } else {
          setErrorMessage(data.detail || "Login failed. Please try again.");
        }
        return;
      }

     
        localStorage.setItem("token", data.access_token);
     
        sessionStorage.setItem("token", data.access_token);
   

      toast({
        title: "Login successful",
        description: "Welcome back to your dashboard",
      });
      
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <p className="text-center text-muted-foreground text-sm">
            Sign in to access your account
          </p>
        </CardHeader>
        
        <CardContent>
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="your.email@example.com" 
                          className="pl-9" 
                          autoComplete="email"
                          disabled={isLoading}
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          className="pl-9 pr-10" 
                          autoComplete="current-password"
                          disabled={isLoading}
                          {...field} 
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                          onClick={togglePasswordVisibility}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rememberMe"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                      <label
                        htmlFor="rememberMe"
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        Remember me
                      </label>
                    </div>
                  )}
                />
                
              
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter>
          <div className="w-full text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-medium text-primary hover:underline">
              Create account
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
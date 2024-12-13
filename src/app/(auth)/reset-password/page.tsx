'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { type ResetPasswordInput, resetPasswordSchema } from "@/validations/auth"
import { AppRoutes } from "@/constants/routes"
import { PasswordRules } from "@/components/password-rules";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ResetPasswordCredentials } from "@/types/auth";
import { Link, Loader2 } from "lucide-react";
import { usePasswordRules } from "@/hooks/use-password-rules";
import { useResetPassword } from "@/hooks/auth/use-auth-mutation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const {toast} = useToast()
  const resetPassword = useResetPassword()
  const token = searchParams.get('token')
  
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
      token: token || "",
    },
  })
  
  const password = form.watch("newPassword")
  const {showRules, setShowRules, passwordRules} = usePasswordRules(password)
  
  const onSubmit = async (data: ResetPasswordCredentials) => {
    if (!token) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid reset link. Please request a new one.",
      })
      return
    }
    
    resetPassword.mutate({
      token: token,
      newPassword: data.newPassword
    })
  }
  
  if (!searchParams.get('token')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-destructive">Invalid Reset Link</h1>
          <p className="text-muted-foreground">
            This password reset link is invalid or has expired.
          </p>
          <Button asChild>
            <Link href={AppRoutes.FORGOT_PASSWORD}>Request New Link</Link>
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-light">Set new password</h1>
          <p className="text-sm text-muted-foreground">
            Please enter your new password
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="newPassword"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="New password"
                      className="h-12"
                      onFocus={() => setShowRules(true)}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            
            {showRules && <PasswordRules rules={passwordRules}/>}
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      className="h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            
            <Button
              className="w-full h-12"
              type="submit"
              disabled={resetPassword.isPending}
            >
              {resetPassword.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                  Resetting password...
                </>
              ) : (
                'Reset password'
              )}
            </Button>
          </form>
        </Form>
        
        <div className="text-center">
          <a
            href={AppRoutes.LOGIN}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to sign in
          </a>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { resetPasswordSchema, type ResetPasswordInput } from "@/types/auth"
import { AppRoutes } from "@/constants/routes"
import { PasswordRules } from "@/components/password-rules";
import { usePasswordRules } from "@/hooks/usePasswordRules";

export default function ResetPasswordPage() {
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      token: ""
    },
  })
  
  const password = form.watch("password")
  const { showRules, setShowRules, passwordRules } = usePasswordRules(password)
  
  const onSubmit = async (data: ResetPasswordInput) => {
    console.log(data)
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
              name="password"
              render={({ field }) => (
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
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {showRules && <PasswordRules rules={passwordRules} />}
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      className="h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button className="w-full h-12" type="submit">
              Reset password
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

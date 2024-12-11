'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/validations/auth"
import { AppRoutes } from "@/constants/routes"

export default function ForgotPasswordPage() {
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })
  
  const onSubmit = async (data: ForgotPasswordInput) => {
    console.log(data)
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-light">Reset password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
                      className="h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button className="w-full h-12" type="submit">
              Send reset link
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

'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { loginSchema, type LoginInput } from "@/validations/auth"
import { AppRoutes } from "@/constants/routes"

export default function LoginPage() {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  
  const onSubmit = async (data: LoginInput) => {
    console.log(data)
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-light">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Please sign in to continue</p>
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      className="h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="text-right">
              <a
                href={AppRoutes.FORGOT_PASSWORD}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Forgot your password?
              </a>
            </div>
            
            <Button className="w-full h-12" type="submit">
              Sign in
            </Button>
          </form>
        </Form>
        
        <div className="text-center pt-4">
          <a
            href={AppRoutes.REGISTER}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
          >
            Don't have an account? Sign up
          </a>
        </div>
      </div>
    </div>
  )
}

import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center">
      <div className="w-full max-w-sm space-y-8 px-4">
        {children}
      </div>
    </div>
  )
}

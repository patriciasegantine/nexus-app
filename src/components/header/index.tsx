'use client'

import Link from "next/link"
import Image from "next/image"
import { AppRoutes } from "@/constants/routes"
import { useLogout } from "@/hooks/auth/use-auth-mutation";
import { useUser } from "@/hooks/auth/use-user";

export function Header() {
  const {data: user} = useUser()
  const logout = useLogout()
  
  return (
    <header className="fixed top-0 left-0 right-0 h-14 border-b bg-background">
      <div className="h-full px-6 flex items-center justify-between">
        <Link href={AppRoutes.HOME} className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Nexus"
            width={24}
            height={24}
            className="rounded"
          />
          <span className="text-sm font-medium">Nexus</span>
        </Link>
        
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user.name}
            </span>
            <button
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="text-sm font-medium hover:text-foreground transition-colors"
            >
              {logout.isPending ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        ) : (
          <Link href={AppRoutes.LOGIN}>Sign in</Link>
        )}
      </div>
    </header>
  )
}

'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AppRoutes } from '@/constants/routes'

const SEQUENCE_TIMEOUT = 1000

export function useKeyboardNavigation(onOpenHelp: () => void) {
  const router = useRouter()
  const pendingN = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearPending = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    pendingN.current = false
  }, [])

  useEffect(() => {
    function isEditable() {
      const el = document.activeElement
      if (!el) return false
      const tag = el.tagName.toLowerCase()
      return tag === 'input' || tag === 'textarea' || (el as HTMLElement).isContentEditable
    }

    function handleKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (isEditable()) return

      const key = e.key.toLowerCase()

      if (pendingN.current) {
        clearPending()
        const nav: Record<string, string> = {
          o: AppRoutes.DASHBOARD.HOME,
          p: AppRoutes.DASHBOARD.PROJECTS,
          t: AppRoutes.DASHBOARD.TASKS,
          s: AppRoutes.DASHBOARD.SETTINGS,
        }
        if (nav[key]) {
          e.preventDefault()
          router.push(nav[key])
        } else if (e.key === '?') {
          e.preventDefault()
          onOpenHelp()
        }
        return
      }

      if (key === 'n') {
        pendingN.current = true
        timer.current = setTimeout(clearPending, SEQUENCE_TIMEOUT)
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
      clearPending()
    }
  }, [router, onOpenHelp, clearPending])
}

import { useEffect } from "react"

export function restoreBodyPointerEventsIfUnlocked() {
  const openModal = document.querySelector(
    '[role="dialog"][data-state="open"], [role="alertdialog"][data-state="open"]'
  )

  if (!openModal) {
    document.body.style.pointerEvents = ""
  }
}

// Radix locks body pointer-events while a modal overlay is open. When stacked
// overlays close out of order (dropdown → dialog → toast), the lock can leak
// and leave the whole page unclickable. Restore it whenever a modal content
// unmounts, unless another modal is still open and owns the lock.
export function useRestoreBodyPointerEvents() {
  useEffect(() => {
    return () => {
      setTimeout(restoreBodyPointerEventsIfUnlocked, 0)
    }
  }, [])
}

"use client"

import { useState, useEffect } from "react"
import { SlidersHorizontal, Shield, User } from "lucide-react"
import { DangerZone } from "@/components/settings/account/danger-zone/danger-zone"
import { PreferencesSettings } from "@/components/settings/preferences/preferences-settings"
import { ProfileSettings } from "@/components/settings/profile/profile-settings"
import { SecuritySettings } from "@/components/settings/account/security/security-settings"
import { ThemeSettings } from "@/components/settings/preferences/theme-settings"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const SETTINGS_TABS = [
  { value: "profile", label: "Profile", icon: User },
  { value: "preferences", label: "Preferences", icon: SlidersHorizontal },
  { value: "account", label: "Account", icon: Shield },
] as const

type SettingsTab = (typeof SETTINGS_TABS)[number]["value"]

interface SettingsTabsProps {
  hasPassword: boolean
  providers: string[]
}

function getTabFromHash(): SettingsTab {
  const hash = typeof window !== 'undefined' ? window.location.hash.slice(1) : ''
  return (SETTINGS_TABS.map(t => t.value) as string[]).includes(hash)
    ? (hash as SettingsTab)
    : 'profile'
}

export function SettingsTabs({ hasPassword, providers }: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>(getTabFromHash)

  useEffect(() => {
    function onHashChange() {
      setActiveTab(getTabFromHash())
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  function handleTabChange(tab: SettingsTab) {
    window.location.hash = tab
    setActiveTab(tab)
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div
        role="tablist"
        aria-label="Settings sections"
        className="flex gap-1 border-b"
      >
        {SETTINGS_TABS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={activeTab === value}
            aria-controls={`settings-panel-${value}`}
            id={`settings-tab-${value}`}
            onClick={() => handleTabChange(value)}
            className={cn(
              "inline-flex items-center gap-2 border-b-2 border-transparent px-3 pb-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none",
              activeTab === value && "border-foreground text-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <div
          role="tabpanel"
          id="settings-panel-profile"
          aria-labelledby="settings-tab-profile"
          className="space-y-6"
        >
          <ProfileSettings />
        </div>
      )}

      {activeTab === "preferences" && (
        <div
          role="tabpanel"
          id="settings-panel-preferences"
          aria-labelledby="settings-tab-preferences"
          className="space-y-6"
        >
          <ThemeSettings />
          <Separator />
          <PreferencesSettings />
        </div>
      )}

      {activeTab === "account" && (
        <div
          role="tabpanel"
          id="settings-panel-account"
          aria-labelledby="settings-tab-account"
          className="space-y-8"
        >
          <SecuritySettings hasPassword={hasPassword} providers={providers} />
          <Separator />
          <DangerZone />
        </div>
      )}
    </div>
  )
}

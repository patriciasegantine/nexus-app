"use client"

import { useState } from "react"
import { SlidersHorizontal, Shield, User } from "lucide-react"
import { DangerZone } from "@/components/settings/danger-zone"
import { PreferencesSettings } from "@/components/settings/preferences-settings"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { SecuritySettings } from "@/components/settings/security-settings"
import { ThemeSettings } from "@/components/settings/theme-settings"
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
}

export function SettingsTabs({ hasPassword }: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile")

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        aria-label="Settings sections"
        className="flex w-full gap-1 overflow-x-auto rounded-md border bg-card p-1 sm:w-fit"
      >
        {SETTINGS_TABS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={activeTab === value}
            aria-controls={`settings-panel-${value}`}
            id={`settings-tab-${value}`}
            onClick={() => setActiveTab(value)}
            className={cn(
              "inline-flex h-9 items-center justify-center gap-2 rounded-sm px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              activeTab === value && "bg-background text-foreground shadow-sm"
            )}
          >
            <Icon className="h-4 w-4" />
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
          className="space-y-6"
        >
          <SecuritySettings hasPassword={hasPassword} />
          <Separator />
          <DangerZone />
        </div>
      )}
    </div>
  )
}

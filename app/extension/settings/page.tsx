"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Globe, Lock, Palette, Puzzle, Zap, Monitor, Moon, Sun, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"

const settingsSections = [
  {
    title: "General",
    icon: Puzzle,
    settings: [
      { label: "Auto-solve on page load", key: "autoSolve", type: "toggle", defaultValue: true },
      { label: "Show solving notifications", key: "notifications", type: "toggle", defaultValue: true },
      { label: "Sound effects", key: "sounds", type: "toggle", defaultValue: false },
    ],
  },
  {
    title: "Performance",
    icon: Zap,
    settings: [
      { label: "Turbo mode", key: "turbo", type: "toggle", defaultValue: false },
      { label: "Background solving", key: "background", type: "toggle", defaultValue: true },
      { label: "Low power mode", key: "lowPower", type: "toggle", defaultValue: false },
    ],
  },
  {
    title: "Privacy",
    icon: Lock,
    settings: [
      { label: "Anonymous solving", key: "anonymous", type: "toggle", defaultValue: true },
      { label: "Clear data on close", key: "clearData", type: "toggle", defaultValue: false },
    ],
  },
]

const themeOptions = [
  { label: "Light", icon: Sun, value: "light" },
  { label: "Dark", icon: Moon, value: "dark" },
  { label: "System", icon: Monitor, value: "system" },
]

export default function ExtensionSettingsPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [settings, setSettings] = useState<Record<string, boolean>>({
    autoSolve: true,
    notifications: true,
    sounds: false,
    turbo: false,
    background: true,
    lowPower: false,
    anonymous: true,
    clearData: false,
  })
  const [theme, setTheme] = useState("system")

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const toggleSetting = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-[360px] bg-background border border-border rounded-2xl shadow-2xl shadow-primary/5 overflow-hidden">
        {/* Header */}
        <header
          className={`px-4 py-3 border-b border-border bg-card transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
        >
          <div className="flex items-center gap-3">
            <Link href="/extension">
              <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-sm font-semibold text-foreground">Settings</h1>
          </div>
        </header>

        {/* Settings Content */}
        <div className="max-h-[480px] overflow-y-auto">
          {/* Theme Selector */}
          <div
            className={`px-4 py-3 border-b border-border transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: "100ms" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-foreground">Appearance</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                    theme === option.value
                      ? "bg-primary/10 border-primary/30"
                      : "bg-card border-border hover:border-primary/20"
                  }`}
                >
                  <option.icon
                    className={`w-5 h-5 ${theme === option.value ? "text-primary" : "text-muted-foreground"}`}
                  />
                  <span className="text-[10px] font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Settings Sections */}
          {settingsSections.map((section, sectionIndex) => (
            <div
              key={section.title}
              className={`px-4 py-3 border-b border-border transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: `${(sectionIndex + 2) * 100}ms` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <section.icon className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-foreground">{section.title}</span>
              </div>
              <div className="space-y-2">
                {section.settings.map((setting) => (
                  <div
                    key={setting.key}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <span className="text-xs text-foreground">{setting.label}</span>
                    <Switch
                      checked={settings[setting.key]}
                      onCheckedChange={() => toggleSetting(setting.key)}
                      className="scale-75 data-[state=checked]:bg-primary"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Advanced Settings Link */}
          <div
            className={`px-4 py-3 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: "500ms" }}
          >
            <button className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-foreground">Advanced Settings</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border bg-secondary/30">
          <p className="text-[10px] text-center text-muted-foreground">Changes are saved automatically</p>
        </div>
      </div>
    </div>
  )
}

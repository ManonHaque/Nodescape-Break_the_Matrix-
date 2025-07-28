"use client"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { GitBranch, Home } from "lucide-react"
import { useGraphStore } from "@/lib/store"

export function GraphToolbar() {
  const { mode, setMode } = useGraphStore()

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <a href="/" className="flex items-center space-x-2">
          <GitBranch className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold">NodeScape</h1>
        </a>
        <a href="/">
          <Button variant="ghost" size="sm">
            <Home className="h-4 w-4" />
          </Button>
        </a>
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center justify-between">
        <Label htmlFor="mode-toggle" className="text-sm font-medium">
          Mode
        </Label>
        <div className="flex items-center space-x-3">
          <span className={`text-sm ${mode === "interactive" ? "font-medium text-blue-600" : "text-gray-500"}`}>
            Interactive
          </span>
          <Switch
            id="mode-toggle"
            checked={mode === "custom"}
            onCheckedChange={(checked) => setMode(checked ? "custom" : "interactive")}
          />
          <span className={`text-sm ${mode === "custom" ? "font-medium text-blue-600" : "text-gray-500"}`}>Custom</span>
        </div>
      </div>
    </div>
  )
}

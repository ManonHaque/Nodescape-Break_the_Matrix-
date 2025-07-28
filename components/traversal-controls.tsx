"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { useGraphStore } from "@/lib/store"
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from "lucide-react"
import { useEffect } from "react"

export function TraversalControls() {
  const {
    nodes,
    algorithm,
    setAlgorithm,
    startNode,
    setStartNode,
    traversalState,
    setTraversalState,
    currentStep,
    steps,
    playbackSpeed,
    setPlaybackSpeed,
    runTraversal,
    stepForward,
    stepBackward,
    resetTraversal,
    pauseTraversal,
  } = useGraphStore()

  // Auto-play functionality
  useEffect(() => {
    if (traversalState === "RUNNING") {
      const interval = setInterval(() => {
        if (currentStep < steps.length - 1) {
          stepForward()
        } else {
          setTraversalState("COMPLETED")
        }
      }, 1000 / playbackSpeed)

      return () => clearInterval(interval)
    }
  }, [traversalState, currentStep, steps.length, playbackSpeed, stepForward, setTraversalState])

  const handleStartTraversal = () => {
    if (traversalState === "IDLE") {
      runTraversal()
    } else if (traversalState === "PAUSED") {
      setTraversalState("RUNNING")
    }
  }

  const handlePauseTraversal = () => {
    if (traversalState === "RUNNING") {
      pauseTraversal()
    }
  }

  const canStart = startNode && nodes.length > 0 && (traversalState === "IDLE" || traversalState === "PAUSED")
  const canPause = traversalState === "RUNNING"
  const canStep = steps.length > 0 && traversalState !== "RUNNING"
  const canReset = traversalState !== "IDLE"

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Traversal Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Algorithm Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Algorithm</label>
            <Select value={algorithm} onValueChange={setAlgorithm} disabled={traversalState !== "IDLE"}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BFS">Breadth-First Search</SelectItem>
                <SelectItem value="DFS">Depth-First Search</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Start Node Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Start Node</label>
            <Select value={startNode || ""} onValueChange={setStartNode} disabled={traversalState !== "IDLE"}>
              <SelectTrigger>
                <SelectValue placeholder="Select start node" />
              </SelectTrigger>
              <SelectContent>
                {nodes.map((node) => (
                  <SelectItem key={node.id} value={node.id}>
                    {node.data.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Playback Controls */}
          <div>
            <label className="text-sm font-medium mb-3 block">Playback</label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <Button size="sm" onClick={handleStartTraversal} disabled={!canStart}>
                <Play className="h-4 w-4 mr-1" />
                {traversalState === "PAUSED" ? "Resume" : "Start"}
              </Button>
              <Button size="sm" onClick={handlePauseTraversal} disabled={!canPause}>
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <Button size="sm" variant="outline" onClick={stepBackward} disabled={!canStep || currentStep === 0}>
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={stepForward}
                disabled={!canStep || currentStep >= steps.length - 1}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={resetTraversal} disabled={!canReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Speed Control */}
          <div>
            <label className="text-sm font-medium mb-2 block">Speed: {playbackSpeed}x</label>
            <Slider
              value={[playbackSpeed]}
              onValueChange={([value]) => setPlaybackSpeed(value)}
              min={0.25}
              max={4}
              step={0.25}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.25x</span>
              <span>4x</span>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <Badge
              variant={
                traversalState === "RUNNING"
                  ? "default"
                  : traversalState === "PAUSED"
                    ? "secondary"
                    : traversalState === "COMPLETED"
                      ? "default"
                      : "outline"
              }
            >
              {traversalState}
            </Badge>

            {steps.length > 0 && (
              <Badge variant="outline">
                Step {currentStep + 1} / {steps.length}
              </Badge>
            )}
          </div>

          {/* Progress Bar */}
          {steps.length > 0 && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

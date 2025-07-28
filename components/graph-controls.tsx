"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from "lucide-react"
import { useGraphStore } from "@/lib/store"
import { useEffect } from "react"

export function GraphControls() {
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

  const handleRun = () => {
    if (traversalState === "IDLE") {
      runTraversal()
    } else if (traversalState === "PAUSED") {
      setTraversalState("RUNNING")
    }
  }

  const handlePause = () => {
    if (traversalState === "RUNNING") {
      setTraversalState("PAUSED")
    }
  }

  const canRun = startNode && nodes.length > 0 && (traversalState === "IDLE" || traversalState === "PAUSED")
  const canPause = traversalState === "RUNNING"
  const canStep = steps.length > 0 && traversalState !== "RUNNING"

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Algorithm Controls</h3>

      {/* Algorithm Selection */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">Algorithm</label>
        <Select value={algorithm} onValueChange={setAlgorithm}>
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
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">Start Node</label>
        <Select value={startNode || ""} onValueChange={setStartNode}>
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

      <Separator className="my-4" />

      {/* Playback Controls */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">Playback Controls</label>
        <div className="flex space-x-2 mb-3">
          <Button size="sm" onClick={handleRun} disabled={!canRun}>
            <Play className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={handlePause} disabled={!canPause}>
            <Pause className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={resetTraversal} disabled={traversalState === "IDLE"}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex space-x-2">
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
        </div>
      </div>

      {/* Speed Control */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">Speed: {playbackSpeed}x</label>
        <Slider
          value={[playbackSpeed]}
          onValueChange={([value]) => setPlaybackSpeed(value)}
          min={0.25}
          max={4}
          step={0.25}
          className="w-full"
        />
      </div>

      {/* Step Counter */}
      {steps.length > 0 && (
        <div className="text-center">
          <Badge variant="secondary">
            Step {currentStep + 1} of {steps.length}
          </Badge>
        </div>
      )}

      {/* Status */}
      <div className="mt-4 text-center">
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
      </div>
    </div>
  )
}

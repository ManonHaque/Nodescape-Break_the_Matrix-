"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGraphStore } from "@/lib/store"
import { MousePointer, Link, Trash2 } from "lucide-react"

export function InteractiveModePanel() {
  const {
    graphType,
    setGraphType,
    isCreatingEdge,
    setIsCreatingEdge,
    setSourceNode,
    sourceNode,
    clearGraph,
    addNodeMode,
    setAddNodeMode,
  } = useGraphStore()

  const toggleEdgeCreation = () => {
    if (!isCreatingEdge) {
      setIsCreatingEdge(true)
      setSourceNode(null)
      if (addNodeMode) {
        setAddNodeMode(false)
      }
    } else {
      // If already in edge creation mode, just reset the source node
      setSourceNode(null)
    }
  }

  const toggleAddNodeMode = () => {
    if (!addNodeMode) {
      setAddNodeMode(true)
      if (isCreatingEdge) {
        setIsCreatingEdge(false)
        setSourceNode(null)
      }
    }
  }

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Interactive Mode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Graph Type */}
          <div>
            <label className="text-sm font-medium mb-2 block">Graph Type</label>
            <Select value={graphType} onValueChange={setGraphType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="undirected">Undirected</SelectItem>
                <SelectItem value="directed">Directed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Graph Tools */}
          <div>
            <label className="text-sm font-medium mb-3 block">Graph Tools</label>
            <div className="space-y-2">
              <Button
                variant={addNodeMode ? "default" : "outline"}
                size="sm"
                onClick={toggleAddNodeMode}
                className="w-full justify-start"
              >
                <MousePointer className="h-4 w-4 mr-2" />
                Add Node
                {addNodeMode && (
                  <Badge variant="secondary" className="ml-auto">
                    Active
                  </Badge>
                )}
              </Button>

              <Button
                variant={isCreatingEdge ? "default" : "outline"}
                size="sm"
                onClick={toggleEdgeCreation}
                className="w-full justify-start"
              >
                <Link className="h-4 w-4 mr-2" />
                Add Edge
                {isCreatingEdge && (
                  <Badge variant="secondary" className="ml-auto">
                    Active
                  </Badge>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={clearGraph}
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 bg-transparent"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Graph
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">Instructions</h4>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Click canvas to add nodes (when Add Node is active)</li>
              <li>• Click two nodes to create edges (when Add Edge is active)</li>
              <li>• Double-click nodes/edges to delete</li>
              <li>• Drag nodes to reposition</li>
              <li>• Use +/- buttons to zoom</li>
            </ul>
          </div>

          {/* Status */}
          {isCreatingEdge && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-yellow-800 dark:text-yellow-200">
                  {sourceNode ? "Click target node to complete edge" : "Click source node to start"}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

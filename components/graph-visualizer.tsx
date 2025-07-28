"use client"

import type React from "react"

import { useCallback, useRef, useState, useEffect } from "react"
import { useGraphStore } from "@/lib/store"
import { GraphToolbar } from "./graph-toolbar"
import { CustomModePanel } from "./custom-mode-panel"
import { InteractiveModePanel } from "./interactive-mode-panel"
import { TraversalControls } from "./traversal-controls"
import { TraversalLog } from "./traversal-log"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, Download, Upload, RotateCcw } from "lucide-react"

interface Point {
  x: number
  y: number
}

export function GraphVisualizer() {
  const {
    nodes,
    edges,
    graphType,
    addNode,
    addEdge: addStoreEdge,
    removeNode,
    removeEdge,
    setNodes,
    isCreatingEdge,
    sourceNode,
    setIsCreatingEdge,
    setSourceNode,
    currentStep,
    steps,
    traversalState,
    mode,
    exportGraph,
    importGraph,
    clearGraph,
    addNodeMode,
  } = useGraphStore()

  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const leftResizeRef = useRef<HTMLDivElement>(null)
  const rightResizeRef = useRef<HTMLDivElement>(null)

  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 })
  const [svgSize, setSvgSize] = useState({ width: 800, height: 600 })
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })

  // Resizable sidebar states
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(320)
  const [rightSidebarWidth, setRightSidebarWidth] = useState(400)
  const [isResizingLeft, setIsResizingLeft] = useState(false)
  const [isResizingRight, setIsResizingRight] = useState(false)

  // Update SVG size on window resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setSvgSize({ width: rect.width, height: rect.height })
      }
    }

    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [leftSidebarWidth, rightSidebarWidth])

  // Handle left sidebar resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingLeft) {
        const newWidth = Math.max(250, Math.min(500, e.clientX))
        setLeftSidebarWidth(newWidth)
      }
      if (isResizingRight) {
        const newWidth = Math.max(300, Math.min(600, window.innerWidth - e.clientX))
        setRightSidebarWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizingLeft(false)
      setIsResizingRight(false)
    }

    if (isResizingLeft || isResizingRight) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [isResizingLeft, isResizingRight])

  // Get current step data for styling
  const currentStepData = steps.length > 0 && currentStep < steps.length ? steps[currentStep] : null

  const getNodeStyle = (nodeId: string) => {
    if (!currentStepData) {
      return {
        fill: "#e5e7eb",
        stroke: "#9ca3af",
        strokeWidth: 2,
      }
    }

    const isVisited = currentStepData.visitedNodes.includes(nodeId)
    const isCurrent = nodeId === currentStepData.currentNode
    const isInFrontier = currentStepData.frontier.includes(nodeId)

    return {
      fill: isCurrent ? "#3b82f6" : isVisited ? "#22c55e" : isInFrontier ? "#f59e0b" : "#e5e7eb",
      stroke: isCurrent ? "#1d4ed8" : isVisited ? "#16a34a" : isInFrontier ? "#d97706" : "#9ca3af",
      strokeWidth: isCurrent ? 3 : 2,
    }
  }

  const getEdgeStyle = (edgeId: string, source: string, target: string) => {
    if (!currentStepData) {
      return {
        stroke: "#9ca3af",
        strokeWidth: 2,
      }
    }

    const isTraversed =
      currentStepData.traversedEdges.includes(edgeId) || currentStepData.traversedEdges.includes(`${target}-${source}`)

    const isCurrent = currentStepData.currentNode === target && currentStepData.parentMap[target] === source

    return {
      stroke: isCurrent ? "#3b82f6" : isTraversed ? "#f97316" : "#9ca3af",
      strokeWidth: isCurrent ? 4 : isTraversed ? 3 : 2,
    }
  }

  const handleZoom = (delta: number) => {
    const newZoom = Math.max(0.1, Math.min(3, zoom + delta))
    setZoom(newZoom)
  }

  const handleResetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const handleSvgClick = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      if (isPanning) return

      if (isCreatingEdge) {
        // Don't disable edge creation mode on canvas click
        return
      }

      if (traversalState !== "IDLE" || mode !== "interactive" || !addNodeMode) return

      const rect = svgRef.current?.getBoundingClientRect()
      if (rect) {
        const x = (event.clientX - rect.left - pan.x) / zoom
        const y = (event.clientY - rect.top - pan.y) / zoom
        addNode({ x, y })
      }
    },
    [isCreatingEdge, traversalState, mode, addNode, zoom, pan, isPanning, addNodeMode],
  )

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, nodeId: string) => {
      event.stopPropagation()

      if (isCreatingEdge && mode === "interactive") {
        if (!sourceNode) {
          setSourceNode(nodeId)
        } else if (sourceNode !== nodeId) {
          addStoreEdge(sourceNode, nodeId)
          setSourceNode(null)
          // Keep edge creation mode active
        }
      }
    },
    [isCreatingEdge, sourceNode, setSourceNode, addStoreEdge, mode],
  )

  const handleNodeMouseDown = useCallback(
    (event: React.MouseEvent, nodeId: string) => {
      if (isCreatingEdge || traversalState !== "IDLE" || mode !== "interactive") return

      event.preventDefault()
      setDraggedNode(nodeId)

      const rect = svgRef.current?.getBoundingClientRect()
      const node = nodes.find((n) => n.id === nodeId)
      if (rect && node) {
        setDragOffset({
          x: (event.clientX - rect.left - pan.x) / zoom - node.position.x,
          y: (event.clientY - rect.top - pan.y) / zoom - node.position.y,
        })
      }
    },
    [isCreatingEdge, traversalState, nodes, zoom, pan, mode],
  )

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (draggedNode) {
        const rect = svgRef.current?.getBoundingClientRect()
        if (rect) {
          const newX = (event.clientX - rect.left - pan.x) / zoom - dragOffset.x
          const newY = (event.clientY - rect.top - pan.y) / zoom - dragOffset.y

          const updatedNodes = nodes.map((node) =>
            node.id === draggedNode
              ? {
                  ...node,
                  position: {
                    x: Math.max(30, Math.min(newX, svgSize.width / zoom - 30)),
                    y: Math.max(30, Math.min(newY, svgSize.height / zoom - 30)),
                  },
                }
              : node,
          )
          setNodes(updatedNodes)
        }
      } else if (isPanning) {
        const deltaX = event.clientX - panStart.x
        const deltaY = event.clientY - panStart.y
        setPan({
          x: pan.x + deltaX,
          y: pan.y + deltaY,
        })
        setPanStart({ x: event.clientX, y: event.clientY })
      }
    },
    [draggedNode, dragOffset, nodes, setNodes, svgSize, zoom, isPanning, panStart, pan],
  )

  const handleMouseUp = useCallback(() => {
    setDraggedNode(null)
    setIsPanning(false)
  }, [])

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (event.button === 1 || (event.button === 0 && event.ctrlKey)) {
      // Middle mouse button or Ctrl+click for panning
      event.preventDefault()
      setIsPanning(true)
      setPanStart({ x: event.clientX, y: event.clientY })
    }
  }, [])

  const handleNodeDoubleClick = useCallback(
    (event: React.MouseEvent, nodeId: string) => {
      event.stopPropagation()
      if (traversalState === "IDLE" && mode === "interactive") {
        removeNode(nodeId)
      }
    },
    [removeNode, traversalState, mode],
  )

  const handleEdgeDoubleClick = useCallback(
    (event: React.MouseEvent, edgeId: string) => {
      event.stopPropagation()
      if (traversalState === "IDLE" && mode === "interactive") {
        removeEdge(edgeId)
      }
    },
    [removeEdge, traversalState, mode],
  )

  const handleExport = () => {
    const data = exportGraph()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "graph.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          importGraph(data)
        } catch (error) {
          console.error("Failed to import graph:", error)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Left Sidebar */}
      <div
        className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden relative"
        style={{ width: leftSidebarWidth }}
      >
        <GraphToolbar />

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">
          {/* Mode-specific panels */}
          {mode === "custom" ? <CustomModePanel /> : <InteractiveModePanel />}
          <TraversalControls />
        </div>

        {/* Left Resize Handle */}
        <div
          ref={leftResizeRef}
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-gray-300 dark:bg-gray-600 hover:bg-blue-500 transition-colors opacity-0 hover:opacity-100"
          onMouseDown={() => setIsResizingLeft(true)}
        />
      </div>

      {/* Main Graph Area */}
      <div className="flex-1 relative" ref={containerRef}>
        {/* Canvas Controls */}
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => handleZoom(0.1)}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleZoom(-0.1)}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleResetView}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" className="relative overflow-hidden bg-transparent">
            <Upload className="h-4 w-4" />
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </Button>
        </div>

        {/* Graph Canvas */}
        <svg
          ref={svgRef}
          className="w-full h-full cursor-crosshair"
          onClick={handleSvgClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseUp}
          style={{ cursor: isPanning ? "grabbing" : draggedNode ? "grabbing" : "default" }}
        >
          {/* Grid Pattern */}
          <defs>
            <pattern id="grid" width={20 * zoom} height={20 * zoom} patternUnits="userSpaceOnUse">
              <path
                d={`M ${20 * zoom} 0 L 0 0 0 ${20 * zoom}`}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="1"
                opacity="0.3"
              />
            </pattern>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#9ca3af" />
            </marker>
            <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
            </marker>
            <marker id="arrowhead-orange" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#f97316" />
            </marker>
          </defs>

          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            <rect width={svgSize.width / zoom} height={svgSize.height / zoom} fill="url(#grid)" />

            {/* Edges */}
            {edges.map((edge) => {
              const sourceNode = nodes.find((n) => n.id === edge.source)
              const targetNode = nodes.find((n) => n.id === edge.target)

              if (!sourceNode || !targetNode) return null

              const style = getEdgeStyle(edge.id, edge.source, edge.target)
              const markerId =
                style.stroke === "#3b82f6"
                  ? "arrowhead-blue"
                  : style.stroke === "#f97316"
                    ? "arrowhead-orange"
                    : "arrowhead"

              return (
                <g key={edge.id}>
                  <line
                    x1={sourceNode.position.x}
                    y1={sourceNode.position.y}
                    x2={targetNode.position.x}
                    y2={targetNode.position.y}
                    stroke={style.stroke}
                    strokeWidth={style.strokeWidth}
                    markerEnd={graphType === "directed" ? `url(#${markerId})` : undefined}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onDoubleClick={(e) => handleEdgeDoubleClick(e, edge.id)}
                  />
                </g>
              )
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const style = getNodeStyle(node.id)
              const orderNumber = currentStepData?.nodeOrder[node.id]

              return (
                <g key={node.id}>
                  <circle
                    cx={node.position.x}
                    cy={node.position.y}
                    r="25"
                    fill={style.fill}
                    stroke={style.stroke}
                    strokeWidth={style.strokeWidth}
                    className="cursor-pointer hover:opacity-80 transition-all duration-200"
                    onClick={(e) => handleNodeClick(e, node.id)}
                    onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                    onDoubleClick={(e) => handleNodeDoubleClick(e, node.id)}
                  />
                  <text
                    x={node.position.x}
                    y={node.position.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-sm font-medium pointer-events-none select-none"
                    fill={style.fill === "#e5e7eb" ? "#374151" : "white"}
                  >
                    {node.data.label}
                  </text>
                  {orderNumber && (
                    <g>
                      <circle
                        cx={node.position.x + 20}
                        cy={node.position.y - 20}
                        r="12"
                        fill="#3b82f6"
                        stroke="white"
                        strokeWidth="2"
                      />
                      <text
                        x={node.position.x + 20}
                        y={node.position.y - 20}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xs font-bold pointer-events-none select-none"
                        fill="white"
                      >
                        {orderNumber}
                      </text>
                    </g>
                  )}
                </g>
              )
            })}

            {/* Creating Edge Preview */}
            {isCreatingEdge && sourceNode && (
              <g>
                <circle
                  cx={nodes.find((n) => n.id === sourceNode)?.position.x}
                  cy={nodes.find((n) => n.id === sourceNode)?.position.y}
                  r="25"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  className="animate-pulse"
                />
              </g>
            )}
          </g>
        </svg>

        {/* Instructions Overlay */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-md">
              <h3 className="text-lg font-semibold mb-2">Get Started</h3>
              {mode === "interactive" ? (
                <>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">Click anywhere on the canvas to add nodes</p>
                  <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <li>• Use "Add Edge" button to connect nodes</li>
                    <li>• Double-click nodes/edges to delete them</li>
                    <li>• Drag nodes to reposition them</li>
                    <li>• Ctrl+click or middle mouse to pan</li>
                    <li>• Use +/- buttons to zoom</li>
                  </ul>
                </>
              ) : (
                <>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Use the Custom Mode panel to define your graph
                  </p>
                  <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <li>• Set number of nodes and edges</li>
                    <li>• Define edges in the text area</li>
                    <li>• Click "Generate Graph" to create</li>
                  </ul>
                </>
              )}
            </div>
          </div>
        )}

        {/* Status Bar */}
        <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3">
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <span>Nodes: {nodes.length}</span>
            <span>Edges: {edges.length}</span>
            <span>Zoom: {Math.round(zoom * 100)}%</span>
            <span>Mode: {mode === "interactive" ? "Interactive" : "Custom"}</span>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Traversal Log */}
      <div
        className="bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 relative"
        style={{ width: rightSidebarWidth }}
      >
        <TraversalLog />

        {/* Right Resize Handle */}
        <div
          ref={rightResizeRef}
          className="absolute top-0 left-0 w-1 h-full cursor-col-resize bg-gray-300 dark:bg-gray-600 hover:bg-blue-500 transition-colors opacity-0 hover:opacity-100"
          onMouseDown={() => setIsResizingRight(true)}
        />
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useGraphStore } from "@/lib/store"
import { AlertCircle, CheckCircle } from "lucide-react"

export function CustomModePanel() {
  const { graphType, setGraphType, generateCustomGraph } = useGraphStore()
  const [numNodes, setNumNodes] = useState<number>(4)
  const [numEdges, setNumEdges] = useState<number>(4)
  const [edgeInput, setEdgeInput] = useState<string>("1 2\n2 3\n3 4\n4 1")
  const [validationError, setValidationError] = useState<string>("")
  const [validationSuccess, setValidationSuccess] = useState<boolean>(false)

  const validateInput = () => {
    const lines = edgeInput
      .trim()
      .split("\n")
      .filter((line) => line.trim())

    if (lines.length !== numEdges) {
      setValidationError(`Expected ${numEdges} edges, but found ${lines.length}`)
      return false
    }

    const nodeSet = new Set<string>()
    const edgeSet = new Set<string>()

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      const parts = line.split(/\s+/)

      if (parts.length !== 2) {
        setValidationError(`Line ${i + 1}: Expected 2 nodes per edge, found ${parts.length}`)
        return false
      }

      const [node1, node2] = parts

      // Check if nodes are valid (numbers or strings)
      if (!node1 || !node2) {
        setValidationError(`Line ${i + 1}: Invalid node names`)
        return false
      }

      nodeSet.add(node1)
      nodeSet.add(node2)

      // Check for duplicate edges
      const edgeKey = graphType === "directed" ? `${node1}-${node2}` : [node1, node2].sort().join("-")

      if (edgeSet.has(edgeKey)) {
        setValidationError(`Duplicate edge found: ${node1} ${node2}`)
        return false
      }

      edgeSet.add(edgeKey)
    }

    if (nodeSet.size > numNodes) {
      setValidationError(`Found ${nodeSet.size} unique nodes, but expected maximum ${numNodes}`)
      return false
    }

    setValidationError("")
    setValidationSuccess(true)
    setTimeout(() => setValidationSuccess(false), 2000)
    return true
  }

  const handleGenerateGraph = () => {
    if (!validateInput()) return

    const lines = edgeInput
      .trim()
      .split("\n")
      .filter((line) => line.trim())
    const edges = lines.map((line) => {
      const [source, target] = line.trim().split(/\s+/)
      return { source, target }
    })

    generateCustomGraph(numNodes, edges)
  }

  const handleEdgeInputChange = (value: string) => {
    setEdgeInput(value)
    setValidationError("")
    setValidationSuccess(false)
  }

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Custom Mode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Graph Parameters */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="numNodes" className="text-sm font-medium">
                Number of Nodes (n)
              </Label>
              <Input
                id="numNodes"
                type="number"
                min="1"
                max="20"
                value={numNodes}
                onChange={(e) => setNumNodes(Number.parseInt(e.target.value) || 1)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="numEdges" className="text-sm font-medium">
                Number of Edges (m)
              </Label>
              <Input
                id="numEdges"
                type="number"
                min="0"
                max="50"
                value={numEdges}
                onChange={(e) => setNumEdges(Number.parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Graph Type */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Graph Type</Label>
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

          {/* Edge Input */}
          <div>
            <Label htmlFor="edgeInput" className="text-sm font-medium mb-2 block">
              Edges ({numEdges} required)
            </Label>
            <Textarea
              id="edgeInput"
              placeholder="node1 node2&#10;node2 node3&#10;..."
              value={edgeInput}
              onChange={(e) => handleEdgeInputChange(e.target.value)}
              rows={Math.min(8, Math.max(3, numEdges))}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Format: Each line should contain two node names separated by space
            </p>
          </div>

          {/* Validation Messages */}
          {validationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}

          {validationSuccess && (
            <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Input validation successful!
              </AlertDescription>
            </Alert>
          )}

          {/* Generate Button */}
          <Button onClick={handleGenerateGraph} className="w-full" size="sm">
            Generate Graph
          </Button>

          {/* Quick Examples */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <Label className="text-xs font-medium text-gray-500 mb-2 block">Quick Examples:</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setNumNodes(4)
                  setNumEdges(4)
                  setEdgeInput("1 2\n2 3\n3 4\n4 1")
                }}
                className="text-xs"
              >
                Cycle
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setNumNodes(4)
                  setNumEdges(3)
                  setEdgeInput("1 2\n1 3\n1 4")
                }}
                className="text-xs"
              >
                Star
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

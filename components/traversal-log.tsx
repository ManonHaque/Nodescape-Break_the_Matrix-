"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useGraphStore } from "@/lib/store"
import { GitBranch, Clock, Activity, ArrowRight } from "lucide-react"

export function TraversalLog() {
  const { algorithm, steps, currentStep, traversalState, traversalLog, startNode } = useGraphStore()

  const currentStepData = steps[currentStep]
  const previousStepData = currentStep > 0 ? steps[currentStep - 1] : null

  // Get the edge used in current step
  const getCurrentEdge = () => {
    if (!currentStepData || !previousStepData) return null

    const newEdges = currentStepData.traversedEdges.filter((edge) => !previousStepData.traversedEdges.includes(edge))

    return newEdges.length > 0 ? newEdges[0] : null
  }

  const currentEdge = getCurrentEdge()

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold flex items-center">
          <GitBranch className="h-5 w-5 mr-2" />
          Traversal Log
        </h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Step-by-Step Details */}
          {currentStepData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Step {currentStep + 1} of {steps.length}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-1 text-sm">Starting Node</h4>
                    <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-800">
                      {startNode}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-sm">Current Node</h4>
                    <Badge variant="default" className="bg-blue-600">
                      {currentStepData.currentNode}
                    </Badge>
                  </div>
                </div>

                {currentEdge && (
                  <div>
                    <h4 className="font-semibold mb-1 text-sm">Last Edge Used</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                        {currentEdge.replace("-", " → ")}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-orange-600" />
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-1 text-sm">{algorithm === "BFS" ? "Queue" : "Stack"}</h4>
                  <div className="flex flex-wrap gap-1">
                    {currentStepData.frontier.length > 0 ? (
                      currentStepData.frontier.map((nodeId, index) => (
                        <Badge
                          key={`${nodeId}-${index}`}
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-800 text-xs"
                        >
                          {nodeId}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">Empty</span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-1 text-sm">Visited Nodes</h4>
                  <div className="flex flex-wrap gap-1">
                    {currentStepData.visitedNodes.map((nodeId, index) => (
                      <Badge
                        key={`${nodeId}-${index}`}
                        variant="outline"
                        className="border-green-500 text-green-700 text-xs"
                      >
                        {nodeId}
                      </Badge>
                    ))}
                  </div>
                </div>

                {currentStepData.traversedEdges.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-1 text-sm">Edges Traversed So Far</h4>
                    <div className="flex flex-wrap gap-1">
                      {currentStepData.traversedEdges.map((edgeId, index) => (
                        <Badge
                          key={`${edgeId}-${index}`}
                          variant="outline"
                          className="border-orange-500 text-orange-700 text-xs"
                        >
                          {edgeId.replace("-", " → ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Algorithm Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Algorithm: {algorithm}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Time Complexity:</span>
                  <Badge variant="secondary">O(V + E)</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Space Complexity:</span>
                  <Badge variant="secondary">O(V)</Badge>
                </div>
                <Separator />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {algorithm === "BFS"
                    ? "BFS explores nodes level by level using a queue (FIFO). It guarantees the shortest path in unweighted graphs."
                    : "DFS explores as far as possible along each branch using a stack (LIFO). It's useful for detecting cycles and topological sorting."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Complete Traversal Summary */}
          {traversalState !== "IDLE" && (
            <>
              {/* All Steps Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Complete Traversal Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-48">
                    <div className="space-y-2">
                      {steps.map((step, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded text-xs border ${
                            index === currentStep
                              ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20"
                              : "bg-gray-50 border-gray-200 dark:bg-gray-800"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Step {index + 1}:</span>
                            <Badge variant="outline" className="text-xs">
                              {step.currentNode}
                            </Badge>
                          </div>
                          {step.traversedEdges.length > 0 && (
                            <div className="mt-1 text-gray-600 dark:text-gray-400">
                              Last edge:{" "}
                              {step.traversedEdges[step.traversedEdges.length - 1]?.replace("-", " → ") || "None"}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Connected Components */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Connected Components</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-40">
                    <div className="space-y-2">
                      {traversalLog.components.map((component, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                          <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Component {index + 1} ({component.length} nodes):
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {component.map((nodeId) => (
                              <Badge key={nodeId} variant="secondary" className="text-xs">
                                {nodeId}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Traversal Table */}
              {currentStepData && Object.keys(currentStepData.nodeOrder).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Traversal Table</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="max-h-48">
                      <table className="w-full text-xs border-collapse">
                        <thead className="sticky top-0 bg-white dark:bg-gray-800">
                          <tr className="border-b">
                            <th className="text-left p-2">Order</th>
                            <th className="text-left p-2">Node</th>
                            <th className="text-left p-2">Parent</th>
                            {algorithm === "BFS" ? (
                              <th className="text-left p-2">Level</th>
                            ) : (
                              <>
                                <th className="text-left p-2">Discovery</th>
                                <th className="text-left p-2">Finish</th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(currentStepData.nodeOrder)
                            .sort(([, a], [, b]) => a - b)
                            .map(([nodeId, order]) => (
                              <tr key={nodeId} className="border-b">
                                <td className="p-2 font-medium">{order}</td>
                                <td className="p-2">
                                  <Badge variant="outline" className="text-xs">
                                    {nodeId}
                                  </Badge>
                                </td>
                                <td className="p-2 text-gray-600 dark:text-gray-400">
                                  {currentStepData.parentMap[nodeId] || "-"}
                                </td>
                                {algorithm === "BFS" ? (
                                  <td className="p-2 text-gray-600 dark:text-gray-400">
                                    {currentStepData.level?.[nodeId] ?? "-"}
                                  </td>
                                ) : (
                                  <>
                                    <td className="p-2 text-gray-600 dark:text-gray-400">
                                      {currentStepData.discoveryTime?.[nodeId] ?? "-"}
                                    </td>
                                    <td className="p-2 text-gray-600 dark:text-gray-400">
                                      {currentStepData.finishTime?.[nodeId] ?? "-"}
                                    </td>
                                  </>
                                )}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

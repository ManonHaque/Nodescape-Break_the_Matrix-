import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Zap, GitBranch } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <GitBranch className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">NodeScape</h1>
            </Link>
            <Link href="/">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">About Graph Traversal Algorithms</h1>

          {/* Algorithm Overview */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Zap className="h-6 w-6 text-blue-600" />
                  <CardTitle>Breadth-First Search (BFS)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  BFS explores nodes level by level, visiting all neighbors of a node before moving to the next level.
                </p>
                <div className="space-y-2">
                  <Badge variant="secondary">Queue-based</Badge>
                  <Badge variant="secondary">Shortest Path</Badge>
                  <Badge variant="secondary">Level Order</Badge>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Time Complexity: O(V + E)</h4>
                  <h4 className="font-semibold mb-2">Space Complexity: O(V)</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Where V is vertices and E is edges</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Clock className="h-6 w-6 text-purple-600" />
                  <CardTitle>Depth-First Search (DFS)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  DFS explores as far as possible along each branch before backtracking to explore other branches.
                </p>
                <div className="space-y-2">
                  <Badge variant="secondary">Stack-based</Badge>
                  <Badge variant="secondary">Recursive</Badge>
                  <Badge variant="secondary">Backtracking</Badge>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Time Complexity: O(V + E)</h4>
                  <h4 className="font-semibold mb-2">Space Complexity: O(V)</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Where V is vertices and E is edges</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Differences */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Key Differences</CardTitle>
              <CardDescription>Understanding when to use BFS vs DFS</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold">Aspect</th>
                      <th className="text-left p-4 font-semibold text-blue-600">BFS</th>
                      <th className="text-left p-4 font-semibold text-purple-600">DFS</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b">
                      <td className="p-4 font-medium">Data Structure</td>
                      <td className="p-4">Queue (FIFO)</td>
                      <td className="p-4">Stack (LIFO) / Recursion</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Traversal Order</td>
                      <td className="p-4">Level by level</td>
                      <td className="p-4">Branch by branch</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Shortest Path</td>
                      <td className="p-4">✅ Guarantees shortest path</td>
                      <td className="p-4">❌ May not find shortest path</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Memory Usage</td>
                      <td className="p-4">Higher (stores all level nodes)</td>
                      <td className="p-4">Lower (stores path nodes)</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Use Cases</td>
                      <td className="p-4">Shortest path, level-order traversal</td>
                      <td className="p-4">Topological sort, cycle detection</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Educational Intent */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Educational Purpose</CardTitle>
              <CardDescription>Why visualizing algorithms matters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                NodeScape is designed to make graph traversal algorithms accessible and understandable through
                interactive visualization. By seeing how BFS and DFS work step-by-step, students and developers can
                build intuition about:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
                <li>How different data structures affect traversal order</li>
                <li>The relationship between algorithm choice and problem requirements</li>
                <li>Time and space complexity in practice</li>
                <li>Graph properties and their impact on algorithm performance</li>
              </ul>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Interactive Learning Features</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Step-by-step execution with pause/resume controls</li>
                  <li>• Real-time data structure visualization (queue/stack)</li>
                  <li>• Traversal tables showing discovery and finish times</li>
                  <li>• Pseudo-code highlighting for each algorithm step</li>
                  <li>• Custom graph creation for testing different scenarios</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ready to Start Learning?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Try the interactive visualizer and see these algorithms in action
            </p>
            <Link href="/visualizer">
              <Button size="lg">Launch Visualizer</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

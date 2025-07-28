import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, GitBranch, Zap, Brain, CheckCircle, Clock } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GitBranch className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">NodeScape</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/about"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                About
              </Link>
              <Link href="/visualizer">
                <Button>Start Visualizing</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Badge variant="secondary" className="mb-4">
          Hackathon Project - Phase 1
        </Badge>
        <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Visualize Graph Traversal
          <span className="text-blue-600"> Algorithms</span>
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Build custom graphs and watch BFS and DFS algorithms come to life with step-by-step visualization, interactive
          controls, and real-time complexity analysis.
        </p>
        <Link href="/visualizer">
          <Button size="lg" className="text-lg px-8 py-3">
            Start Visualizing <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Core Features</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <GitBranch className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Interactive Graph Builder</CardTitle>
              <CardDescription>
                Create custom graphs with drag-and-drop nodes, directed/undirected edges, and real-time editing
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Algorithm Visualization</CardTitle>
              <CardDescription>
                Watch BFS and DFS algorithms execute step-by-step with highlighted nodes, edges, and data structures
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Brain className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Educational Tools</CardTitle>
              <CardDescription>
                Complexity analysis, pseudo-code viewer, and traversal tables to enhance learning
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Three-Phase Structure */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Project Roadmap</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="default" className="bg-green-600">
                  Phase 1
                </Badge>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle className="text-green-800 dark:text-green-200">Graph Traversal Visualizer</CardTitle>
              <CardDescription>
                Interactive BFS/DFS visualization with custom graph building and educational tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
                <li>• Graph Builder Interface</li>
                <li>• BFS/DFS Algorithms</li>
                <li>• Step-by-step Visualization</li>
                <li>• Import/Export Functionality</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="opacity-60">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Phase 2</Badge>
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <CardTitle className="text-gray-600 dark:text-gray-400">DevOps & Deployment</CardTitle>
              <CardDescription>Advanced CI/CD, containerization, and cloud deployment strategies</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">Coming Soon...</p>
            </CardContent>
          </Card>

          <Card className="opacity-60">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Phase 3</Badge>
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <CardTitle className="text-gray-600 dark:text-gray-400">ML Integration</CardTitle>
              <CardDescription>Machine learning algorithms for graph analysis and optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">Coming Soon...</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Explore Graph Algorithms?</h3>
          <p className="text-xl mb-8 text-blue-100">
            Start building graphs and visualizing traversal algorithms in seconds
          </p>
          <Link href="/visualizer">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Launch Visualizer <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 NodeScape. Built for educational purposes.</p>
        </div>
      </footer>
    </div>
  )
}

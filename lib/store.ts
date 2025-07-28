import { create } from "zustand"

export type Algorithm = "BFS" | "DFS"
export type GraphType = "directed" | "undirected"
export type TraversalState = "IDLE" | "RUNNING" | "PAUSED" | "COMPLETED"
export type Mode = "interactive" | "custom"

export interface Node {
  id: string
  position: { x: number; y: number }
  data: { label: string }
}

export interface Edge {
  id: string
  source: string
  target: string
}

export interface TraversalStep {
  currentNode: string
  visitedNodes: string[]
  frontier: string[]
  traversedEdges: string[]
  step: number
  totalSteps: number
  nodeOrder: Record<string, number>
  parentMap: Record<string, string | null>
  discoveryTime?: Record<string, number>
  finishTime?: Record<string, number>
  level?: Record<string, number>
}

export interface TraversalLog {
  visitedNodes: string[]
  traversedEdges: string[]
  components: string[][]
}

export interface GraphState {
  // Graph data
  nodes: Node[]
  edges: Edge[]
  graphType: GraphType
  mode: Mode

  // Algorithm state
  algorithm: Algorithm
  startNode: string | null
  traversalState: TraversalState
  currentStep: number
  steps: TraversalStep[]
  playbackSpeed: number
  traversalLog: TraversalLog

  // UI state
  selectedNodes: string[]
  isCreatingEdge: boolean
  sourceNode: string | null
  addNodeMode: boolean

  // Actions
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  addNode: (position: { x: number; y: number }) => void
  removeNode: (nodeId: string) => void
  addEdge: (source: string, target: string) => void
  removeEdge: (edgeId: string) => void
  setGraphType: (type: GraphType) => void
  setMode: (mode: Mode) => void

  setAlgorithm: (algorithm: Algorithm) => void
  setStartNode: (nodeId: string | null) => void
  setTraversalState: (state: TraversalState) => void
  setCurrentStep: (step: number) => void
  setSteps: (steps: TraversalStep[]) => void
  setPlaybackSpeed: (speed: number) => void

  setSelectedNodes: (nodes: string[]) => void
  setIsCreatingEdge: (creating: boolean) => void
  setSourceNode: (nodeId: string | null) => void
  setAddNodeMode: (mode: boolean) => void

  // Complex actions
  runTraversal: () => void
  stepForward: () => void
  stepBackward: () => void
  resetTraversal: () => void
  pauseTraversal: () => void
  clearGraph: () => void
  importGraph: (data: { nodes: Node[]; edges: Edge[] }) => void
  exportGraph: () => { nodes: Node[]; edges: Edge[] }
  generateCustomGraph: (numNodes: number, edges: { source: string; target: string }[]) => void
}

export const useGraphStore = create<GraphState>((set, get) => ({
  // Initial state
  nodes: [],
  edges: [],
  graphType: "undirected",
  mode: "interactive",

  algorithm: "BFS",
  startNode: null,
  traversalState: "IDLE",
  currentStep: 0,
  steps: [],
  playbackSpeed: 1,
  traversalLog: { visitedNodes: [], traversedEdges: [], components: [] },

  selectedNodes: [],
  isCreatingEdge: false,
  sourceNode: null,
  addNodeMode: true,

  // Basic setters
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setGraphType: (graphType) => set({ graphType }),
  setMode: (mode) => set({ mode }),
  setAlgorithm: (algorithm) => set({ algorithm }),
  setStartNode: (startNode) => set({ startNode }),
  setTraversalState: (traversalState) => set({ traversalState }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setSteps: (steps) => set({ steps }),
  setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),
  setSelectedNodes: (selectedNodes) => set({ selectedNodes }),
  setIsCreatingEdge: (isCreatingEdge) => set({ isCreatingEdge }),
  setSourceNode: (sourceNode) => set({ sourceNode }),
  setAddNodeMode: (addNodeMode) => set({ addNodeMode }),

  // Graph manipulation
  addNode: (position) => {
    const { nodes } = get()
    const newNode: Node = {
      id: `node-${Date.now()}`,
      position,
      data: { label: `N${nodes.length + 1}` },
    }
    set({ nodes: [...nodes, newNode] })
  },

  removeNode: (nodeId) => {
    const { nodes, edges } = get()
    set({
      nodes: nodes.filter((node) => node.id !== nodeId),
      edges: edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
    })
  },

  addEdge: (source, target) => {
    const { edges } = get()
    const edgeId = `${source}-${target}`
    if (!edges.find((edge) => edge.id === edgeId)) {
      const newEdge: Edge = {
        id: edgeId,
        source,
        target,
      }
      set({ edges: [...edges, newEdge] })
    }
  },

  removeEdge: (edgeId) => {
    const { edges } = get()
    set({ edges: edges.filter((edge) => edge.id !== edgeId) })
  },

  // Generate custom graph
  generateCustomGraph: (numNodes, edgeList) => {
    const nodes: Node[] = []
    const edges: Edge[] = []

    // Create nodes in a circular layout
    const centerX = 400
    const centerY = 300
    const radius = Math.min(150, 50 + numNodes * 10)

    for (let i = 1; i <= numNodes; i++) {
      const angle = (2 * Math.PI * (i - 1)) / numNodes
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      nodes.push({
        id: i.toString(),
        position: { x, y },
        data: { label: `N${i}` },
      })
    }

    // Create edges
    edgeList.forEach(({ source, target }) => {
      const edgeId = `${source}-${target}`
      edges.push({
        id: edgeId,
        source,
        target,
      })
    })

    set({
      nodes,
      edges,
      startNode: nodes.length > 0 ? nodes[0].id : null,
      traversalState: "IDLE",
      currentStep: 0,
      steps: [],
    })
  },

  // Traversal actions
  runTraversal: () => {
    const { algorithm, startNode, nodes, edges, graphType } = get()
    if (!startNode) return

    const { steps, log } =
      algorithm === "BFS"
        ? generateBFSSteps(startNode, nodes, edges, graphType)
        : generateDFSSteps(startNode, nodes, edges, graphType)

    set({
      steps,
      traversalLog: log,
      currentStep: 0,
      traversalState: "RUNNING",
    })
  },

  stepForward: () => {
    const { currentStep, steps } = get()
    if (currentStep < steps.length - 1) {
      set({ currentStep: currentStep + 1 })
    } else {
      set({ traversalState: "COMPLETED" })
    }
  },

  stepBackward: () => {
    const { currentStep } = get()
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 })
    }
  },

  pauseTraversal: () => {
    set({ traversalState: "PAUSED" })
  },

  resetTraversal: () => {
    set({
      traversalState: "IDLE",
      currentStep: 0,
      steps: [],
      traversalLog: { visitedNodes: [], traversedEdges: [], components: [] },
    })
  },

  clearGraph: () => {
    set({
      nodes: [],
      edges: [],
      startNode: null,
      traversalState: "IDLE",
      currentStep: 0,
      steps: [],
      traversalLog: { visitedNodes: [], traversedEdges: [], components: [] },
    })
  },

  importGraph: (data) => {
    set({
      nodes: data.nodes,
      edges: data.edges,
      startNode: null,
      traversalState: "IDLE",
      currentStep: 0,
      steps: [],
      traversalLog: { visitedNodes: [], traversedEdges: [], components: [] },
    })
  },

  exportGraph: () => {
    const { nodes, edges } = get()
    return { nodes, edges }
  },
}))

// Enhanced algorithm implementations with proper step-by-step visualization
function generateBFSSteps(
  startNodeId: string,
  nodes: Node[],
  edges: Edge[],
  graphType: GraphType,
): { steps: TraversalStep[]; log: TraversalLog } {
  const steps: TraversalStep[] = []
  const globalVisited = new Set<string>()
  const allTraversedEdges: string[] = []
  const components: string[][] = []
  let globalOrderCounter = 1

  // Build adjacency list
  const adjacencyList: Record<string, string[]> = {}
  nodes.forEach((node) => {
    adjacencyList[node.id] = []
  })

  edges.forEach((edge) => {
    adjacencyList[edge.source].push(edge.target)
    if (graphType === "undirected") {
      adjacencyList[edge.target].push(edge.source)
    }
  })

  // Function to perform BFS on a single component
  const bfsComponent = (startNode: string) => {
    const visited = new Set<string>()
    const queue = [startNode]
    const parentMap: Record<string, string | null> = { [startNode]: null }
    const level: Record<string, number> = { [startNode]: 0 }
    const nodeOrder: Record<string, number> = {}
    const component: string[] = []

    // Add initial step - starting node
    steps.push({
      currentNode: startNode,
      visitedNodes: [],
      frontier: [startNode],
      traversedEdges: [...allTraversedEdges],
      step: steps.length + 1,
      totalSteps: 0,
      nodeOrder: {},
      parentMap: { [startNode]: null },
      level: { [startNode]: 0 },
    })

    while (queue.length > 0) {
      const currentNode = queue.shift()!

      if (!visited.has(currentNode)) {
        // Mark as visited
        visited.add(currentNode)
        globalVisited.add(currentNode)
        component.push(currentNode)
        nodeOrder[currentNode] = globalOrderCounter++

        // Handle traversed edge (if not the start node)
        if (parentMap[currentNode]) {
          const parentId = parentMap[currentNode]!
          const edgeId = `${parentId}-${currentNode}`
          allTraversedEdges.push(edgeId)
        }

        // Add current step
        steps.push({
          currentNode,
          visitedNodes: Array.from(globalVisited),
          frontier: [...queue],
          traversedEdges: [...allTraversedEdges],
          step: steps.length + 1,
          totalSteps: 0,
          nodeOrder: { ...nodeOrder },
          parentMap: { ...parentMap },
          level: { ...level },
        })

        // Add unvisited neighbors to queue
        const neighbors = adjacencyList[currentNode] || []
        neighbors.forEach((neighbor) => {
          if (!visited.has(neighbor) && !queue.includes(neighbor)) {
            queue.push(neighbor)
            if (!(neighbor in parentMap)) {
              parentMap[neighbor] = currentNode
              level[neighbor] = level[currentNode] + 1
            }
          }
        })

        // Add step showing updated frontier
        if (queue.length > 0) {
          steps.push({
            currentNode,
            visitedNodes: Array.from(globalVisited),
            frontier: [...queue],
            traversedEdges: [...allTraversedEdges],
            step: steps.length + 1,
            totalSteps: 0,
            nodeOrder: { ...nodeOrder },
            parentMap: { ...parentMap },
            level: { ...level },
          })
        }
      }
    }

    return component
  }

  // Start with the specified start node
  const firstComponent = bfsComponent(startNodeId)
  if (firstComponent.length > 0) {
    components.push(firstComponent)
  }

  // Handle remaining disconnected components
  nodes.forEach((node) => {
    if (!globalVisited.has(node.id)) {
      const component = bfsComponent(node.id)
      if (component.length > 0) {
        components.push(component)
      }
    }
  })

  // Update total steps
  steps.forEach((step) => {
    step.totalSteps = steps.length
  })

  return {
    steps,
    log: {
      visitedNodes: Array.from(globalVisited),
      traversedEdges: allTraversedEdges,
      components,
    },
  }
}

function generateDFSSteps(
  startNodeId: string,
  nodes: Node[],
  edges: Edge[],
  graphType: GraphType,
): { steps: TraversalStep[]; log: TraversalLog } {
  const steps: TraversalStep[] = []
  const globalVisited = new Set<string>()
  const allTraversedEdges: string[] = []
  const components: string[][] = []
  let globalOrderCounter = 1
  let globalTimeCounter = 0

  // Build adjacency list
  const adjacencyList: Record<string, string[]> = {}
  nodes.forEach((node) => {
    adjacencyList[node.id] = []
  })

  edges.forEach((edge) => {
    adjacencyList[edge.source].push(edge.target)
    if (graphType === "undirected") {
      adjacencyList[edge.target].push(edge.source)
    }
  })

  // Function to perform DFS on a single component
  const dfsComponent = (startNode: string) => {
    const visited = new Set<string>()
    const stack = [startNode]
    const parentMap: Record<string, string | null> = { [startNode]: null }
    const discoveryTime: Record<string, number> = {}
    const finishTime: Record<string, number> = {}
    const nodeOrder: Record<string, number> = {}
    const component: string[] = []

    // Add initial step - starting node
    steps.push({
      currentNode: startNode,
      visitedNodes: [],
      frontier: [startNode],
      traversedEdges: [...allTraversedEdges],
      step: steps.length + 1,
      totalSteps: 0,
      nodeOrder: {},
      parentMap: { [startNode]: null },
      discoveryTime: {},
      finishTime: {},
    })

    while (stack.length > 0) {
      const currentNode = stack.pop()!

      if (!visited.has(currentNode)) {
        // Mark as visited
        visited.add(currentNode)
        globalVisited.add(currentNode)
        component.push(currentNode)
        discoveryTime[currentNode] = ++globalTimeCounter
        nodeOrder[currentNode] = globalOrderCounter++

        // Handle traversed edge (if not the start node)
        if (parentMap[currentNode]) {
          const parentId = parentMap[currentNode]!
          const edgeId = `${parentId}-${currentNode}`
          allTraversedEdges.push(edgeId)
        }

        // Add current step
        steps.push({
          currentNode,
          visitedNodes: Array.from(globalVisited),
          frontier: [...stack],
          traversedEdges: [...allTraversedEdges],
          step: steps.length + 1,
          totalSteps: 0,
          nodeOrder: { ...nodeOrder },
          parentMap: { ...parentMap },
          discoveryTime: { ...discoveryTime },
          finishTime: { ...finishTime },
        })

        // Add unvisited neighbors to stack (in reverse order for consistent traversal)
        const neighbors = (adjacencyList[currentNode] || []).slice().reverse()
        neighbors.forEach((neighbor) => {
          if (!visited.has(neighbor) && !stack.includes(neighbor)) {
            stack.push(neighbor)
            if (!(neighbor in parentMap)) {
              parentMap[neighbor] = currentNode
            }
          }
        })

        // Add step showing updated frontier
        if (stack.length > 0) {
          steps.push({
            currentNode,
            visitedNodes: Array.from(globalVisited),
            frontier: [...stack],
            traversedEdges: [...allTraversedEdges],
            step: steps.length + 1,
            totalSteps: 0,
            nodeOrder: { ...nodeOrder },
            parentMap: { ...parentMap },
            discoveryTime: { ...discoveryTime },
            finishTime: { ...finishTime },
          })
        }
      }
    }

    // Set finish times
    Object.keys(discoveryTime).forEach((nodeId) => {
      finishTime[nodeId] = ++globalTimeCounter
    })

    return component
  }

  // Start with the specified start node
  const firstComponent = dfsComponent(startNodeId)
  if (firstComponent.length > 0) {
    components.push(firstComponent)
  }

  // Handle remaining disconnected components
  nodes.forEach((node) => {
    if (!globalVisited.has(node.id)) {
      const component = dfsComponent(node.id)
      if (component.length > 0) {
        components.push(component)
      }
    }
  })

  // Update total steps
  steps.forEach((step) => {
    step.totalSteps = steps.length
  })

  return {
    steps,
    log: {
      visitedNodes: Array.from(globalVisited),
      traversedEdges: allTraversedEdges,
      components,
    },
  }
}

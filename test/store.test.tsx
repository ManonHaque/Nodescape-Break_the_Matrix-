import { describe, it, expect, beforeEach } from "vitest"
import { useGraphStore } from "@/lib/store"

describe("Graph Store", () => {
  beforeEach(() => {
    useGraphStore.getState().clearGraph()
  })

  it("initializes with empty graph", () => {
    const state = useGraphStore.getState()

    expect(state.nodes).toEqual([])
    expect(state.edges).toEqual([])
    expect(state.graphType).toBe("undirected")
    expect(state.algorithm).toBe("BFS")
    expect(state.traversalState).toBe("IDLE")
  })

  it("can add nodes to the graph", () => {
    const { addNode } = useGraphStore.getState()

    addNode({ x: 100, y: 100 })

    const state = useGraphStore.getState()
    expect(state.nodes).toHaveLength(1)
    expect(state.nodes[0].position).toEqual({ x: 100, y: 100 })
    expect(state.nodes[0].data.label).toBe("Node 1")
  })

  it("can add edges between nodes", () => {
    const { addNode, addEdge } = useGraphStore.getState()

    addNode({ x: 100, y: 100 })
    addNode({ x: 200, y: 200 })

    const nodes = useGraphStore.getState().nodes
    addEdge(nodes[0].id, nodes[1].id)

    const state = useGraphStore.getState()
    expect(state.edges).toHaveLength(1)
    expect(state.edges[0].source).toBe(nodes[0].id)
    expect(state.edges[0].target).toBe(nodes[1].id)
  })

  it("can remove nodes and associated edges", () => {
    const { addNode, addEdge, removeNode } = useGraphStore.getState()

    addNode({ x: 100, y: 100 })
    addNode({ x: 200, y: 200 })

    const nodes = useGraphStore.getState().nodes
    addEdge(nodes[0].id, nodes[1].id)

    removeNode(nodes[0].id)

    const state = useGraphStore.getState()
    expect(state.nodes).toHaveLength(1)
    expect(state.edges).toHaveLength(0)
  })

  it("can export and import graph data", () => {
    const { addNode, addEdge, exportGraph, importGraph } = useGraphStore.getState()

    addNode({ x: 100, y: 100 })
    addNode({ x: 200, y: 200 })

    const nodes = useGraphStore.getState().nodes
    addEdge(nodes[0].id, nodes[1].id)

    const exported = exportGraph()

    useGraphStore.getState().clearGraph()
    expect(useGraphStore.getState().nodes).toHaveLength(0)

    importGraph(exported)

    const state = useGraphStore.getState()
    expect(state.nodes).toHaveLength(2)
    expect(state.edges).toHaveLength(1)
  })

  it("generates correct BFS traversal steps", () => {
    const { addNode, addEdge, setStartNode, runTraversal, setAlgorithm } = useGraphStore.getState()

    // Create a simple graph: A -> B -> C
    addNode({ x: 100, y: 100 })
    addNode({ x: 200, y: 100 })
    addNode({ x: 300, y: 100 })

    const nodes = useGraphStore.getState().nodes
    addEdge(nodes[0].id, nodes[1].id)
    addEdge(nodes[1].id, nodes[2].id)

    setAlgorithm("BFS")
    setStartNode(nodes[0].id)
    runTraversal()

    const state = useGraphStore.getState()
    expect(state.steps.length).toBeGreaterThan(0)
    expect(state.steps[0].currentNode).toBe(nodes[0].id)
    expect(state.traversalState).toBe("RUNNING")
  })
})

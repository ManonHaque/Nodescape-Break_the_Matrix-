"use client"

import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, beforeEach } from "vitest"
import { GraphVisualizer } from "@/components/graph-visualizer"
import { useGraphStore } from "@/lib/store"

describe("GraphVisualizer", () => {
  beforeEach(() => {
    useGraphStore.getState().clearGraph()
  })

  it("renders the graph visualizer interface", () => {
    render(<GraphVisualizer />)

    expect(screen.getByText("NodeScape")).toBeInTheDocument()
    expect(screen.getByText("Algorithm Controls")).toBeInTheDocument()
  })

  it("allows switching between BFS and DFS algorithms", () => {
    render(<GraphVisualizer />)

    const algorithmSelect = screen.getByRole("combobox")
    fireEvent.click(algorithmSelect)

    expect(screen.getByText("Breadth-First Search")).toBeInTheDocument()
    expect(screen.getByText("Depth-First Search")).toBeInTheDocument()
  })

  it("shows instructions when graph is empty", () => {
    render(<GraphVisualizer />)

    expect(screen.getByText("Get Started")).toBeInTheDocument()
    expect(screen.getByText(/Click anywhere on the canvas/)).toBeInTheDocument()
  })

  it("can toggle between directed and undirected graphs", () => {
    render(<GraphVisualizer />)

    const directedButton = screen.getByText("Directed")
    const undirectedButton = screen.getByText("Undirected")

    expect(undirectedButton).toHaveClass("bg-primary")

    fireEvent.click(directedButton)
    expect(useGraphStore.getState().graphType).toBe("directed")
  })

  it("displays node and edge count", () => {
    render(<GraphVisualizer />)

    expect(screen.getByText(/Nodes: 0 \| Edges: 0/)).toBeInTheDocument()
  })
})

import type { Node, Edge } from "reactflow"
import dagre from "dagre"

// This is a placeholder for your actual implementation
// You'll need to adapt this based on your database structure
export function parseDatabaseToERForReactFlow(database: any) {
  const nodes: Node[] = []
  const edges: Edge[] = []

  // Calculate node heights based on number of columns
  const getNodeHeight = (columns: any[]) => {
    const headerHeight = 40
    const rowHeight = 28
    const padding = 16 // 8px padding top and bottom
    return headerHeight + columns.length * rowHeight + padding
  }

  // Create nodes for each table
  if (database.tables) {
    database.tables.forEach((table: any, index: number) => {
      const columns = table.columns || []
      const nodeHeight = getNodeHeight(columns)

      nodes.push({
        id: table.id || `table-${index}`,
        type: "tableNode",
        position: { x: 0, y: index * 200 }, // Initial position, will be adjusted by layout
        data: {
          label: table.name,
          columns: columns,
          primaryKey: table.primaryKey,
        },
        style: {
          width: 200,
          height: nodeHeight,
        },
      })
    })
  }

  // Create edges for relationships
  if (database.relationships) {
    database.relationships.forEach((rel: any, index: number) => {
      edges.push({
        id: `edge-${index}`,
        source: rel.sourceTable,
        target: rel.targetTable,
        sourceHandle: rel.sourceColumn,
        targetHandle: rel.targetColumn,
        type: "smoothstep",
        animated: false,
        style: { stroke: "#555" },
        markerEnd: {
          type: "arrowclosed",
          width: 20,
          height: 20,
          color: "#555",
        },
      })
    })
  }

  // Apply automatic layout
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges)

  return { nodes: layoutedNodes, edges: layoutedEdges }
}

// Helper function to automatically layout nodes and edges using dagre
function getLayoutedElements(nodes: Node[], edges: Edge[]) {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ rankdir: "LR", ranksep: 150, nodesep: 80 })

  // Add nodes to dagre graph with their actual dimensions
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: node.style?.width || 200,
      height: node.style?.height || 150,
    })
  })

  // Add edges to dagre graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  // Calculate layout
  dagre.layout(dagreGraph)

  // Apply layout positions to nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - (node.style?.width || 200) / 2,
        y: nodeWithPosition.y - (node.style?.height || 150) / 2,
      },
    }
  })

  return { nodes: layoutedNodes, edges }
}


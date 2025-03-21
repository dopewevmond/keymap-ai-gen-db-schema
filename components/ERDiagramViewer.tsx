"use client";

import type React from "react";
import { useEffect, useState, useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
  ConnectionLineType,
} from "reactflow";
import "reactflow/dist/style.css";
import { parseDatabaseToERForReactFlow } from "@/lib/er-reactflow";
import TableNode from "@/components/TableNode";
import { DatabaseForReactFlow } from "@/lib/dbml-convert";

interface Props {
  database: DatabaseForReactFlow;
}

const nodeTypes = {
  tableNode: TableNode,
};

const ERDiagramViewer: React.FC<Props> = ({ database }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLayouting, setIsLayouting] = useState(false);

  useEffect(() => {
    if (!database) return;

    try {
      setIsLayouting(true);
      const { nodes: flowNodes, edges: flowEdges } =
        parseDatabaseToERForReactFlow(database);

      setNodes(flowNodes);
      setEdges(flowEdges);
    } catch (error) {
      console.error("Error parsing database:", error);
    } finally {
      setIsLayouting(false);
    }
  }, [database, setNodes, setEdges]);

  // Handle node drag stopping - you could add custom logic here
  const onNodeDragStop = useCallback(() => {
    // Optional: Save node positions or trigger other actions
  }, []);

  return (
    <div className="w-full h-[600px] bg-background border rounded-md">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={onNodeDragStop}
        connectionLineType={ConnectionLineType.SmoothStep}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
      >
        <Controls />
        <MiniMap />
        <Background color="#f2f7fa" gap={16} />
        {isLayouting && (
          <Panel position="top-center">
            <div className="bg-background/80 p-2 rounded-md shadow-sm">
              <p className="text-sm">Applying layout...</p>
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};

export default ERDiagramViewer;

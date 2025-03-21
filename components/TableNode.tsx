"use client";

import { ColumnForReactFlow } from "@/lib/dbml-convert";
import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";

interface TableNodeData {
  label: string;
  columns: ColumnForReactFlow[];
}

const TableNode = ({ data }: NodeProps<TableNodeData>) => {
  const rowHeight = 28;
  return (
    <div className="bg-card border rounded-md shadow-sm overflow-visible">
      <div className="bg-primary text-primary-foreground font-medium p-2 text-center">
        {data.label}
      </div>
      <div className="p-2">
        {data.columns.map((column, index) => {
          return (
            <div
              key={index}
              className="flex items-center justify-between py-1 border-b border-border/50 last:border-0"
              style={{ height: `${rowHeight}px`, position: "relative" }}
            >
              <div className="flex items-center">
                {column.isPrimaryKey && (
                  <span className="mr-1 text-amber-500 text-[0.5rem] font-bold">
                    PK
                  </span>
                )}
                {column.isForeignKey && (
                  <span className="mr-1 text-blue-500 text-[0.5rem] font-bold">
                    FK
                  </span>
                )}
                <span className="text-sm">{column.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {column.type}
              </span>

              {column.isPrimaryKey && (
                <Handle
                  id={column.name}
                  type="source"
                  position={Position.Right}
                  className="w-2 h-2"
                  style={{
                    background: "#f59e0b",
                    top: "50%",
                    transform: "translateY(-50%)",
                    right: -15,
                    zIndex: 10,
                  }}
                />
              )}

              {column.isForeignKey && (
                <Handle
                  id={column.name}
                  type="target"
                  position={Position.Left}
                  className="w-2 h-2"
                  style={{
                    background: "#3b82f6",
                    top: "50%",
                    transform: "translateY(-50%)",
                    left: -15,
                    zIndex: 10,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(TableNode);

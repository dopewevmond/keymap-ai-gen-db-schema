import Database from "@dbml/core/types/model_structure/database";

export type ColumnForReactFlow = {
  name: string;
  type: string;
  isForeignKey: boolean;
  isPrimaryKey: boolean;
};

export type TableForReactFlow = {
  id: string;
  name: string;
  columns: ColumnForReactFlow[];
};

export type RelationshipForReactFlow = {
  sourceTable: string;
  sourceColumn: string;
  targetTable: string;
  targetColumn: string;
};

export type DatabaseForReactFlow = {
  tables: TableForReactFlow[];
  relationships: RelationshipForReactFlow[];
};

export function convertDBMLToReactFlowFormat(dbml: Database) {
  const tables: TableForReactFlow[] = [];
  const relationships: RelationshipForReactFlow[] = [];

  dbml.export().schemas.forEach((schema) => {
    schema.tables.forEach((table) => {
      tables.push({
        id: table.name,
        name: table.name,
        columns: table.fields.map((field) => ({
          name: field.name,
          type: field.type.type_name,
          isPrimaryKey: Boolean(field.pk),
          isForeignKey: false,
        })),
      });
    });

    // Process relationships
    schema.refs.forEach((ref) => {
      const source = ref.endpoints.find((r) => r.relation === "1")!;
      const target = ref.endpoints.find((r) => r.relation === "*")!;

      relationships.push({
        sourceTable: source.tableName,
        targetTable: target.tableName,
        sourceColumn: source.fieldNames[0],
        targetColumn: target.fieldNames[0],
      });

      // Mark foreign keys
      const targetTable = tables.find((t) => t.id === target.tableName);
      if (targetTable) {
        const targetColumn = targetTable.columns.find(
          (col) => col.name === target.fieldNames[0]
        );
        if (targetColumn) {
          targetColumn.isForeignKey = true;
        }
      }
    });
  });

  return { tables, relationships };
}

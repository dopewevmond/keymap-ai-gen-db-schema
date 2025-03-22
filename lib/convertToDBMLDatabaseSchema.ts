import {
  DatabaseForReactFlow,
  DatabaseSchema,
  FieldsDictionary,
  Ref,
  Table,
  TableConstraintsDictionary,
} from "./types";

export function convertToDBMLDatabaseSchema(
  db: DatabaseForReactFlow
): DatabaseSchema {
  const tables: Table[] = db.tables.map((table) => ({
    name: table.name,
    schemaName: "", // Assuming no schema separation
    note: { value: "" }, // No note information provided
  }));

  const fields: FieldsDictionary = {};
  const tableConstraints: TableConstraintsDictionary = {};
  const refs: Ref[] = [];

  db.tables.forEach((table) => {
    const tableKey = `${table.name}`;

    fields[tableKey] = table.columns.map((column) => ({
      name: column.name,
      type: { type_name: column.type, schemaName: null },
      dbdefault: null, // No default values provided
      not_null: column.isPrimaryKey, // Assume primary keys are not null
      increment: false, // No info on auto-increment
      note: { value: "" }, // No column-specific notes provided
    }));

    // Process constraints
    tableConstraints[tableKey] = {};
    table.columns.forEach((column) => {
      if (column.isPrimaryKey) {
        tableConstraints[tableKey][column.name] = { pk: true };
      }
    });
  });

  // Convert relationships into foreign key references
  db.relationships.forEach((rel) => {
    refs.push({
      name: `${rel.sourceTable}_${rel.sourceColumn}_to_${rel.targetTable}_${rel.targetColumn}`,
      endpoints: [
        {
          tableName: rel.targetTable,
          schemaName: "",
          fieldNames: [rel.targetColumn],
          relation: "*",
        },
        {
          tableName: rel.sourceTable,
          schemaName: "",
          fieldNames: [rel.sourceColumn],
          relation: "1",
        },
      ],
      onDelete: null,
      onUpdate: null,
    });
  });

  return {
    tables,
    fields,
    enums: [], // No enum data available
    tableConstraints,
    refs,
    indexes: {}, // No index information provided
  };
}

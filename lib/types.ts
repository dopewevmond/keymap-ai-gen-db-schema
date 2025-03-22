import { z } from "zod";

// types
export type TokenPayloadType = {
  _id: string;
  username: string;
};

export type AnonymousLoginResponse = {
  _id: string;
  username: string;
};

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

export type ParsedOpenAIStructuredResponse = {
  databaseSchema: DatabaseForReactFlow;
  message: {
    content: string;
    _id: string;
  };
  title: string;
};


// zod schemas
const ColumnForReactFlowSchema = z.object({
  name: z.string(),
  type: z.string(),
  isForeignKey: z.boolean(),
  isPrimaryKey: z.boolean(),
});

const TableForReactFlowSchema = z.object({
  id: z.string(),
  name: z.string(),
  columns: z.array(ColumnForReactFlowSchema),
});

const RelationshipForReactFlowSchema = z.object({
  sourceTable: z.string(),
  sourceColumn: z.string(),
  targetTable: z.string(),
  targetColumn: z.string(),
});

export const DatabaseForReactFlowSchema = z.object({
  tables: z.array(TableForReactFlowSchema),
  relationships: z.array(RelationshipForReactFlowSchema),
});

const MessageSchema = z.object({
  role: z.string(),
  content: z.string(),
});

export const AIRequestTypeSchema = z.object({
  messages: z.array(MessageSchema),
  databaseSchema: DatabaseForReactFlowSchema.optional(),
  conversationId: z.string(),
});

export const AIResponseTypeSchema = z.object({
  databaseSchema: DatabaseForReactFlowSchema,
  title: z.string(),
  message: z.object({
    content: z.string(),
    _id: z.string(),
  }),
});




// types for convertToDBMLDatabaseSchema
export interface NoteInfo {
  value: string;
}

export interface TypeInfo {
  type_name: string;
  schemaName: string | null;
}

type DefaultType = 'string' | 'number' | 'boolean' | 'expression';

export interface DefaultInfo {
  type: DefaultType,
  value: string;
}

export interface Field {
  name: string;
  type: TypeInfo;
  dbdefault: DefaultInfo | null;
  not_null: boolean;
  increment: boolean;
  note: NoteInfo;
}

export interface Table {
  name: string;
  schemaName: string;
  note: NoteInfo;
}

export interface FieldsDictionary {
  [key: string]: Field[]; // Represents fields within tables, indexed by schemaName.tableName
}

export interface TableConstraint {
  [fieldName: string]: {
    pk?: boolean;
    unique?: boolean;
  };
}

export interface TableConstraintsDictionary {
  [tableIdentifier: string]: TableConstraint; // Represents constraints within tables, indexed by schemaName.tableName
}

export interface RefEndpoint {
  tableName: string; // Parent table or child table
  schemaName: string;
  fieldNames: string[]; // The parent fields or the child fields (foreign key fields)
  relation: '*' | '1'; // The parent endpoint is '*' and the child endpoint is '1'
}

export interface Ref {
  name: string;
  endpoints: RefEndpoint[]; // The first endpoint is the parent table and the second endpoint is the child table.
  onDelete: string | null;
  onUpdate: string | null;
}

export interface EnumValue {
  name: string;
}

export interface Enum {
  name: string;
  schemaName: string;
  values: EnumValue[];
}

export interface IndexColumn {
  type: 'column' | 'expression';
  value: string;
}

export interface Index {
  name: string;
  type: string;
  unique?: boolean,
  pk?: boolean,
  columns: IndexColumn[];
}

export interface IndexesDictionary {
  [tableIdentifier: string]: Index[]; // Represents indexes within tables, indexed by schemaName.tableName
}

export interface DatabaseSchema {
  tables: Table[];
  fields: FieldsDictionary;
  enums: Enum[];
  tableConstraints: TableConstraintsDictionary;
  refs: Ref[];
  indexes: IndexesDictionary; // Represents the indexes property
}


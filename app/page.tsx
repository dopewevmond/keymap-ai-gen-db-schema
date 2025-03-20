"use client";
import { useState } from "react";
import { ArrowUp, Leaf, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import ERDiagramViewer from "@/components/ERDiagramViewer";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  return (
    <div className="w-full bg-white overflow-hidden flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <Leaf className="h-5 w-5" />
          <span className="font-medium text-lg">KeyMap</span>
        </div>
        <div className="flex items-center gap-4">
          <Menu className="h-5 w-5 text-gray-500" />
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
        {messages?.length > 0 ? (
          <>
            <div className="flex-1 w-full text-center flex items-center justify-center">
              <ERDiagramViewer database={exampleDatabase} />
            </div>

            <div className="space-y-6 mb-2.5">
              <p
                className={cn(
                  "text-center px-5 py-2.5 rounded-2xl leading-[150%] text-[#0D0D0D]",
                  true ? "bg-transparent" : "bg-[#E8E8E880]/50"
                )}
              >
                Yes, but employees have different roles.
              </p>
              <p className="text-center px-5 py-2.5 rounded-2xl leading-[150%] text-[#0D0D0D] bg-[#E8E8E880]">
                Yes, but employees have different roles.
              </p>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-medium mb-2">
              Welcome, <span className="italic">User</span>.
            </h1>
            <p className="text-xl text-gray-500">What are we building today?</p>
          </>
        )}
      </main>

      <div className="px-6 pb-6 flex justify-center">
        <div className="relative w-full max-w-2xl">
          <Textarea
            placeholder="Ask anything"
            className="pr-12 py-6 rounded-xl border-gray-200"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white rounded-full p-2"
            aria-label="Submit"
            onClick={() => setMessages([inputValue])}
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

const exampleDatabase = {
  tables: [
    {
      id: "users",
      name: "Users",
      columns: [
        { name: "id", type: "uuid", isPrimaryKey: true },
        { name: "username", type: "varchar(50)" },
        { name: "email", type: "varchar(100)" },
        { name: "created_at", type: "timestamp" },
      ],
      primaryKey: "id",
    },
    {
      id: "posts",
      name: "Posts",
      columns: [
        { name: "id", type: "uuid", isPrimaryKey: true },
        { name: "title", type: "varchar(100)" },
        { name: "content", type: "text" },
        { name: "user_id", type: "uuid", isForeignKey: true },
        { name: "created_at", type: "timestamp" },
      ],
      primaryKey: "id",
    },
    {
      id: "comments",
      name: "Comments",
      columns: [
        { name: "id", type: "uuid", isPrimaryKey: true },
        { name: "content", type: "text" },
        { name: "user_id", type: "uuid", isForeignKey: true },
        { name: "post_id", type: "uuid", isForeignKey: true },
        { name: "created_at", type: "timestamp" },
      ],
      primaryKey: "id",
    },
  ],
  relationships: [
    {
      sourceTable: "users",
      targetTable: "posts",
      sourceColumn: "id",
      targetColumn: "user_id",
      type: "1:N",
    },
    {
      sourceTable: "users",
      targetTable: "comments",
      sourceColumn: "id",
      targetColumn: "user_id",
      type: "1:N",
    },
    {
      sourceTable: "posts",
      targetTable: "comments",
      sourceColumn: "id",
      targetColumn: "post_id",
      type: "1:N",
    },
  ],
};

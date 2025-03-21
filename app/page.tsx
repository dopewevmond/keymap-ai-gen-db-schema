"use client";
import { useState } from "react";
import { ArrowUp, Leaf, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import ERDiagramViewer from "@/components/ERDiagramViewer";
import { Parser } from "@dbml/core";
import { convertDBMLToReactFlowFormat } from "@/lib/dbml-convert";

const parser = new Parser();

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<string[]>([""]);
  const dbml = parser.parse(dbmlContent, "dbml");
  const transformedDatabase = convertDBMLToReactFlowFormat(dbml);

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
              <ERDiagramViewer database={transformedDatabase} />
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

const dbmlContent = `
Table follows {
  following_user_id integer
  followed_user_id integer
  created_at timestamp 
}

Table users {
  id integer [primary key]
  username varchar
  role varchar
  created_at timestamp
}

Table posts {
  id integer [primary key]
  title varchar
  body text [note: 'Content of the post']
  user_id integer [not null]
  status varchar
  created_at timestamp
}

Ref user_posts: posts.user_id > users.id // many-to-one

Ref: users.id < follows.following_user_id

Ref: users.id < follows.followed_user_id
`;

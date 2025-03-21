"use client";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import ERDiagramViewer from "@/components/ERDiagramViewer";
import { ArrowUp } from "lucide-react";
import { Parser } from "@dbml/core";
import { convertDBMLToReactFlowFormat } from "@/lib/dbml-convert";

const parser = new Parser();

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<string[]>([""]);

  const dbml = parser.parse(dbmlContent, "dbml");
  const transformedDatabase = convertDBMLToReactFlowFormat(dbml);
  return (
    <>
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
    </>
  );
};

export default Home;
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

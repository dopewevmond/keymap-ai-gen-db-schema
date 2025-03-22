"use client";
// import React, { Usable, useContext, useEffect, useRef, useState } from "react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import ERDiagramViewer from "@/components/ERDiagramViewer";
import { convertToDBMLDatabaseSchema } from "@/lib/convertToDBMLDatabaseSchema";
import { MessageContext } from "@/components/ReactQueryClientWrapper";
import ChatInput from "@/components/ChatInput";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { importer, exporter } from "@dbml/core";
import { DatabaseForReactFlow } from "@/lib/types";

// type ChatPageProps = {
//   params: {
//     id: string;
//   };
// };
type Message = {
  _id: string;
  role: "system" | "user" | "assistant";
  content: string;
};

type AIRequestType = {
  messages: Message[];
  databaseSchema?: DatabaseForReactFlow;
};

type ParsedOpenAIContent = {
  databaseSchema: DatabaseForReactFlow;
  message: {
    content: string;
    _id: string;
  };
};
type AIResponseType = {
  role: "system" | "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  // export default function ChatPage({ params }: ChatPageProps) {
  // const unwrappedParams = React.use(
  //   params as unknown as Usable<{ id: string }>
  // );

  const [messages, setMessages] = useState<Message[]>([]);
  const { message } = useContext(MessageContext);
  const [databaseSchema, setDatabaseSchema] = useState<
    DatabaseForReactFlow | undefined
  >();

  const { status, mutate } = useMutation({
    mutationFn: (data: AIRequestType) =>
      axios.post<AIResponseType>("/api/chat", data).then((r) => r.data),
    onSuccess(data) {
      const structuredOutput = JSON.parse(data?.content) as ParsedOpenAIContent;
      setDatabaseSchema(structuredOutput.databaseSchema);
      setMessages((msgs) => [
        ...msgs,
        {
          _id: structuredOutput.message._id,
          content: structuredOutput.message.content,
          role: "assistant",
        },
      ]);
    },
  });

  const sendNewMessage = (content: string) => {
    const _id = crypto.randomUUID();
    const newMessagePayload: Message[] = [
      ...messages,
      { _id, content, role: "user" },
    ];
    setMessages(newMessagePayload);
    mutate({ messages: newMessagePayload, databaseSchema });
  };

  const sendNewMessageRef = useRef<typeof sendNewMessage | null>(
    sendNewMessage
  );

  useEffect(() => {
    if (message && messages.length === 0) {
      if (!sendNewMessageRef.current) return;
      sendNewMessageRef.current(message);
    }
    if (!message && messages.length === 0) {
      // implement fn to fetch data for conversation
    }
  }, [sendNewMessageRef, message, messages.length]);

  const handleConvertToSQL = () => {
    try {
      if (!databaseSchema) return;
      const databaseSchemaObject = convertToDBMLDatabaseSchema(databaseSchema);
      const dbmlObj = importer.generateDbml(databaseSchemaObject);
      const sql = exporter.export(dbmlObj, "mysql");
      console.log({ sql });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
        <div className="flex-1 w-full text-center flex items-center justify-center">
          {status == "pending" ? (
            <Loader2 className="animate-spin" />
          ) : databaseSchema != null ? (
            <ERDiagramViewer database={databaseSchema} />
          ) : null}
          {status === "error" && (
            <p>
              A connection error occurred. Please click{" "}
              <Link href="/" className="underline underline-offset-4">
                here
              </Link>{" "}
              to retry
            </p>
          )}
        </div>

        <div className="space-y-6 mb-2.5">
          {messages.slice(messages.length - 2).map((msg) => (
            <p
              key={msg._id}
              className={cn(
                "text-left max-w-xl px-5 py-2.5 rounded-2xl leading-[150%] text-[#0D0D0D] whitespace-pre-wrap",
                msg.role === "assistant"
                  ? "bg-transparent"
                  : "bg-[#E8E8E880]/50"
              )}
            >
              {msg.content}
            </p>
          ))}
        </div>
      </main>

      <ChatInput handleSubmit={(e) => sendNewMessage(e)} />
    </>
  );
}

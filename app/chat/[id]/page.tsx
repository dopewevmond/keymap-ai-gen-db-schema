"use client";
// import React, { Usable, useContext, useEffect, useRef, useState } from "react";
import React, { Usable, useContext, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import ERDiagramViewer from "@/components/ERDiagramViewer";
import { convertToDBMLDatabaseSchema } from "@/lib/convertToDBMLDatabaseSchema";
import { AppContext } from "@/components/ReactQueryClientWrapper";
import ChatInput from "@/components/ChatInput";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, Terminal } from "lucide-react";
import Link from "next/link";
import { importer, exporter } from "@dbml/core";
import {
  DatabaseForReactFlow,
  ParsedOpenAIStructuredResponse,
} from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Message = {
  _id: string;
  role: "system" | "user" | "assistant";
  content: string;
};

type AIRequestType = {
  messages: Message[];
  databaseSchema?: DatabaseForReactFlow;
  conversationId: string;
};

type AIResponseType = {
  role: "system" | "user" | "assistant";
  content: string;
};

type ConversationResponseType = {
  userId: string;
  messages: Message[];
  databaseSchema: string;
  title: string;
};

type ChatPageProps = {
  params: {
    id: string;
  };
};

const convertDatabaseSchemaToSQL = (
  databaseSchema: DatabaseForReactFlow | undefined
) => {
  try {
    if (!databaseSchema)
      throw new Error("Please pass a database schema object to convert");
    const databaseSchemaObject = convertToDBMLDatabaseSchema(databaseSchema);
    const dbmlObj = importer.generateDbml(databaseSchemaObject);
    const sql = exporter.export(dbmlObj, "mysql");
    return sql;
  } catch (err) {
    console.error(err);
    return "";
  }
};

export default function ChatPage({ params }: ChatPageProps) {
  const unwrappedParams = React.use(
    params as unknown as Usable<{ id: string }>
  );

  const [messages, setMessages] = useState<Message[]>([]);
  const {
    message,
    loggedInUserId,
    setProjectTitle,
    setMessage,
    setSQLContent,
  } = useContext(AppContext);
  const [databaseSchema, setDatabaseSchema] = useState<
    DatabaseForReactFlow | undefined
  >();

  const { status: mutateConversationStatus, mutate } = useMutation({
    mutationFn: (data: AIRequestType) =>
      axios.post<AIResponseType>("/api/chat", data).then((r) => r.data),
    onSuccess(data) {
      const structuredOutput = JSON.parse(
        data?.content
      ) as ParsedOpenAIStructuredResponse;
      if (messages.length === 1) {
        setProjectTitle(structuredOutput.title);
      }
      setDatabaseSchema(structuredOutput.databaseSchema);
      setSQLContent(
        convertDatabaseSchemaToSQL(structuredOutput.databaseSchema)
      );
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

  const {
    data: conversationQueryData,
    status: conversationQueryStatus,
    isFetching: isConversationQueryFetching,
  } = useQuery({
    enabled: !message && messages.length === 0,
    queryKey: ["conversations", unwrappedParams.id],
    queryFn: () =>
      axios
        .get<ConversationResponseType>(
          `/api/conversations/${unwrappedParams.id}`
        )
        .then(({ data }) => {
          setMessages(data.messages);
          setProjectTitle(data.title);
          try {
            const schema = JSON.parse(data.databaseSchema);
            setDatabaseSchema(schema);
            setSQLContent(convertDatabaseSchemaToSQL(schema));
          } catch (err) {
            console.log(err);
          } finally {
            return data;
          }
        }),
  });

  const sendNewMessage = (content: string) => {
    const _id = crypto.randomUUID();
    const newMessagePayload: Message[] = [
      ...messages,
      { _id, content, role: "user" },
    ];
    setMessages(newMessagePayload);
    mutate({
      messages: newMessagePayload,
      databaseSchema,
      conversationId: unwrappedParams.id,
    });
  };

  const sendNewMessageRef = useRef<typeof sendNewMessage | null>(
    sendNewMessage
  );

  useEffect(() => {
    if (message && messages.length === 0) {
      if (!sendNewMessageRef.current) return;
      sendNewMessageRef.current(message);
    }
  }, [
    sendNewMessageRef,
    message,
    messages.length,
    setProjectTitle,
    setMessage,
  ]);

  return (
    <>
      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
        <div className="flex-1 w-full text-center flex items-center justify-center">
          {/* should only show large loading spinner when it's the first response */}
          {(messages.length < 2 && mutateConversationStatus == "pending") ||
          isConversationQueryFetching ? (
            <Loader2 className="animate-spin" />
          ) : databaseSchema != null ? (
            <ERDiagramViewer database={databaseSchema} />
          ) : null}
          {mutateConversationStatus === "error" && (
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

      {conversationQueryStatus === "success" &&
      conversationQueryData?.userId !== loggedInUserId ? (
        <div className="px-6 pb-6 flex justify-center">
          <Alert className="w-fit">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Alert</AlertTitle>
            <AlertDescription>
              This schema can only be edited by its creator.
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <ChatInput
          isSubmitting={mutateConversationStatus === "pending"}
          handleSubmit={(e) => sendNewMessage(e)}
        />
      )}
    </>
  );
}

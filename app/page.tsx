"use client";
import ChatInput from "@/components/ChatInput";
import { AppContext } from "@/components/ReactQueryClientWrapper";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { flushSync } from "react-dom";

export default function Index() {
  const router = useRouter();
  const { setMessage, username, setProjectTitle } = useContext(AppContext);
  const handleSubmit = async (value: string) => {
    flushSync(() => {
      setMessage(value);
      setProjectTitle("");
    });
    const uuid = crypto.randomUUID();
    router.push(`/chat/${uuid}`);
  };

  return (
    <>
      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
        <h1 className="text-2xl font-medium mb-2">
          Welcome, <span className="italic">User</span>{" "}
          <span className="text-purple-900">({username})</span>.
        </h1>
        <p className="text-xl text-gray-500">What are we building today?</p>
      </main>

      <ChatInput isSubmitting={false} handleSubmit={handleSubmit} />
    </>
  );
}

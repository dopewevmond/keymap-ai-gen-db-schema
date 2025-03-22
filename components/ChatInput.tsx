"use client";
import React, { useRef } from "react";
import { Textarea } from "./ui/textarea";
import { ArrowUp } from "lucide-react";

type Props = {
  handleSubmit: (value: string) => void;
};

const ChatInput = (props: Props) => {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputRef.current || inputRef.current.value.trim() === "") return;
    const content = inputRef.current.value.trim();
    inputRef.current.value = "";
    props.handleSubmit(content);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(new Event("submit") as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <div className="px-6 pb-6 flex justify-center">
      <form onSubmit={onSubmit} className="relative w-full max-w-2xl">
        <Textarea
          placeholder="Ask anything"
          className="pr-12 py-6 rounded-xl border-gray-200"
          onKeyDown={onKeyDown}
          ref={inputRef}
        />
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white rounded-full p-2"
          aria-label="Submit"
          type="submit"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;

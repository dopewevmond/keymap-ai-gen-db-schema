"use client";
import React, { createContext, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export type MessageContextType = {
  message: string;
  setMessage: (newMessage: string) => void;
};

export const MessageContext = createContext<MessageContextType>({
  message: "",
  setMessage: () => {},
});

const queryClient = new QueryClient();

type Props = {
  children: React.ReactNode;
};

const ReactQueryClientWrapper = (props: Props) => {
  const [message, setMessage] = useState<string>("");

  return (
    <QueryClientProvider client={queryClient}>
      <MessageContext.Provider value={{ message, setMessage }}>
        {props.children}
      </MessageContext.Provider>
    </QueryClientProvider>
  );
};

export default ReactQueryClientWrapper;

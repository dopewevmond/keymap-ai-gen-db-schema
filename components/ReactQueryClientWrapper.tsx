"use client";
import React, { createContext, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export type MessageContextType = {
  message: string;
  setMessage: (newMessage: string) => void;
  username: string;
  setUsername: (username: string) => void;
};

export const AppContext = createContext<MessageContextType>({
  message: "",
  setMessage: () => {},
  username: "",
  setUsername: () => {},
});

const queryClient = new QueryClient();

type Props = {
  children: React.ReactNode;
};

const ReactQueryClientWrapper = (props: Props) => {
  const [message, setMessage] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider
        value={{ message, username, setMessage, setUsername }}
      >
        {props.children}
      </AppContext.Provider>
    </QueryClientProvider>
  );
};

export default ReactQueryClientWrapper;

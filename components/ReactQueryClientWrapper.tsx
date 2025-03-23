"use client";
import React, { createContext, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export type MessageContextType = {
  message: string;
  setMessage: (newMessage: string) => void;
  username: string;
  setUsername: (username: string) => void;
  loggedInUserId: string;
  setLoggedInUserId: (loggedInUserId: string) => void;
  projectTitle: string;
  setProjectTitle: (title: string) => void;
  sqlContent: string;
  setSQLContent: (sqlContent: string) => void;
};

export const AppContext = createContext<MessageContextType>({
  message: "",
  setMessage: () => {},
  username: "",
  setUsername: () => {},
  projectTitle: "",
  setProjectTitle: () => {},
  loggedInUserId: "",
  setLoggedInUserId: () => {},
  sqlContent: "",
  setSQLContent: () => {},
});

const queryClient = new QueryClient();

type Props = {
  children: React.ReactNode;
};

const ReactQueryClientWrapper = (props: Props) => {
  const [loggedInUserId, setLoggedInUserId] = useState("");
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [sqlContent, setSQLContent] = useState("");

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider
        value={{
          message,
          loggedInUserId,
          username,
          projectTitle,
          sqlContent,
          setMessage,
          setUsername,
          setProjectTitle,
          setLoggedInUserId,
          setSQLContent,
        }}
      >
        {props.children}
      </AppContext.Provider>
    </QueryClientProvider>
  );
};

export default ReactQueryClientWrapper;

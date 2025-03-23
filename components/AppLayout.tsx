"use client";
import React, { useContext, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { AnonymousLoginResponse } from "@/lib/types";
import ProjectsList from "@/components/ProjectsList";
import { Loader2 } from "lucide-react";
import { AppContext } from "./ReactQueryClientWrapper";

type Props = {
  children: React.ReactNode;
};

export default function AppLayout(props: Props) {
  const [isProjectsListOpen, setIsProjectsListOpen] = useState(false);
  const { setUsername, setLoggedInUserId } = useContext(AppContext);
  const { mutate: authenticateUser, data } = useMutation({
    mutationFn: () =>
      axios
        .post<AnonymousLoginResponse>("/api/anonymous-login")
        .then((r) => r.data),
    onSuccess: (data) => {
      setUsername(data.username);
      setLoggedInUserId(data._id);
    },
  });
  useEffect(() => {
    authenticateUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full bg-white overflow-hidden flex flex-col min-h-screen relative">
      {data ? (
        <>
          <Navbar
            isProjectsListOpen={isProjectsListOpen}
            toggleProjectListOpen={() => setIsProjectsListOpen((curr) => !curr)}
          />
          {isProjectsListOpen ? <ProjectsList projects={[]} /> : props.children}
        </>
      ) : (
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex flex-col items-center justify-center gap-2">
          <Loader2 className="animate-spin self-center justify-self-center" />
          <p>logging you in...</p>
        </div>
      )}
    </div>
  );
}

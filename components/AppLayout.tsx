"use client";
import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { AnonymousLoginResponse } from "@/lib/types";
import ProjectsList from "@/components/ProjectsList";

type Props = {
  children: React.ReactNode;
};

export default function AppLayout(props: Props) {
  const [isProjectsListOpen, setIsProjectsListOpen] = useState(false);
  const { mutate: authenticateUser } = useMutation({
    mutationFn: () =>
      axios
        .post<AnonymousLoginResponse>("/api/anonymous-login")
        .then((r) => r.data),
  });
  useEffect(() => {
    authenticateUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full bg-white overflow-hidden flex flex-col min-h-screen relative">
      <Navbar
        isProjectsListOpen={isProjectsListOpen}
        toggleProjectListOpen={() => setIsProjectsListOpen((curr) => !curr)}
      />
      {isProjectsListOpen ? <ProjectsList projects={[]} /> : props.children}
    </div>
  );
}

"use client";
import Home from "@/components/Home";
import Navbar from "@/components/Navbar";
import ProjectsList from "@/components/ProjectsList";

import { useState } from "react";

const projects = [
  { slug: "project-alpha", title: "Project Alpha" },
  { slug: "project-beta", title: "Project Beta" },
  { slug: "project-gamma", title: "Project Gamma" },
  { slug: "project-delta", title: "Project Delta" },
  { slug: "project-epsilon", title: "Project Epsilon" },
];

export default function Index() {
  const [isProjectsListOpen, setIsProjectsListOpen] = useState(false);
  return (
    <div className="w-full bg-white overflow-hidden flex flex-col min-h-screen relative">
      <Navbar />
      {isProjectsListOpen ? (
        <ProjectsList projects={projects} />
      ) : (
        <>
          <Home />
        </>
      )}
    </div>
  );
}

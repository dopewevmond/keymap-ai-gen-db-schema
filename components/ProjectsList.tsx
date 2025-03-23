"use client";
import React from "react";
import { Loader2, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Project = {
  _id: string;
  title: string;
};

type Props = {
  closeProjectsList: () => void;
};

const ProjectsList = (props: Props) => {
  const { data, status } = useQuery({
    queryKey: ["projects"],
    queryFn: () => axios.get<Project[]>("/api/projects").then((r) => r.data),
  });
  const pathname = usePathname();
  const pattern = /\/chat\/([^\/]+)(\/.*)?/;
  const match = pathname.match(pattern);

  return (
    <section className="flex-1 flex flex-col h-full overflow-hidden items-center justify-between p-6 gap-8 relative">
      <div className="h-full max-h-[70vh] w-full overflow-y-auto">
        {status === "pending" ? (
          <div className="flex flex-col gap-2 items-center justify-center">
            <Loader2 className="animate-spin" />
            <p>loading projects...</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-5">
            {data?.map((project) => (
              <li key={project._id} className="text-center">
                <Link
                  onClick={props.closeProjectsList}
                  href={`/chat/${project._id}`}
                  className={cn(
                    "text-2xl inline-block py-4",
                    project._id === match?.[1]
                      ? "text-[#335CFF]"
                      : "text-[#0A0A0A]"
                  )}
                >
                  {project.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button className="flex items-center gap-2 px-12 py-4 bg-black text-white rounded-[100px] cursor-pointer absolute bottom-16 left-0 right-0 mx-auto w-fit">
        <Plus />
        <span className="font-medium text-lg">New Project</span>
      </button>
    </section>
  );
};

export default ProjectsList;

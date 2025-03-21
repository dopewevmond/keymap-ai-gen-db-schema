import { Plus } from "lucide-react";
import React from "react";

type Props = {
  projects: {
    slug: string;
    title: string;
  }[];
};

const ProjectsList = (props: Props) => {
  return (
    <section className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
      <ul className="flex flex-col gap-5">
        {props.projects.map((project) => (
          <li key={project.slug} className="text-2xl text-[#0A0A0A] py-5 text-center">
            {project.title}
          </li>
        ))}
      </ul>

      <button className="flex items-center gap-2 px-12 py-4 bg-black text-white rounded-[100px] cursor-pointer absolute bottom-16 left-0 right-0 mx-auto w-fit">
        <Plus />
        <span className="font-medium text-lg">New Project</span>
      </button>
    </section>
  );
};

export default ProjectsList;

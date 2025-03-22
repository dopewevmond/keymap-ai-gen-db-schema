import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import Link from "next/link";

type Props = {
  isProjectsListOpen: boolean;
  toggleProjectListOpen: () => void;
};

const Navbar = (props: Props) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b">
      <Link href='/' className="flex items-center gap-1">
        <svg className="w-8 h-8">
          <use href="/sprite.svg#logo" />
        </svg>
        <span className="font-medium text-lg">KeyMap</span>
      </Link>
      <div>
        <p className="text-[#0D0D0D]">Employee Management Database</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="w-10 h-10 flex items-center justify-center"
          onClick={props.toggleProjectListOpen}
        >
          {props.isProjectsListOpen ? (
            <X className="w-6 h-6 text-[#5D5D5D]" />
          ) : (
            <svg className="w-10 h-10">
              <use href="/sprite.svg#button-history" />
            </svg>
          )}
        </button>
        <Avatar className="h-10 w-10">
          <AvatarImage src="/avatar.png" alt="" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Navbar;

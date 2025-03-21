import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b">
      <div className="flex items-center gap-1">
        <svg className="w-8 h-8">
          <use href="/sprite.svg#logo" />
        </svg>
        <span className="font-medium text-lg">KeyMap</span>
      </div>
      <div>
        <p className="text-[#0D0D0D]">Employee Management Database</p>
      </div>
      <div className="flex items-center gap-2">
        <svg className="w-10 h-10">
          <use href="/sprite.svg#button-history" />
        </svg>
        <Avatar className="h-10 w-10">
          <AvatarImage src="/avatar.png" alt="" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Navbar;

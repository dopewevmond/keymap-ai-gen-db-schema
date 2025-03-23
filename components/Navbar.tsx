"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext, useState } from "react";
import { Check, Copy, Download, FolderOutput, X } from "lucide-react";
import { AppContext } from "./ReactQueryClientWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  isProjectsListOpen: boolean;
  toggleProjectListOpen: () => void;
};

const Navbar = (props: Props) => {
  const pathname = usePathname();
  const { projectTitle, sqlContent } = useContext(AppContext);
  const [copied, setCopied] = useState(false);
  const [isCopySQLDialogOpen, setIsCopySQLDialogOpen] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);
  const sqlFilename = projectTitle.replaceAll(" ", "_") + ".sql";

  const copyToClipboard = async () => {
    const currentUrl = window.location.href;

    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const copySqlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sqlContent);
      setSqlCopied(true);
      setTimeout(() => {
        setSqlCopied(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to copy SQL: ", err);
    }
  };

  const downloadSql = () => {
    const blob = new Blob([sqlContent], { type: "text/sql" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = sqlFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b">
      <Link href="/" className="flex items-center gap-1">
        <svg className="w-8 h-8">
          <use href="/sprite.svg#logo" />
        </svg>
        <span className="font-medium text-lg">KeyMap</span>
      </Link>
      {pathname !== "/" && (
        <div className="hidden lg:block">
          <p className="text-[#0D0D0D]">{projectTitle}</p>
        </div>
      )}
      <div className="flex items-center gap-2 lg:gap-4">
        <Dialog>
          <DropdownMenu>
            {pathname !== "/" && (
              <DropdownMenuTrigger className="flex items-center text-sm gap-2 cursor-pointer text-[#5D5D5D]">
                <FolderOutput className="w-6 h-6" />
              </DropdownMenuTrigger>
            )}
            <DropdownMenuContent>
              <DialogTrigger asChild>
                <DropdownMenuItem>Share</DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem onClick={() => setIsCopySQLDialogOpen(true)}>
                Download SQL
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share link</DialogTitle>
              <DialogDescription>
                Share this schema conversation with others by copying the URL
                below. Other users cannot make changes to it.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2 mt-4">
              <div className="grid flex-1 gap-2">
                <Input
                  id="link"
                  readOnly
                  value={
                    typeof window !== "undefined" ? window.location.href : ""
                  }
                  className="w-full"
                />
              </div>
              <Button size="sm" className="px-3" onClick={copyToClipboard}>
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span className="sr-only">Copy</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <button
          className="w-10 h-10 flex items-center justify-center cursor-pointer"
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

      <AlertDialog
        open={isCopySQLDialogOpen}
        onOpenChange={setIsCopySQLDialogOpen}
      >
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>SQL Schema</AlertDialogTitle>
            <AlertDialogDescription>
              You can copy this SQL to your clipboard or download it as a file.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="my-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">
                Filename: {sqlFilename}
              </div>
              <div className="flex gap-2 mb-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={copySqlToClipboard}
                >
                  {sqlCopied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {sqlCopied ? "Copied" : "Copy"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={downloadSql}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>

            <div className="relative w-full h-fit min-h-[400px]">
              <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[400px] absolute top-0 left-0 right-0">
                <code>{sqlContent}</code>
              </pre>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default Navbar;

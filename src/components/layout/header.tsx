
"use client";

import Link from "next/link";
import { Home, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppHeader() {

  return (
    <header className="w-full max-w-5xl mx-auto p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
      <Link href="/">
        <div className="text-3xl font-bold font-headline text-primary cursor-pointer text-center sm:text-left">
          Brain Training Hub
        </div>
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/" passHref>
          <Button variant="ghost">
            <Home className="mr-2 h-4 w-4" />
            All Games
          </Button>
        </Link>
        <Link href="/blog" passHref>
          <Button variant="ghost">
            <Newspaper className="mr-2 h-4 w-4" />
            Blog
          </Button>
        </Link>
      </div>
    </header>
  );
}

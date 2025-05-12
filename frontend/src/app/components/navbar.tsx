"use client";

import Link from "next/link";
import { Pill, Menu } from "lucide-react";
import { Logout } from "./logout";
import { useAuth } from "../providers/authprovider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const NavItems = () => (
    <>
      {isAuthenticated ? (
        <>
          <Link href="/home">
            <Button variant="ghost" className="font-medium hover:bg-primary/10">
              Home
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" className="font-medium hover:bg-primary/10">
              Profile
            </Button>
          </Link>
          <Logout />
        </>
      ) : (
        <>
          <Link href="/signin">
            <Button variant="ghost" className="font-medium hover:bg-primary/10">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="default" className="font-medium">
              Sign Up
            </Button>
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/50 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Pill className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl text-primary">RemindRx</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-2">
            <NavItems />
          </nav>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] pr-0">
              <nav className="flex flex-col gap-2 mt-12">
                <NavItems />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
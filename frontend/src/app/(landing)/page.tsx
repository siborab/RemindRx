'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/providers/authprovider"
import { useRouter } from "next/navigation"
import Signin from "../(auth)/signin/page"
import HomePage from "../(private)/home/page"


export default function Home() {
  const { isAuthenticated } = useAuth();
  return (isAuthenticated ?
    <HomePage /> : <Signin />
  );
}

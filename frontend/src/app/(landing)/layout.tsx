"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import Loading from "@/app/components/loading";
import { ReactNode } from "react";
import Navbar from "@/app/components/navbar";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const router = useRouter();

  useEffect(() => {
    async function redirectUser() {
      const response = await supabase.auth.getUser();
      let user = response.data.user;
      if (!user) {
        setLoading(false);
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
        router.push("/home");
      }
    }
    redirectUser();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
      />
      {children}
    </>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import Loading from "../components/loading";
import { ReactNode } from "react";
import { User } from "@supabase/supabase-js";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);


  const router = useRouter();

  useEffect(() => {
    async function redirectUser() {
      const response = await supabase.auth.getUser();
      if (!response.data.user) {
        router.push("/signin");
      }
      setLoading(false)
    }
    redirectUser();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
        {children}
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import Loading from "../components/loading";
import { ReactNode } from "react";
import { userAtom } from "@/lib/atoms";
import { useSetAtom } from "jotai";
import Navbar from "@/app/components/navbar";


export default function PrivateLayout({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const setAtom = useSetAtom(userAtom);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT") {
          setIsLoggedIn(false);
          router.push("/signin");
        } else if (event === "SIGNED_IN" || session) {
          setIsLoggedIn(true);
          const { data, error } = await supabase
            .from('users')
            .select('first_name, last_name')
            .eq('auth_id', session?.user?.id)
            .single();
            
          if (data) {
            setAtom({
              first_name: data.first_name || '',
              last_name: data.last_name || ''
            });
          }
        }
      }
    );

    async function redirectUser() {
      const response = await supabase.auth.getUser();
      if (!response.data.user) {
        setIsLoggedIn(false);
        router.push("/signin");
      } else {
        setIsLoggedIn(true);
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
        <Navbar
          isLoggedIn={isLoggedIn}
        />
        {children}
    </div>
  );
}
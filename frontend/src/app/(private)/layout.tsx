"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import Loading from "../components/loading";
import { ReactNode } from "react";
import { userAtom } from "@/lib/atoms";
import { useSetAtom } from "jotai";


export default function PrivateLayout({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const setAtom = useSetAtom(userAtom);

  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT") {
          router.push("/signin");
        } else if (event === "SIGNED_IN" || session) {
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
import { useSetAtom } from "jotai";
import { userAtom } from "@/lib/atoms";
import { useRouter } from 'next/navigation'
import { supabase } from "@/utils/supabase/client";

export default function Logout() {
    const setAtom = useSetAtom(userAtom);
    const router = useRouter();
    
    async function handleClick() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            setAtom({
                first_name: '',
                last_name: ''
            });
            
            router.push('/');
        } catch (err) {
            console.error("Logout failed:", err);
        }
    }

    return (
        <button
            className="px-4 py-2 bg-indigo-700 text-white rounded-lg shadow shadow-blue-300" 
            onClick={handleClick}
        >
            Logout
        </button>
    )
}
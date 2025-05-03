import { useSetAtom } from "jotai";
import { userAtom } from "@/lib/atoms";
import { useRouter } from 'next/navigation';
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useAuth } from "../providers/authprovider";

export function Logout() {
    // global state to keep track of user instance and its data from the table
    const setAtom = useSetAtom(userAtom);
    const router = useRouter();
    const { refreshAuthState } = useAuth();


    async function handleClick() {
        toast.info("Logout button clicked");

        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error('Sign out error:', error);
                toast.error('Sign out error: ' + error.message);
                return;
            }

            setAtom(null);

            await refreshAuthState();
            toast.success('Logged out successfully');

            router.push('/signin');
        } catch (err) {
            console.error("Logout failed:", err);
            toast.error("Something went wrong");
        }
    }

    return (
        <button
            className="px-4 py-2 bg-indigo-700 text-white rounded-lg shadow shadow-blue-300 cursor-pointer"
            onClick={handleClick}
            type="button"
        >
            Logout
        </button>
    );
}
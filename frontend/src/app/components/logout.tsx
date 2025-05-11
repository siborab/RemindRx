import { useSetAtom } from "jotai";
import { userAtom } from "@/lib/atoms";
import { useRouter } from 'next/navigation';
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";

export function Logout() {
    const setAtom = useSetAtom(userAtom);
    const router = useRouter();

    async function handleClick() {
        toast.info("Logout button clicked");

        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Sign out error:', error);
                toast.error('Sign out error: ' + error.message);
                return;
            }

            console.log("Before logging out");

            setAtom(null);
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
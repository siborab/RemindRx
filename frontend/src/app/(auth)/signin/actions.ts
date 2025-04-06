'use server';

import { LoginFormSchema } from "@/lib/formSchemas";
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signin (state: any, formData: FormData) {
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }
    const validatedFields = LoginFormSchema.safeParse({
        email: data.email,
        password: data.password,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors
        };
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        console.error(error);
    } else {
        redirect('/home');
    }
}
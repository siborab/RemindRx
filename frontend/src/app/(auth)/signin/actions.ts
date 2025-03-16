'use server';

import { LoginFormSchema } from "@/lib/formSchemas";

export async function signin (state: any, formData: FormData) {
    const validatedFields = LoginFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors
        };
    }
}
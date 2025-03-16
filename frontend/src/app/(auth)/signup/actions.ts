'use server';

import { SignupFormSchema } from "@/lib/formSchemas";

export async function signup (state: any, formData: FormData) {
    const validatedFields = SignupFormSchema.safeParse({
        email: formData.get('email'),
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword')
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors
        };
    }
}
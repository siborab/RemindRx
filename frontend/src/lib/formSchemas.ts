import { z } from 'zod';

export const SignupFormSchema = z.object({
    email: z.string().email({message:'Please enter a valid email'}).trim(),
    first_name: z.string().min(1, {message: "First name cannot be empty"}),
    last_name: z.string().min(1, {message: "Last name cannot be empty"}),
    password: z.string().min(1, {message: 'Password cannot be empty'}).min(6, {message: "Password must be at least 6 characters long"}),
    confirmPassword: z.string().trim()
}).superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password fields do not match.",
        path: ["confirmPassword"],
      });
    }
});

export const LoginFormSchema = z.object({
    email: z.string().email({message: "Please enter a valid email"}).trim(),
    password: z.string().trim()
})
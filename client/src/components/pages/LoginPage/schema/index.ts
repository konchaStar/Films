import { z } from "zod";

export const SignInSchema = z.object({
  email: z
    .string({ required_error: "Required field" })
    .email({ message: "Invalid email address" }),
  password: z
    .string({ required_error: "Required field" })
    .min(8, { message: "Must be 8 characters at least" }),
});

export type SignInSchemaType = z.infer<typeof SignInSchema>

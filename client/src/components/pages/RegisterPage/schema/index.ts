import { z } from "zod";

export const SignUpSchema = z
  .object({
    email: z
      .string({ required_error: "Required field" })
      .email({ message: "Invalid email address" }),
    password: z
      .string({ required_error: "Required field" })
      .min(8, { message: "Must be 8 characters at least" }),
    confirm: z.string({ required_error: "Required field" }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;

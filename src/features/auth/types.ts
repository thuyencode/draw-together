import type { LoginFormSchema, PasswordChangingFormSchema } from "./schema";
import type {
  SignUpFormStep1Schema,
  SignUpFormStep2Schema,
} from "./forms/sign-up-form/schema";
import type * as v from "valibot";

export type LoginForm = v.InferOutput<typeof LoginFormSchema>;

export type SignUpForm = Pick<
  v.InferOutput<typeof SignUpFormStep1Schema>,
  "email" | "name" | "username"
> &
  Pick<v.InferOutput<typeof SignUpFormStep2Schema>, "password">;

export type PasswordChangingForm = v.InferOutput<
  typeof PasswordChangingFormSchema
>;

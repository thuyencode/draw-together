import * as v from "valibot";
import { EmailSchema, PasswordSchema } from "../../schema";
import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from "../../constants";
import { m } from "~/paraglide/messages";

export const SignUpFormStep1Schema = v.object({
  name: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty(() => m.auth_nameRequired()),
  ),
  email: EmailSchema,
  username: v.pipe(
    v.string(),
    v.trim(),
    v.regex(/^\S*$/, () => m.auth_usernameNoWhitespace()),
    v.minLength(USERNAME_MIN_LENGTH, () =>
      m.auth_usernameMinLength({ min: USERNAME_MIN_LENGTH }),
    ),
    v.maxLength(USERNAME_MAX_LENGTH, () =>
      m.auth_usernameMaxLength({ max: USERNAME_MAX_LENGTH }),
    ),
  ),
});

export const SignUpFormStep2Schema = v.pipe(
  v.object({
    password: PasswordSchema,
    confirmPassword: PasswordSchema,
  }),
  v.forward(
    v.partialCheck(
      [["password"], ["confirmPassword"]],
      (input) => input.password === input.confirmPassword,
      () => m.auth_passwordsDoNotMatchError(),
    ),
    ["confirmPassword"],
  ),
);

export const SignUpFormMultiStepSchema = v.object({
  step1: SignUpFormStep1Schema,
  step2: SignUpFormStep2Schema,
});

export type SignUpFormMultiStep = v.InferOutput<
  typeof SignUpFormMultiStepSchema
>;

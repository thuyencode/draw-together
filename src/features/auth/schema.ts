import * as v from "valibot";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "./constants";
import { m } from "~/paraglide/messages";

const EmailSchema = v.pipe(v.string(), v.trim(), v.email());

const UsernameSchema = v.pipe(
  v.string(),
  v.trim(),
  v.regex(/^\S*$/, () => m.auth_usernameNoWhitespace()),
  v.minLength(USERNAME_MIN_LENGTH, () =>
    m.auth_usernameMinLength({ min: USERNAME_MIN_LENGTH }),
  ),
  v.maxLength(USERNAME_MAX_LENGTH, () =>
    m.auth_usernameMaxLength({ max: USERNAME_MAX_LENGTH }),
  ),
);

export const PasswordSchema = v.pipe(
  v.string(),
  v.regex(/[a-z]/, () => m.auth_passwordLowercase()),
  v.regex(/[A-Z]/, () => m.auth_passwordUppercase()),
  v.regex(/[0-9]/, () => m.auth_passwordNumber()),
  v.regex(/[^A-Za-z0-9]/, () => m.auth_passwordSpecial()),
  v.minLength(PASSWORD_MIN_LENGTH, () =>
    m.auth_passwordMinLength({ min: PASSWORD_MIN_LENGTH }),
  ),
  v.maxLength(PASSWORD_MAX_LENGTH, () =>
    m.auth_passwordMaxLength({ max: PASSWORD_MAX_LENGTH }),
  ),
);

export const LoginFormSchema = v.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export const SignUpFormSchema = v.pipe(
  v.object({
    ...LoginFormSchema.entries,
    name: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty(() => m.auth_nameRequired()),
    ),
    email: EmailSchema,
    username: UsernameSchema,
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

export type LoginForm = v.InferOutput<typeof LoginFormSchema>;
export type SignUpForm = v.InferOutput<typeof SignUpFormSchema>;

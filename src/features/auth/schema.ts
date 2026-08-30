import * as v from "valibot";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "./constants";
import { m } from "~/paraglide/messages";

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

export const EmailSchema = v.pipe(v.string(), v.trim(), v.email());

export const LoginFormSchema = v.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export const PasswordChangingFormSchema = v.pipe(
  v.object({
    currentPassword: PasswordSchema,
    newPassword: PasswordSchema,
    confirmPassword: PasswordSchema,
  }),
  v.forward(
    v.partialCheck(
      [["newPassword"], ["confirmPassword"]],
      (input) => input.newPassword === input.confirmPassword,
      () => m.auth_passwordsDoNotMatchError(),
    ),
    ["confirmPassword"],
  ),
);

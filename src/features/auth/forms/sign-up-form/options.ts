import { formOptions } from "@tanstack/solid-form";
import type { SignUpFormMultiStep } from "./schema";

export const signUpFormOpts = formOptions({
  defaultValues: {
    step1: {
      email: "",
      name: "",
      username: "",
    },
    step2: {
      password: "",
      confirmPassword: "",
    },
  } satisfies SignUpFormMultiStep,
});

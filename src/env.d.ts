import type ServerEnv from "./configs/env/schema";

declare global {
  namespace NodeJS {
    interface ProcessEnv extends ServerEnv {}
  }
}

export {};

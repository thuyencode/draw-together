// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";

const app = document.getElementById("app");

if (!app) {
  throw new Error("can't find element with the id 'app'");
}

mount(() => <StartClient />, app);

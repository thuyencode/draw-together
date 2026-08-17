import { createFileRoute } from "@tanstack/solid-router";
import { FilePlusCornerIcon } from "lucide-solid";
import { createSignal } from "solid-js";
import type { ModalContextValue } from "~/features/shared/components/ui";
import { NewDrawingForm } from "~/features/drawing-board/forms";
import { Modal } from "~/features/shared/components/ui";
import { m } from "~/paraglide/messages";

export const Route = createFileRoute("/_navbar-layout/")({
  component: HomePage,
});

function HomePage() {
  const [modalRef, setModalRef] = createSignal<ModalContextValue>();

  return (
    <main class="flex h-full flex-col items-center justify-center gap-5">
      <h1>{m.app_name()}</h1>
      <h2 class="font-light">{m.home_tagline()}</h2>

      <Modal.Provider hotkey="N" ref={setModalRef}>
        <Modal.Trigger class="btn-lg btn-primary">
          <FilePlusCornerIcon class="size-5" />
          {m.home_startDrawing()}
          <kbd class="kbd kbd-sm">N</kbd>
        </Modal.Trigger>

        <Modal.Root>
          <Modal.Box class="space-y-3">
            <h2 class="text-center text-lg font-medium">
              {m.home_createNewDrawing()}
            </h2>

            <NewDrawingForm
              class="space-y-3"
              onClose={() => modalRef()?.closeModal()}
            />
          </Modal.Box>

          <Modal.Backdrop />
        </Modal.Root>
      </Modal.Provider>
    </main>
  );
}

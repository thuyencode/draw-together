import { createFileRoute } from "@tanstack/solid-router";
import { FilePlusCornerIcon } from "lucide-solid";
import { NewDrawingForm } from "~/features/drawing-board/forms/new-drawing";
import { Modal } from "~/features/shared/components/ui";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main class="flex h-full flex-col items-center justify-center gap-5">
      <h1>Draw Together</h1>
      <h2 class="font-light">Let's go!</h2>

      <Modal.Provider hotkey="N">
        <Modal.Trigger class="btn-lg btn-primary">
          <FilePlusCornerIcon class="size-5" />
          Start drawing
          <kbd class="kbd kbd-sm">N</kbd>
        </Modal.Trigger>
        <Modal.Root>
          <Modal.Box class="space-y-4">
            <h1 class="text-center text-xl font-semibold">
              Create a new drawing
            </h1>

            <NewDrawingForm class="space-y-4">
              <div class="modal-action">
                <button class="btn btn-primary" type="submit">
                  Create
                </button>
                <Modal.Closer>Close</Modal.Closer>
              </div>
            </NewDrawingForm>
          </Modal.Box>

          <Modal.Backdrop />
        </Modal.Root>
      </Modal.Provider>
    </main>
  );
}

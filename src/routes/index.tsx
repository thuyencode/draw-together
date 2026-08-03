import { createFileRoute } from "@tanstack/solid-router";
import { FilePlusCornerIcon } from "lucide-solid";
import { NewDrawingForm } from "~/features/drawing-board/forms/new-drawing";
import { Modal } from "~/features/shared/components/ui";
import { m } from "~/paraglide/messages";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main class="flex h-full flex-col items-center justify-center gap-5">
      <h1>{m.app_name()}</h1>
      <h2 class="font-light">{m.home_tagline()}</h2>

      <Modal.Provider hotkey="N">
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

            <NewDrawingForm class="space-y-3">
              <div class="modal-action">
                <button class="btn btn-primary" type="submit">
                  {m.home_create()}
                </button>
                <Modal.Closer>{m.home_close()}</Modal.Closer>
              </div>
            </NewDrawingForm>
          </Modal.Box>

          <Modal.Backdrop />
        </Modal.Root>
      </Modal.Provider>
    </main>
  );
}

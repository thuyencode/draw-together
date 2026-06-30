import { ClientOnly } from "@tanstack/solid-router";
import { ErrorBoundary, Suspense, lazy } from "solid-js";
import { errorBoundaryFallBackProp } from "~/features/shared/components";

const DrawingBoardClient = lazy(() => import("./_drawing-board.client"));

export default function DrawingBoard() {
  return (
    <ClientOnly>
      <ErrorBoundary fallback={errorBoundaryFallBackProp}>
        <Suspense fallback={"Loading canvas..."}>
          <DrawingBoardClient />
        </Suspense>
      </ErrorBoundary>
    </ClientOnly>
  );
}

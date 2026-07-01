import { ClientOnly } from "@tanstack/solid-router";
import { ErrorBoundary, Suspense, lazy } from "solid-js";
import {
  LoadingScreen,
  errorBoundaryFallBackProp,
} from "~/features/shared/components";

const DrawingBoardClient = lazy(() => import("./_drawing-board.client"));
const fallback = <LoadingScreen message={"Loading canvas..."} />;

export default function DrawingBoard() {
  return (
    <ClientOnly fallback={fallback}>
      <ErrorBoundary fallback={errorBoundaryFallBackProp}>
        <Suspense fallback={fallback}>
          <DrawingBoardClient />
        </Suspense>
      </ErrorBoundary>
    </ClientOnly>
  );
}

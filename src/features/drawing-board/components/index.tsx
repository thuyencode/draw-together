import { ErrorBoundary, Suspense, lazy } from "solid-js";
import {
  LoadingScreen,
  errorBoundaryFallBackProp,
} from "~/features/shared/components";

const LazyDrawingBoard = lazy(() => import("./_drawing-board"));

export default function DrawingBoard() {
  return (
    <ErrorBoundary fallback={errorBoundaryFallBackProp}>
      <Suspense fallback={<LoadingScreen message={"Loading canvas..."} />}>
        <LazyDrawingBoard />
      </Suspense>
    </ErrorBoundary>
  );
}

import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { debounce, throttle } from "@solid-primitives/scheduled";
import { getTransformVals } from "../utils";
import { DEFAULT_ZOOM, ZOOM_MAX, ZOOM_MIN } from "../constants";
import type { Canvas } from "fabric";
import type { Accessor } from "solid-js";
import type { DragAndZoomSettings, Point } from "../types";

const FRAME_16_MS = 16;
const WHEEL_ZOOM_FACTOR = 0.999;
const PINCH_SLOW_DOWN = 20;
const DEBOUNCE_MS = 1000;
const CAP_OFFSET_RATIO = 0.5;
const TWO = 2;

interface DragAndZoomEnabledSettings {
  drag: boolean;
  zoom: boolean;
}

export interface CanvasDragAndZoomControls {
  enableds: Accessor<DragAndZoomEnabledSettings>;
  setEnableds: (v: DragAndZoomEnabledSettings) => void;
  zoom: Accessor<number>;
  setZoom: (level: number) => void;
}

export function useCanvasDragAndZoom(
  canvas: Accessor<Canvas | undefined>,
  wrapperRef: Accessor<HTMLElement | undefined>,
  dragAndZoomSettings?: DragAndZoomSettings,
): CanvasDragAndZoomControls {
  const [enableds, setEnableds] = createSignal({
    drag: true,
    zoom: true,
  });
  const [zoom, setZoom] = createSignal(
    dragAndZoomSettings?.zoom ?? DEFAULT_ZOOM,
  );

  createEffect(() => {
    console.log(zoom());
  });

  onMount(() => {
    const c = canvas();
    if (!c) return;

    let touchZoom = 1;
    let pinchCenter: Point = { x: 0, y: 0 };
    let initialDistance = 0;
    const lastPos: Point = { x: 0, y: 0 };
    const { wrapperEl } = c;

    /**
     * Calculates and caps the container offset relative to the wrapper
     * @see https://medium.com/@Fjonan/performant-drag-and-zoom-using-fabric-js-3f320492f24b
     */
    const capCanvasOffset = (
      offset: number,
      containerDimension: number,
      wrapperDimension: number,
    ) => {
      const maxOffset = wrapperDimension * CAP_OFFSET_RATIO;
      const centerOffset = (wrapperDimension - containerDimension) / 2;
      const minOffset = centerOffset - maxOffset;
      const maxOffsetFinal = centerOffset + maxOffset;
      const capped = Math.max(offset, minOffset);
      return Math.min(capped, maxOffsetFinal);
    };

    /**
     * Convert movement to CSS translate which visually moves the canvas
     * @see https://medium.com/@Fjonan/performant-drag-and-zoom-using-fabric-js-3f320492f24b
     */
    const translateCanvas = (event: MouseEvent | Touch) => {
      const tVals = getTransformVals(c.wrapperEl);

      const offsetX = tVals.translateX + (event.clientX - lastPos.x);
      const offsetY = tVals.translateY + (event.clientY - lastPos.y);

      const wrapper = wrapperRef();

      if (wrapper) {
        const viewBox = wrapper.getBoundingClientRect();
        const cappedX = capCanvasOffset(offsetX, tVals.width, viewBox.width);
        const cappedY = capCanvasOffset(offsetY, tVals.height, viewBox.height);
        c.wrapperEl.style.transform = `translate(${cappedX}px, ${cappedY}px) scale(${tVals.scaleX})`;
      } else {
        c.wrapperEl.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${tVals.scaleX})`;
      }

      lastPos.x = event.clientX;
      lastPos.y = event.clientY;
    };

    /**
     * Save reference point from which the interaction started
     * @see https://medium.com/@Fjonan/performant-drag-and-zoom-using-fabric-js-3f320492f24b
     */
    const dragCanvasStart = (e: MouseEvent | Touch) => {
      lastPos.x = e.clientX;
      lastPos.y = e.clientY;
    };

    /**
     * Convert zoom to CSS scale which visually zooms the canvas
     * @see https://medium.com/@Fjonan/performant-drag-and-zoom-using-fabric-js-3f320492f24b
     */
    const scaleCanvas = (level: number, aroundPoint: Point) => {
      const clampedZoom = Math.min(Math.max(level, ZOOM_MIN), ZOOM_MAX);

      if (clampedZoom === touchZoom) return;

      const tVals = getTransformVals(c.wrapperEl);
      const scaleFactor = (tVals.scaleX / touchZoom) * clampedZoom;

      c.wrapperEl.style.transformOrigin = `${aroundPoint.x}px ${aroundPoint.y}px`;
      c.wrapperEl.style.transform = `translate(${tVals.translateX}px, ${tVals.translateY}px) scale(${scaleFactor})`;

      touchZoom = clampedZoom;
      setZoom(clampedZoom);
    };

    const throttledTranslateCanvas = throttle(translateCanvas, FRAME_16_MS);
    const throttledScaleCanvas = throttle(scaleCanvas, FRAME_16_MS);

    /**
     * Dragging the canvas
     * @see https://medium.com/@Fjonan/performant-drag-and-zoom-using-fabric-js-3f320492f24b
     */
    const dragCanvas = (e: MouseEvent | Touch) => {
      if ("buttons" in e && e.buttons !== 1) {
        return;
      }

      throttledTranslateCanvas(e);
    };

    /**
     * Converts CSS transform to Fabric.js zoom so the blurry image gets sharp
     * @see https://medium.com/@Fjonan/performant-drag-and-zoom-using-fabric-js-3f320492f24b
     */
    const canvasScaleToZoom = debounce(() => {
      const wrapper = wrapperRef();
      if (!wrapper) return;

      const canvasBox = c.wrapperEl.getBoundingClientRect();
      const viewBox = wrapper.getBoundingClientRect();

      // preserve the visual position
      const offsetX = canvasBox.x - viewBox.x;
      const offsetY = canvasBox.y - viewBox.y;

      c.setDimensions({
        height: canvasBox.height,
        width: canvasBox.width,
      });
      c.setZoom(touchZoom);

      c.wrapperEl.style.transformOrigin = `0px 0px`;
      c.wrapperEl.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(1)`;

      c.requestRenderAll();
    }, DEBOUNCE_MS);

    /**
     * Putting touch point coordinates into an object
     * @see https://medium.com/@Fjonan/performant-drag-and-zoom-using-fabric-js-3f320492f24b
     */
    const getPinchCoordinates = (touch1: Touch, touch2: Touch) => {
      return {
        x1: touch1.clientX,
        y1: touch1.clientY,
        x2: touch2.clientX,
        y2: touch2.clientY,
      };
    };

    /**
     * Pinch center around wich the canvas will be scaled/zoomed
     * takes into account the translation of the container element
     * @see https://medium.com/@Fjonan/performant-drag-and-zoom-using-fabric-js-3f320492f24b
     */
    const setPinchCenter = (touch1: Touch, touch2: Touch) => {
      const coord = getPinchCoordinates(touch1, touch2);

      const currentX = (coord.x1 + coord.x2) / 2;
      const currentY = (coord.y1 + coord.y2) / 2;

      const transform = getTransformVals(wrapperEl);

      pinchCenter = {
        x: currentX - transform.translateX,
        y: currentY - transform.translateY,
      };
    };

    /**
     * Returns the distance between two touch points
     * @see https://medium.com/@Fjonan/performant-drag-and-zoom-using-fabric-js-3f320492f24b
     */
    const getPinchDistance = (touch1: Touch, touch2: Touch) => {
      const coord = getPinchCoordinates(touch1, touch2);
      return Math.sqrt(
        Math.pow(coord.x2 - coord.x1, 2) + Math.pow(coord.y2 - coord.y1, 2),
      );
    };

    /**
     * Save the distance between the touch points when starting the pinch
     * @see https://medium.com/@Fjonan/performant-drag-and-zoom-using-fabric-js-3f320492f24b
     */
    const pinchCanvasStart = (event: TouchEvent) => {
      if (event.touches.length !== 2) {
        return;
      }

      initialDistance = getPinchDistance(event.touches[0], event.touches[1]);
    };

    /**
     * Start pinch-zooming the canvas
     * @see https://medium.com/@Fjonan/performant-drag-and-zoom-using-fabric-js-3f320492f24b
     */
    const pinchCanvas = (e: TouchEvent) => {
      if (e.touches.length !== 2) {
        return;
      }

      setPinchCenter(e.touches[0], e.touches[1]);

      const currentDistance = getPinchDistance(e.touches[0], e.touches[1]);
      let scale = Number((currentDistance / initialDistance).toFixed(2));
      scale = 1 + (scale - 1) / PINCH_SLOW_DOWN;

      throttledScaleCanvas(scale * touchZoom, pinchCenter);
    };

    /**
     * Re-Draw the canvas after pinching ended
     * @see https://medium.com/@Fjonan/performant-drag-and-zoom-using-fabric-js-3f320492f24b
     */
    const pinchCanvasEnd = (event: TouchEvent) => {
      if (2 > event.touches.length) {
        canvasScaleToZoom();
      }
    };

    createEffect(function registerDragListeners() {
      if (!enableds().drag) return;

      const ac = new AbortController();

      wrapperEl.addEventListener("mousedown", dragCanvasStart, {
        signal: ac.signal,
      });

      wrapperEl.addEventListener("mousemove", dragCanvas, {
        signal: ac.signal,
      });

      wrapperEl.addEventListener(
        "touchstart",
        function handleTouchStart(e) {
          dragCanvasStart(e.targetTouches[0]);
        },
        { signal: ac.signal },
      );

      wrapperEl.addEventListener(
        "touchmove",
        function handleTouchMove(e) {
          dragCanvas(e.targetTouches[0]);
        },
        { signal: ac.signal },
      );

      onCleanup(() => {
        ac.abort();
      });
    });

    createEffect(function registerZoomListeners() {
      if (!enableds().zoom) return;

      const ac = new AbortController();

      wrapperEl.addEventListener(
        "wheel",
        /**
         * Zoom canvas when user used mouse wheel
         * @see https://medium.com/@Fjonan/performant-drag-and-zoom-using-fabric-js-3f320492f24b
         */
        function handleZoomCanvasMouseWheel(e) {
          const delta = e.deltaY;
          const point: Point = { x: e.offsetX, y: e.offsetY };
          let zoomLevel = touchZoom;

          zoomLevel *= WHEEL_ZOOM_FACTOR ** delta;

          throttledScaleCanvas(zoomLevel, point);
          canvasScaleToZoom();
        },
        { signal: ac.signal },
      );

      wrapperEl.addEventListener(
        "touchstart",
        function handleTouchStart(e) {
          pinchCanvasStart(e);
        },
        { signal: ac.signal },
      );

      wrapperEl.addEventListener(
        "touchmove",
        function handleTouchMove(e) {
          pinchCanvas(e);
        },
        { signal: ac.signal },
      );

      wrapperEl.addEventListener("touchend", pinchCanvasEnd, {
        signal: ac.signal,
      });

      onCleanup(() => {
        ac.abort();
      });
    });

    createEffect(function onSetZoom() {
      const level = zoom();
      if (level === touchZoom) return;

      const wrapper = wrapperRef();
      if (!wrapper) return;

      const viewBox = wrapper.getBoundingClientRect();
      const tVals = getTransformVals(c.wrapperEl);
      const point: Point = {
        x: viewBox.width / 2 - tVals.translateX,
        y: viewBox.height / 2 - tVals.translateY,
      };

      scaleCanvas(level, point);
      canvasScaleToZoom();
    });

    onCleanup(() => {
      canvasScaleToZoom.clear();
    });
  });

  return { enableds, setEnableds, zoom, setZoom };
}

# Canvas Drag & Zoom — `useCanvasDragAndZoom`

> **Document type:** Explanation  
> **Audience:** Developers working on the drawing board feature  
> **Goal:** Understand how CSS transform-based drag and zoom works, why it is performant, and how the hook orchestrates it

---

## 1. Overview

The hook provides smooth, performant canvas navigation for a Fabric.js drawing board. It handles three interaction modes:

| Mode           | Input                           | Mechanism                        |
| -------------- | ------------------------------- | -------------------------------- |
| **Drag (pan)** | Mouse drag, single-finger touch | CSS `translate`                  |
| **Zoom**       | Mouse wheel                     | CSS `scale` + exponential factor |
| **Pinch zoom** | Two-finger touch                | CSS `scale` + Euclidean distance |

All three share a common foundation: **CSS `transform`** applied to the canvas wrapper element. This keeps interactions at 60 fps because transforms are GPU-composited and don't trigger layout or paint.

---

## 2. The Core Idea: CSS Transform as a GPU Layer

### Why CSS `transform` is faster

When you change an element's `transform` via CSS, the browser **promotes that element to its own compositor layer** on the GPU. Moving or scaling that layer does **not** trigger a repaint of the element's content — the GPU simply shifts or stretches the existing pixels.

```mermaid
flowchart LR
    subgraph JS_Approach["Fabric.js (JS)"]
        A1["User drags"] --> A2["JS recalculates<br>every object's position"]
        A2 --> A3["Canvas repaints<br>all pixels"]
        A3 --> A4["Display frame"]
    end

    subgraph CSS_Approach["CSS Transform (GPU)"]
        B1["User drags"] --> B2["GPU shifts<br>compositor layer"]
        B2 --> B3["Display frame"]
    end
```

The JS approach touches every object on the canvas — for hundreds of objects this means hundreds of matrix multiplications and repaints per frame. The CSS approach touches exactly one element's style and lets the GPU do the rest.

### The trade-off

The entire canvas content must be **drawn in full at all times**, because CSS `transform` only shifts the rendered layer — it does not change what Fabric.js has drawn. Content outside the visible area is still rendered but clipped by the wrapper's `overflow: hidden`.

---

## 3. Architecture: The Two-Phase Zoom Strategy

Zooming has a fundamental tension:

- **CSS `transform: scale()`** is cheap and smooth but produces a blurry canvas (the browser scales rasterized pixels).
- **Fabric.js `canvas.setZoom()`** re-renders vector objects at the target resolution (crisp) but is expensive — it recalculates every object's position, dimensions, and stroke widths.

The hook resolves this with a **two-phase strategy**:

```mermaid
flowchart TD
    U["User scrolls / pinches"] --> P1

    subgraph P1["Phase 1 — instant (throttled 16ms)"]
        A["CSS transform scale()"] --> B["GPU-composited, blurry"]
        B --> C["Visual feedback only"]
    end

    C --> D["User stops interacting for 1000ms"]

    subgraph P2["Phase 2 — debounced"]
        E["Fabric.js setZoom()"] --> F["Crisp vector render"]
        F --> G["Reset CSS scale → 1<br>preserves visual position"]
    end

    D --> P2
```

**Phase 1** (`throttledScaleCanvas`) runs during active interaction. It applies `scale()` to the wrapper's CSS transform, giving instant visual feedback at 60 fps. The mouse wheel handler only triggers Phase 1 — it never calls `canvasScaleToZoom` directly.

**Phase 2** (`canvasScaleToZoom`) fires 1000 ms after the user stops interacting, but only when triggered by a pinch-end or an external zoom change (menu input, reset). It reads the final bounding box of the scaled wrapper, calls `canvas.setZoom(touchZoom)`, and resets the CSS transform to `scale(1)` — preserving the visual position so the user sees no jump.

---

## 4. The CSS Transform Matrix

Every CSS `transform` applied to the wrapper is stored by the browser as a **2D affine transformation matrix**:

```
⎡ m11  m21  m31  m41 ⎤      ⎡ scaleX  0       0   translateX ⎤
⎢ m12  m22  m32  m42 ⎥  =   ⎢ 0       scaleY  0   translateY ⎥
⎢ m13  m23  m33  m43 ⎥      ⎢ 0       0       1   0          ⎥
⎣ m14  m24  m34  m44 ⎦      ⎣ 0       0       0   1          ⎦
```

The hook reads the current transform state via `getTransformVals`:

```ts
// src/features/drawing-board/utils.ts
export function getTransformVals(el: HTMLElement) {
  const style = window.getComputedStyle(el);
  const matrix = new DOMMatrixReadOnly(style.transform);
  return {
    scaleX: matrix.m11, // horizontal scale
    scaleY: matrix.m22, // vertical scale
    translateX: matrix.m41, // horizontal translation (px)
    translateY: matrix.m42, // vertical translation (px)
    width: el.getBoundingClientRect().width,
    height: el.getBoundingClientRect().height,
  };
}
```

| Matrix cell | CSS property | Meaning                 |
| ----------- | ------------ | ----------------------- |
| `m11`       | `scaleX`     | Horizontal scale factor |
| `m22`       | `scaleY`     | Vertical scale factor   |
| `m41`       | `translateX` | Horizontal offset in px |
| `m42`       | `translateY` | Vertical offset in px   |

When the hook writes a transform like `translate(100px, 50px) scale(2)`, the browser composes these into a single matrix. Reading it back via `DOMMatrixReadOnly` gives the accumulated values — even if multiple transforms were applied over time.

---

## 5. `transformOrigin` Is Always `0px 0px`

A crucial design decision: the CSS `transformOrigin` is **always** set to `0px 0px` and never changes after initialization.

### Why not use `transformOrigin` for zoom anchoring?

Using `transformOrigin` to anchor zoom to the cursor seems intuitive — set the origin to the cursor position and the browser handles the rest. In practice this causes problems:

- **Cumulative drift** — changing `transformOrigin` on every tick repeatedly shifts the element's visual anchor point, causing the canvas to drift toward the top-left corner.
- **Coordinate mismatch** — `offsetX`/`offsetY` from mouse events are in screen pixels relative to the scaled bounding box, but `transformOrigin` expects local CSS pixel coordinates. These diverge when the element is scaled.

### The solution: translate compensation

With `transformOrigin` fixed at `0px 0px`, zooming toward a point is achieved by **adjusting the translate** to keep that point visually fixed:

```
newTranslateX = oldTranslateX + aroundPoint.x × (oldScaleX − newScaleFactor)
newTranslateY = oldTranslateY + aroundPoint.y × (oldScaleY − newScaleFactor)
```

```ts
const newTranslateX =
  tVals.translateX + aroundPoint.x * (tVals.scaleX - scaleFactor);
const newTranslateY =
  tVals.translateY + aroundPoint.y * (tVals.scaleY - scaleFactor);

c.wrapperEl.style.transformOrigin = `0px 0px`;
c.wrapperEl.style.transform = `translate(${newTranslateX}px, ${newTranslateY}px) scale(${scaleFactor})`;
```

The `aroundPoint` must be in **local CSS pixel coordinates** — the same coordinate system the element uses before any scale is applied. When the cursor position comes from mouse events, it must be converted from screen pixels:

```
localX = offsetX / currentScaleX
localY = offsetY / currentScaleY
```

---

## 6. Initial Fit-to-Viewport Zoom

On mount, the hook computes a **fit zoom** so the canvas never overflows the viewport at startup. This is critical because users can create canvases much larger than the viewport (e.g. 2480×1748 px).

```ts
const fitZoom = Math.min(
  viewportWidth / initialWidth,
  viewportHeight / initialHeight,
  1,
);
```

The formula picks the smaller of the two axis ratios, then caps at `1` so the canvas never zooms in past 100 % on load:

```
viewportWidth  = 1200px
viewportHeight = 800px
canvasWidth    = 2480px
canvasHeight   = 1748px

fitZoom = min(1200/2480, 800/1748, 1)
        = min(0.484, 0.458, 1)
        = 0.458  (≈ 46 %)
```

The canvas is also **centered** in the viewport. Because `transformOrigin` is `0px 0px`, the centering translate must account for the scaled canvas size, not the unscaled one:

```ts
initialCenterX = (viewportWidth - initialWidth * fitZoom) / 2;
initialCenterY = (viewportHeight - initialHeight * fitZoom) / 2;
```

The initial transform is applied with `transformOrigin` set to `0px 0px`:

```ts
c.wrapperEl.style.transformOrigin = `0px 0px`;
c.wrapperEl.style.transform = `translate(${initialCenterX}px, ${initialCenterY}px) scale(${fitZoom})`;
```

Both centering values are stored as module-level variables so the `reset()` function can restore them later.

### Dynamic zoom minimum

The minimum zoom is no longer a hardcoded constant. It is computed relative to the fit zoom so the user can always zoom out to a reasonable fraction of the initial view:

```ts
const ZOOM_MIN_ABSOLUTE = 0.05;
const ZOOM_MIN_FIT_RATIO = 0.25;

setZoomMin(Math.max(ZOOM_MIN_ABSOLUTE, fitZoom * ZOOM_MIN_FIT_RATIO));
```

This means:

- A canvas that fits at 100 % → `zoomMin = max(0.05, 0.25) = 0.25` (25 %)
- A canvas that fits at 46 % → `zoomMin = max(0.05, 0.115) = 0.115` (≈ 11.5 %)

The floor of `ZOOM_MIN_ABSOLUTE` (5 %) prevents the zoom from going so far that the canvas becomes unusably small.

---

## 7. Drag: Translating the Canvas

### Delta accumulation

Dragging works by accumulating mouse movement deltas:

```
newTranslateX = currentTranslateX + (event.clientX - lastPos.x)
newTranslateY = currentTranslateY + (event.clientY - lastPos.y)
```

Each frame, the difference between the current pointer position and the _previous frame's_ pointer position is added to the existing translation. This is a classic **delta-based pan** — simple and frame-rate-independent.

```ts
const offsetX = tVals.translateX + (event.clientX - lastPos.x);
const offsetY = tVals.translateY + (event.clientY - lastPos.y);
lastPos.x = event.clientX;
lastPos.y = event.clientY;
```

```mermaid
flowchart TD
    A["mousedown / touchstart"] --> B["Record lastPos = (clientX, clientY)"]
    B --> C["mousemove / touchmove"]
    C --> D["Read current transform<br>from getTransformVals()"]
    D --> E["offsetX = translateX + (clientX - lastPos.x)<br>offsetY = translateY + (clientY - lastPos.y)"]
    E --> F["Cap offset so canvas<br>stays partially visible"]
    F --> G["Apply: transform = translate(cappedX, cappedY) scale(...)"]
    G --> H["Update lastPos = (clientX, clientY)"]
    H --> C
```

### Coordinate capping

Without limits, the user could drag the canvas entirely out of view. The `capCanvasOffset` function constrains the translation so the canvas never drifts more than **50 % of the wrapper's dimension** past center.

```ts
const capCanvasOffset = (
  offset: number,
  containerDimension: number,
  wrapperDimension: number,
) => {
  const maxOffset = wrapperDimension * CAP_OFFSET_RATIO; // 0.5
  const centerOffset = (wrapperDimension - containerDimension) / 2;
  const minOffset = centerOffset - maxOffset;
  const maxOffsetFinal = centerOffset + maxOffset;
  const capped = Math.max(offset, minOffset);
  return Math.min(capped, maxOffsetFinal);
};
```

**Visual:**

```
┌──────────────────────┐  ← wrapper (viewport)
│                      │
│   ┌──────────────┐   │
│   │              │   │  ← canvas container
│   │   (content)  │   │
│   │              │   │
│   └──────────────┘   │
│                      │
└──────────────────────┘

centerOffset = (wrapperWidth - containerWidth) / 2
              ↑ position where canvas is centered

Allowed range: [centerOffset - 0.5*wrapper, centerOffset + 0.5*wrapper]
               ↑ left limit                  ↑ right limit

If the canvas is smaller than the wrapper, centerOffset is negative
(the canvas starts left of the wrapper origin). The cap still allows
50% of the wrapper's width of travel in either direction.
```

This means the user can pull the canvas halfway off-screen in any direction, but no further — the canvas always remains reachable.

### Throttling

Mouse and touch events fire at high frequency (often > 100 Hz). We throttle `translateCanvas` to **16 ms** (~60 fps) — the fastest the display can refresh — avoiding wasted work.

```ts
const FRAME_16_MS = 16;
const throttledTranslateCanvas = throttle(translateCanvas, FRAME_16_MS);
```

---

## 8. Mouse-Wheel Zoom: Exponential Scaling + Translate Compensation

### The formula

```ts
const WHEEL_ZOOM_FACTOR = 0.999;
zoomLevel *= WHEEL_ZOOM_FACTOR ** deltaY;
```

`deltaY` is the mouse wheel delta (typically ±120 per notch on most mice, smaller on trackpads).

**Why exponential?** Perceptual uniformity. A scroll tick should feel like a constant zoom step regardless of the current zoom level. Exponential scaling achieves this:

```
At zoom 1.0:  1.0 × 0.999^120  ≈ 0.887  (≈ 11% change)
At zoom 2.0:  2.0 × 0.999^120  ≈ 1.774  (≈ 11% change)
```

The _relative_ change is constant. Linear scaling would feel sluggish at low zoom and hypersensitive at high zoom.

**Visual:**

```
zoomLevel
    │
 3.0 │                    ╱
    │                  ╱
 2.0 │               ╱
    │            ╱
 1.0 │        ╱
    │     ╱
 0.5 │  ╱
    │
    └──────────────────────────
              scroll distance

The curve is exponential: each unit of scroll distance multiplies
zoom by a constant factor, so the curve steepens as zoom increases.
```

### Zooming toward the cursor

Because `transformOrigin` is always `0px 0px`, the cursor position from the event must be converted from screen pixels to local CSS pixels before it can be used in the translate compensation formula:

```ts
function handleZoomCanvasMouseWheel(e) {
  e.preventDefault();
  const delta = e.deltaY;
  const tVals = getTransformVals(c.wrapperEl);

  // Convert screen-space offset to local CSS pixels
  const point: Point = {
    x: e.offsetX / tVals.scaleX,
    y: e.offsetY / tVals.scaleY,
  };
  let zoomLevel = touchZoom;

  zoomLevel *= WHEEL_ZOOM_FACTOR ** delta;

  throttledScaleCanvas(zoomLevel, point);
}
```

The division by `tVals.scaleX`/`tVals.scaleY` converts the mouse offset from the scaled visual coordinate system back to the element's local coordinate system. This is necessary because `offsetX`/`offsetY` are measured against the element's **visual** bounding box (after CSS transforms are applied).

The `scaleCanvas` function then uses this point in the translate compensation formula (see §5) to keep the cursor position stationary during the zoom.

Note that the wheel handler **does not** call `canvasScaleToZoom()` — Phase 2 only fires for pinch-end and external zoom changes. This avoids constant debounce rescheduling and stale bounding rect reads during rapid scrolling.

### Clamping

The zoom level is clamped to `[zoomMin(), ZOOM_MAX]` = `[dynamic, 3.0]`:

```ts
const clampedZoom = Math.min(Math.max(level, zoomMin()), ZOOM_MAX);
```

The lower bound is the dynamic `zoomMin` signal (see §6), not a hardcoded constant.

---

## 9. Pinch Zoom: Touch Geometry

Pinch zoom uses two fingers. The math has three parts: distance, center, and slow-down.

### Euclidean distance

The distance between two touch points is the standard Euclidean distance:

```
distance = √((x₂ − x₁)² + (y₂ − y₁)²)
```

```ts
const getPinchDistance = (touch1: Touch, touch2: Touch) => {
  const coord = getPinchCoordinates(touch1, touch2);
  return Math.sqrt(
    Math.pow(coord.x2 - coord.x1, 2) + Math.pow(coord.y2 - coord.y1, 2),
  );
};
```

**Visual:**

```
  (x₁, y₁)  ●────────────●  (x₂, y₂)
              \          /
               \        /
                \      /
                 \    /
                  \  /
                   \/
                    √((x₂−x₁)² + (y₂−y₁)²)

The distance forms the hypotenuse of a right triangle whose legs
are the horizontal and vertical gaps between the two fingers.
```

### Pinch center

The zoom center is the midpoint between the two fingers, adjusted for the current translation:

```ts
pinchCenter = {
  x: (x₁ + x₂) / 2 - translateX,
  y: (y₁ + y₂) / 2 - translateY,
};
```

Subtracting `translateX`/`translateY` converts from screen coordinates to canvas-content coordinates in the **local** CSS pixel space. With `transformOrigin` fixed at `0px 0px`, no division by scale is needed here because `clientX`/`clientY` are already in screen pixels and the translate is also in screen pixels — they share the same coordinate base.

### Slow-down factor

```ts
const PINCH_SLOW_DOWN = 20;
let scale = Number((currentDistance / initialDistance).toFixed(2));
scale = 1 + (scale - 1) / PINCH_SLOW_DOWN;
```

Raw pinch ratios are mapped through a slow-down:

```
If fingers spread to 1.4× the initial distance:
  raw scale = 1.4
  effective = 1 + (1.4 - 1) / 20 = 1.02

If fingers pinch to 0.6× the initial distance:
  raw scale = 0.6
  effective = 1 + (0.6 - 1) / 20 = 0.98
```

This prevents the zoom from changing too aggressively on touch screens, where small finger movements would otherwise produce large zoom jumps. The factor of 20 was chosen empirically to feel natural.

### The scale-to-zoom conversion

CSS `scale()` and Fabric.js zoom are **independent** values. The hook maintains `touchZoom` — the "true" zoom level that Fabric.js knows about. The CSS `scale` is computed relative to it:

```
scaleFactor = (currentScaleX / touchZoom) * newZoom
```

This ensures that if Fabric.js already has a zoom of `2×` and the user pinches to `1.5×` of the current view, the CSS scale becomes `(1 / 2) * 1.5 = 0.75`, and `touchZoom` is updated to `1.5`.

```mermaid
flowchart LR
    subgraph Input["Input"]
        W["Mouse wheel deltaY"]
        P["Pinch distance ratio"]
    end

    subgraph Compute["Zoom computation"]
        Z["zoom *= WHEEL_ZOOM_FACTOR ** deltaY<br>or<br>scale = 1 + (ratio - 1) / PINCH_SLOW_DOWN"]
        C["clampedZoom = clamp(zoom, zoomMin(), ZOOM_MAX)"]
        S["scaleFactor = (scaleX / touchZoom) * clampedZoom"]
    end

    subgraph Apply["CSS Transform"]
        O["transform-origin: 0px 0px"]
        T["newTx = oldTx + aroundPoint.x * (scaleX - scaleFactor)<br>transform: translate(newTx, newTy) scale(scaleFactor)"]
    end

    Input --> Compute --> Apply
```

---

## 10. The Blur Problem: Migrating CSS Scale to Fabric.js Zoom

### Why it gets blurry

CSS `scale()` is a **raster operation** — it stretches the existing pixel buffer. When you zoom in past 100 %, the GPU interpolates pixels, causing blur.

### The solution: `canvasScaleToZoom`

After the user stops zooming — triggered by pinch-end or an external zoom change — we **migrate** the CSS transform into Fabric.js's own zoom system:

```mermaid
flowchart TD
    A["User stops zooming"] --> B["Wait DEBOUNCE_MS (1000 ms)"]
    B --> C["Get canvasBox = wrapperEl.getBoundingClientRect()"]
    C --> D["Get viewBox = wrapper.getBoundingClientRect()"]
    D --> E["offsetX = canvasBox.x - viewBox.x<br>offsetY = canvasBox.y - viewBox.y"]
    E --> F["canvas.setDimensions({ width, height })"]
    F --> G["canvas.setZoom(touchZoom)"]
    G --> H["Reset CSS transform:<br>translate(offsetX, offsetY) scale(1)"]
    H --> I["canvas.requestRenderAll()"]
```

```ts
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
```

After migration, Fabric.js redraws all objects at the correct resolution — the image becomes sharp again.

The wheel handler does **not** trigger this migration — it only runs Phase 1. This avoids constant debounce rescheduling during rapid scrolling.

---

## 11. Programmatic Zoom & Reset

### Programmatic zoom

The hook exposes `setZoom(level)` which allows external controls (e.g., zoom buttons or an input field) to set the zoom level. The `onSetZoom` effect detects changes to the `zoom` signal and computes the zoom center as the **center of the visible viewport**, converted to local CSS pixels:

```ts
const point: Point = {
  x: (viewBox.width / 2 - tVals.translateX) / tVals.scaleX,
  y: (viewBox.height / 2 - tVals.translateY) / tVals.scaleY,
};
```

Dividing by `tVals.scaleX`/`tVals.scaleY` converts the viewport center from screen pixels to local CSS pixels — the same conversion the wheel handler does for cursor position.

This ensures that programmatic zoom always centers on the middle of what the user sees.

### Reset

The `reset()` function restores the canvas to its initial fit-to-viewport state:

```ts
const reset = () => {
  setZoom(initialFitZoom);

  const c = canvas();
  if (!c) return;

  c.setDimensions({ width: initialWidth, height: initialHeight });
  c.setZoom(1);
  c.viewportTransform = [1, 0, 0, 1, 0, 0];
  c.setViewportTransform(c.viewportTransform);

  c.wrapperEl.style.transform = `translate(${initialCenterX}px, ${initialCenterY}px) scale(${initialFitZoom})`;
  c.wrapperEl.style.transformOrigin = `0px 0px`;

  c.requestRenderAll();
};
```

It resets Fabric.js dimensions and zoom, restores the viewport transform, sets `transformOrigin` back to `0px 0px`, and reapplies the initial centered fit zoom — the same state the canvas had on mount.

---

## 12. Event Registration

Listeners are registered inside SolidJS `createEffect` blocks, making them reactive to the `enabled` signal:

```mermaid
flowchart LR
    subgraph Drag["Drag listeners"]
        D1["mousedown → dragCanvasStart"]
        D2["mousemove → dragCanvas"]
        D3["touchstart → dragCanvasStart(touches[0])"]
        D4["touchmove → dragCanvas(touches[0])"]
    end

    subgraph Zoom["Zoom listeners"]
        Z1["wheel → handleZoomCanvasMouseWheel"]
        Z2["touchstart → pinchCanvasStart"]
        Z3["touchmove → pinchCanvas"]
        Z4["touchend → pinchCanvasEnd"]
    end

    Drag -->|"enabled().drag === true"| Register
    Zoom -->|"enabled().zoom === true"| Register
```

Each effect creates an `AbortController` and cleans up on disposal, so toggling `enabled` cleanly adds/removes listeners.

---

## 13. Performance: Throttling & Debouncing

### Throttle at 16 ms (~60 fps)

```ts
const FRAME_16_MS = 16;
const throttledTranslateCanvas = throttle(translateCanvas, FRAME_16_MS);
const throttledScaleCanvas = throttle(scaleCanvas, FRAME_16_MS);
```

Both drag and zoom updates are throttled to **one execution per 16 ms** — matching the browser's typical vsync interval (1000 ms / 60 ≈ 16.67 ms). This ensures:

- No wasted work on frames the user never sees.
- The handler never queues more than one update per animation frame.
- Smooth 60 fps visual feedback.

### Debounce at 1000 ms

```ts
const DEBOUNCE_MS = 1000;
const canvasScaleToZoom = debounce(() => {
  /* Fabric.js setZoom */
}, DEBOUNCE_MS);
```

The expensive Fabric.js re-render (Phase 2) is debounced: it only fires **1000 ms after the user stops interacting**. This prevents:

- Re-rendering on every scroll tick during rapid zooming (the wheel handler doesn't call it at all).
- Layout thrashing from repeated `getBoundingClientRect()` calls.
- Object flickering as Fabric.js recalculates positions mid-gesture.

### Cleanup

The debounced callback is cleared on unmount to prevent stale updates:

```ts
onCleanup(() => {
  canvasScaleToZoom.clear();
});
```

---

## 14. API Reference

### `useCanvasDragAndZoom`

```ts
function useCanvasDragAndZoom(
  canvas: Accessor<Canvas | undefined>,
  wrapperRef: Accessor<HTMLElement | undefined>,
  dragAndZoomSettings?: DragAndZoomSettings,
): UseCanvasDragAndZoomReturn;
```

| Parameter             | Type                                 | Description                                                           |
| --------------------- | ------------------------------------ | --------------------------------------------------------------------- |
| `canvas`              | `Accessor<Canvas \| undefined>`      | Reactive Fabric.js canvas instance                                    |
| `wrapperRef`          | `Accessor<HTMLElement \| undefined>` | Reactive reference to the wrapper element that constrains drag bounds |
| `dragAndZoomSettings` | `DragAndZoomSettings` (optional)     | Initial settings, currently only `{ zoom: number }`                   |

### Return: `UseCanvasDragAndZoomReturn`

```ts
interface UseCanvasDragAndZoomReturn {
  enabled: Accessor<{ drag: boolean; zoom: boolean }>;
  setEnabled: (v: { drag: boolean; zoom: boolean }) => void;
  zoom: Accessor<number>;
  setZoom: Setter<number>;
  zoomMin: Accessor<number>;
  reset: () => void;
}
```

| Property     | Type                                         | Description                                                                                    |
| ------------ | -------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `enabled`    | `Accessor<{ drag: boolean, zoom: boolean }>` | Reactive signal — individually toggles drag and zoom                                           |
| `setEnabled` | `(v) => void`                                | Update which interactions are active                                                           |
| `zoom`       | `Accessor<number>`                           | Current zoom level (clamped to `[zoomMin(), ZOOM_MAX]`)                                        |
| `setZoom`    | `Setter<number>`                             | Programmatically set zoom level. Triggers the same two-phase flow (CSS scale → Fabric.js zoom) |
| `zoomMin`    | `Accessor<number>`                           | Dynamic minimum zoom, computed as `max(ZOOM_MIN_ABSOLUTE, fitZoom * ZOOM_MIN_FIT_RATIO)`       |
| `reset`      | `() => void`                                 | Restores canvas to initial fit-to-viewport position and zoom                                   |

### Constants

| Constant             | Value   | Description                                            |
| -------------------- | ------- | ------------------------------------------------------ |
| `ZOOM_MAX`           | `3`     | Maximum zoom (300 %)                                   |
| `ZOOM_MIN_ABSOLUTE`  | `0.05`  | Absolute floor for minimum zoom (5 %)                  |
| `ZOOM_MIN_FIT_RATIO` | `0.25`  | Fraction of fit zoom used as dynamic minimum floor     |
| `WHEEL_ZOOM_FACTOR`  | `0.999` | Exponential base for mouse-wheel zoom                  |
| `PINCH_SLOW_DOWN`    | `20`    | Divisor that attenuates pinch-zoom sensitivity         |
| `CAP_OFFSET_RATIO`   | `0.5`   | Maximum drag offset as a fraction of wrapper dimension |
| `FRAME_16_MS`        | `16`    | Throttle interval (~60 fps)                            |
| `DEBOUNCE_MS`        | `1000`  | Debounce interval before committing Fabric.js zoom     |

Note: `DEFAULT_ZOOM` and `ZOOM_MIN` were removed from `constants.ts`. The initial zoom is now computed dynamically as a fit-to-viewport value, and the minimum zoom is derived from it at runtime.

---

## 15. Summary

The hook's design follows a clear set of principles:

1. **CSS transforms first** — all interactions manipulate `transform: translate() scale()` for GPU-composited 60 fps feedback.
2. **Fabric.js zoom second** — after the user pauses, the visual state is committed to Fabric.js's internal coordinate system for crisp rendering.
3. **Fixed `transformOrigin: 0px 0px`** — never changes after init; zoom-around-point is achieved by compensating the translate, avoiding cumulative drift and coordinate mismatch.
4. **Fit-to-viewport on mount** — the initial zoom is computed so the entire canvas is visible, regardless of its dimensions.
5. **Dynamic zoom minimum** — `zoomMin` is derived from the fit zoom, ensuring the user can always zoom out to a reasonable fraction of the initial view.
6. **Exponential zoom** — `WHEEL_ZOOM_FACTOR ** deltaY` provides perceptually uniform mouse-wheel zoom.
7. **Euclidean pinch geometry** — standard distance and midpoint math, with a slow-down factor for touch ergonomics.
8. **Coordinate capping** — drag is bounded to 50 % of the viewport past center, preventing the canvas from disappearing.
9. **Throttle + debounce** — cheap CSS updates run at frame rate; expensive re-renders wait for quiescence.

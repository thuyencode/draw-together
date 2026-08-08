import * as v from "valibot";
import { m } from "~/paraglide/messages";

export const SIZE_MIN = 500;
export const SIZE_MAX = 5000;
export const TITLE_MAX_LENGTH = 200;

const SizeValueSchema = v.union([
  v.pipe(
    v.number(),
    v.minValue(SIZE_MIN, () => m.newDrawing_sizeMin({ min: SIZE_MIN })),
    v.maxValue(SIZE_MAX, () => m.newDrawing_sizeMax({ max: SIZE_MAX })),
  ),
  v.pipe(
    v.string(),
    v.toNumber(),
    v.minValue(SIZE_MIN, () => m.newDrawing_sizeMin({ min: SIZE_MIN })),
    v.maxValue(SIZE_MAX, () => m.newDrawing_sizeMax({ max: SIZE_MAX })),
  ),
]);

export const DimensionSchema = v.tuple([
  // Width
  SizeValueSchema,
  // Height
  SizeValueSchema,
]);

export const NewDrawingOptionsFormSchema = v.object({
  dimension: DimensionSchema,
  title: v.optional(
    v.pipe(
      v.string(),
      v.maxLength(TITLE_MAX_LENGTH, () =>
        m.newDrawing_titleMaxLength({ max: TITLE_MAX_LENGTH }),
      ),
    ),
    "Untitled",
  ),
});

export type NewDrawingOptionsInput = v.InferInput<
  typeof NewDrawingOptionsFormSchema
>;

export const NewDrawingOptionsSchema = v.object({
  width: SizeValueSchema,
  height: SizeValueSchema,
  title: v.optional(
    v.pipe(
      v.string(),
      v.maxLength(TITLE_MAX_LENGTH, () =>
        m.newDrawing_titleMaxLength({ max: TITLE_MAX_LENGTH }),
      ),
    ),
    "Untitled",
  ),
});

export type NewDrawingOptions = v.InferOutput<typeof NewDrawingOptionsSchema>;

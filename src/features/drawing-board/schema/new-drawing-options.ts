import * as v from "valibot";

export const TITLE_MAX_LENGTH = 200;

const SizeValueSchema = v.union([
  v.pipe(v.number(), v.minValue(500)),
  v.pipe(v.string(), v.toNumber(), v.minValue(500)),
]);

export const NewDrawingOptionsFormSchema = v.object({
  dimension: v.tuple([
    // Width
    SizeValueSchema,
    // Height
    SizeValueSchema,
  ]),
  title: v.optional(
    v.pipe(v.string(), v.maxLength(TITLE_MAX_LENGTH)),
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
    v.pipe(v.string(), v.maxLength(TITLE_MAX_LENGTH)),
    "Untitled",
  ),
});

export type NewDrawingOptions = v.InferOutput<typeof NewDrawingOptionsSchema>;

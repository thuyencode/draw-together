import { createForm } from "@tanstack/solid-form";
import { splitProps } from "solid-js";
import { useNavigate } from "@tanstack/solid-router";
import {
  NewDrawingOptionsFormSchema,
  SIZE_MAX,
  SIZE_MIN,
  TITLE_MAX_LENGTH,
} from "../schema";
import { CanvasSizeInput, FieldError, TextInput } from "../components/ui";
import type { NewDrawingOptionsInput } from "../schema";
import type { ComponentProps } from "solid-js";
import { m } from "~/paraglide/messages";

const defaultValues: NewDrawingOptionsInput = {
  dimension: [500, 500],
  title: "Untitled",
};

interface NewDrawingFormProps extends ComponentProps<"form"> {
  onClose?: () => void;
}

export function NewDrawingForm(_props: NewDrawingFormProps) {
  const navigate = useNavigate();
  const [props, rest] = splitProps(_props, ["onSubmit", "onClose"]);
  const form = createForm(() => ({
    defaultValues,
    validators: {
      onSubmit: NewDrawingOptionsFormSchema,
      onBlur: NewDrawingOptionsFormSchema,
    },
    onSubmit: (data) => {
      const {
        dimension: [width, height],
        title,
      } = data.value;
      navigate({
        to: "/rooms/trial",
        search: { width, height, title },
      });
    },
  }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();

        if (props.onSubmit) {
          if (typeof props.onSubmit === "function") {
            props.onSubmit(e);
          } else {
            const data = props.onSubmit[1];
            const handler = props.onSubmit[0];
            handler(data, e);
          }
        }
      }}
      {...rest}
    >
      <form.Field name="title">
        {(field) => (
          <fieldset class="fieldset">
            <legend class="label text-sm capitalize">
              {m.newDrawing_title()}
            </legend>
            <TextInput
              name={field().name}
              class="w-full"
              value={field().state.value ?? ""}
              onBlur={field().handleBlur}
              onChange={field().handleChange}
              placeholder={m.newDrawing_untitled()}
              maxLength={TITLE_MAX_LENGTH}
            />
            <FieldError class="mt-1" errors={field().state.meta.errors} />
          </fieldset>
        )}
      </form.Field>
      <form.Field
        name="dimension"
        validators={{
          onChange: ({ value: [width, height] }) => {
            const errors: Array<{ message: string }> = [];

            const w = Number(width);
            const h = Number(height);

            if (w < SIZE_MIN || w > SIZE_MAX) {
              errors.push({
                message:
                  w < SIZE_MIN
                    ? m.newDrawing_widthMin({ min: SIZE_MIN })
                    : m.newDrawing_widthMax({ max: SIZE_MAX }),
              });
            }
            if (h < SIZE_MIN || h > SIZE_MAX) {
              errors.push({
                message:
                  h < SIZE_MIN
                    ? m.newDrawing_heightMin({ min: SIZE_MIN })
                    : m.newDrawing_heightMax({ max: SIZE_MAX }),
              });
            }

            return errors.length ? errors : undefined;
          },
        }}
      >
        {(field) => (
          <fieldset class="fieldset">
            <legend class="label text-sm capitalize">
              {m.newDrawing_dimension()}
            </legend>
            <CanvasSizeInput
              onChange={field().handleChange}
              onInput={field().handleChange}
            />
            <FieldError class="mt-1" errors={field().state.meta.errors} />
          </fieldset>
        )}
      </form.Field>

      <div class="modal-action">
        <button class="btn btn-primary" type="submit">
          {m.home_create()}
        </button>
        <button class="btn" type="button" onClick={() => props.onClose?.()}>
          {m.home_close()}
        </button>
      </div>
    </form>
  );
}

import { createForm } from "@tanstack/solid-form";
import { splitProps } from "solid-js";
import { useNavigate } from "@tanstack/solid-router";
import { NewDrawingOptionsFormSchema, TITLE_MAX_LENGTH } from "../schema";
import { CanvasSizeInput, TextInput } from "../components/ui";
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
              onChange={(v) => field().handleChange(v)}
              placeholder={m.newDrawing_untitled()}
              maxLength={TITLE_MAX_LENGTH}
            />
          </fieldset>
        )}
      </form.Field>
      <form.Field name="dimension">
        {(field) => (
          <fieldset class="fieldset">
            <legend class="label text-sm capitalize">
              {m.newDrawing_dimension()}
            </legend>

            <CanvasSizeInput
              onChange={(v) => field().handleChange(v)}
              onInput={(v) => field().handleChange(v)}
            />
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

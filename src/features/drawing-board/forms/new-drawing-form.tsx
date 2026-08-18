import { useNavigate } from "@tanstack/solid-router";
import {
  DimensionSchema,
  NewDrawingOptionsFormSchema,
  TITLE_MAX_LENGTH,
} from "../schema";
import { CanvasSizeInput } from "../components/ui";
import type { NewDrawingOptionsInput } from "../schema";
import { m } from "~/paraglide/messages";
import { useAppForm } from "~/features/shared/hooks/form";

const defaultValues: NewDrawingOptionsInput = {
  dimension: [500, 500],
  title: "Untitled",
};

interface NewDrawingFormProps {
  onClose?: () => void;
}

export function NewDrawingForm(props: NewDrawingFormProps) {
  const navigate = useNavigate();
  const form = useAppForm(() => ({
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
        to: "/trial",
        search: { width, height, title },
      });
    },
  }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.AppField name="title">
        {(field) => (
          <field.Fieldset label={m.newDrawing_title()}>
            <field.TextInput
              class="w-full"
              placeholder={m.newDrawing_untitled()}
              maxLength={TITLE_MAX_LENGTH}
            />
            <field.FieldError />
          </field.Fieldset>
        )}
      </form.AppField>
      <form.AppField
        name="dimension"
        validators={{
          onChange: DimensionSchema,
        }}
      >
        {(field) => (
          <field.Fieldset label={m.newDrawing_dimension()}>
            <CanvasSizeInput
              onChange={field().handleChange}
              onInput={field().handleChange}
            />
            <field.FieldError />
          </field.Fieldset>
        )}
      </form.AppField>

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

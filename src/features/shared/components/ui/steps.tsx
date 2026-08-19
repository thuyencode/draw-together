import {
  Show,
  createContext,
  createSignal,
  mergeProps,
  splitProps,
  useContext,
} from "solid-js";
import { cn } from "../../utils/cn";
import type { Accessor, ComponentProps, ParentProps, Setter } from "solid-js";

interface StepsContextValue {
  count: Accessor<number>;
  step: Accessor<number>;
  setStep: Setter<number>;
  hasNextStep: Accessor<boolean>;
  hasPrevStep: Accessor<boolean>;
  goToNextStep: () => void;
  goToPrevStep: () => void;
}

const StepsContext = createContext<StepsContextValue | undefined>(undefined);

interface StepsProviderProps {
  count: number;
  defaultStep?: number;
}

function StepsRoot(_props: ParentProps<StepsProviderProps>) {
  const props = mergeProps(
    { defaultStep: 0 } satisfies Partial<StepsProviderProps>,
    _props,
  );
  const [step, setStep] = createSignal(props.defaultStep);

  const hasNextStep = () => step() < props.count - 1;
  const hasPrevStep = () => step() > 0;

  return (
    <StepsContext.Provider
      value={{
        count: () => props.count,
        step,
        setStep,
        hasNextStep,
        hasPrevStep,
        goToNextStep: () => setStep((prev) => prev + 1),
        goToPrevStep: () => setStep((prev) => prev - 1),
      }}
    >
      {props.children}
    </StepsContext.Provider>
  );
}

function StepsList(_props: ComponentProps<"ul">) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <ul
      class={cn("steps", props.class)}
      data-scope="steps"
      data-part="list"
      {...rest}
    />
  );
}

interface StepsItemProps extends ComponentProps<"li"> {
  index: number;
  stepClass?: string;
}

function StepsItem(_props: StepsItemProps) {
  const merged = mergeProps(
    { stepClass: "step-primary" } satisfies Partial<StepsItemProps>,
    _props,
  );
  const [props, rest] = splitProps(merged, ["class", "stepClass", "index"]);

  const steps = useSteps();

  return (
    <li
      class={cn(
        "step",
        props.index  <= steps.step()  ? props.stepClass : undefined,
        props.class,
      )}
      data-current={steps.step() === props.index}
      data-scope="steps"
      data-part="item"
      {...rest}
    />
  );
}

function StepsIcon(_props: ComponentProps<"span">) {
  const [props, rest] = splitProps(_props, ["class"]);

  return (
    <span class={cn("step-icon", props.class)} data-scope="steps" {...rest} />
  );
}

interface StepsContentProps extends ComponentProps<"div"> {
  index: number;
}

function StepsContent(_props: StepsContentProps) {
  const [props, rest] = splitProps(_props, ["index"]);
  const steps = useSteps();

  return (
    <Show when={steps.step() === props.index}>
      <div data-scope="steps" data-part="content" {...rest} />
    </Show>
  );
}

function StepsPrevTrigger(
  _props: Omit<ComponentProps<"button">, "onSubmit" | "disabled">,
) {
  const [props, rest] = splitProps(_props, ["class"]);
  const steps = useSteps();

  return (
    <button
      type="button"
      class={cn("btn", props.class)}
      disabled={!steps.hasPrevStep()}
      onClick={steps.goToPrevStep}
      data-scope="steps"
      data-part="prev trigger"
      {...rest}
    />
  );
}

function StepsNextTrigger(
  _props: Omit<ComponentProps<"button">, "onSubmit" | "disabled">,
) {
  const [props, rest] = splitProps(_props, ["class"]);
  const steps = useSteps();

  return (
    <button
      type="button"
      class={cn("btn", props.class)}
      disabled={!steps.hasNextStep()}
      onClick={steps.goToNextStep}
      data-scope="steps"
      data-part="next trigger"
      {...rest}
    />
  );
}

function useSteps() {
  const context = useContext(StepsContext);

  if (!context) {
    throw new Error("useSteps must be used within a Steps.Root");
  }

  return context;
}

export const Steps = {
  Root: StepsRoot,
  List: StepsList,
  Item: StepsItem,
  Icon: StepsIcon,
  Content: StepsContent,
  PrevTrigger: StepsPrevTrigger,
  NextTrigger: StepsNextTrigger,
  useSteps,
};

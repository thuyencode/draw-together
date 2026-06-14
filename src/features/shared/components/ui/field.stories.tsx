import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Field } from "./field";

const meta = {
  title: "Forms/Field",
  component: Field.Root,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Field.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Input: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>Username</Field.Label>
      <Field.Input placeholder="Enter your username" />
    </Field.Root>
  ),
};

export const InputWithHelper: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>Email</Field.Label>
      <Field.Input type="email" placeholder="you@example.com" />
      <Field.HelperText>We'll never share your email.</Field.HelperText>
    </Field.Root>
  ),
};

export const InputWithError: Story = {
  render: () => (
    <Field.Root invalid>
      <Field.Label>Password</Field.Label>
      <Field.Input type="password" placeholder="Enter your password" />
      <Field.ErrorText>Password must be at least 8 characters.</Field.ErrorText>
    </Field.Root>
  ),
};

export const InputRequired: Story = {
  render: () => (
    <Field.Root required>
      <Field.Label>
        Full Name <Field.RequiredIndicator />
      </Field.Label>
      <Field.Input placeholder="John Doe" />
    </Field.Root>
  ),
};

export const Textarea: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>Bio</Field.Label>
      <Field.Textarea placeholder="Tell us about yourself" />
    </Field.Root>
  ),
};

export const TextareaWithHelper: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>Message</Field.Label>
      <Field.Textarea placeholder="Write your message" />
      <Field.HelperText>Max 500 characters.</Field.HelperText>
    </Field.Root>
  ),
};

export const Select: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>Country</Field.Label>
      <Field.Select>
        <option value="">Select a country</option>
        <option value="us">United States</option>
        <option value="ca">Canada</option>
        <option value="uk">United Kingdom</option>
      </Field.Select>
    </Field.Root>
  ),
};

export const SelectWithError: Story = {
  render: () => (
    <Field.Root invalid>
      <Field.Label>Country</Field.Label>
      <Field.Select>
        <option value="">Select a country</option>
        <option value="us">United States</option>
        <option value="ca">Canada</option>
      </Field.Select>
      <Field.ErrorText>Please select a country.</Field.ErrorText>
    </Field.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field.Root disabled>
      <Field.Label>Disabled Field</Field.Label>
      <Field.Input placeholder="This is disabled" />
      <Field.HelperText>This field is currently disabled.</Field.HelperText>
    </Field.Root>
  ),
};

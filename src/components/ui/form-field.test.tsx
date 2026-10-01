// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, InputField } from "./form-field";

const schema = z.object({ name: z.string().min(2, "الاسم قصير") });
type V = z.infer<typeof schema>;

function Demo() {
  const form = useForm<V>({ resolver: zodResolver(schema), defaultValues: { name: "" } });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})}>
        <InputField<V> name="name" label="الاسم" />
        <button type="submit">ارسال</button>
      </form>
    </Form>
  );
}

describe("FormField", () => {
  it("بيعرض الخطأ تحت الحقل ويربطه بـ aria", async () => {
    render(<Demo />);
    fireEvent.click(screen.getByText("ارسال"));
    const err = await waitFor(() => screen.getByRole("alert"));
    expect(err.textContent).toBe("الاسم قصير");
    const input = screen.getByLabelText("الاسم");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe(err.id);
    // الخطأ بعد الحقل في الـ DOM = تحته
    expect(input.compareDocumentPosition(err) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});

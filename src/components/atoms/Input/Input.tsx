"use client";

import type { ChangeEvent, ComponentProps } from "react";

import { sanitizeInputChange } from "@/lib/sanitize";

export type InputProps = ComponentProps<"input">;

/** `<input>` con sanitización centralizada en cada cambio del usuario. */
export function Input({ onChange, type = "text", ref, ...props }: InputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!onChange) {
      return;
    }

    const sanitized = sanitizeInputChange(event.target.value, type);
    if (sanitized === event.target.value) {
      onChange(event);
      return;
    }

    onChange({
      ...event,
      target: { ...event.target, value: sanitized },
      currentTarget: { ...event.currentTarget, value: sanitized },
    });
  };

  return <input ref={ref} type={type} onChange={handleChange} {...props} />;
}

import { forwardRef } from "react";

import { cn } from "@/lib/cn";

// Field wraps a labeled control with optional helper/error text, matching the
// design system (caption labels, hairline borders, blue focus ring).
export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: {
  label?: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={htmlFor} className="text-caption text-ink-2">
          {label}
          {required && <span className="text-brand-red"> *</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-caption text-brand-red">{error}</p>
      ) : hint ? (
        <p className="text-caption text-ink-3">{hint}</p>
      ) : null}
    </div>
  );
}

const controlClass =
  "w-full rounded-md border border-line bg-surface px-3 text-body-sm text-ink placeholder:text-ink-4 transition-colors duration-200 focus:border-brand-blue focus:outline-none disabled:bg-surface-muted disabled:text-ink-3";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(controlClass, "h-10", className)} {...props} />;
  },
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, rows = 4, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(controlClass, "py-2 leading-relaxed", className)}
      {...props}
    />
  );
});

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={cn(controlClass, "h-10 cursor-pointer pr-8", className)}
        {...props}
      >
        {children}
      </select>
    );
  },
);

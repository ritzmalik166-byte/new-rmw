"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";

type ContactSelectProps = {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
  compact?: boolean;
};

export function ContactSelect({
  label,
  value,
  options,
  onChange,
  placeholder = "Select",
  required,
  error,
  className,
  compact,
}: ContactSelectProps) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [dropUp, setDropUp] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    listRef.current?.focus({ preventScroll: true });
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const openList = () => {
    setActive(Math.max(0, options.indexOf(value)));
    const button = buttonRef.current?.getBoundingClientRect();
    const root = rootRef.current?.getBoundingClientRect();
    const slip = rootRef.current?.closest(".ct-slip")?.getBoundingClientRect();
    if (button && root) {
      const below = Math.min(slip?.bottom ?? window.innerHeight, window.innerHeight) - button.bottom;
      const above = button.top - Math.max(slip?.top ?? 0, 0);
      const needed = Math.min(260, options.length * 40 + 20);
      setDropUp(below < needed && above > below ? root.bottom - button.top + 6 : null);
    }
    setOpen(true);
  };

  const choose = (index: number) => {
    onChange(options[index]);
    setOpen(false);
    buttonRef.current?.focus({ preventScroll: true });
  };

  const onButtonKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      openList();
    }
  };

  const onListKey = (event: KeyboardEvent<HTMLUListElement>) => {
    const last = options.length - 1;
    const moves: Record<string, number> = {
      ArrowDown: Math.min(last, active + 1),
      ArrowUp: Math.max(0, active - 1),
      Home: 0,
      End: last,
    };
    if (event.key in moves) {
      event.preventDefault();
      setActive(moves[event.key]);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(active);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      buttonRef.current?.focus({ preventScroll: true });
    } else if (event.key === "Tab") {
      setOpen(false);
    } else if (event.key.length === 1) {
      const match = options.findIndex((option) => option.toLowerCase().startsWith(event.key.toLowerCase()));
      if (match >= 0) setActive(match);
    }
  };

  return (
    <div ref={rootRef} className={cn("ct-field ct-select", compact && "is-compact", error && "has-error", className)}>
      {compact ? null : (
        <span id={`${id}-label`} className="ct-label">
          {label}
          {required ? <span aria-hidden>*</span> : null}
        </span>
      )}
      <button
        ref={buttonRef}
        id={`${id}-button`}
        type="button"
        className={cn("ct-select-button", !value && "is-placeholder")}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={compact ? `${label}: ${value}` : undefined}
        aria-labelledby={compact ? undefined : `${id}-label ${id}-button`}
        aria-describedby={error ? `${id}-error` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onButtonKey}
      >
        <span>{value || placeholder}</span>
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <ul
        ref={listRef}
        id={`${id}-list`}
        role="listbox"
        tabIndex={-1}
        className={cn("ct-select-list", open && "is-open", dropUp !== null && "is-up")}
        style={dropUp !== null ? { bottom: dropUp } : undefined}
        aria-label={label}
        aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
        hidden={!open}
        onKeyDown={onListKey}
        data-lenis-prevent
      >
        {options.map((option, index) => (
          <li
            key={option}
            id={`${id}-opt-${index}`}
            role="option"
            aria-selected={option === value}
            className={cn(index === active && "is-active")}
            onPointerEnter={() => setActive(index)}
            onClick={() => choose(index)}
          >
            {option}
          </li>
        ))}
      </ul>
      {error ? (
        <span id={`${id}-error`} className="ct-error">
          {error}
        </span>
      ) : null}
    </div>
  );
}

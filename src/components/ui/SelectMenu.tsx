"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";

type SelectMenuProps = {
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  placeholder?: string;
  /** Mirrors the value into a hidden input so uncontrolled forms can read it from FormData. */
  name?: string;
  id?: string;
  labelledBy?: string;
  ariaLabel?: string;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
};

const LIST_MAX = 264;

export function SelectMenu({
  value,
  options,
  onChange,
  placeholder = "Select",
  name,
  id,
  labelledBy,
  ariaLabel,
  invalid,
  disabled,
  className,
}: SelectMenuProps) {
  const uid = useId();
  const buttonId = id ?? `${uid}-button`;
  const listId = `${uid}-list`;
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [dropUp, setDropUp] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    listRef.current?.focus({ preventScroll: true });
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const openList = () => {
    if (disabled) return;
    setActive(Math.max(0, options.indexOf(value)));
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const needed = Math.min(LIST_MAX, options.length * 44 + 16);
      const below = window.innerHeight - rect.bottom;
      setDropUp(below < needed && rect.top > below);
    }
    setOpen(true);
  };

  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) buttonRef.current?.focus({ preventScroll: true });
  };

  const choose = (index: number) => {
    onChange(options[index]);
    close();
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
      close();
    } else if (event.key === "Tab") {
      close(false);
    } else if (event.key.length === 1) {
      const match = options.findIndex((option) => option.toLowerCase().startsWith(event.key.toLowerCase()));
      if (match >= 0) setActive(match);
    }
  };

  return (
    <div ref={rootRef} className={cn("sx-select", open && "is-open", invalid && "has-error", className)}>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <button
        ref={buttonRef}
        id={buttonId}
        type="button"
        className={cn("sx-select-button", !value && "is-placeholder")}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel ? `${ariaLabel}: ${value || placeholder}` : undefined}
        aria-labelledby={ariaLabel ? undefined : labelledBy ? `${labelledBy} ${buttonId}` : undefined}
        disabled={disabled}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onButtonKey}
      >
        <span>{value || placeholder}</span>
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <ul
        ref={listRef}
        id={listId}
        role="listbox"
        tabIndex={-1}
        className={cn("sx-select-list", dropUp && "is-up")}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : labelledBy}
        aria-activedescendant={open ? `${uid}-opt-${active}` : undefined}
        hidden={!open}
        onKeyDown={onListKey}
        data-lenis-prevent
      >
        {options.map((option, index) => (
          <li
            key={option}
            id={`${uid}-opt-${index}`}
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
    </div>
  );
}

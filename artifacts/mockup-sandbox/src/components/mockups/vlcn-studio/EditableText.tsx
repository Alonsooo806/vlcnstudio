import { createElement, useEffect, useRef, useState } from "react";
import { useEdit } from "./editContext";

type Props = {
  id: string;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div" | "a";
  children: string;
  className?: string;
  style?: React.CSSProperties;
  href?: string;
  multiline?: boolean;
};

export default function EditableText({
  id,
  as = "span",
  children,
  className,
  style,
  href,
  multiline = false,
}: Props) {
  const { editing, overrides, saveOverride, resetOverride, route } = useEdit();
  const value = overrides[`${route}::${id}`] ?? children;

  const ref = useRef<HTMLElement | null>(null);
  const [editingThis, setEditingThis] = useState(false);

  useEffect(() => {
    if (!editing) setEditingThis(false);
  }, [editing]);

  function handleBlur(): void {
    if (!ref.current) return;
    const next = ref.current.innerText;
    if (next !== value) {
      void saveOverride(id, "text", next);
    }
    setEditingThis(false);
  }

  function handleKeyDown(e: React.KeyboardEvent): void {
    if (e.key === "Enter" && !e.shiftKey && !multiline) {
      e.preventDefault();
      ref.current?.blur();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      if (ref.current) ref.current.innerText = value;
      ref.current?.blur();
    }
  }

  function handleReset(e: React.MouseEvent): void {
    e.stopPropagation();
    void resetOverride(id);
  }

  const isOverridden = overrides[`${route}::${id}`] !== undefined;

  const editStyle: React.CSSProperties = editing
    ? {
        outline: editingThis ? "2px solid #a855f7" : "1px dashed rgba(168,85,247,0.55)",
        outlineOffset: "2px",
        borderRadius: "4px",
        cursor: "text",
        backgroundColor: editingThis ? "rgba(168,85,247,0.08)" : "transparent",
        transition: "outline 0.15s, background-color 0.15s",
      }
    : {};

  return createElement(
    as,
    {
      ref,
      className,
      style: { ...style, ...editStyle },
      contentEditable: editing,
      suppressContentEditableWarning: true,
      spellCheck: false,
      href: as === "a" ? href : undefined,
      onClick: (e: React.MouseEvent) => {
        if (editing) {
          e.preventDefault();
          e.stopPropagation();
          setEditingThis(true);
        }
      },
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
    },
    value,
    editing && isOverridden
      ? createElement(
          "span",
          {
            onClick: handleReset,
            title: "Restaurar texto original",
            style: {
              marginLeft: "6px",
              fontSize: "10px",
              padding: "1px 5px",
              borderRadius: "4px",
              background: "rgba(236,72,153,0.2)",
              border: "1px solid rgba(236,72,153,0.5)",
              color: "#f9a8d4",
              cursor: "pointer",
              userSelect: "none",
              verticalAlign: "middle",
            },
          },
          "restaurar",
        )
      : null,
  );
}

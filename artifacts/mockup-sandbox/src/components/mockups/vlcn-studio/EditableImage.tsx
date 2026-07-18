import { useRef, useState } from "react";
import { useEdit } from "./editContext";
import { supabase } from "../../../lib/supabase";
type Props = {
  id: string;
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function EditableImage({
  id,
  src,
  alt,
  className,
  style,
}: Props) {
  const { editing, overrides, saveOverride, resetOverride, route } = useEdit();
  const value = overrides[`${route}::${id}`] ?? src;
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleFile(file: File): Promise<void> {
    setErr(null);
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      const path = `${route}/${id}.${ext}`;

      const publicUrl = await supabase.uploadImage(path, file);
      await saveOverride(id, "image", publicUrl);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setUploading(false);
    }
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
    e.target.value = "";
  }

  function handleReset(e: React.MouseEvent): void {
    e.stopPropagation();
    void resetOverride(id);
  }

  const isOverridden = overrides[`${route}::${id}`] !== undefined;

  return (
    <div
      className={className}
      style={{ ...style, position: "relative", display: "inline-block" }}
      onClick={(e) => {
        if (editing) {
          e.preventDefault();
          e.stopPropagation();
          fileRef.current?.click();
        }
      }}
    >
      <img
        src={value}
        alt={alt}
        className={className}
        style={{
          ...style,
          ...(editing
            ? {
                outline: "2px dashed rgba(168,85,247,0.7)",
                outlineOffset: "2px",
                cursor: "pointer",
              }
            : {}),
        }}
      />
      {editing && (
        <div
          style={{
            position: "absolute",
            top: "6px",
            left: "6px",
            display: "flex",
            gap: "6px",
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              padding: "3px 7px",
              borderRadius: "4px",
              background: "rgba(168,85,247,0.85)",
              color: "#fff",
              fontFamily: "Menlo, monospace",
              letterSpacing: "0.05em",
            }}
          >
            {uploading ? "subiendo…" : "click para cambiar"}
          </span>
          {isOverridden && (
            <button
              type="button"
              onClick={handleReset}
              title="Restaurar imagen original"
              style={{
                fontSize: "10px",
                padding: "3px 7px",
                borderRadius: "4px",
                background: "rgba(236,72,153,0.85)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                pointerEvents: "auto",
                fontFamily: "Menlo, monospace",
              }}
            >
              restaurar
            </button>
          )}
        </div>
      )}
      {err && (
        <div
          style={{
            position: "absolute",
            bottom: "6px",
            left: "6px",
            right: "6px",
            fontSize: "10px",
            color: "#fecaca",
            background: "rgba(0,0,0,0.7)",
            padding: "4px 6px",
            borderRadius: "4px",
          }}
        >
          {err}
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={onPick}
        style={{ display: "none" }}
      />
    </div>
  );
}

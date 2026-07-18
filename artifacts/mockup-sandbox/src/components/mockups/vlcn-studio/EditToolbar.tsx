import { useState } from "react";
import { useEdit } from "./editContext";

export default function EditToolbar() {
  const { editing, setEditing, loading, error, route } = useEdit();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed && !editing) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 14px",
        borderRadius: "12px",
        background: "rgba(13,0,32,0.92)",
        backdropFilter: "blur(14px)",
        border: "1px solid rgba(168,85,247,0.35)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.45), 0 0 24px rgba(168,85,247,0.18)",
        fontFamily: "Menlo, monospace",
        fontSize: "12px",
        color: "#fff",
      }}
    >
      {loading && <span style={{ color: "#c084fc" }}>cargando…</span>}
      {error && (
        <span style={{ color: "#fecaca", maxWidth: "200px" }} title={error}>
          error
        </span>
      )}
      <span style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>
        {route}
      </span>
      <button
        type="button"
        onClick={() => setEditing(!editing)}
        style={{
          padding: "6px 14px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          fontWeight: 700,
          letterSpacing: "0.05em",
          fontSize: "11px",
          background: editing
            ? "linear-gradient(135deg, #ec4899, #f43f5e)"
            : "linear-gradient(135deg, #7c3aed, #a855f7)",
          color: "#fff",
          transition: "transform 0.15s, filter 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.filter = "brightness(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.filter = "brightness(1)";
        }}
      >
        {editing ? "LISTO" : "EDITAR"}
      </button>
      {!editing && (
        <button
          type="button"
          onClick={() => setDismissed(true)}
          style={{
            background: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.35)",
            cursor: "pointer",
            fontSize: "14px",
            lineHeight: 1,
            padding: "0 2px",
          }}
          title="Ocultar"
        >
          ×
        </button>
      )}
    </div>
  );
}

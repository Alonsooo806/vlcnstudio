import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase, type ContentOverride, type OverrideMap } from "../../../lib/supabase";

type EditContextValue = {
  route: string;
  editing: boolean;
  setEditing: (v: boolean) => void;
  overrides: OverrideMap;
  saveOverride: (elementId: string, kind: "text" | "image", value: string) => Promise<void>;
  resetOverride: (elementId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
};

const EditContext = createContext<EditContextValue | null>(null);

function keyOf(route: string, elementId: string): string {
  return `${route}::${elementId}`;
}

export function EditProvider({
  route,
  children,
}: {
  route: string;
  children: ReactNode;
}) {
  const [editing, setEditing] = useState(false);
  const [overrides, setOverrides] = useState<OverrideMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    async function load(): Promise<void> {
      try {
        const rows = await supabase.listOverrides(route);
        if (cancelled) return;
        const map: OverrideMap = {};
        for (const row of rows) {
          map[keyOf(route, row.element_id)] = row.value;
        }
        setOverrides(map);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [route]);

  const saveOverride = useCallback(
    async (elementId: string, kind: "text" | "image", value: string) => {
      try {
        await supabase.upsertOverride(route, elementId, kind, value);
        setOverrides((prev) => ({ ...prev, [keyOf(route, elementId)]: value }));
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
        throw e;
      }
    },
    [route],
  );

  const resetOverride = useCallback(
    async (elementId: string) => {
      try {
        await supabase.deleteOverride(route, elementId);
        setOverrides((prev) => {
          const next = { ...prev };
          delete next[keyOf(route, elementId)];
          return next;
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
        throw e;
      }
    },
    [route],
  );

  const value = useMemo<EditContextValue>(
    () => ({
      route,
      editing,
      setEditing,
      overrides,
      saveOverride,
      resetOverride,
      loading,
      error,
    }),
    [route, editing, overrides, saveOverride, resetOverride, loading, error],
  );

  return <EditContext.Provider value={value}>{children}</EditContext.Provider>;
}

export function useEdit(): EditContextValue {
  const ctx = useContext(EditContext);
  if (!ctx) {
    throw new Error("useEdit must be used within an EditProvider");
  }
  return ctx;
}

export type { ContentOverride };

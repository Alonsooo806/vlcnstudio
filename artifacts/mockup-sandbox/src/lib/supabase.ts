const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigured = Boolean(url && anonKey);

export type ContentOverride = {
  route: string;
  element_id: string;
  kind: "text" | "image";
  value: string;
};

export type OverrideMap = Record<string, string>;

const restBase = supabaseConfigured ? `${url}/rest/v1` : "";
const storageBase = supabaseConfigured ? `${url}/storage/v1` : "";

function restHeaders(extra?: Record<string, string>): HeadersInit {
  return {
    apikey: anonKey!,
    Authorization: `Bearer ${anonKey}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

export const supabase = {
  async listOverrides(route: string): Promise<ContentOverride[]> {
    if (!supabaseConfigured) return [];
    const res = await fetch(
      `${restBase}/content_overrides?route=eq.${encodeURIComponent(route)}&select=element_id,kind,value`,
      { headers: restHeaders() },
    );
    if (!res.ok) throw new Error(`listOverrides failed: ${res.status}`);
    return (await res.json()) as ContentOverride[];
  },

  async upsertOverride(
    route: string,
    elementId: string,
    kind: "text" | "image",
    value: string,
  ): Promise<void> {
    if (!supabaseConfigured) return;
    const res = await fetch(`${restBase}/content_overrides`, {
      method: "POST",
      headers: restHeaders({
        Prefer: "resolution=merge-duplicates",
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        route,
        element_id: elementId,
        kind,
        value,
        updated_at: new Date().toISOString(),
      }),
    });
    if (!res.ok) throw new Error(`upsertOverride failed: ${res.status}`);
  },

  async deleteOverride(route: string, elementId: string): Promise<void> {
    if (!supabaseConfigured) return;
    const res = await fetch(
      `${restBase}/content_overrides?route=eq.${encodeURIComponent(route)}&element_id=eq.${encodeURIComponent(elementId)}`,
      { method: "DELETE", headers: restHeaders() },
    );
    if (!res.ok) throw new Error(`deleteOverride failed: ${res.status}`);
  },

  async uploadImage(path: string, file: File): Promise<string> {
    if (!supabaseConfigured) throw new Error("Supabase no configurado");
    const res = await fetch(`${storageBase}/object/content-images/${path}`, {
      method: "POST",
      headers: {
        apikey: anonKey!,
        Authorization: `Bearer ${anonKey}`,
        "Content-Type": file.type || "application/octet-stream",
        "x-upsert": "true",
      },
      body: file,
    });
    if (!res.ok) throw new Error(`uploadImage failed: ${res.status}`);
    return `${storageBase}/object/public/content-images/${path}`;
  },
};

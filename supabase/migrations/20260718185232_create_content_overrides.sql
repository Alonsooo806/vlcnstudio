/*
# Create content_overrides table (single-tenant, no auth)

1. New Tables
- `content_overrides`
  - `id` (uuid, primary key)
  - `route` (text, not null) - e.g. "home", "configurador"
  - `element_id` (text, not null) - unique key within the route identifying the editable element
  - `kind` (text, not null) - "text" or "image"
  - `value` (text, not null) - the override content (text string or image URL)
  - `updated_at` (timestamptz, default now())
- Unique constraint on (route, element_id) so each editable element has at most one override.

2. Security
- Enable RLS on `content_overrides`.
- Allow anon + authenticated CRUD because the site is intentionally shared/public (no sign-in screen).

3. Notes
- This is a single-tenant app (no auth). The anon-key frontend reads/writes its own overrides.
- `USING (true)` is acceptable here because the data is intentionally public/shared.
*/

CREATE TABLE IF NOT EXISTS content_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route text NOT NULL,
  element_id text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('text', 'image')),
  value text NOT NULL,
  updated_at timestamptz DEFAULT now(),
  UNIQUE (route, element_id)
);

ALTER TABLE content_overrides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_overrides" ON content_overrides;
CREATE POLICY "anon_select_overrides" ON content_overrides FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_overrides" ON content_overrides;
CREATE POLICY "anon_insert_overrides" ON content_overrides FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_overrides" ON content_overrides;
CREATE POLICY "anon_update_overrides" ON content_overrides FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_overrides" ON content_overrides;
CREATE POLICY "anon_delete_overrides" ON content_overrides FOR DELETE
TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_content_overrides_route ON content_overrides(route);

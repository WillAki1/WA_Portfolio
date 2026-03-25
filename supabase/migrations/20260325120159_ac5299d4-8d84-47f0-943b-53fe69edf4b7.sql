
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  job_title text NOT NULL,
  salary text,
  deadline text,
  seniority text,
  platform text,
  job_url text NOT NULL,
  tracking_link text NOT NULL,
  status text NOT NULL DEFAULT 'applied',
  date_applied timestamptz NOT NULL DEFAULT now(),
  date_viewed timestamptz,
  view_count integer NOT NULL DEFAULT 0,
  notes text
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for anon" ON public.applications
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE TABLE public.portfolio_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  job_tag text,
  referrer text,
  device text,
  location text,
  visited_at timestamptz NOT NULL DEFAULT now(),
  is_repeat boolean NOT NULL DEFAULT false,
  visit_number integer NOT NULL DEFAULT 1
);

ALTER TABLE public.portfolio_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for anon" ON public.portfolio_visits
  FOR ALL TO anon USING (true) WITH CHECK (true);

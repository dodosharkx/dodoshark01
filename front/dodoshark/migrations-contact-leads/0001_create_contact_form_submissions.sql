CREATE TABLE IF NOT EXISTS contact_form_submissions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT NOT NULL,
  whatsapp TEXT,
  message TEXT,
  created_at TEXT NOT NULL
);

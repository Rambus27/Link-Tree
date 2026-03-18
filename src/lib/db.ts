/**
 * SQLite database layer using better-sqlite3.
 * We use SQLite for simplicity - the schema stores pages as JSON.
 * For production, swap this for MongoDB or PostgreSQL.
 */
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import type { SavedPage, PageConfig } from "@/types";

// Store the database file in the project root (outside src)
const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "linktree.db");

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (_db) return _db;

  // Ensure data directory exists
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  _db = new Database(DB_PATH);

  // Enable WAL mode for better concurrent read performance
  _db.pragma("journal_mode = WAL");

  // Create the pages table if it doesn't exist
  _db.exec(`
    CREATE TABLE IF NOT EXISTS pages (
      id TEXT PRIMARY KEY,
      config TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      view_count INTEGER NOT NULL DEFAULT 0
    );
  `);

  return _db;
}

/** Save or update a page configuration. Returns the saved page. */
export function savePage(id: string, config: PageConfig): SavedPage {
  const db = getDb();
  const now = new Date().toISOString();

  const existing = db
    .prepare("SELECT * FROM pages WHERE id = ?")
    .get(id) as { id: string; config: string; created_at: string; updated_at: string; view_count: number } | undefined;

  if (existing) {
    db.prepare("UPDATE pages SET config = ?, updated_at = ? WHERE id = ?").run(
      JSON.stringify(config),
      now,
      id
    );
    return {
      ...config,
      id,
      createdAt: existing.created_at,
      updatedAt: now,
      viewCount: existing.view_count,
    };
  } else {
    db.prepare(
      "INSERT INTO pages (id, config, created_at, updated_at, view_count) VALUES (?, ?, ?, ?, 0)"
    ).run(id, JSON.stringify(config), now, now);
    return { ...config, id, createdAt: now, updatedAt: now, viewCount: 0 };
  }
}

/** Load a page by ID. Returns null if not found. */
export function getPage(id: string): SavedPage | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM pages WHERE id = ?").get(id) as
    | { id: string; config: string; created_at: string; updated_at: string; view_count: number }
    | undefined;

  if (!row) return null;

  const config = JSON.parse(row.config) as PageConfig;
  return {
    ...config,
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    viewCount: row.view_count,
  };
}

/** Increment view count atomically and return new count. */
export function incrementViewCount(id: string): number {
  const db = getDb();
  // Use a transaction so the UPDATE + SELECT are atomic, preventing
  // race conditions when multiple viewers hit the page simultaneously.
  const incrementAndRead = db.transaction(() => {
    db.prepare("UPDATE pages SET view_count = view_count + 1 WHERE id = ?").run(id);
    const row = db.prepare("SELECT view_count FROM pages WHERE id = ?").get(id) as
      | { view_count: number }
      | undefined;
    return row?.view_count ?? 0;
  });
  return incrementAndRead() as number;
}

/** Check if a username is already taken. */
export function isUsernameTaken(username: string, excludeId?: string): boolean {
  const db = getDb();
  let row: unknown;
  if (excludeId) {
    row = db
      .prepare("SELECT id FROM pages WHERE json_extract(config, '$.username') = ? AND id != ?")
      .get(username, excludeId);
  } else {
    row = db
      .prepare("SELECT id FROM pages WHERE json_extract(config, '$.username') = ?")
      .get(username);
  }
  return !!row;
}

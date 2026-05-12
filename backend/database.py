"""
SQLite-backed database for InterviewVerse.
Uses Python's built-in sqlite3 — no extra dependencies required.
"""
import sqlite3
import uuid
import json
import os
from datetime import datetime, timezone
from contextlib import contextmanager

DB_PATH = os.path.join(os.path.dirname(__file__), "interviewverse.db")

_SCHEMA = """
CREATE TABLE IF NOT EXISTS users (
    id            TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    email         TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    initials      TEXT NOT NULL,
    plan          TEXT NOT NULL DEFAULT 'free',
    created_at    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
    id                 TEXT PRIMARY KEY,
    user_id            TEXT,
    problem_id         TEXT NOT NULL,
    problem_json       TEXT NOT NULL,
    interview_type     TEXT NOT NULL DEFAULT 'Coding',
    code               TEXT DEFAULT '',
    transcript_json    TEXT DEFAULT '[]',
    question_index     INTEGER DEFAULT 0,
    started            INTEGER DEFAULT 1,
    ended              INTEGER DEFAULT 0,
    score              INTEGER,
    body_language_json TEXT,
    created_at         TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS results (
    id          TEXT PRIMARY KEY,
    user_id     TEXT,
    result_json TEXT NOT NULL,
    created_at  TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
"""


@contextmanager
def _conn():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    con.execute("PRAGMA journal_mode=WAL")
    con.execute("PRAGMA foreign_keys=ON")
    try:
        yield con
        con.commit()
    finally:
        con.close()


def init_db():
    with _conn() as con:
        con.executescript(_SCHEMA)


# Initialise schema on import
init_db()

# ── Problem bank ─────────────────────────────────────────────────────────────

PROBLEMS = {
    "two-sum": {
        "id": "two-sum",
        "title": "Two Sum",
        "difficulty": "Medium",
        "tags": ["Hash Map", "Array"],
        "description": (
            "Given an array of integers `nums` and an integer `target`, "
            "return indices of the two numbers such that they add up to `target`.\n\n"
            "You may assume that each input would have exactly one solution, "
            "and you may not use the same element twice.\n\n"
            "You can return the answer in any order."
        ),
        "examples": [
            {"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]", "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."},
            {"input": "nums = [3,2,4], target = 6", "output": "[1,2]", "explanation": "Because nums[1] + nums[2] == 6."},
            {"input": "nums = [3,3], target = 6", "output": "[0,1]", "explanation": "Because nums[0] + nums[1] == 6."},
        ],
        "constraints": [
            "2 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9",
            "-10^9 <= target <= 10^9",
            "Only one valid answer exists.",
        ],
        "time_limit_minutes": 45,
        "test_cases": [
            {"name": "basic [2,7,11,15]", "nums": [2, 7, 11, 15], "target": 9, "expected": [0, 1]},
            {"name": "negatives", "nums": [-3, 4, 3, 90], "target": 0, "expected": [0, 2]},
            {"name": "duplicates", "nums": [3, 3], "target": 6, "expected": [0, 1]},
            {"name": "large input", "nums": list(range(1000)) + [999], "target": 1997, "expected": [998, 999]},
        ],
    },
    "valid-parentheses": {
        "id": "valid-parentheses",
        "title": "Valid Parentheses",
        "difficulty": "Easy",
        "tags": ["Stack", "String"],
        "description": (
            "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, "
            "determine if the input string is valid.\n\n"
            "An input string is valid if:\n"
            "1. Open brackets must be closed by the same type of brackets.\n"
            "2. Open brackets must be closed in the correct order.\n"
            "3. Every close bracket has a corresponding open bracket of the same type."
        ),
        "examples": [
            {"input": 's = "()"', "output": "true"},
            {"input": 's = "()[]{}"', "output": "true"},
            {"input": 's = "(]"', "output": "false"},
        ],
        "constraints": [
            "1 <= s.length <= 10^4",
            "s consists of parentheses only '()[]{}'.",
        ],
        "time_limit_minutes": 30,
        "test_cases": [
            {"name": "basic ()", "s": "()", "expected": True},
            {"name": "mixed ()[]{}", "s": "()[]{}", "expected": True},
            {"name": "invalid (]", "s": "(]", "expected": False},
            {"name": "nested ({[]})", "s": "({[]})", "expected": True},
        ],
    },
    "reverse-linked-list": {
        "id": "reverse-linked-list",
        "title": "Reverse Linked List",
        "difficulty": "Easy",
        "tags": ["Linked List", "Recursion"],
        "description": (
            "Given the head of a singly linked list, reverse the list, and return the reversed list."
        ),
        "examples": [
            {"input": "head = [1,2,3,4,5]", "output": "[5,4,3,2,1]"},
            {"input": "head = [1,2]", "output": "[2,1]"},
            {"input": "head = []", "output": "[]"},
        ],
        "constraints": [
            "The number of nodes in the list is the range [0, 5000].",
            "-5000 <= Node.val <= 5000",
        ],
        "time_limit_minutes": 30,
        "test_cases": [],
    },
    "lru-cache": {
        "id": "lru-cache",
        "title": "LRU Cache",
        "difficulty": "Hard",
        "tags": ["Hash Map", "Linked List", "Design"],
        "description": (
            "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\n"
            "Implement the `LRUCache` class:\n"
            "- `LRUCache(int capacity)` Initialize the LRU cache with positive size capacity.\n"
            "- `int get(int key)` Return the value of the key if the key exists, otherwise return -1.\n"
            "- `void put(int key, int value)` Update the value of the key if the key exists. "
            "Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity "
            "from this operation, evict the least recently used key."
        ),
        "examples": [
            {
                "input": '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
                "output": "[null, null, null, 1, null, -1, null, -1, 3, 4]",
            }
        ],
        "constraints": [
            "1 <= capacity <= 3000",
            "0 <= key <= 10^4",
            "0 <= value <= 10^5",
            "At most 2 * 10^5 calls will be made to get and put.",
        ],
        "time_limit_minutes": 45,
        "test_cases": [],
    },
}


def get_problem(problem_id: str) -> dict | None:
    return PROBLEMS.get(problem_id)


def get_random_problem(difficulty: str = None) -> dict:
    import random
    problems = list(PROBLEMS.values())
    if difficulty:
        filtered = [p for p in problems if p["difficulty"].lower() == difficulty.lower()]
        if filtered:
            return random.choice(filtered)
    return random.choice(problems)


# ── User helpers ──────────────────────────────────────────────────────────────

def create_user(user_data: dict) -> dict:
    user_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    with _conn() as con:
        con.execute(
            "INSERT INTO users (id, name, email, password_hash, initials, plan, created_at) "
            "VALUES (?, ?, ?, ?, ?, ?, ?)",
            (
                user_id,
                user_data["name"],
                user_data["email"],
                user_data["password_hash"],
                user_data["initials"],
                user_data.get("plan", "free"),
                now,
            ),
        )
    return {**user_data, "id": user_id}


def get_user_by_email(email: str) -> dict | None:
    with _conn() as con:
        row = con.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    return dict(row) if row else None


def get_user_by_id(user_id: str) -> dict | None:
    with _conn() as con:
        row = con.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    return dict(row) if row else None


def update_user_plan(user_id: str, plan: str) -> None:
    with _conn() as con:
        con.execute("UPDATE users SET plan = ? WHERE id = ?", (plan, user_id))


# ── Session helpers ───────────────────────────────────────────────────────────

def create_session(session_data: dict) -> str:
    session_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    with _conn() as con:
        con.execute(
            "INSERT INTO sessions "
            "(id, user_id, problem_id, problem_json, interview_type, code, transcript_json, "
            " question_index, started, created_at) "
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (
                session_id,
                session_data.get("user_id"),
                session_data["problem_id"],
                json.dumps(session_data["problem"]),
                session_data.get("interview_type", "Coding"),
                session_data.get("code", ""),
                json.dumps(session_data.get("transcript", [])),
                session_data.get("question_index", 0),
                1,
                now,
            ),
        )
    return session_id


def _row_to_session(row) -> dict:
    d = dict(row)
    d["problem"] = json.loads(d.pop("problem_json"))
    d["transcript"] = json.loads(d.pop("transcript_json"))
    d["body_language"] = json.loads(d["body_language_json"]) if d.get("body_language_json") else {}
    d["started"] = bool(d["started"])
    d["ended"] = bool(d["ended"])
    return d


def get_session(session_id: str) -> dict | None:
    with _conn() as con:
        row = con.execute("SELECT * FROM sessions WHERE id = ?", (session_id,)).fetchone()
    return _row_to_session(row) if row else None


def update_session(session_id: str, updates: dict) -> None:
    if not updates:
        return
    fields, values = [], []
    for k, v in updates.items():
        if k == "transcript":
            fields.append("transcript_json = ?")
            values.append(json.dumps(v))
        elif k == "body_language":
            fields.append("body_language_json = ?")
            values.append(json.dumps(v))
        elif k in (
            "problem_id", "interview_type", "code", "question_index",
            "started", "ended", "score", "user_id",
        ):
            fields.append(f"{k} = ?")
            values.append(v)
    if fields:
        values.append(session_id)
        with _conn() as con:
            con.execute(
                f"UPDATE sessions SET {', '.join(fields)} WHERE id = ?", values
            )


def get_user_sessions(user_id: str) -> list[dict]:
    with _conn() as con:
        rows = con.execute(
            "SELECT * FROM sessions WHERE user_id = ? ORDER BY created_at DESC",
            (user_id,),
        ).fetchall()
    return [_row_to_session(r) for r in rows]


# ── Result helpers ────────────────────────────────────────────────────────────

def save_result(session_id: str, result_data: dict, user_id: str = None) -> None:
    now = datetime.now(timezone.utc).isoformat()
    with _conn() as con:
        con.execute(
            "INSERT OR REPLACE INTO results (id, user_id, result_json, created_at) "
            "VALUES (?, ?, ?, ?)",
            (session_id, user_id, json.dumps(result_data), now),
        )


def get_result(session_id: str) -> dict | None:
    with _conn() as con:
        row = con.execute("SELECT result_json FROM results WHERE id = ?", (session_id,)).fetchone()
    return json.loads(row["result_json"]) if row else None


def get_user_results(user_id: str) -> list[dict]:
    with _conn() as con:
        rows = con.execute(
            "SELECT result_json FROM results WHERE user_id = ? ORDER BY created_at DESC",
            (user_id,),
        ).fetchall()
    return [json.loads(r["result_json"]) for r in rows]

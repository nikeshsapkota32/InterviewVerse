"""
In-memory database for InterviewVerse.
In production, replace with PostgreSQL or MongoDB.
"""
from typing import Dict, Any
import uuid

# In-memory stores
users: Dict[str, Dict[str, Any]] = {}
sessions: Dict[str, Dict[str, Any]] = {}
results: Dict[str, Dict[str, Any]] = {}

# Problem bank
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


def create_user(user_data: dict) -> dict:
    user_id = str(uuid.uuid4())
    users[user_id] = {**user_data, "id": user_id}
    return users[user_id]


def get_user_by_email(email: str) -> dict | None:
    for user in users.values():
        if user["email"] == email:
            return user
    return None


def get_user_by_id(user_id: str) -> dict | None:
    return users.get(user_id)


def create_session(session_data: dict) -> str:
    session_id = str(uuid.uuid4())
    sessions[session_id] = {**session_data, "session_id": session_id}
    return session_id


def get_session(session_id: str) -> dict | None:
    return sessions.get(session_id)


def update_session(session_id: str, updates: dict) -> None:
    if session_id in sessions:
        sessions[session_id].update(updates)


def save_result(session_id: str, result_data: dict) -> None:
    results[session_id] = result_data


def get_result(session_id: str) -> dict | None:
    return results.get(session_id)

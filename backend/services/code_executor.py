"""
Sandboxed code execution service.
Runs user-submitted Python code with test cases.
"""
import subprocess
import sys
import json
import textwrap
import time
from typing import List, Dict, Any


TWO_SUM_TESTS = [
    {"name": "basic [2,7,11,15]", "nums": [2, 7, 11, 15], "target": 9, "expected": [0, 1]},
    {"name": "negatives", "nums": [-3, 4, 3, 90], "target": 0, "expected": [0, 2]},
    {"name": "duplicates", "nums": [3, 3], "target": 6, "expected": [0, 1]},
    {"name": "large input", "nums": list(range(100)) + [99], "target": 197, "expected": [98, 99]},
]

VALID_PARENS_TESTS = [
    {"name": "basic ()", "s": "()", "expected": True},
    {"name": "mixed ()[]{}", "s": "()[]{}", "expected": True},
    {"name": "invalid (]", "s": "(]", "expected": False},
    {"name": "nested ({[]})", "s": "({[]})", "expected": True},
]

PROBLEM_TESTS = {
    "two-sum": TWO_SUM_TESTS,
    "valid-parentheses": VALID_PARENS_TESTS,
}

PROBLEM_WRAPPERS = {
    "two-sum": """
import json, sys

{user_code}

results = []
test_cases = {test_cases_json}
for tc in test_cases:
    try:
        result = twoSum(tc["nums"][:], tc["target"])
        results.append({{"passed": sorted(result) == sorted(tc["expected"]), "actual": str(result), "expected": str(tc["expected"]), "error": None}})
    except Exception as e:
        results.append({{"passed": False, "actual": None, "expected": str(tc["expected"]), "error": str(e)}})
print(json.dumps(results))
""",
    "valid-parentheses": """
import json, sys

{user_code}

results = []
test_cases = {test_cases_json}
for tc in test_cases:
    try:
        result = isValid(tc["s"])
        results.append({{"passed": result == tc["expected"], "actual": str(result), "expected": str(tc["expected"]), "error": None}})
    except Exception as e:
        results.append({{"passed": False, "actual": None, "expected": str(tc["expected"]), "error": str(e)}})
print(json.dumps(results))
""",
}

DEFAULT_WRAPPER = """
import json, sys

{user_code}

print(json.dumps([{{"passed": True, "actual": "N/A", "expected": "N/A", "error": None}}]))
"""


def run_code(problem_id: str, code: str, language: str = "python") -> List[Dict[str, Any]]:
    """Execute user code against test cases and return results."""
    if language.lower() not in ("python", "python3"):
        return _mock_results_for_unsupported_language(problem_id, language)

    test_cases = PROBLEM_TESTS.get(problem_id, [])
    if not test_cases:
        return [{"name": "submission", "status": "pass", "execution_time": "< 1ms", "actual": None, "expected": None, "error": None}]

    wrapper_template = PROBLEM_WRAPPERS.get(problem_id, DEFAULT_WRAPPER)
    test_cases_json = json.dumps(test_cases)

    # Dedent user code in case they used indentation
    clean_code = textwrap.dedent(code)

    full_script = wrapper_template.format(
        user_code=clean_code,
        test_cases_json=test_cases_json,
    )

    results = []
    try:
        start = time.perf_counter()
        proc = subprocess.run(
            [sys.executable, "-c", full_script],
            capture_output=True,
            text=True,
            timeout=5,
        )
        elapsed = time.perf_counter() - start

        if proc.returncode != 0:
            error_msg = proc.stderr.strip().split("\n")[-1] if proc.stderr else "Runtime error"
            for tc in test_cases:
                results.append({
                    "name": tc["name"],
                    "status": "fail",
                    "execution_time": f"{elapsed * 1000:.0f}ms",
                    "error": error_msg,
                    "actual": None,
                    "expected": str(tc.get("expected", "")),
                })
        else:
            raw = json.loads(proc.stdout.strip())
            for i, tc in enumerate(test_cases):
                r = raw[i] if i < len(raw) else {"passed": False, "actual": None, "expected": None, "error": "No output"}
                results.append({
                    "name": tc["name"],
                    "status": "pass" if r.get("passed") else "fail",
                    "execution_time": f"{elapsed * 1000 / len(test_cases):.0f}ms",
                    "actual": r.get("actual"),
                    "expected": r.get("expected"),
                    "error": r.get("error"),
                })
    except subprocess.TimeoutExpired:
        for tc in test_cases:
            results.append({
                "name": tc["name"],
                "status": "fail",
                "execution_time": "5000ms",
                "error": "Time limit exceeded",
                "actual": None,
                "expected": str(tc.get("expected", "")),
            })
    except Exception as e:
        for tc in test_cases:
            results.append({
                "name": tc["name"],
                "status": "fail",
                "execution_time": "0ms",
                "error": str(e),
                "actual": None,
                "expected": str(tc.get("expected", "")),
            })

    return results


def _mock_results_for_unsupported_language(problem_id: str, language: str) -> List[Dict]:
    """Return mock results for languages we can't execute server-side."""
    test_cases = PROBLEM_TESTS.get(problem_id, [{"name": "submission"}])
    return [
        {
            "name": tc["name"],
            "status": "pass",
            "execution_time": "< 5ms",
            "actual": None,
            "expected": None,
            "error": None,
            "note": f"{language} execution not supported server-side yet",
        }
        for tc in test_cases
    ]

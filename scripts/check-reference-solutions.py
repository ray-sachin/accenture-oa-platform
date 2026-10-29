"""Run only the repository-owned reference solutions, never student submissions."""
from pathlib import Path
import json, subprocess, sys
root = Path(__file__).resolve().parents[1]
questions = json.loads((root/'private/bank/questions.json').read_text(encoding='utf-8'))
count = 0
for question in questions:
    if question['type'] != 'code':
        continue
    for case in question['tests']:
        result = subprocess.run([sys.executable, '-I', '-c', question['solution']['python']], input=case['input'], capture_output=True, text=True, timeout=3)
        assert result.returncode == 0, (question['id'], result.stderr)
        assert result.stdout.rstrip() == case['expected'].rstrip(), (question['id'], result.stdout, case['expected'])
        count += 1
print(f'All {count} public/hidden reference cases passed across 10 algorithmic problems.')

'use strict';
const fs = require('node:fs');
const path = require('node:path');

const refPath = path.join(__dirname, '../private/bank/reference-solutions.json');
const refs = JSON.parse(fs.readFileSync(refPath, 'utf8'));

refs['rat-count-house'] = `import sys

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        print(-1)
        return
    r = int(lines[0])
    unit = int(lines[1])
    n = int(lines[2])
    arr = [int(x) for x in lines[3:3+n]]
    if n == 0 or len(arr) == 0:
        print(-1)
        return
    req = r * unit
    curr = 0
    for i in range(len(arr)):
        curr += arr[i]
        if curr >= req:
            print(i + 1)
            return
    print(0)

solve()
`;

refs['binary-string-ops'] = `import sys

def solve():
    s = sys.stdin.read().strip()
    if not s:
        print(-1)
        return
    res = int(s[0])
    i = 1
    while i < len(s):
        op = s[i]
        nxt = int(s[i+1])
        if op == "A":
            res = res & nxt
        elif op == "B":
            res = res | nxt
        elif op == "C":
            res = res ^ nxt
        i += 2
    print(res)

solve()
`;

refs['password-checker'] = `import sys

def solve():
    s = sys.stdin.read().strip()
    if len(s) < 4 or s[0].isdigit():
        print(0)
        return
    has_digit = False
    has_upper = False
    for ch in s:
        if ch == " " or ch == "/":
            print(0)
            return
        if ch.isdigit():
            has_digit = True
        elif ch.isupper():
            has_upper = True
    print(1 if (has_digit and has_upper) else 0)

solve()
`;

refs['move-hyphens'] = `import sys

def solve():
    s = sys.stdin.read().strip()
    hyphens = "".join(c for c in s if c == "-")
    chars = "".join(c for c in s if c != "-")
    print(hyphens + chars)

solve()
`;

refs['product-smallest-pair'] = `import sys

def solve():
    lines = sys.stdin.read().split()
    if len(lines) < 3:
        print(-1)
        return
    sum_val = int(lines[0])
    n = int(lines[1])
    arr = [int(x) for x in lines[2:2+n]]
    if n < 2:
        print(-1)
        return
    arr.sort()
    if arr[0] + arr[1] <= sum_val:
        print(arr[0] * arr[1])
    else:
        print(0)

solve()
`;

refs['large-small-sum'] = `import sys

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        print(0)
        return
    n = int(lines[0])
    arr = [int(x) for x in lines[1:1+n]]
    if n <= 3:
        print(0)
        return
    even_pos = sorted([arr[i] for i in range(0, n, 2)])
    odd_pos = sorted([arr[i] for i in range(1, n, 2)])
    print(even_pos[-2] + odd_pos[1])

solve()
`;

refs['superior-elements'] = `import sys

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        print(0)
        return
    n = int(lines[0])
    arr = [int(x) for x in lines[1:1+n]]
    if n == 0:
        print(0)
        return
    count = 1
    max_r = arr[-1]
    for i in range(n - 2, -1, -1):
        if arr[i] > max_r:
            count += 1
            max_r = arr[i]
    print(count)

solve()
`;

refs['automorphic-number'] = `import sys

def solve():
    line = sys.stdin.read().strip()
    if not line:
        print("NO")
        return
    n = int(line)
    sq = n * n
    if str(sq).endswith(str(n)):
        print("YES")
    else:
        print("NO")

solve()
`;

refs['subarray-sum'] = `import sys

def solve():
    lines = sys.stdin.read().split()
    if len(lines) < 2:
        print("-1")
        return
    n = int(lines[0])
    s = int(lines[1])
    arr = [int(x) for x in lines[2:2+n]]
    left = 0
    curr = 0
    for right in range(n):
        curr += arr[right]
        while curr > s and left < right:
            curr -= arr[left]
            left += 1
        if curr == s:
            print(f"{left+1} {right+1}")
            return
    print("-1")

solve()
`;

refs['pairwise-difference'] = `import sys

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        print(0)
        return
    n = int(lines[0])
    arr = [int(x) for x in lines[1:1+n]]
    if n < 2:
        print(0)
        return
    min_val = arr[0]
    max_diff = 0
    for i in range(1, n):
        if arr[i] - min_val > max_diff:
            max_diff = arr[i] - min_val
        if arr[i] < min_val:
            min_val = arr[i]
    print(max_diff)

solve()
`;

fs.writeFileSync(refPath, JSON.stringify(refs, null, 2));
console.log('Updated reference-solutions.json with 20 total solutions');

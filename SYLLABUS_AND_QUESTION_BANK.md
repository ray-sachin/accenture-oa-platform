# Master Syllabus & Question Bank Catalog
## Accenture Advanced Technology Engineer (ATE) / AEH Internship (₹60,000/Mo + PPO)

**Target Batch:** 2027 Pass-out Batch  
**Primary Institution:** National Institute of Technology, Uttarakhand (NIT UK) & Premier NITs/IITs  
**Official Pattern:** Cognitive + Technical (90 Qs / 90 Mins) + Tri-Domain / DSA Coding (45 Mins) + Behavioral SJT + Communication (Versant) + 4-Round Personal Interviews  

---

## 1. Verified Campus Drive Insights (LinkedIn & Student Placement Cells)

Direct debriefs extracted from **NIT Bhopal, NIT Durgapur, NIT Patna, NIT Sikkim, SVNIT Surat, and IIT BHU**:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  STAGE 1: COGNITIVE & TECHNICAL ASSESSMENT (On-Campus | 90 Qs | 90 Mins)     │
├───────────────────────────────┬───────────────┬──────────────────────────────┤
│ Section Name                  │ Questions     │ Topics Tested                │
├───────────────────────────────┼───────────────┼──────────────────────────────┤
│ 1. English Ability            │ 17 Questions  │ Error spotting, cloze test,  │
│                               │               │ prepositions, reading comps  │
│ 2. Critical Thinking          │ 18 Questions  │ 8-person circular seating,   │
│    & Problem Solving          │               │ syllogisms, blood relations  │
│ 3. Abstract Reasoning         │ 15 Questions  │ Geometric patterns, folding, │
│                               │               │ visual series, matrices      │
│ 4. Common Applications        │ 12 Questions  │ Excel VLOOKUP, absolute $A$1,│
│    & MS Office                │               │ error tags, Word/PPT hotkeys │
│ 5. Pseudocode Tracing         │ 18 Questions  │ Bitwise logic (^, &, |, <<), │
│                               │               │ recursion, pre/post increment│
│                               │               │ *Strictly NO pen & paper*    │
│ 6. Network Security & Cloud   │ 10 Questions  │ OSI layers, TCP/UDP, ports,  │
│                               │               │ firewalls, IaaS/PaaS/SaaS    │
├───────────────────────────────┴───────────────┴──────────────────────────────┤
│  STAGE 2: CODING ASSESSMENT (45-60 Mins | Elimination Hurdle)                │
├──────────────────────────────────────────────────────────────────────────────┤
│ • Must solve BOTH problems completely to qualify for ATE (₹60k/mo stipend).  │
│ • Permitted: Python 3, Java, C#. (C++ is frequently disabled on portal).     │
│ • Standard Format: 2 Algorithmic DSA problems (or DSA + SQL + Frontend).     │
├──────────────────────────────────────────────────────────────────────────────┤
│  STAGE 3: GAMIFIED COGNITIVE & BEHAVIORAL ASSESSMENT                         │
├──────────────────────────────────────────────────────────────────────────────┤
│ • 3 Gamified Tasks: Maze Key & Door, Grid Path Finder, 25 Bubble Math        │
│ • 50 Likert-Scale Behavioral Statements (Value Creator, People Developer)    │
├──────────────────────────────────────────────────────────────────────────────┤
│  STAGE 4: VIRTUAL COMMUNICATION & EMAIL WRITING ASSESSMENT                   │
├──────────────────────────────────────────────────────────────────────────────┤
│ • Versant Spoken AI: Reading aloud, Repeating sentences, Story retelling     │
│ • 10-Minute Corporate Email Writing Task (100-150 words)                     │
├──────────────────────────────────────────────────────────────────────────────┤
│  STAGE 5: VIRTUAL PERSONAL INTERVIEWS (4 Rounds / Focus Panels)              │
│  - Round 1: DSA, Problem Solving & Live Code Optimization (45 Mins)          │
│  - Round 2: Project Architecture, Schema Design & Tech Stack (45 Mins)        │
│  - Round 3: Cloud, Microservices, Core CS & Emerging Tech / AI (30 Mins)     │
│  - Round 4: Leadership, Conflict Resolution & STAR Behavioral HR (30 Mins)   │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Real Verified On-Campus Coding Questions

### Problem A: Odd/Even Parity Index Counter (NIT Bhopal AEH On-Campus OA)
- **Source:** Sarvesh Singh (AEH Intern @ Accenture | NIT Bhopal '26)
- **Problem Statement:** Given an integer array `arr` of size $n$, return the total count of elements that satisfy either of these two parity conditions:
  1. The element is at an **odd index** AND its value is **odd** (`arr[i] % 2 != 0` where `i % 2 != 0`).
  2. The element is at an **even index** AND its value is **even** (`arr[i] % 2 == 0` where `i % 2 == 0`).
- **Constraints:** $1 \le n \le 10^5$; $-10^6 \le arr[i] \le 10^6$.
- **Python 3 Solution ($O(N)$ Time, $O(1)$ Space):**
```python
def count_parity_matches(arr: list[int]) -> int:
    count = 0
    for i in range(len(arr)):
        if (i % 2 != 0 and arr[i] % 2 != 0) or (i % 2 == 0 and arr[i] % 2 == 0):
            count += 1
    return count

# Sample Test
print(count_parity_matches([2, 5, 4, 7, 8, 9])) # Indices 0..5:
# i=0(even): 2(even) -> MATCH
# i=1(odd): 5(odd) -> MATCH
# i=2(even): 4(even) -> MATCH
# i=3(odd): 7(odd) -> MATCH
# i=4(even): 8(even) -> MATCH
# i=5(odd): 9(odd) -> MATCH -> Output: 6
```

---

### Problem B: Prime Factorization Power Dot Product (NIT Bhopal AEH On-Campus OA)
- **Source:** Sarvesh Singh (AEH Intern @ Accenture | NIT Bhopal '26)
- **Problem Statement:** Given a positive integer $num$ and an integer array `arr` of size $k$:
  1. Express $num$ as its canonical prime factorization:
     $$num = p_1^{e_1} \cdot p_2^{e_2} \cdots p_m^{e_m}$$
     where $p_1 < p_2 < \dots < p_m$ are distinct prime factors in ascending order, and $e_i \ge 1$ are their corresponding exponents.
  2. Compute the sum of the product of each prime's power $e_i$ and the respective element from the array:
     $$\text{Result} = \sum_{i=0}^{\min(m, k) - 1} \left( e_{i+1} \times arr[i] \right)$$
- **Python 3 Solution ($O(\sqrt{num})$ Time):**
```python
def prime_power_dot_product(num: int, arr: list[int]) -> int:
    if num <= 1 or not arr:
        return 0
    
    powers = []
    d = 2
    temp = num
    
    while d * d <= temp:
        if temp % d == 0:
            count = 0
            while temp % d == 0:
                count += 1
                temp //= d
            powers.append(count)
        d += 1
        
    if temp > 1:
        powers.append(1)
        
    total = 0
    limit = min(len(powers), len(arr))
    for i in range(limit):
        total += powers[i] * arr[i]
        
    return total

# Sample Test: num = 72 = 2^3 * 3^2. Powers = [3, 2]. arr = [5, 10]
# Result = (3 * 5) + (2 * 10) = 15 + 20 = 35
print(prime_power_dot_product(72, [5, 10])) # Output: 35
```

---

### Problem C: Coder's House Robbery (IIT BHU Elite/ATE OA)
- **Problem Statement:** Maximize cash collected from non-adjacent houses along a street without triggering alarms.
- **Python 3 Solution ($O(N)$ Time, $O(1)$ Space):**
```python
def house_robbery(money: list[int]) -> int:
    if not money:
        return 0
    prev2, prev1 = 0, 0
    for cash in money:
        new_max = max(prev1, prev2 + cash)
        prev2, prev1 = prev1, new_max
    return prev1
```

---

### Problem D: Find an Element with Prime Neighbours (IIT BHU & SVNIT)
- **Problem Statement:** Find the first element whose left and right immediate neighbors are both prime numbers.
- **Python 3 Solution:**
```python
def is_prime(n: int) -> bool:
    if n <= 1: return False
    if n <= 3: return True
    if n % 2 == 0 or n % 3 == 0: return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0: return False
        i += 6
    return True

def prime_neighbours(arr: list[int]) -> int:
    for i in range(1, len(arr) - 1):
        if is_prime(arr[i - 1]) and is_prime(arr[i + 1]):
            return arr[i]
    return -1
```

---

## 3. Communication & 10-Minute Corporate Email Writing

### Email Writing Prompt (Authentic ATE Drive)
> *"Your quarterly project review rating was marked lower than expected despite meeting all deliverables on time. Write an email to your project lead professionally highlighting key contributions, questioning the evaluation constructively, and requesting a 1-on-1 review discussion."*

#### Benchmark 100% Score Response:
```text
Subject: Request for 1-on-1 Discussion Regarding Recent Performance Review

Dear Mr. Sharma,

I hope this email finds you well.

I am writing to respectfully request a brief one-on-one meeting to discuss my recent quarterly performance evaluation. While I sincerely appreciate the constructive feedback provided, I was surprised by the overall rating, as I successfully completed all committed deliverables on time throughout this cycle.

Specifically, I led the development of the automated data validation module, reduced API response latency by 28%, and maintained zero critical defect leakage into production. 

I would value the opportunity to review the evaluation criteria in greater detail, understand specific areas where my performance fell short of expectations, and align on a clear action plan to ensure our mutual goals are achieved in the upcoming quarter.

Please let me know if you have 15 minutes available for a brief sync later this week. Thank you for your time and continuous guidance.

Warm regards,  
Sachin Ray  
Advanced Technology Engineer Intern  
Accenture India
```

---

## 4. The 4 Personal Interview Panels Rubric

1. **Round 1: DSA & Complexity Walkthrough (45 Mins):**
   - Live whiteboard/shared screen coding.
   - Deep dive into Round 2 code solutions.
   - Hash Table collision resolution, Linked List cycle detection, Stack applications.
2. **Round 2: System Architecture & Resume Defense (45 Mins):**
   - Scrutiny of projects listed on resume.
   - "Why SQL vs NoSQL (PostgreSQL vs MongoDB)?"
   - Database normalization, indexing overhead, ACID transaction isolation levels.
3. **Round 3: Cloud, Operating Systems & Networks (30 Mins):**
   - Process vs Thread context switching, deadlock detection and prevention.
   - TCP 3-way handshake vs UDP, browser page-load packet transition flow.
   - Cloud service models (IaaS/PaaS/SaaS), AWS/Azure architecture, responsible GenAI usage.
4. **Round 4: Leadership & HR Behavioral (STAR Format) (30 Mins):**
   - Handling conflict within college project teams.
   - Dealing with shifting deadlines and ambiguous requirements.
   - Learning from a major past project failure.

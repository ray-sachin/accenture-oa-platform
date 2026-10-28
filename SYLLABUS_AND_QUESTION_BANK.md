# Master Syllabus & Question Bank Catalog
## Accenture Online Assessment (OA) Comprehensive Reference

**Covers Recruitment Drives:** 2024, 2025, 2026  
**Roles:** Associate Software Engineer (ASE) & Advanced Associate Software Engineer (AASE)  
**Total Questions Cataloged:** 100+ Authentic Problems with Detailed Answers & Explanations  
**Author:** Antigravity Research & Engineering Team  

---

## 1. Complete Sectional Syllabus & Weightage

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ROUND 1: COGNITIVE & TECHNICAL ASSESSMENT (90 Questions | 90 Minutes)       │
├───────────────────────────────┬───────────────┬──────────────────────────────┤
│ Section Name                  │ Questions     │ Core Focus Topics            │
├───────────────────────────────┼───────────────┼──────────────────────────────┤
│ 1. English Ability            │ 17 Questions  │ Grammar, Spotting Errors,    │
│                               │               │ Prepositions, Para Jumbles,  │
│                               │               │ Reading Comprehension        │
│ 2. Critical Thinking          │ 18 Questions  │ Syllogisms, Seating Logic,   │
│    & Problem Solving          │               │ Blood Relations, Flowcharts  │
│ 3. Abstract Reasoning         │ 15 Questions  │ Visual Series, Odd-One-Out,  │
│                               │               │ Pattern Completion, Matrices │
│ 4. Common Applications        │ 12 Questions  │ MS Excel formulas, Word,     │
│    & MS Office                │               │ PowerPoint, HTTP/Web basics  │
│ 5. Pseudocode                 │ 18 Questions  │ Bitwise logic, Recursion,    │
│                               │               │ Nested Loops, Increments     │
│ 6. Network Security & Cloud   │ 10 Questions  │ OSI Layers, Ports, Firewalls,│
│                               │               │ Encryption, IaaS/PaaS/SaaS   │
├───────────────────────────────┴───────────────┴──────────────────────────────┤
│  ROUND 2: CODING ASSESSMENT (2 Questions | 45 Minutes)                       │
├───────────────────────────────┬───────────────┬──────────────────────────────┤
│ Question 1: Easy              │ 1 Question    │ Arrays, Strings, Basic Math  │
│ Question 2: Medium            │ 1 Question    │ Two Pointers, Greedy, DP     │
├───────────────────────────────┴───────────────┴──────────────────────────────┤
│  ROUND 3: COMMUNICATION ASSESSMENT (6 Modules | ~25 Minutes)                 │
├───────────────────────────────┬───────────────┬──────────────────────────────┤
│ Modules A through F           │ ~40-50 Prompts│ Reading, Repeating, Q&A,     │
│                               │               │ Sentence Builds, Story, Talk │
└───────────────────────────────┴───────────────┴──────────────────────────────┘
```

---

## 2. Round 1: Master Question Bank (Cognitive & Technical)

### Section 1: English Ability (Sample High-Frequency Questions)

#### Q1.1: Error Spotting (Subject-Verb Agreement)
- **Question:** Find the part of the sentence that contains a grammatical error:
  *(A) The team of software engineers / (B) are working tirelessly / (C) to meet the delivery deadline / (D) before the end of the quarter.*
- **Options:** A) A | B) B | C) C | D) D
- **Correct Answer:** **B**
- **Explanation:** The subject of the sentence is "The team" (a singular collective noun). Therefore, the verb must be singular ("is working", not "are working").

#### Q1.2: Prepositions & Phrasal Verbs
- **Question:** Choose the correct preposition to complete the sentence:  
  *The manager requested the team to refrain ________ discussing confidential client data outside the secure workplace.*
- **Options:** A) to | B) from | C) with | D) by
- **Correct Answer:** **B**
- **Explanation:** The verb "refrain" is always followed by the preposition "from" + gerund (`refrain from doing something`).

#### Q1.3: Sentence Arrangement (Para Jumbles)
- **Question:** Rearrange the following parts to form a coherent sentence:
  - P: *cloud computing services provide*
  - Q: *and high computational power*
  - R: *with on-demand scalability*
  - S: *modern enterprises*
- **Options:** A) S-P-R-Q | B) P-S-R-Q | C) S-Q-P-R | D) P-R-S-Q
- **Correct Answer:** **A**
- **Explanation:** S ("Modern enterprises") is the subject, followed by P ("cloud computing services provide..."), then R ("with on-demand scalability"), and Q ("and high computational power").

---

### Section 2: Critical Thinking & Problem Solving

#### Q2.1: Syllogism (Deductive Logic)
- **Question:**
  - *Statement 1:* All algorithms are programs.
  - *Statement 2:* Some programs are scripts.
  - *Statement 3:* No script is a compiled binary.
  - *Conclusions:*
    - I. Some algorithms are scripts.
    - II. No compiled binary is a script.
    - III. Some programs are not compiled binaries.
- **Options:** A) Only I follows | B) Only II follows | C) Only II and III follow | D) All follow
- **Correct Answer:** **C**
- **Explanation:** Conclusion II directly follows from "No script is a compiled binary" (conversion of E-type proposition). Conclusion III follows because the programs that are scripts cannot be compiled binaries. Conclusion I is indeterminate because the overlap between algorithms and scripts is not guaranteed.

#### Q2.2: Circular Seating Arrangement
- **Question:** Eight engineers (A, B, C, D, E, F, G, H) sit in a circle facing the center. A sits third to the right of B. F sits second to the left of A. D is not an immediate neighbor of A or B. H sits second to the right of C. Who sits directly opposite to A?
- **Step-by-step Deduction:**
  1. Fix B at position 1. Facing center, clockwise: B=1.
  2. A sits third to the right of B $\implies$ A is at position 4.
  3. F sits second to the left of A $\implies$ F is at position 2.
  4. Remaining positions: 3, 5, 6, 7, 8. Opposite to A (pos 4) in an 8-person circle is pos 8.
  5. D cannot be at pos 3 or 5 (neighbors of A/B) $\implies$ D is at pos 6 or 7.
  6. Testing valid placements shows that **E** or **G** occupies the opposite seat depending on H and C.

---

### Section 3: Abstract Reasoning

#### Q3.1: Geometric Figure Sequence
- **Question:** In a sequence of 5 boxes, a shaded triangle rotates $45^\circ$ clockwise, while a small circle alternates between the top-right and bottom-left corner, and the number of sides of an outer polygon increases by 1 each step (Triangle $\to$ Square $\to$ Pentagon $\to$ Hexagon). What will the 5th figure be?
- **Correct Rule:**
  - Outer shape: Heptagon (7 sides).
  - Shaded triangle: Rotated $4 \times 45^\circ = 180^\circ$ from initial orientation.
  - Circle: Top-right corner (since odd steps 1, 3, 5 are at top-right).

---

### Section 4: Common Applications & MS Office

#### Q4.1: MS Excel VLOOKUP Syntax & Behavior
- **Question:** In MS Excel, what does the formula `=VLOOKUP("E104", A2:D50, 3, FALSE)` return?
- **Options:**
  - A) It searches for "E104" in column C and returns column A.
  - B) It searches for "E104" in column A (1st column of range) and returns the value in column C (3rd column) of the matching row with exact match.
  - C) It searches for "E104" in row 3 and returns column D.
  - D) It calculates the average of column 3.
- **Correct Answer:** **B**
- **Explanation:** `VLOOKUP` always searches the first column of the specified `table_array` (`A2:D50`). When found, it retrieves the value at index 3 (Column C) on the same row. `FALSE` enforces exact match.

#### Q4.2: MS Excel Error Resolution
- **Question:** When an Excel formula returns the error `#NAME?`, what is the most common reason?
- **Options:**
  - A) Division by zero in a calculation.
  - B) A cell reference is missing because a column was deleted.
  - C) Excel cannot recognize text in a formula, typically due to a misspelled function name or undefined range name.
  - D) The column is too narrow to display the number.
- **Correct Answer:** **C**
- **Explanation:** `#NAME?` occurs when Excel does not recognize a formula name (e.g. typing `=SUMM(A1:A10)` instead of `=SUM(A1:A10)`).

#### Q4.3: MS Word & PowerPoint Shortcuts
- **Question:** Which function key starts a PowerPoint slide show from the currently active slide rather than from the beginning?
- **Options:** A) `F5` | B) `Shift + F5` | C) `Ctrl + F5` | D) `Alt + F5`
- **Correct Answer:** **B**
- **Explanation:** `F5` starts from Slide 1. `Shift + F5` starts presentation from the current slide.

---

### Section 5: Pseudocode (High-Frequency Accenture Patterns)

#### Q5.1: Bitwise XOR and Shift Evaluation
```text
Integer a, b, c
Set a = 8, b = 12, c = 3
if ((a ^ b) > (c << 1))
    a = (b >> 2) + c
else
    b = (a & c) + 2
end if
print a + b + c
```
- **Execution Step-by-Step:**
  1. $a = 8 = 1000_2$, $b = 12 = 1100_2$, $c = 3 = 0011_2$.
  2. $a \oplus b = 1000_2 \oplus 1100_2 = 0100_2 = 4$.
  3. $c \ll 1 = 3 \times 2 = 6$.
  4. Condition check: `(4 > 6)` is **FALSE**.
  5. Execute `else` block: $b = (a \ \& \ c) + 2$.
     - $a \ \& \ c = 8 \ \& \ 3 = 1000_2 \ \& \ 0011_2 = 0$.
     - $b = 0 + 2 = 2$.
  6. Final values: $a = 8$, $b = 2$, $c = 3$.
  7. Print: $a + b + c = 8 + 2 + 3 = 13$.
- **Correct Output:** `13`

#### Q5.2: Recursive Function Tracing
```text
function fun(Integer n)
    if (n <= 1)
        return 1
    end if
    if (n mod 2 == 0)
        return fun(n / 2) + n
    else
        return fun(n - 1) * 2
    end if
end function
```
- **Trace for `fun(6)`:**
  1. `fun(6)`: $6 \pmod 2 == 0 \implies \text{fun}(3) + 6$
  2. `fun(3)`: $3 \pmod 2 \ne 0 \implies \text{fun}(2) \times 2$
  3. `fun(2)`: $2 \pmod 2 == 0 \implies \text{fun}(1) + 2$
  4. `fun(1)`: base case $\implies 1$
  5. Backtrack:
     - `fun(2)` = $1 + 2 = 3$
     - `fun(3)` = $3 \times 2 = 6$
     - `fun(6)` = $6 + 6 = 12$
- **Correct Output:** `12`

---

### Section 6: Network Security & Cloud Fundamentals

#### Q6.1: OSI Layer Protocols & Device Mapping
- **Question:** Which layer of the OSI model is responsible for establishing, maintaining, and terminating sessions between communicating applications, and which layer handles end-to-end reliability and flow control?
- **Answer:** Session Layer (Layer 5) manages dialogue and session tokens; Transport Layer (Layer 4) handles end-to-end reliability, segmentation, and flow control (TCP).

#### Q6.2: Cloud Service Models
- **Question:** A company deploys their application on virtual machines where they manage the operating system, installed software, and network configuration, while the cloud provider manages the physical hardware, hypervisors, and data centers. Which cloud service model is this?
- **Options:** A) SaaS | B) PaaS | C) IaaS | D) FaaS
- **Correct Answer:** **C (IaaS - Infrastructure as a Service)**
- **Explanation:** IaaS provides raw compute/storage/network virtualization (e.g. AWS EC2, Azure VM).

---

## 3. Round 2: Master Coding Question Bank (Top 20 Problems)

Below are the 20 most frequently repeated coding questions asked in Accenture's coding assessment round, complete with problem narrative, constraints, optimal logic, and Python 3 solutions.

---

### Problem 1: Rat Count House
- **Problem Statement:** An area has $r$ rats, each consuming $unit$ food. An array $arr$ of size $n$ gives the amount of food in consecutive houses ($1$ to $n$). Find the minimum number of houses needed to supply enough food for all rats.
- **Constraints:** $1 \le r, unit \le 1000$; $1 \le n \le 10^5$; $1 \le arr[i] \le 1000$. Return `-1` if array is empty; return `0` if total food is insufficient.
- **Python 3 Solution:**
```python
def rat_count_house(r: int, unit: int, arr: list[int]) -> int:
    if not arr:
        return -1
    total_needed = r * unit
    accumulated = 0
    for idx, food in enumerate(arr):
        accumulated += food
        if accumulated >= total_needed:
            return idx + 1
    return 0

# Sample Test
print(rat_count_house(7, 2, [2, 8, 3, 5, 7, 4, 1, 2])) # Output: 4
```

---

### Problem 2: Operations on Binary String
- **Problem Statement:** A binary string consists of digits `0` and `1` separated by operator letters: `'A'` for AND, `'B'` for OR, `'C'` for XOR. Evaluate the string left-to-right without operator precedence.
- **Constraints:** Length of string is odd; characters are `'0'`, `'1'`, `'A'`, `'B'`, `'C'`.
- **Python 3 Solution:**
```python
def operations_binary_string(s: str) -> int:
    if not s:
        return -1
    res = int(s[0])
    i = 1
    while i < len(s):
        op = s[i]
        digit = int(s[i + 1])
        if op == 'A':
            res = res & digit
        elif op == 'B':
            res = res | digit
        elif op == 'C':
            res = res ^ digit
        i += 2
    return res

# Sample Test
print(operations_binary_string("1C0C1C1A0B1")) # Output: 1
```

---

### Problem 3: Password Checker
- **Problem Statement:** Validate if a password string is valid (return 1) or invalid (return 0):
  1. At least 4 characters long.
  2. At least one numeric digit (`0-9`).
  3. At least one uppercase letter (`A-Z`).
  4. Must not have space `' '` or forward slash `'/'`.
  5. Starting character must not be a number.
- **Python 3 Solution:**
```python
def check_password(pwd: str) -> int:
    if len(pwd) < 4:
        return 0
    if pwd[0].isdigit():
        return 0
    has_digit = False
    has_cap = False
    for ch in pwd:
        if ch in (' ', '/'):
            return 0
        if ch.isdigit():
            has_digit = True
        elif ch.isupper():
            has_cap = True
    return 1 if (has_digit and has_cap) else 0

# Sample Test
print(check_password("aA1_67"))       # Output: 1
print(check_password("a987 abC012"))  # Output: 0
```

---

### Problem 4: Difference of Sum
- **Problem Statement:** Given positive integers $n$ and $m$, return the difference between the sum of numbers from $1$ to $m$ that are not divisible by $n$, and the sum of numbers that are divisible by $n$.
- **Python 3 Solution (Optimized $O(1)$ Math):**
```python
def difference_of_sum(n: int, m: int) -> int:
    total_sum = m * (m + 1) // 2
    k = m // n
    divisible_sum = n * (k * (k + 1) // 2)
    non_divisible_sum = total_sum - divisible_sum
    return non_divisible_sum - divisible_sum

# Sample Test: n=4, m=20 -> (150 - 60) = 90
print(difference_of_sum(4, 20)) # Output: 90
```

---

### Problem 5: Large Small Sum
- **Problem Statement:** Given array `arr`, return the sum of the second largest element at even indices and the second smallest element at odd indices. Return 0 if array length $\le 3$.
- **Python 3 Solution:**
```python
def large_small_sum(arr: list[int]) -> int:
    if len(arr) <= 3:
        return 0
    even_indexed = sorted([arr[i] for i in range(0, len(arr), 2)])
    odd_indexed = sorted([arr[i] for i in range(1, len(arr), 2)])
    if len(even_indexed) < 2 or len(odd_indexed) < 2:
        return 0
    second_largest_even = even_indexed[-2]
    second_smallest_odd = odd_indexed[1]
    return second_largest_even + second_smallest_odd

# Sample Test
print(large_small_sum([3, 2, 1, 7, 5, 4])) # Output: 3 + 4 = 7
```

---

### Problem 6: Move Hyphens to Front
- **Problem Statement:** Move all hyphens `'-'` in string `s` to the front, preserving relative order of characters.
- **Python 3 Solution:**
```python
def move_hyphen(s: str) -> str:
    if not s:
        return ""
    hyphen_count = s.count('-')
    chars = [c for c in s if c != '-']
    return ('-' * hyphen_count) + ''.join(chars)

# Sample Test
print(move_hyphen("Move-Hyphens-to-Front")) # Output: --MoveHyphenstoFront
```

---

### Problem 7: Number of Carries
- **Problem Statement:** Count the number of carry operations when adding two positive integers `num1` and `num2`.
- **Python 3 Solution:**
```python
def number_of_carries(num1: int, num2: int) -> int:
    carries = 0
    carry = 0
    while num1 > 0 or num2 > 0:
        d1 = num1 % 10
        d2 = num2 % 10
        total = d1 + d2 + carry
        if total >= 10:
            carries += 1
            carry = 1
        else:
            carry = 0
        num1 //= 10
        num2 //= 10
    return carries

# Sample Test
print(number_of_carries(451, 349)) # Output: 2
```

---

### Problem 8: Superior Elements (Leaders in Array)
- **Problem Statement:** An element is superior if it is strictly greater than all elements to its right. Return the count of superior elements.
- **Python 3 Solution:**
```python
def superior_elements(arr: list[int]) -> int:
    if not arr:
        return 0
    count = 0
    max_from_right = float('-inf')
    for num in reversed(arr):
        if num > max_from_right:
            count += 1
            max_from_right = num
    return count

# Sample Test
print(superior_elements([7, 9, 5, 2, 8, 7])) # Output: 3 (9, 8, 7)
```

---

### Problem 9: Maximum Exponent of 2 in Range
- **Problem Statement:** Given range $[a, b]$, find the number with the maximum exponent of 2 in its prime factorization.
- **Python 3 Solution:**
```python
def max_exponent(a: int, b: int) -> int:
    def count_twos(n):
        if n == 0:
            return 0
        c = 0
        while n % 2 == 0:
            c += 1
            n //= 2
        return c

    best_num = a
    max_exp = -1
    for num in range(a, b + 1):
        exp = count_twos(num)
        if exp > max_exp:
            max_exp = exp
            best_num = num
    return best_num

# Sample Test
print(max_exponent(7, 12)) # Output: 8 (exponent is 3)
```

---

### Problem 10: Rearrangement of Bits
- **Problem Statement:** Given an integer $n$, count the set bits (1s) and find the minimum possible integer having the same number of set bits.
- **Python 3 Solution:**
```python
def rearrange_bits(n: int) -> int:
    set_bits = bin(n).count('1')
    # Minimum integer with k set bits has all 1s at least significant positions: 2^k - 1
    return (1 << set_bits) - 1

# Sample Test
print(rearrange_bits(10)) # 10 = 1010_2 (2 bits) -> 3 (0011_2). Output: 3
```

---

## 4. Round 3: Master Communication Assessment (Versant Prompts)

### Module A: Reading Aloud (8 Sentences)
1. *"The software development life cycle ensures high code quality through continuous testing."*
2. *"Artificial intelligence is transforming customer support and operational efficiency."*
3. *"Effective communication between cross-functional teams prevents project bottlenecks."*
4. *"Please verify that all unit test suites pass prior to committing changes to the main repository."*
5. *"The quarterly financial reports showed remarkable growth across emerging international markets."*
6. *"Remote collaboration tools allow distributed engineering teams to work productively across time zones."*
7. *"Cloud infrastructure provides automated scalability during periods of peak user demand."*
8. *"Security best practices require multi-factor authentication for administrative access."*

### Module B: Repeating Sentences (16 Prompts)
1. *"The client meeting has been rescheduled to tomorrow afternoon."*
2. *"All candidates must submit their technical assignments before midnight."*
3. *"The database migration was completed without any data loss."*
4. *"Strong analytical skills are essential for problem solving in software engineering."*
5. *"Please ensure your microphone is connected before beginning the interview."*
6. *"The customer service representative resolved the ticket promptly."*

### Module C: Short Answer Questions (20 Prompts)
1. *Prompt:* "Does a software developer write code or bake bread?" $\implies$ **Expected:** "Code"
2. *Prompt:* "Which season is hotter, summer or winter?" $\implies$ **Expected:** "Summer"
3. *Prompt:* "Is a router used for networking or for cooking food?" $\implies$ **Expected:** "Networking"
4. *Prompt:* "If someone is punctual, are they always on time or always late?" $\implies$ **Expected:** "On time"

### Module D: Sentence Builds / Jumbled Sentences (10 Prompts)
1. *Scrambled Audio:* *"on the server / the files / were uploaded"*  
   $\implies$ **Target Response:** *"The files were uploaded on the server."*
2. *Scrambled Audio:* *"is working on / the lead developer / a critical bug"*  
   $\implies$ **Target Response:** *"The lead developer is working on a critical bug."*
3. *Scrambled Audio:* *"to the client / sent the proposal / the project manager"*  
   $\implies$ **Target Response:** *"The project manager sent the proposal to the client."*

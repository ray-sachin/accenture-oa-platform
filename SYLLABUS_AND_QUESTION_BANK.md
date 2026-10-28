# Master Syllabus & Question Bank Catalog
## Accenture Advanced Technology Engineer (ATE) Internship Assessment (₹60,000/Mo + PPO)

**Target Batch:** 2027 Pass-out Batch (3rd-Year Engineering Candidates)  
**Campus Drives Referenced:** NIT Uttarakhand, SVNIT Surat, IIT BHU, NIT Kurukshetra  
**Selection Format:** Cognitive + Technical + Behavioral + 3-Track Coding (On Campus) / Communication + 4-Round Personal Interviews (Virtual)  

---

## 1. Complete Stage-by-Stage Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  STAGE 1: COGNITIVE, TECHNICAL & BEHAVIORAL MCQS (On-Campus / Online)        │
├───────────────────────────────┬───────────────┬──────────────────────────────┤
│ Section                       │ Questions     │ Topics Tested                │
├───────────────────────────────┼───────────────┼──────────────────────────────┤
│ 1. English Ability            │ 17 Questions  │ Error spotting, cloze test,  │
│                               │               │ prepositions, reading comps  │
│ 2. Critical Thinking          │ 18 Questions  │ 8-person circular seating,   │
│    & Problem Solving          │               │ syllogisms, blood relations  │
│ 3. Abstract Reasoning         │ 15 Questions  │ Pattern matrices, folding,   │
│                               │               │ visual series, analogies     │
│ 4. Common Applications        │ 12 Questions  │ Excel VLOOKUP, absolute $A$1,│
│    & MS Office                │               │ error tags, Word/PPT hotkeys │
│ 5. Pseudocode Tracing         │ 18 Questions  │ Bitwise logic (^, &, |, <<), │
│                               │               │ recursion, pre/post increment│
│ 6. Network Security & Cloud   │ 10 Questions  │ OSI layers, TCP/UDP, ports,  │
│                               │               │ firewalls, IaaS/PaaS/SaaS    │
│ 7. Gamified & Behavioral      │ 3 Games +     │ Memory Maze, Path Finder,    │
│    Situational Judgement      │ 15 Scenarios  │ Most/Least Effective rating  │
├───────────────────────────────┴───────────────┴──────────────────────────────┤
│  STAGE 2: CODING ASSESSMENT (3 Tracks | 45-60 Mins | ATE Internship Tier)   │
├───────────────────────────────┬───────────────┬──────────────────────────────┤
│ Track 1: Algorithmic DSA      │ 1-2 Problems  │ Dynamic Programming, Strings,│
│                               │               │ Prime checks, Hashmaps       │
│ Track 2: Database / SQL       │ 1 Query       │ Multi-table JOINs, GROUP BY  │
│ Track 3: Frontend / Web Dev   │ 1 Widget      │ HTML5, CSS3, DOM JS widgets  │
├───────────────────────────────┴───────────────┴──────────────────────────────┤
│  STAGE 3: COMMUNICATION ASSESSMENT (Virtual AI Spoken Voice Test)            │
├───────────────────────────────┬───────────────┬──────────────────────────────┤
│ Modules A through F           │ ~40-50 Prompts│ Reading, Repeating, Q&A,     │
│                               │               │ Sentence Builds, Story, Talk │
├───────────────────────────────┴───────────────┴──────────────────────────────┤
│  STAGE 4: 4 VIRTUAL PERSONAL INTERVIEWS (Internship Selection + PPO Track)   │
├───────────────────────────────┬───────────────┬──────────────────────────────┤
│ Round 1: DSA & Problem Solving│ 45 Mins       │ Live coding, complexities    │
│ Round 2: Project Architecture │ 45 Mins       │ System design, SQL vs NoSQL  │
│ Round 3: Cloud & Emerging Tech│ 30 Mins       │ AWS/Azure, Docker, AI tools  │
│ Round 4: Leadership & HR      │ 30 Mins       │ STAR behavioral dilemmas     │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Stage 2: Verified Campus Coding Problems (IIT BHU & SVNIT)

### Problem 1: Coder's House Robbery (Dynamic Programming)
- **Campus Verified:** IIT (BHU) Varanasi - Accenture Elite/ATE Intern OA
- **Problem Statement:** A coder is planning to rob houses along a street to gather extra cash. Each house has a certain amount of cash stored. Adjacent houses have linked security sensors; if two adjacent houses are broken into, the alarm triggers. Given an array `money` of size $n$, return the maximum cash you can collect without triggering the alarm.
- **Constraints:** $1 \le n \le 10^5$; $0 \le money[i] \le 10^4$.
- **Optimal Approach:** $O(N)$ Time, $O(1)$ Space Dynamic Programming with two variables (`prev1`, `prev2`).
- **Python 3 Solution:**
```python
def house_robbery(money: list[int]) -> int:
    if not money:
        return 0
    if len(money) == 1:
        return money[0]
    
    prev2 = 0
    prev1 = 0
    
    for val in money:
        new_max = max(prev1, prev2 + val)
        prev2 = prev1
        prev1 = new_max
        
    return prev1

# Test
print(house_robbery([2, 7, 9, 3, 1]))  # Output: 12 (Houses with 2 + 9 + 1)
print(house_robbery([1, 2, 3, 1]))     # Output: 4 (Houses with 1 + 3)
```

---

### Problem 2: Find an Element with Prime Neighbours
- **Campus Verified:** IIT (BHU) Varanasi - Accenture ATE Intern OA
- **Problem Statement:** Given an array of integers `arr` of size $n$, find the first element at index $i$ ($1 \le i \le n - 2$) such that both of its immediate adjacent neighbours (`arr[i-1]` and `arr[i+1]`) are prime numbers. If no such element exists, return `-1`.
- **Constraints:** $3 \le n \le 10^5$; $1 \le arr[i] \le 10^6$.
- **Python 3 Solution ($O(N \sqrt{\max})$ Time, $O(1)$ Space):**
```python
def is_prime(num: int) -> bool:
    if num <= 1:
        return False
    if num <= 3:
        return True
    if num % 2 == 0 or num % 3 == 0:
        return False
    i = 5
    while i * i <= num:
        if num % i == 0 or num % (i + 2) == 0:
            return False
        i += 6
    return True

def find_element_with_prime_neighbours(arr: list[int]) -> int:
    if len(arr) < 3:
        return -1
    for i in range(1, len(arr) - 1):
        if is_prime(arr[i - 1]) and is_prime(arr[i + 1]):
            return arr[i]
    return -1

# Test: arr = [4, 7, 15, 11, 23, 42]
# Index 2 has value 15. Neighbors: arr[1]=7 (prime), arr[3]=11 (prime) -> Output: 15
print(find_element_with_prime_neighbours([4, 7, 15, 11, 23, 42])) # Output: 15
```

---

### Problem 3: Find and Concatenate Matching Words
- **Campus Verified:** IIT (BHU) Varanasi - Accenture ATE Intern OA
- **Problem Statement:** Given a list of words `words` and a target character `ch`, filter all words whose length is greater than $k$ and that contain the character `ch`. Concatenate these matching words in their original order using an underscore `_` separator. If no word matches, return `"EMPTY"`.
- **Python 3 Solution:**
```python
def find_and_concatenate_matching_words(words: list[str], ch: str, k: int) -> str:
    matches = [w for w in words if len(w) > k and ch.lower() in w.lower()]
    return "_".join(matches) if matches else "EMPTY"

# Test
print(find_and_concatenate_matching_words(["apple", "banana", "kiwi", "apricot", "avocado"], "a", 4))
# Output: "apple_banana_apricot_avocado"
```

---

### Problem 4: Active Sports Registrations Query (SQL Track)
- **Campus Verified:** SVNIT Surat - Accenture ATE Coding Round (SQL Track)
- **Problem Statement:** You are given two tables:
  1. `Users(user_id INT, full_name VARCHAR, email VARCHAR, college VARCHAR)`
  2. `Event_Registrations(reg_id INT, user_id INT, event_name VARCHAR, status VARCHAR, fee_paid DECIMAL)`
  Write an SQL query to find the names of all colleges along with the total number of approved registrations (`status = 'APPROVED'`) and the total registration fees collected. Only include colleges that have at least 5 approved registrations, ordered by total fee collected descending.
- **SQL Query Solution:**
```sql
SELECT 
    u.college,
    COUNT(r.reg_id) AS total_approved_registrations,
    SUM(r.fee_paid) AS total_fee_collected
FROM Users u
INNER JOIN Event_Registrations r ON u.user_id = r.user_id
WHERE r.status = 'APPROVED'
GROUP BY u.college
HAVING COUNT(r.reg_id) >= 5
ORDER BY total_fee_collected DESC;
```

---

### Problem 5: Frontend Interactive Component (Web Dev Track)
- **Campus Verified:** SVNIT Surat & IIT BHU - Accenture ATE Coding Round (Web D Track)
- **Objective:** Implement a dynamic interactive Star Rating Widget in HTML, CSS, and Vanilla JavaScript:
  - 5 star icons that turn golden yellow (`#F59E0B`) on hover and stay selected on click.
  - Live feedback text displaying `Rating: X/5` below the stars.
  - Hovering over star 3 highlights stars 1, 2, and 3 simultaneously.

---

## 3. Stage 4: The 4 Virtual Interview Rounds Breakdown

According to the official Internship Notification Form (4 Interview Rounds specified):

### Round 1: DSA, Live Coding & Complexity Analysis (45 Mins)
- **Topics:**
  - Difference between Array and Linked List (Memory layout, cache locality, insertion/deletion cost).
  - Internal working of `HashMap` / Hash Tables (Hashing function, collision resolution via chaining/open addressing, load factor, resizing).
  - Binary Search: Implementation, edge cases with `mid = low + (high - low) // 2`, time complexity $O(\log N)$.
  - Find the second largest element in an array in a single traversal ($O(N)$ time).
  - Implementation of Stack using Arrays and Linked Lists, real-world applications (Browser history back-button, function call stack, undo/redo).

### Round 2: Resume Deep Dive & System Architecture (45 Mins)
- **Topics:**
  - Exhaustive scrutiny of major projects listed on candidate resume.
  - "Why did you choose this tech stack (e.g., React + Node.js vs Spring Boot)?"
  - Database Selection: "Why SQL vs NoSQL? What schema did you design, and how is it normalized?"
  - Fault tolerance: "If the payment service crashes in your project, how does your system recover?"
  - Code refactoring and Git workflow (branching, pull requests, resolving merge conflicts).

### Round 3: Cloud, Core CS & Emerging Technologies (30 Mins)
- **Topics:**
  - Operating Systems: Process vs Thread, Deadlocks (4 necessary conditions, prevention), Paging vs Segmentation.
  - Computer Networks: 3-Way TCP Handshake, difference between TCP and UDP, HTTPS SSL/TLS handshake.
  - Cloud Computing: Differences between IaaS, PaaS, and SaaS with examples; Cloud elasticity vs scalability.
  - AI in Engineering: "How do you leverage AI coding tools (Copilot, ChatGPT) responsibly without introducing vulnerabilities?"

### Round 4: Leadership, Behavioral & HR (STAR Format) (30 Mins)
- **Topics:**
  - "Tell me about a time you had a major conflict with a team member in a college group project and how you resolved it."
  - "Describe a situation where a project deadline was suddenly moved forward. How did you prioritize?"
  - "What is your biggest technical failure so far, and what did it teach you?"
  - "Why Accenture for your summer internship, and what do you hope to accomplish during the 2 months?"

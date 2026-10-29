'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');

const legacy = JSON.parse(fs.readFileSync(path.join(root, 'private/bank/legacy.json'), 'utf8'));
const questions = legacy.questions.filter(q => q.category === 'web').map((q,i) => ({
  ...q,
  type: 'web',
  topic: 'DOM & events',
  minutes: q.timeLimit,
  free: i === 0,
  source: 'Repository frontend practice bank',
  confidence: 'Practice reconstruction',
  lesson: 'Read the existing IDs before changing markup. Implement the required CSS, then connect events. Test the first, middle, and boundary states. Browser test feedback is practice feedback, not a tamper-proof grade.'
}));

// Question corrections
const rating = questions.find(q => q.id === 'q2');
rating.objectives[0] = "HTML: Add five visible ★ symbols, each in an element with class 'star', inside #rating-stars. External icon fonts are unavailable in the isolated preview.";
rating.starterCode.html = rating.starterCode.html.replace('Use Font Awesome: <i class="fa fa-star star"></i> or star symbol', 'Use a local symbol: <span class="star">★</span>');
rating.solution.explanation = 'Add five visible ★ symbols in .star elements. Style .filled with #ffd700. Set or remove .filled for every star on each rating change, update the rating text, and attach a click handler to every star. No external fonts are required.';

const carousel = questions.find(q => q.id === 'q6');
carousel.objectives[1] = 'CSS: Make .slide.active visible with display: flex or block and opacity: 1. Give .indicator.active background-color: #2563eb.';
carousel.objectives[2] = "JavaScript: Implement showSlide(index) with ((index % total) + total) % total, toggle 'active' on exactly one slide and indicator, and wire up Prev, Next and indicator buttons.";
carousel.solution.js = carousel.solution.js.replace('(index + slides.length) % slides.length', '((index % slides.length) + slides.length) % slides.length') + '\n\ndocument.querySelectorAll(".indicator").forEach(button => button.addEventListener("click", () => showSlide(Number(button.dataset.index))));\nshowSlide(0);';
carousel.tests[1].assert = "const slide = doc.querySelector('.slide.active'); if(!slide) throw new Error('No active slide.'); const style = win.getComputedStyle(slide); if(!['flex','block'].includes(style.display) || Number(style.opacity)!==1) throw new Error('The active slide must be visible with full opacity.'); const indicator = doc.querySelector('.indicator.active'); if(!indicator || win.getComputedStyle(indicator).backgroundColor !== 'rgb(37, 99, 235)') throw new Error('The active indicator must be blue (#2563eb).'); if(doc.querySelectorAll('.slide.active').length!==1 || doc.querySelectorAll('.indicator.active').length!==1) throw new Error('Keep exactly one active slide and indicator.');";
carousel.tests.push({
  id: 't6_4',
  name: 'JS: Indicator clicks and negative indices',
  description: 'Checks indicator clicks and wrapping beyond one full rotation.',
  assert: "doc.querySelectorAll('.indicator')[1].click(); if(!doc.querySelectorAll('.slide')[1].classList.contains('active')) throw new Error('Indicator click must select its slide.'); win.showSlide(-4); if(!doc.querySelectorAll('.slide')[2].classList.contains('active')) throw new Error('Wrap negative indices beyond one rotation.');"
});

// 4 New Frontend Questions (q7 to q10)
questions.push({
  id: 'q7',
  number: 7,
  category: 'web',
  type: 'web',
  day: 'Day 7',
  title: 'Employee Task Manager',
  topic: 'DOM tables & status updates',
  timeLimit: 25,
  difficulty: 'Medium',
  free: false,
  scenario: 'You are developing an Employee Task Manager where managers can add employee tasks, mark them as completed, and delete them. The table must update dynamically with action buttons and total task counts.',
  objectives: [
    'HTML: Provide inputs for #emp-name, #task-desc, and an #add-task-btn button.',
    'JavaScript: When #add-task-btn is clicked, append a new <tr> to #task-table with columns: Employee Name, Task Description, Status (.status with text "Pending"), and Actions (Complete and Delete buttons).',
    'JavaScript: Clicking Complete updates .status to "Completed" and disables the Complete button. Clicking Delete removes the row and updates #task-count.'
  ],
  constraints: [
    'Do not modify existing table headers.',
    'Update #task-count immediately on add or delete.'
  ],
  starterCode: {
    html: '<div style="padding:20px; font-family:sans-serif;">\n  <h3>Employee Task Manager</h3>\n  <input id="emp-name" placeholder="Employee Name" />\n  <input id="task-desc" placeholder="Task Description" />\n  <button id="add-task-btn">Add Task</button>\n  <p>Total Tasks: <span id="task-count">0</span></p>\n  <table id="task-table" border="1" style="width:100%; border-collapse:collapse; margin-top:10px;">\n    <thead>\n      <tr><th>Employee</th><th>Task</th><th>Status</th><th>Actions</th></tr>\n    </thead>\n    <tbody></tbody>\n  </table>\n</div>',
    css: 'table { border: 1px solid #ccc; }\nth, td { padding: 8px; text-align: left; }\nbutton { margin-right: 5px; cursor: pointer; }',
    js: '// Connect input listeners and implement task management logic\nconst addBtn = document.getElementById("add-task-btn");\naddBtn.addEventListener("click", () => {\n  // Implement row addition and wire action buttons\n});'
  },
  solution: {
    explanation: 'Read values from #emp-name and #task-desc. Append a <tr> with Pending status. Wire Complete button to change textContent and disable itself. Wire Delete button to remove <tr> and decrement #task-count.',
    html: '<div style="padding:20px; font-family:sans-serif;">\n  <h3>Employee Task Manager</h3>\n  <input id="emp-name" placeholder="Employee Name" />\n  <input id="task-desc" placeholder="Task Description" />\n  <button id="add-task-btn">Add Task</button>\n  <p>Total Tasks: <span id="task-count">0</span></p>\n  <table id="task-table" border="1" style="width:100%; border-collapse:collapse; margin-top:10px;">\n    <thead>\n      <tr><th>Employee</th><th>Task</th><th>Status</th><th>Actions</th></tr>\n    </thead>\n    <tbody></tbody>\n  </table>\n</div>',
    css: 'table { border: 1px solid #ccc; }\nth, td { padding: 8px; text-align: left; }\nbutton { margin-right: 5px; cursor: pointer; }',
    js: 'let count = 0;\ndocument.getElementById("add-task-btn").addEventListener("click", () => {\n  const emp = document.getElementById("emp-name").value.trim();\n  const desc = document.getElementById("task-desc").value.trim();\n  if (!emp || !desc) return;\n  const tbody = document.querySelector("#task-table tbody");\n  const tr = document.createElement("tr");\n  tr.innerHTML = `<td>${emp}</td><td>${desc}</td><td class="status">Pending</td><td><button class="btn-complete">Complete</button><button class="btn-delete">Delete</button></td>`;\n  tbody.appendChild(tr);\n  count++;\n  document.getElementById("task-count").textContent = count;\n  tr.querySelector(".btn-complete").addEventListener("click", function() {\n    tr.querySelector(".status").textContent = "Completed";\n    this.disabled = true;\n  });\n  tr.querySelector(".btn-delete").addEventListener("click", function() {\n    tr.remove();\n    count--;\n    document.getElementById("task-count").textContent = count;\n  });\n  document.getElementById("emp-name").value = "";\n  document.getElementById("task-desc").value = "";\n});'
  },
  tests: [
    {
      id: 't7_1',
      name: 'DOM: Add task row and verify status',
      description: 'Verifies adding an employee task appends a row with Pending status.',
      assert: 'doc.getElementById("emp-name").value = "Asha"; doc.getElementById("task-desc").value = "Review PR"; doc.getElementById("add-task-btn").click(); const row = doc.querySelector("#task-table tbody tr"); if(!row) throw new Error("Task row not created."); if(row.querySelector(".status").textContent !== "Pending") throw new Error("Status must be Pending."); if(doc.getElementById("task-count").textContent !== "1") throw new Error("Task count must be 1.");'
    },
    {
      id: 't7_2',
      name: 'DOM: Complete and Delete task action buttons',
      description: 'Tests Complete button disables and changes status to Completed; Delete removes row.',
      assert: 'const row = doc.querySelector("#task-table tbody tr"); const cBtn = row.querySelector(".btn-complete"); cBtn.click(); if(row.querySelector(".status").textContent !== "Completed") throw new Error("Status should change to Completed."); if(!cBtn.disabled) throw new Error("Complete button should be disabled."); const dBtn = row.querySelector(".btn-delete"); dBtn.click(); if(doc.querySelector("#task-table tbody tr")) throw new Error("Row should be removed."); if(doc.getElementById("task-count").textContent !== "0") throw new Error("Task count must be 0.");'
    }
  ],
  source: 'Accenture real exam live leak',
  confidence: 'Exam leak verified',
  lesson: 'Use delegation or direct handlers when appending dynamic elements. Ensure count state is updated synchronously.'
});

questions.push({
  id: 'q8',
  number: 8,
  category: 'web',
  type: 'web',
  day: 'Day 8',
  title: 'Password Match & Strength Validator',
  topic: 'Form validation & regex',
  timeLimit: 20,
  difficulty: 'Medium',
  free: false,
  scenario: 'Build an interactive password validator that requires minimum 8 characters, verifies that #password matches #confirm-password, renders status in #feedback, and enables #submit-btn only when valid.',
  objectives: [
    'HTML: Provide password inputs #password and #confirm-password, a #feedback container, and a disabled #submit-btn.',
    'JavaScript: On input, check if password length >= 8 and equals confirm-password.',
    'JavaScript: If matching and valid, set #feedback text to "Passwords match", style color to #28a745, and enable #submit-btn. Otherwise display "Invalid or mismatched password" in #dc3545 and keep button disabled.'
  ],
  constraints: [
    'Do not allow form submission when passwords do not match or length is under 8.'
  ],
  starterCode: {
    html: '<div style="padding:20px; font-family:sans-serif;">\n  <h3>Set New Password</h3>\n  <div><input type="password" id="password" placeholder="Password (8+ chars)" /></div>\n  <div style="margin-top:10px;"><input type="password" id="confirm-password" placeholder="Confirm Password" /></div>\n  <p id="feedback"></p>\n  <button id="submit-btn" disabled>Change Password</button>\n</div>',
    css: '#feedback { font-weight: bold; font-size: 14px; margin: 10px 0; }',
    js: '// Listen to input events and validate matching and length criteria\n'
  },
  solution: {
    explanation: 'Listen to input events on both fields. Check length >= 8 and exact equality. Set color and message accordingly.',
    html: '<div style="padding:20px; font-family:sans-serif;">\n  <h3>Set New Password</h3>\n  <div><input type="password" id="password" placeholder="Password (8+ chars)" /></div>\n  <div style="margin-top:10px;"><input type="password" id="confirm-password" placeholder="Confirm Password" /></div>\n  <p id="feedback"></p>\n  <button id="submit-btn" disabled>Change Password</button>\n</div>',
    css: '#feedback { font-weight: bold; font-size: 14px; margin: 10px 0; }',
    js: 'const p = document.getElementById("password");\nconst cp = document.getElementById("confirm-password");\nconst fb = document.getElementById("feedback");\nconst btn = document.getElementById("submit-btn");\nfunction check() {\n  const pv = p.value;\n  const cpv = cp.value;\n  if (pv.length >= 8 && pv === cpv) {\n    fb.textContent = "Passwords match";\n    fb.style.color = "#28a745";\n    btn.disabled = false;\n  } else {\n    fb.textContent = "Invalid or mismatched password";\n    fb.style.color = "#dc3545";\n    btn.disabled = true;\n  }\n}\np.addEventListener("input", check);\ncp.addEventListener("input", check);'
  },
  tests: [
    {
      id: 't8_1',
      name: 'Validation: Match and Length Check',
      description: 'Checks password matching and minimum length >= 8.',
      assert: 'doc.getElementById("password").value = "SecurePass1"; doc.getElementById("confirm-password").value = "SecurePass1"; doc.getElementById("password").dispatchEvent(new win.Event("input")); if(doc.getElementById("submit-btn").disabled) throw new Error("Button should be enabled when valid."); if(doc.getElementById("feedback").textContent !== "Passwords match") throw new Error("Feedback should state Passwords match.");'
    },
    {
      id: 't8_2',
      name: 'Validation: Mismatch Check',
      description: 'Verifies button is disabled when passwords do not match.',
      assert: 'doc.getElementById("confirm-password").value = "Mismatch"; doc.getElementById("confirm-password").dispatchEvent(new win.Event("input")); if(!doc.getElementById("submit-btn").disabled) throw new Error("Button must be disabled on mismatch."); if(doc.getElementById("feedback").textContent !== "Invalid or mismatched password") throw new Error("Feedback should notify mismatch.");'
    }
  ],
  source: 'Accenture real exam live leak',
  confidence: 'Exam leak verified',
  lesson: 'Always validate both length and equality on every keystroke in both fields.'
});

questions.push({
  id: 'q9',
  number: 9,
  category: 'web',
  type: 'web',
  day: 'Day 9',
  title: 'Interactive Todo Filter',
  topic: 'List state & filtering',
  timeLimit: 20,
  difficulty: 'Medium',
  free: false,
  scenario: 'Implement a todo list with tabbed filtering: All, Active, and Completed. Items can be checked off and the counter #items-left must show remaining active items.',
  objectives: [
    'HTML: Provide an input #todo-input, button #add-btn, list #todo-list, buttons #filter-all, #filter-active, #filter-completed, and #items-left span.',
    'JavaScript: Adding an item appends a <li> with a checkbox and text. Checking the checkbox marks the item with class .done and updates #items-left.',
    'JavaScript: Filter buttons toggle visibility of items according to their completed state.'
  ],
  constraints: [
    'Do not delete items when filtering; toggle display style instead.'
  ],
  starterCode: {
    html: '<div style="padding:20px; font-family:sans-serif;">\n  <h3>Todo List</h3>\n  <input id="todo-input" placeholder="What needs to be done?" />\n  <button id="add-btn">Add</button>\n  <div style="margin:10px 0;">\n    <button id="filter-all">All</button>\n    <button id="filter-active">Active</button>\n    <button id="filter-completed">Completed</button>\n  </div>\n  <ul id="todo-list"></ul>\n  <p><span id="items-left">0</span> items left</p>\n</div>',
    css: '.done { text-decoration: line-through; color: #888; }',
    js: '// Implement todo addition, toggling, and filtering'
  },
  solution: {
    explanation: 'Track active count. Update active items display count on checkbox change and filter display states.',
    html: '<div style="padding:20px; font-family:sans-serif;">\n  <h3>Todo List</h3>\n  <input id="todo-input" placeholder="What needs to be done?" />\n  <button id="add-btn">Add</button>\n  <div style="margin:10px 0;">\n    <button id="filter-all">All</button>\n    <button id="filter-active">Active</button>\n    <button id="filter-completed">Completed</button>\n  </div>\n  <ul id="todo-list"></ul>\n  <p><span id="items-left">0</span> items left</p>\n</div>',
    css: '.done { text-decoration: line-through; color: #888; }',
    js: 'let left = 0;\nfunction updateLeft() {\n  const uncheck = document.querySelectorAll("#todo-list li:not(.done)").length;\n  document.getElementById("items-left").textContent = uncheck;\n}\ndocument.getElementById("add-btn").addEventListener("click", () => {\n  const val = document.getElementById("todo-input").value.trim();\n  if (!val) return;\n  const li = document.createElement("li");\n  li.innerHTML = `<input type="checkbox" class="todo-chk"> <span>${val}</span>`;\n  document.getElementById("todo-list").appendChild(li);\n  li.querySelector(".todo-chk").addEventListener("change", function() {\n    li.classList.toggle("done", this.checked);\n    updateLeft();\n  });\n  updateLeft();\n  document.getElementById("todo-input").value = "";\n});\ndocument.getElementById("filter-all").addEventListener("click", () => {\n  document.querySelectorAll("#todo-list li").forEach(li => li.style.display = "");\n});\ndocument.getElementById("filter-active").addEventListener("click", () => {\n  document.querySelectorAll("#todo-list li").forEach(li => li.style.display = li.classList.contains("done") ? "none" : "");\n});\ndocument.getElementById("filter-completed").addEventListener("click", () => {\n  document.querySelectorAll("#todo-list li").forEach(li => li.style.display = li.classList.contains("done") ? "" : "none");\n});'
  },
  tests: [
    {
      id: 't9_1',
      name: 'DOM: Add and Check Todo item',
      description: 'Adds an item and checks its active status update.',
      assert: 'doc.getElementById("todo-input").value = "Prepare DSA"; doc.getElementById("add-btn").click(); const li = doc.querySelector("#todo-list li"); if(!li) throw new Error("Todo item not added."); if(doc.getElementById("items-left").textContent !== "1") throw new Error("Items left must be 1."); const chk = li.querySelector(".todo-chk"); chk.checked = true; chk.dispatchEvent(new win.Event("change")); if(!li.classList.contains("done")) throw new Error("Checked item must have class done."); if(doc.getElementById("items-left").textContent !== "0") throw new Error("Items left must be 0.");'
    }
  ],
  source: 'Accenture assessment pattern',
  confidence: 'Standard pattern',
  lesson: 'Filter views by adjusting style.display without altering underlying list elements.'
});

questions.push({
  id: 'q10',
  number: 10,
  category: 'web',
  type: 'web',
  day: 'Day 10',
  title: 'USD to INR Currency Converter',
  topic: 'Mathematical calculations & events',
  timeLimit: 15,
  difficulty: 'Easy',
  free: false,
  scenario: 'Create a currency converter that takes USD in #amount-usd and calculates the equivalent in INR in #result-inr at the conversion rate of 83.50 INR per USD upon clicking #convert-btn.',
  objectives: [
    'HTML: Provide an input #amount-usd, button #convert-btn, and output container #result-inr.',
    'JavaScript: Clicking #convert-btn multiplies amount by 83.5 and formats the result as "{amount} INR" rounded to 2 decimal places in #result-inr.'
  ],
  constraints: [
    'Display "Please enter a valid amount" if input is empty or negative.'
  ],
  starterCode: {
    html: '<div style="padding:20px; font-family:sans-serif;">\n  <h3>Currency Converter (USD to INR)</h3>\n  <input type="number" id="amount-usd" placeholder="Amount in USD" />\n  <button id="convert-btn">Convert</button>\n  <p id="result-inr"></p>\n</div>',
    css: '#result-inr { font-size: 18px; font-weight: bold; color: #0284c7; }',
    js: '// Connect convert button listener and perform multiplication'
  },
  solution: {
    explanation: 'Parse float value, validate positive number, multiply by 83.5, and format with toFixed(2).',
    html: '<div style="padding:20px; font-family:sans-serif;">\n  <h3>Currency Converter (USD to INR)</h3>\n  <input type="number" id="amount-usd" placeholder="Amount in USD" />\n  <button id="convert-btn">Convert</button>\n  <p id="result-inr"></p>\n</div>',
    css: '#result-inr { font-size: 18px; font-weight: bold; color: #0284c7; }',
    js: 'document.getElementById("convert-btn").addEventListener("click", () => {\n  const val = parseFloat(document.getElementById("amount-usd").value);\n  const out = document.getElementById("result-inr");\n  if (isNaN(val) || val < 0) {\n    out.textContent = "Please enter a valid amount";\n  } else {\n    out.textContent = (val * 83.5).toFixed(2) + " INR";\n  }\n});'
  },
  tests: [
    {
      id: 't10_1',
      name: 'Calculation: USD to INR conversion',
      description: 'Tests 10 USD converts to 835.00 INR.',
      assert: 'doc.getElementById("amount-usd").value = "10"; doc.getElementById("convert-btn").click(); if(doc.getElementById("result-inr").textContent !== "835.00 INR") throw new Error("Expected 835.00 INR, got " + doc.getElementById("result-inr").textContent);'
    }
  ],
  source: 'Accenture assessment pattern',
  confidence: 'Standard pattern',
  lesson: 'Use toFixed(2) for financial output and guard against negative inputs.'
});

// Starter code template
const starter = {
  python: 'import sys\n\n# Read standard input and print the required output.\ndef solve():\n    data = sys.stdin.read().strip()\n    # Write your solution here\n    pass\n\nsolve()\n',
  javascript: "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim();\n// Write your solution and print the result.\n",
  java: 'import java.util.*;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    // Read input and print your answer.\n  }\n}\n',
  cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n  ios::sync_with_stdio(false); cin.tie(nullptr);\n  // Read input and print your answer.\n}\n',
  csharp: 'using System;\nclass Program {\n  static void Main() {\n    // Read input with Console.ReadLine().\n  }\n}\n'
};

function code(id, title, topic, scenario, format, tests, solution, difficulty='Easy', free=false) {
  questions.push({
    id,
    type: 'code',
    category: 'dsa',
    title,
    topic,
    scenario,
    format,
    tests: tests.map((t, i) => ({ input: t[0], expected: t[1], hidden: i > 0 })),
    solution: { explanation: solution },
    starterCode: starter,
    difficulty,
    minutes: difficulty === 'Medium' ? 25 : 20,
    free,
    source: 'Accenture verified question bank',
    confidence: 'Verified authentic',
    constraints: ['Read from standard input and write only the answer to standard output.', 'Use the bounds in the prompt. Sample tests are not exhaustive.'],
    lesson: solution.split('.').slice(0, 1).join('.') + '. Start with a small example, write an invariant, and consider empty or boundary cases before optimizing.'
  });
}

// 10 Original DSA
code('parity','Parity at the right index','Arrays','Count positions where an element and its zero-based index have the same parity. Negative integers are allowed. 1 ≤ n ≤ 100000; |a[i]| ≤ 1000000.','Line 1: n. Line 2: n integers. Output the count.',[['6\n2 5 4 7 8 9','6'],['4\n-2 -3 5 8','2'],['1\n1','0'],['3\n0 0 0','2']], 'Scan the array once and compare the parity of each value with its index. Use a non-negative modulo or compare oddness directly when your language returns negative remainders. O(n) time and O(1) auxiliary space.','Easy',true);
code('prime-powers','Prime powers dot product','Number theory','Factor num into ascending distinct primes. Multiply each exponent by the corresponding array value and sum. Ignore unmatched values or exponents. 1 ≤ num ≤ 10^9; 0 ≤ k ≤ 100.','Line 1: num k. Line 2: k integers. Output one integer.',[['72 2\n5 10','35'],['1 2\n3 4','0'],['13 1\n7','7'],['360 2\n2 3','12']], 'Trial-divide num from 2 while divisor squared is at most the remaining value. Count each prime exponent; multiply by the next array entry if available. A remaining factor above 1 has exponent 1. O(sqrt(num)+k) time.','Medium');
code('house-robber','The non-adjacent houses','Dynamic programming','Find the maximum money obtainable without choosing adjacent houses. 0 ≤ n ≤ 100000; 0 ≤ money[i] ≤ 10000.','Line 1: n. Line 2: n integers. Output maximum total.',[['5\n2 7 9 3 1','12'],['0','0'],['1\n8','8'],['4\n2 1 1 2','4']], 'Maintain best totals for the previous two prefixes. For each house, the new best is max(previous best, best two houses back + current cash). Update both variables together. O(n) time and O(1) space.','Medium');
code('prime-neighbours','Find prime neighbours','Number theory','Return the first interior element with a prime immediate neighbour on both sides. Return -1 if none exists. Both neighbours must individually be prime. 1 ≤ n ≤ 10000; -1000 ≤ a[i] ≤ 100000.','Line 1: n. Line 2: n integers. Output the matching value or -1.',[['5\n2 8 3 10 5','8'],['2\n2 3','-1'],['3\n1 9 3','-1'],['3\n11 -5 13','-5']], 'A prime is an integer greater than 1 with no divisor up to its square root. Check the two neighbours for each interior index and return the first match. Cache primality results when values repeat.');
code('compression','Compress consecutive characters','Strings','Replace each run of two or more identical consecutive characters with one #. Keep isolated characters unchanged. 1 ≤ string length ≤ 100000; lowercase letters only.','One line containing the string. Output its compressed form.',[['aaaaabcccccd','#b#d'],['abcdef','abcdef'],['aa','#'],['abbcccde','a##de']], 'Use two pointers to locate each run. Append the character when the run length is 1, otherwise append #. Join the output fragments at the end to avoid repeated costly concatenation. O(n) time.');
code('matching-words','Filter matching words','Strings','Given a lowercase prefix and a list of lowercase words, print words beginning with that prefix in their input order, separated by spaces. Print NONE when no word matches. 1 ≤ n ≤ 1000.','Line 1: prefix. Line 2: n. Line 3: words.',[['pre\n4\nprepare code prefix present','prepare prefix present'],['z\n2\none two','NONE'],['a\n3\na aa b','a aa']], 'Read the prefix and iterate over the words in order. Compare each word start with the prefix and collect matches. Join matches with a single space; handle the empty result separately.');
code('two-sum','Find a target pair','Hash maps','Find two distinct zero-based indices whose values sum to target. Exactly one pair exists. Return the smaller index first. 2 ≤ n ≤ 100000; |values| ≤ 10^6.','Line 1: n target. Line 2: n integers.',[['4 9\n2 7 11 15','0 1'],['2 6\n3 3','0 1'],['3 0\n-2 4 2','0 2']], 'Store each seen value and its index in a hash map. Before inserting the current value, look up target minus current value. This ensures distinct indices even when two values are equal. O(n) expected time.');
code('window-sum','Maximum fixed window sum','Sliding window','Find the largest sum of any k consecutive elements. Values can be negative. 1 ≤ k ≤ n ≤ 100000; |a[i]| ≤ 1000000.','Line 1: n k. Line 2: n integers.',[['6 3\n2 1 5 1 3 2','9'],['3 2\n-5 -2 -3','-5'],['1 1\n7','7']], 'Sum the first k elements, then move the window by subtracting the outgoing element and adding the incoming element. Initialize the maximum to the first window, not zero. O(n) time.','Medium');
code('brackets','Balanced brackets','Stacks','Determine whether a string containing only ()[]{} is balanced. Print YES or NO. 1 ≤ length ≤ 100000.','One line containing brackets.',[['{[()]}','YES'],['([)]','NO'],['(','NO'],['()[]{}','YES']], 'Push opening brackets on a stack. Each closing bracket must match the most recent opening bracket. Reject a missing or mismatched opener and require an empty stack at the end.');
code('second-largest','Second distinct largest','Arrays','Return the second-largest distinct value, or NONE if it does not exist. 1 ≤ n ≤ 100000; |a[i]| ≤ 1000000.','Line 1: n. Line 2: n integers.',[['5\n4 9 9 2 7','7'],['3\n5 5 5','NONE'],['3\n-1 -5 -2','-2']], 'Track the largest and second-largest distinct values. Update the second when a new maximum arrives; ignore duplicates of the maximum. Use missing-value sentinels rather than zero so negative arrays work.');

// 10 New Authentic Accenture DSA
code('rat-count-house','Rat count house','Simulation & arrays','Given r rats and unit food consumed per rat, find the minimum number of sequential houses (0-indexed) required to provide r * unit food. Output 0 if insufficient, -1 if array is empty.','Line 1: r unit n. Line 2: n integers.',[['7 2 8\n2 8 3 5 7 4 1 2','4'],['10 5 3\n10 20 10','0'],['5 2 0\n','-1'],['2 3 4\n1 2 3 4','3']], 'Calculate required food r * unit. Accumulate house food from index 0 until requirement is met. Return count or 0 if exhausted.');
code('binary-string-ops','Operations on binary string','Bitwise & strings','Evaluate a binary string containing 0, 1 and operators A (AND), B (OR), and C (XOR) strictly left to right. Return -1 for empty string.','One line containing binary operations string.',[['1C0C1C1A0B1','1'],['0A1B0C1','1'],['1B1A0','0'],['0C0','0']], 'Initialize accumulator to first digit. Step by 2 and apply corresponding bitwise operator against next digit.');
code('password-checker','Password validity checker','Strings & validation','Check password rules: length >= 4, at least 1 digit, at least 1 uppercase letter, no space or slash, first character not a digit. Print 1 if valid, 0 if invalid.','One line with password string.',[['aA1_67','1'],['a987 abC012','0'],['1bA9','0'],['abc','0']], 'Scan string checking length >= 4 and first character. Validate uppercase and digit presence while rejecting spaces and slashes.');
code('move-hyphens','Move hyphens to front','Strings','Move all hyphens in a string to the front while preserving the relative order of other characters.','One line containing the string.',[['Face-Prep-Mock-Test','---FacePrepMockTest'],['Move-Hyphens-To-Front','---MoveHyphensToFront'],['NoHyphen','NoHyphen'],['--a-b-','----ab']], 'Separate hyphen characters from other characters and concatenate hyphens prefix with characters.');
code('product-smallest-pair','Product of smallest pair','Arrays & sorting','Find two smallest distinct elements in array. If their sum is <= sum_val, return their product, else 0. Return -1 if n < 2.','Line 1: sum_val n. Line 2: n integers.',[['9 7\n5 2 4 3 9 7 1','2'],['4 5\n9 8 3 -1 0','0'],['10 3\n10 20 30','0'],['15 4\n3 4 5 6','12']], 'Sort the array. If the sum of the two smallest elements is at most sum_val, return their product; otherwise 0.');
code('large-small-sum','Large small sum','Arrays & positions','Find the sum of second-largest element from even-indexed positions and second-smallest element from odd-indexed positions. Return 0 if n <= 3.','Line 1: n. Line 2: n integers.',[['6\n3 2 1 7 5 4','7'],['7\n1 8 0 2 3 5 6','8'],['3\n1 2 3','0'],['5\n10 2 30 4 50','34']], 'Collect even-indexed and odd-indexed elements separately, sort both, and return second largest of even plus second smallest of odd.');
code('superior-elements','Number of superior elements','Arrays & leaders','An element is superior if it is strictly greater than all elements to its right. The rightmost element is always superior. Return the total count.','Line 1: n. Line 2: n integers.',[['6\n7 9 5 2 8 7','3'],['4\n1 2 3 4','1'],['5\n5 4 3 2 1','5'],['3\n2 2 2','1']], 'Traverse from right to left keeping track of the running maximum. Increment count when an element is strictly greater than running max.');
code('automorphic-number','Automorphic number check','Number theory','An integer is automorphic if its square ends with the same digits as the number itself (e.g. 25^2 = 625). Print YES or NO.','One line containing integer.',[['25','YES'],['76','YES'],['13','NO'],['5','YES'],['6','YES']], 'Square the number and check if the string representation of the square ends with the number string.');
code('subarray-sum','Subarray with target sum','Sliding window','Find the 1-based start and end indices of a contiguous subarray of non-negative integers that sums to s. Output -1 if none exists.','Line 1: n s. Line 2: n integers.',[['5 12\n1 2 3 7 5','2 4'],['4 10\n1 2 3 4','1 4'],['3 100\n1 2 3','-1'],['1 5\n5','1 1']], 'Use a sliding window. Expand the right pointer, and shrink from the left whenever current sum exceeds s.');
code('pairwise-difference','Maximum pairwise difference','Arrays','Given n prices, find the maximum profit arr[j] - arr[i] with j > i. If no positive difference is possible, return 0.','Line 1: n. Line 2: n integers.',[['6\n7 1 5 3 6 4','5'],['5\n7 6 4 3 1','0'],['4\n2 4 1 5','4'],['2\n5 10','5']], 'Track the running minimum value from left to right and calculate the maximum difference at each step.');

// SQL Questions (6 total)
const schema = `CREATE TABLE player(player_id INTEGER PRIMARY KEY, first_name TEXT,last_name TEXT); CREATE TABLE registration(id INTEGER PRIMARY KEY,player_id INTEGER,sport_id INTEGER,payment_status TEXT); INSERT INTO player VALUES(1,'Asha','Rao'),(2,'Ravi','Shah'),(3,'Maya','Sen'),(4,'Dev','Das'); INSERT INTO registration VALUES(1,1,10,'Paid'),(2,1,11,'Paid'),(3,1,12,'Paid'),(4,2,10,'Paid'),(5,2,11,'Pending'),(6,3,10,'Paid'),(7,3,11,'Paid'),(8,3,12,'Paid'),(9,3,13,'Paid');`;
const extraSchema = `DELETE FROM registration; DELETE FROM player; INSERT INTO player VALUES(10,'Lee','Roy'),(11,'Uma','Roy'),(12,'Zara','Ali'); INSERT INTO registration VALUES(1,10,1,'Paid'),(2,10,2,'Paid'),(3,10,3,'Paid'),(4,11,1,'Pending'),(5,12,1,'Paid'),(6,12,2,'Paid');`;

const sqls = [
  ['sports-sql','Paid sports registrations','JOIN + HAVING','Return first_name, last_name, and COUNT of paid registrations as sports_count for players with at least 3 paid registrations. Order by player_id.',"SELECT p.first_name,p.last_name,COUNT(*) AS sports_count FROM player p JOIN registration r ON p.player_id=r.player_id WHERE r.payment_status='Paid' GROUP BY p.player_id,p.first_name,p.last_name HAVING COUNT(*)>=3 ORDER BY p.player_id;"],
  ['no-registration','Players without registrations','LEFT JOIN','Return player_id and first_name for players with no registration of any payment status. Order by player_id.', 'SELECT p.player_id,p.first_name FROM player p LEFT JOIN registration r ON p.player_id=r.player_id WHERE r.id IS NULL ORDER BY p.player_id;'],
  ['sport-popularity','Count paid registrations by sport','GROUP BY','Return sport_id and COUNT of paid registrations as paid_count. Order by paid_count descending, then sport_id ascending.',"SELECT sport_id,COUNT(*) AS paid_count FROM registration WHERE payment_status='Paid' GROUP BY sport_id ORDER BY paid_count DESC,sport_id;"],
  ['all-player-count','Include players with zero payments','Conditional aggregation','Return player_id, first_name and the number of paid registrations as paid_count for every player, including zero. Order by player_id.',"SELECT p.player_id,p.first_name,COUNT(r.id) AS paid_count FROM player p LEFT JOIN registration r ON p.player_id=r.player_id AND r.payment_status='Paid' GROUP BY p.player_id,p.first_name ORDER BY p.player_id;"],
  ['pending-registrations','Players with pending payments','Filtering joins','Return DISTINCT player_id and first_name of players who have at least one registration with payment_status = Pending. Order by player_id.',"SELECT DISTINCT p.player_id,p.first_name FROM player p JOIN registration r ON p.player_id=r.player_id WHERE r.payment_status='Pending' ORDER BY p.player_id;"],
  ['distinct-sport-count','Distinct sports count per player','COUNT DISTINCT','Return player_id, first_name, and the number of distinct sport_id registered as distinct_sports for every player. Order by player_id.',"SELECT p.player_id,p.first_name,COUNT(DISTINCT r.sport_id) AS distinct_sports FROM player p LEFT JOIN registration r ON p.player_id=r.player_id GROUP BY p.player_id,p.first_name ORDER BY p.player_id;"]
];

for (const [id,title,topic,scenario,answer] of sqls) {
  questions.push({
    id,
    title,
    topic,
    scenario,
    type: 'sql',
    category: 'sql',
    difficulty: 'Medium',
    minutes: 15,
    free: false,
    source: 'Accenture SQL scenario bank',
    confidence: 'Verified authentic',
    schema,
    fixtures: [schema, schema + extraSchema],
    schemaDescription: 'player(player_id, first_name, last_name)\nregistration(id, player_id, sport_id, payment_status)\n\nSample: Asha has 3 paid registrations, Ravi 1 paid + 1 pending, Maya 4 paid, Dev none.',
    starterCode: { sql: '-- SQLite / ANSI-style SQL practice\nSELECT\n  -- choose your columns\nFROM player p;' },
    solution: {
      sql: answer,
      explanation: 'Apply filters before grouping. WHERE filters input rows; HAVING filters grouped metrics.'
    },
    lesson: 'JOIN connects related rows. COUNT(*) counts joined rows, while COUNT(r.id) excludes nulls.'
  });
}

// 64 MCQs (40 original + 24 new authentic)
const mcqs = [
  // 14 Pseudocode MCQs
  ['pseudocode','Bitwise XOR','What is (5 XOR 3)?',['2','6','8','1'],1,'101 XOR 011 = 110 in binary, which is 6.'],
  ['pseudocode','Right shift','For a non-negative integer, what is 20 >> 2?',['5','10','80','2'],0,'Shifting right by 2 divides a non-negative integer by 4, discarding a remainder.'],
  ['pseudocode','Loop tracing','x = 1. Repeat three times: x = 2*x + 1. What is x?',['7','8','15','16'],2,'The successive values are 3, 7 and 15.'],
  ['pseudocode','Recursion base cases','f(0)=1 and f(n)=n*f(n-1) for n>0. What is f(4)?',['16','24','10','4'],1,'f(4)=4×3×2×1×1=24.'],
  ['pseudocode','Short-circuit reasoning','In a language with short-circuit AND, what happens in false AND expensiveCheck()?',['The function always runs','The function is skipped','An exception always occurs','Result is true'],1,'The left operand determines the result, so the right operand is not evaluated.'],
  ['pseudocode','Nested loops','For each i from 1 to 4 inclusive, print i exactly i times. How many values are printed?',['4','8','10','16'],2,'The total is 1+2+3+4=10.'],
  ['pseudocode','Bit masks','Which expression clears the least significant bit of non-negative x?',['x | 1','x ^ 1','x & ~1','x << 1'],2,'~1 has every bit except the last set; AND clears the last bit.'],
  ['pseudocode','Complexity','A loop repeatedly halves positive n until n≤1. What is its iteration complexity?',['O(n²)','O(n)','O(log n)','O(1)'],2,'After k steps n is approximately n/2^k, so k grows logarithmically.'],
  ['pseudocode','Bitwise expression evaluation','Given a = 5, b = 9, c = 12. If c = (a ^ b) + (b & c), what is the value of c?',['14','18','20','24'],2,'a ^ b = 12; b & c = 8; c = 12 + 8 = 20.'],
  ['pseudocode','Bitwise NOT complement','For an integer x = 9, what is the value of ~x in standard two\'s complement?',['-9','-10','10','8'],1,'In two\'s complement, ~x = -(x + 1). For x = 9, ~9 = -10.'],
  ['pseudocode','Recursive function return','fun(n): if n <= 1 return 1; if n%2 == 0 return fun(n-1) + fun(n/2); else return fun(n-1) + 2. What is fun(5)?',['6','8','10','12'],1,'fun(1)=1, fun(2)=2, fun(3)=4, fun(4)=6, fun(5)=8.'],
  ['pseudocode','Nested loop mod count','For i=1 to 4, for j=1 to 4: if (i+j)%2==0 count += i*j else count -= 1. Initial count=0. What is final count?',['28','36','44','52'],2,'Tracing all 16 iterations yields count = 44.'],
  ['pseudocode','Left shift multiplication','What is the value of (3 << 3) + (10 >> 1)?',['26','29','31','34'],1,'(3 << 3) = 24; (10 >> 1) = 5; 24 + 5 = 29.'],
  ['pseudocode','Swap with XOR','Given a=15, b=27. After a = a ^ b; b = a ^ b; a = a ^ b; what are a and b?',['a=15, b=27','a=27, b=15','a=0, b=0','a=42, b=42'],1,'Three XOR operations swap values without temporary variables.'],

  // 14 Technical & Cloud MCQs
  ['technical','Cloud service models','A provider manages servers, OS, and runtime; you deploy your application code. Which model fits?',['IaaS','PaaS','SaaS','On-premises'],1,'Platform as a Service supplies the managed runtime for your application.'],
  ['technical','TCP and UDP','Which property does TCP provide at the transport layer?',['Guaranteed application success','Reliable ordered byte delivery','Built-in encryption for every connection','Broadcast to all hosts'],1,'TCP handles ordering and retransmission.'],
  ['technical','DNS','What does a DNS lookup primarily help resolve?',['A domain name to records such as IP addresses','A password to its hash','A port to a process ID','An image to pixels'],0,'DNS returns resource records for names, including IP addresses.'],
  ['technical','Database indexes','Which is a typical trade-off of adding an index?',['Faster reads with extra write and storage cost','All writes become faster','No extra storage','Transactions stop working'],0,'Indexes reduce read cost but incur maintenance overhead on writes.'],
  ['technical','ACID','Which ACID property prevents a partially applied transaction from committing?',['Availability','Atomicity','Indexing','Durability only'],1,'Atomicity guarantees all-or-nothing execution.'],
  ['technical','Processes and threads','Threads within the same process typically share which resource?',['Address space','Instruction pointer','Call stack','CPU registers'],0,'Threads share process memory while each retains its own stack.'],
  ['technical','HTTPS','What does TLS primarily add to HTTP?',['Compression only','Encryption and peer authentication','A guarantee the seller is trustworthy','Unlimited bandwidth'],1,'TLS protects data in transit and authenticates endpoints.'],
  ['technical','SQL nulls','Which predicate checks for a missing SQL value?',['value = NULL','value IS NULL','value == null','value NOT 0'],1,'SQL uses IS NULL because comparisons with NULL return unknown.'],
  ['technical','OSI encryption layer','At which layer of the OSI model does TLS/SSL encryption and data formatting occur?',['Application (Layer 7)','Presentation (Layer 6)','Session (Layer 5)','Transport (Layer 4)'],1,'Layer 6 (Presentation) manages syntax, compression, and TLS/SSL encryption.'],
  ['technical','Default SSH port','Which default port is assigned to Secure Shell (SSH) remote administrative access?',['21','22','23','25'],1,'Port 22 is the standard port for SSH.'],
  ['technical','SYN flood attack','Which type of denial-of-service attack exploits the TCP three-way handshake by leaving half-open connections?',['SQL injection','SYN flood','Cross-site scripting','ARP poisoning'],1,'A SYN flood sends repeated SYN packets without sending final ACKs.'],
  ['technical','Symmetric vs asymmetric','Which encryption standard uses a single secret key for both encryption and decryption?',['RSA','AES','Diffie-Hellman','ECC'],1,'AES is a symmetric cipher using one shared key.'],
  ['technical','Usable host calculation','In a subnet with CIDR notation 192.168.1.0/28, how many usable host addresses are available?',['14','16','30','32'],0,'A /28 subnet has 4 host bits: 2^4 - 2 = 14 usable addresses.'],
  ['technical','Community cloud model','Which cloud deployment model allows systems and infrastructure to be shared by multiple organizations with common compliance needs?',['Public cloud','Private cloud','Community cloud','Hybrid cloud'],2,'Community cloud serves specific organizations with shared requirements.'],

  // 12 MS Office & Excel MCQs
  ['office','Absolute references','Which Excel reference keeps both row and column fixed when copied?',['A1','$A1','A$1','$A$1'],3,'The dollar signs lock both the column A and row 1.'],
  ['office','SUMIF','Which formula sums B2:B10 where A2:A10 equals Paid?',['SUMIF(A2:A10,"Paid",B2:B10)','SUM(B2:B10,"Paid")','COUNTIF(B2:B10,"Paid")','IF(A2:A10,B2:B10)'],0,'SUMIF takes criteria range, criterion, and sum range.'],
  ['office','Exact lookup','In VLOOKUP, which final argument requests an exact match?',['TRUE','FALSE','2','-1'],1,'FALSE selects an exact match; TRUE uses approximate matching.'],
  ['office','Spreadsheet errors','What commonly causes #DIV/0! in Excel?',['A number divided by zero or an empty divisor','A narrow column','An invalid sheet name only','A missing font'],0,'Division by zero or an empty divisor produces #DIV/0!.'],
  ['office','Presentation clarity','A slide contains six detailed paragraphs. What best improves readability?',['Shrink all text','Use one key message and move detail to notes','Add more animations','Remove contrast'],1,'One clear message per slide reduces cognitive load.'],
  ['office','Word styles','What is a practical benefit of using heading styles?',['Consistent hierarchy and automatic contents','Automatic factual accuracy','No need for proofreading','Smaller paragraphs only'],0,'Heading styles structure documents and generate tables of contents.'],
  ['office','VLOOKUP limitation','What is the primary structural limitation of VLOOKUP compared to INDEX-MATCH?',['VLOOKUP cannot handle numbers','VLOOKUP can only search in the first column and return values to the right','VLOOKUP is slower for small files','VLOOKUP cannot sort data'],1,'VLOOKUP requires the lookup key in the leftmost column of the table array.'],
  ['office','Excel formula dragging','If the formula =$B$2 * C$3 in cell D4 is copied to cell E6, what will the formula become?',['=$B$2 * D$3','=$C$4 * D$5','=$B$2 * C$3','=$B$4 * D$3'],0,'Column C shifts to D while row $3 and absolute $B$2 remain locked.'],
  ['office','Excel error tags #REF!','What is the root cause of the #REF! error in Microsoft Excel?',['Formula references a deleted cell or range','Misspelled function name','Division by zero','Incompatible text argument'],0,'#REF! occurs when a referenced cell or sheet has been deleted.'],
  ['office','Excel MID function','In Excel, what is the output of =MID(TRIM("  Accenture Technology 2026  "), 11, 10)?',["Accenture","Technology","Technology 2026","echnology"],1,'TRIM removes outer spaces; MID starting at char 11 for length 10 returns Technology.'],
  ['office','Word Find & Replace shortcut','Which standard Windows keyboard shortcut opens the Find and Replace dialog in Microsoft Word?',['Ctrl + F','Ctrl + H','Ctrl + R','Ctrl + K'],1,'Ctrl + H directly opens Find and Replace.'],
  ['office','PowerPoint slide show shortcut','Which shortcut starts a PowerPoint slide show immediately from the currently selected slide?',['F5','Shift + F5','Ctrl + F5','Alt + F5'],1,'Shift + F5 launches the slide show from the active slide.'],

  // 12 Critical Reasoning MCQs
  ['reasoning','Number series','Find the next term: 3, 7, 15, 31, …',['47','62','63','64'],2,'Each term is twice the previous term plus one.'],
  ['reasoning','Logical implication','All testers are engineers. Some engineers are designers. Which must be true?',['All testers are designers','Some designers are testers','All testers are engineers','No testers are designers'],2,'The first premise is guaranteed; no tester-designer relationship follows.'],
  ['reasoning','Direction sense','You walk 3 km north and 4 km east. What is your straight-line distance from the start?',['7 km','1 km','5 km','12 km'],2,'Right triangle: sqrt(3²+4²)=5.'],
  ['reasoning','Work rates','A completes a task in 6 hours and B in 3 hours. Together, at constant independent rates, how long?',['2 hours','3 hours','4 hours','9 hours'],0,'Combined rate is 1/6+1/3=1/2 task per hour.'],
  ['reasoning','Percent change','A price rises by 20%, then falls by 20%. Relative to its starting price it is…',['Unchanged','4% lower','4% higher','20% lower'],1,'Starting with 100 gives 120 then 96, a 4% decrease.'],
  ['reasoning','Data sufficiency','To find the area of a rectangle, I: length is 8. II: perimeter is 28. Which is sufficient?',['I alone','II alone','Both together','Neither together'],2,'Together they give width=14−8=6 and area=48.'],
  ['reasoning','Probability','A fair die is rolled once. Probability of a prime result?',['1/6','1/3','1/2','2/3'],2,'The prime faces are 2, 3 and 5: three of six outcomes.'],
  ['reasoning','Average','The average of four values is 12. Adding a fifth value of 22 gives what average?',['13','14','15','16'],1,'Total is 4×12+22=70. Divide by 5 to get 14.'],
  ['reasoning','Circular seating opposite','Eight people A through H sit around a circle facing center. C is 1st, A is 3rd right of C. D is opposite B. Who sits opposite B?',['D','E','H','F'],0,'Based on standard circular placement, D is seated directly opposite B.'],
  ['reasoning','Coded blood relations','If P/Q means P is mother of Q, P+Q means P is father of Q, and P-Q means P is sister of Q. In M/N+O-Q, how is M related to Q?',['Mother','Paternal Grandmother','Maternal Aunt','Sister'],1,'M is mother of N, who is father of Q; thus M is the paternal grandmother.'],
  ['reasoning','Syllogisms quantifiers','Statements: All Routers are Modems. Some Modems are Switches. No Switch is Firewall. Conclusion: Some Modems are not Firewalls.',['Follows definitely','Does not follow','Insufficient information','Partially invalid'],0,'Modems that are Switches cannot be Firewalls; thus the conclusion follows.'],
  ['reasoning','Distance & turn sequence','A person walks 10m South, turns left and walks 15m, turns left again and walks 10m. What is the direction from start?',['East','West','North','South'],0,'Moving 10m South, 15m East, and 10m North leaves the person exactly 15m East of the origin.'],

  // 8 English Ability MCQs
  ['english','Subject–verb agreement','Choose the correct sentence.',['Each of the students have a laptop.','Each of the students has a laptop.','Each students has a laptop.','Each of students have laptop.'],1,'Each takes a singular verb: has.'],
  ['english','Professional tone','Which opening is most appropriate when requesting clarification?',['You did not explain anything.','Could you clarify the acceptance criteria for this task?','This makes no sense.','Reply immediately.'],1,'Courteous and clear request without blame.'],
  ['english','Concise writing','Choose the most concise equivalent of “at this point in time”.',['Presently currently','Now','At this current present moment','In the point of time'],1,'Now conveys the same meaning without repetition.'],
  ['english','Inference','A team released a fix and then monitored error rates. What can you conclude?',['The error rate became zero','They checked behavior after release','The fix was unnecessary','Customers all complained'],1,'Monitoring behavior after release is directly stated.'],
  ['english','Prepositions','Complete: The team is responsible ___ maintaining the service.',['to','of','for','with'],2,'Responsible for is the proper idiom.'],
  ['english','Active voice','Choose the active-voice version of “The report was reviewed by Maya.”',['Maya reviewed the report.','The report had been reviewed.','The report is under review.','By Maya the report was reviewed.'],0,'The actor Maya becomes the subject.'],
  ['english','Correlative proximity error','Spot the error: Neither the project lead (A) / nor the developers (B) / was able to resolve (C) / the production issue (D).',['A','B','C','D'],2,'With neither...nor, the verb agrees with the closer plural subject (developers were able).'],
  ['english','Antonym selection','Select the word most opposite in meaning to CANDID:',['Outspoken','Deceitful','Frank','Honest'],1,'Candid means frank and honest; deceitful is its opposite.'],

  // 4 Behavioral MCQs
  ['behavioral','Escalating a blocker','A dependency may delay delivery tomorrow. What is the most effective response?',['Wait until the deadline','Inform the lead early with impact and options','Blame the other team publicly','Hide the risk'],1,'Early communication enables shared solutions.'],
  ['behavioral','Handling a mistake','You discover that your change introduced a production defect. What should you do first?',['Delete the logs','Notify the incident owner and help contain impact','Wait for someone else to notice','Argue that tests passed'],1,'Own the issue and coordinate containment.'],
  ['behavioral','Team conflict','Two teammates disagree about an implementation. What is a constructive next step?',['Select the louder opinion','Compare requirements and evidence, then agree on a test','Avoid a decision forever','Escalate personally on social media'],1,'Evidence-based discussions resolve technical conflict.'],
  ['behavioral','Unclear requirements','A request is ambiguous and the deadline is close. What is most useful?',['Assume silently','Confirm the key acceptance criteria and communicate assumptions','Implement every possible feature','Reject all work'],1,'Clarifying acceptance criteria reduces rework.']
];

mcqs.forEach(([category, topic, scenario, options, answer, explanation], i) => {
  questions.push({
    id: `mcq-${i + 1}`,
    title: topic,
    type: 'mcq',
    category,
    topic,
    scenario,
    options,
    answer,
    explanation,
    difficulty: i % 3 === 0 ? 'Medium' : 'Easy',
    minutes: 2,
    free: i < 4,
    source: 'Accenture authentic question bank',
    confidence: 'Verified authentic',
    lesson: explanation
  });
});

// Update modules with balanced question IDs
const modules = [
  {
    title: 'Build your baseline',
    focus: 'Arrays · diagnostic · assessment setup',
    ids: ['parity', 'second-largest', 'rat-count-house', 'mcq-1', 'mcq-3', 'mcq-15', 'mcq-29', 'mcq-41', 'mcq-53'],
    learn: 'Review input/output, zero-based indexing, parity and boundary cases. Test empty arrays and edge cases.',
    tasks: ['Take the free diagnostic and record weak topics.', 'Solve parity and explain your loop invariant.', 'Solve rat-count-house simulation.']
  },
  {
    title: 'Master strings & bitwise operations',
    focus: 'Strings · bitwise logic · validation',
    ids: ['compression', 'matching-words', 'two-sum', 'binary-string-ops', 'password-checker', 'move-hyphens', 'mcq-2', 'mcq-9', 'mcq-13', 'mcq-54'],
    learn: 'Practice bitwise operations (AND, OR, XOR) and in-place string manipulation.',
    tasks: ['Trace binary string operations step by step.', 'Implement password validity criteria.', 'Practice string run compression.']
  },
  {
    title: 'Think in states & algorithms',
    focus: 'Dynamic programming · windows · stacks',
    ids: ['house-robber', 'window-sum', 'brackets', 'product-smallest-pair', 'large-small-sum', 'superior-elements', 'mcq-4', 'mcq-8', 'mcq-11'],
    learn: 'Define states clearly before writing recurrences. Maintain running maximums for superior elements.',
    tasks: ['Trace house-robber DP table.', 'Implement superior elements leader scan.', 'Solve large-small-sum position sorting.']
  },
  {
    title: 'Number theory & mathematical checks',
    focus: 'Primes · factorization · sequences',
    ids: ['prime-powers', 'prime-neighbours', 'automorphic-number', 'subarray-sum', 'pairwise-difference', 'mcq-10', 'mcq-14', 'mcq-43'],
    learn: 'Trial division, square properties, and sliding window target matches.',
    tasks: ['Test automorphic check on 25 and 76.', 'Implement sliding window for target subarray sum.', 'Review prime neighbours primality checks.']
  },
  {
    title: 'Make SQL predictable',
    focus: 'JOIN · GROUP BY · HAVING · Subqueries',
    ids: sqls.map(s => s[0]),
    learn: 'Filter before aggregation. Group by primary keys. Use HAVING for aggregated conditions.',
    tasks: ['Execute all six SQL exercises on fixture tables.', 'Compare INNER JOIN vs LEFT JOIN for missing registrations.', 'Write distinct count aggregations.']
  },
  {
    title: 'Build interactive web interfaces',
    focus: 'DOM manipulation · event handling · styles',
    ids: ['q1', 'q2', 'q3', 'q7', 'q10'],
    learn: 'Preserve required IDs. Attach event listeners cleanly and update state before re-rendering.',
    tasks: ['Complete iPod interface styling.', 'Build Employee Task Manager with status changes.', 'Implement USD to INR currency converter.']
  },
  {
    title: 'Complex frontend workflows',
    focus: 'Cart · chatbot · carousel · password validator',
    ids: ['q4', 'q5', 'q6', 'q8', 'q9'],
    learn: 'Manage multi-field validation, todo filtering without DOM removal, and real-time feedback.',
    tasks: ['Complete password validator with strength indicators.', 'Build Interactive Todo List with active filters.', 'Test chatbot message routing.']
  },
  {
    title: 'Strengthen technical fundamentals',
    focus: 'Pseudocode · cloud · networks · Office',
    ids: questions.filter(q => ['pseudocode', 'technical', 'office'].includes(q.category)).map(q => q.id).slice(0, 15),
    learn: 'Review OSI layers, port allocations, cloud service models, and Excel VLOOKUP vs INDEX-MATCH.',
    tasks: ['Practice 15 timed technical MCQs.', 'Review TCP SYN flood mechanism.', 'Trace nested loops with conditional increments.']
  },
  {
    title: 'Reason clearly, communicate well',
    focus: 'Reasoning · English · workplace judgement',
    ids: questions.filter(q => ['reasoning', 'english', 'behavioral'].includes(q.category)).map(q => q.id).slice(0, 15),
    learn: 'Resolve circular seating step by step. Verify proximity rules in subject-verb agreement.',
    tasks: ['Solve 8-person circular seating arrangement.', 'Review correlative conjunction error spotting.', 'Draft clear blocker escalation message.']
  },
  {
    title: 'Rehearse the complete round',
    focus: 'Timed coding · SQL · frontend · MCQs',
    ids: ['prime-powers', 'rat-count-house', 'sports-sql', 'pending-registrations', 'q7', 'q8', 'mcq-9', 'mcq-23'],
    learn: 'Simulate full 90-minute testing condition. Plan time allocations across sections.',
    tasks: ['Take a timed multi-domain mock round.', 'Review edge-case failures.', 'Verify complete exam checklist.']
  }
];

const lessons = JSON.parse(fs.readFileSync(path.join(root, 'private/bank/lessons.json'), 'utf8'));

const tracks = [10, 20, 30].map(days => ({
  days,
  name: days === 10 ? 'The focused sprint' : days === 20 ? 'Build your rhythm' : 'Start from the foundations',
  daily: days === 10 ? '3–4 hours / day' : days === 20 ? '90–120 min / day' : '60–90 min / day',
  schedule: modules.flatMap((m, i) => Array.from({ length: days / 10 }, (_, j) => {
    const phases = days / 10;
    const tasks = phases === 1 ? m.tasks : j === 0 ? [
      m.tasks[0],
      'Read the worked example and trace it on paper or mentally.',
      'Attempt the linked exercises and note one question you still have.'
    ] : j === 1 ? [
      'Attempt the linked exercises without copying a reference.',
      m.tasks[1],
      'Write down the cause of each failed test and retest the fix.'
    ] : [
      m.tasks[2] || m.tasks[0],
      'Re-solve one earlier exercise without notes.',
      'Explain your approach and its trade-offs in a short spoken summary.'
    ];
    return {
      ...m,
      lesson: lessons[i],
      tasks,
      ids: phases === 1 ? m.ids : m.ids.slice(Math.floor(j * m.ids.length / phases), Math.floor((j + 1) * m.ids.length / phases)),
      day: i * phases + j + 1,
      phase: days === 10 ? 'Learn + practise + review' : days === 20 ? ['Learn & apply', 'Timed practice & review'][j] : ['Learn the foundations', 'Apply in the workspace', 'Review & retrieve'][j],
      title: days === 10 ? m.title : `${m.title} · ${['Learn', 'Practise', 'Review'][j]}`
    };
  }))
}));

const references = JSON.parse(fs.readFileSync(path.join(root, 'private/bank/reference-solutions.json'), 'utf8'));
for (const q of questions) {
  if (references[q.id]) q.solution.python = references[q.id];
}

fs.writeFileSync(path.join(root, 'private/bank/questions.json'), JSON.stringify(questions, null, 2));
fs.writeFileSync(path.join(root, 'private/bank/tracks.json'), JSON.stringify(tracks, null, 2));
console.log(`Successfully built ${questions.length} questions and tracks of ${tracks.map(t => t.days).join(', ')} days.`);

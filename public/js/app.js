/**
 * Main Application Controller for Accenture OA Simulator
 * Coordinates Questions, State, Timers, Anti-Cheat, and Sandboxed Evaluation
 */

(function initAccentureApp() {
  // Global State
  const state = {
    questions: [],
    currentQuestionIndex: 0,
    oaTimeRemaining: 20 * 60, // 20 minutes in seconds
    solutionTimers: {},       // { [qId]: { remainingSeconds: 1200, isUnlocked: false } }
    revisitMap: {},           // { [qId]: boolean }
    solvedMap: {},            // { [qId]: boolean }
    violationsCount: 0,
    activeTab: 'problem',     // 'problem' | 'solution'
    activeEditorTab: 'html',  // 'html' | 'css' | 'js' | 'preview' | 'tests'
  };

  // DOM Elements
  const dom = {
    questionNav: document.getElementById('question-nav'),
    revisitCheckbox: document.getElementById('revisit-checkbox'),
    oaTimerDisplay: document.getElementById('oa-timer-display'),
    oaTimerBox: document.getElementById('oa-timer-box'),
    categoryBadge: document.getElementById('category-badge'),

    // Left Pane
    problemTitle: document.getElementById('problem-title'),
    difficultyBadge: document.getElementById('difficulty-badge'),
    problemDay: document.getElementById('problem-day'),
    problemTimeLimit: document.getElementById('problem-time-limit'),
    problemScenario: document.getElementById('problem-scenario'),
    problemObjectives: document.getElementById('problem-objectives'),
    problemConstraints: document.getElementById('problem-constraints'),

    // Left Tabs
    paneTabs: document.querySelectorAll('.pane-tab'),
    problemView: document.getElementById('problem-view'),
    solutionView: document.getElementById('solution-view'),
    solutionTabIcon: document.getElementById('solution-tab-icon'),
    solutionStatusPill: document.getElementById('solution-status-pill'),
    solutionLockedCard: document.getElementById('solution-locked-card'),
    solutionUnlockedCard: document.getElementById('solution-unlocked-card'),
    solutionCountdown: document.getElementById('solution-countdown'),
    solutionProgressFill: document.getElementById('solution-progress-fill'),
    solutionExplanation: document.getElementById('solution-explanation'),
    solutionCodeHtml: document.getElementById('solution-code-html'),
    solutionCodeCss: document.getElementById('solution-code-css'),
    solutionCodeJs: document.getElementById('solution-code-js'),
    btnEmergencyUnlock: document.getElementById('btn-emergency-unlock'),
    btnLoadSolution: document.getElementById('btn-load-solution'),

    // Editor & Tabs
    editorTabs: document.querySelectorAll('.editor-tab'),
    workspaces: {
      code: document.getElementById('workspace-code'),
      preview: document.getElementById('workspace-preview'),
      tests: document.getElementById('workspace-tests')
    },
    previewIframe: document.getElementById('preview-iframe'),
    btnRefreshPreview: document.getElementById('btn-refresh-preview'),
    btnResetCode: document.getElementById('btn-reset-code'),

    // Action buttons & Footer
    btnRunCode: document.getElementById('btn-run-code'),
    btnSubmitTests: document.getElementById('btn-submit-tests'),
    btnPrevQuestion: document.getElementById('btn-prev-question'),
    btnNextQuestion: document.getElementById('btn-next-question'),
    testSummaryPill: document.getElementById('test-summary-pill'),
    violationCount: document.getElementById('violation-count'),
    antiCheatToast: document.getElementById('anti-cheat-toast'),
    toastMessage: document.getElementById('toast-message'),

    // Test Console Elements
    statTotalTests: document.getElementById('stat-total-tests'),
    statPassedTests: document.getElementById('stat-passed-tests'),
    statFailedTests: document.getElementById('stat-failed-tests'),
    statScorePercent: document.getElementById('stat-score-percent'),
    testResultsList: document.getElementById('test-results-list'),

    // Resizer
    paneResizer: document.getElementById('pane-resizer'),
    leftPane: document.getElementById('left-pane')
  };

  let editorManager = null;
  let oaInterval = null;
  let solutionInterval = null;
  let toastTimeout = null;

  // -------------------------------------------------------------------------
  // Initialization
  // -------------------------------------------------------------------------
  async function init() {
    // Clear any corrupted empty code entries in localStorage from earlier bug
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith('accenture_code_')) {
        const val = localStorage.getItem(key);
        if (!val || val.trim().length === 0) {
          localStorage.removeItem(key);
        }
      }
    }

    initEditor();
    initSplitPaneResizer();
    initGlobalTimers();
    initCandidateTracking();
    await loadQuestions();
    setupEventListeners();
  }

  function initEditor() {
    editorManager = new window.CodeEditorManager({
      onAntiCheatViolation: handleAntiCheatViolation,
      onCodeChange: () => {
        // Clear old test results pill status on fresh edit
        dom.testSummaryPill.textContent = 'Modified';
        dom.testSummaryPill.style.backgroundColor = '#3f3f46';
      }
    });
  }

  // -------------------------------------------------------------------------
  // Load Questions & Setup Navigation
  // -------------------------------------------------------------------------
  async function loadQuestions() {
    try {
      const response = await fetch('/api/questions');
      const data = await response.json();
      state.questions = data.questions || [];
      renderQuestionPills();
      loadQuestionByIndex(0);
    } catch (err) {
      console.error('Failed to load questions from server, falling back to static:', err);
      try {
        const fallback = await fetch('data/questions.json');
        const data = await fallback.json();
        state.questions = data.questions || [];
        renderQuestionPills();
        loadQuestionByIndex(0);
      } catch (e) {
        alert('Could not load questions. Ensure the local server is running.');
      }
    }
  }

  function renderQuestionPills() {
    dom.questionNav.innerHTML = '';
    state.questions.forEach((q, idx) => {
      const pill = document.createElement('button');
      pill.className = `q-pill ${idx === state.currentQuestionIndex ? 'active' : ''}`;
      pill.id = `pill-${q.id}`;
      
      const categoryIcon = q.category === 'dsa' ? '⚡ ' : q.category === 'sql' ? '🗄️ ' : '';
      const dayLabel = q.day ? q.day.replace('Day ', 'D') : `Q${idx + 1}`;
      pill.textContent = `${categoryIcon}${dayLabel}`;
      pill.title = `${q.day || 'Question ' + (idx + 1)}: ${q.title}`;

      pill.addEventListener('click', () => loadQuestionByIndex(idx));
      dom.questionNav.appendChild(pill);
    });
  }

  // -------------------------------------------------------------------------
  // Load Specific Question
  // -------------------------------------------------------------------------
  function loadQuestionByIndex(index) {
    if (index < 0 || index >= state.questions.length) return;

    state.currentQuestionIndex = index;
    const q = state.questions[index];

    // Update Question Nav Pills
    document.querySelectorAll('.q-pill').forEach((pill, idx) => {
      pill.classList.toggle('active', idx === index);
      pill.classList.toggle('revisit', !!state.revisitMap[state.questions[idx].id]);
      pill.classList.toggle('solved', !!state.solvedMap[state.questions[idx].id]);
    });

    // Header Meta
    dom.categoryBadge.textContent = q.category === 'dsa' ? 'Algorithms (DSA)' : q.category === 'sql' ? 'SQL Query' : 'Frontend Web';
    dom.revisitCheckbox.checked = !!state.revisitMap[q.id];

    // Left Pane Content
    dom.problemTitle.textContent = `Question ${index + 1}: ${q.title}`;
    dom.difficultyBadge.textContent = q.difficulty || 'Medium';
    dom.problemDay.textContent = q.day || `Question ${index + 1}`;
    dom.problemTimeLimit.textContent = `${q.timeLimit || 20} Mins`;
    dom.problemScenario.textContent = q.scenario || '';

    // Objectives list
    dom.problemObjectives.innerHTML = '';
    (q.objectives || []).forEach(obj => {
      const li = document.createElement('li');
      li.textContent = obj;
      dom.problemObjectives.appendChild(li);
    });

    // Constraints list
    dom.problemConstraints.innerHTML = '';
    (q.constraints || []).forEach(c => {
      const li = document.createElement('li');
      li.textContent = c;
      dom.problemConstraints.appendChild(li);
    });

    // Editor setup
    editorManager.loadQuestion(q);

    // Reset Test Summary Pill
    dom.testSummaryPill.textContent = '0/' + (q.tests ? q.tests.length : 0);
    dom.testSummaryPill.style.backgroundColor = '#3f3f46';

    // Solution Tab setup
    setupSolutionForQuestion(q);

    // Switch default editor view to code
    switchEditorTab('html');
  }

  // -------------------------------------------------------------------------
  // 20-Minute Locked Solution Logic
  // -------------------------------------------------------------------------
  function setupSolutionForQuestion(q) {
    const qId = q.id;
    const TOTAL_LOCK_SECONDS = 20 * 60; // 20 minutes = 1200 seconds

    if (!state.solutionTimers[qId]) {
      const isAlreadyUnlocked = localStorage.getItem(`accenture_solution_unlocked_${qId}`) === 'true';
      const savedRemaining = localStorage.getItem(`accenture_solution_remaining_${qId}`);

      state.solutionTimers[qId] = {
        remainingSeconds: savedRemaining !== null ? parseInt(savedRemaining, 10) : TOTAL_LOCK_SECONDS,
        isUnlocked: isAlreadyUnlocked
      };
    }

    renderSolutionState(q);
  }

  function renderSolutionState(q) {
    const qId = q.id;
    const timerState = state.solutionTimers[qId];

    if (timerState.isUnlocked || timerState.remainingSeconds <= 0) {
      // Unlocked
      dom.solutionTabIcon.textContent = '💡';
      dom.solutionStatusPill.textContent = 'Unlocked';
      dom.solutionStatusPill.className = 'solution-status-pill unlocked';
      dom.solutionLockedCard.style.display = 'none';
      dom.solutionUnlockedCard.style.display = 'block';

      // Fill in solution data
      if (q.solution) {
        dom.solutionExplanation.innerHTML = formatMarkdown(q.solution.explanation || '');
        dom.solutionCodeHtml.textContent = q.solution.html || '';
        dom.solutionCodeCss.textContent = q.solution.css || '';
        dom.solutionCodeJs.textContent = q.solution.js || '';
      }
    } else {
      // Locked
      dom.solutionTabIcon.textContent = '🔒';
      dom.solutionStatusPill.textContent = 'Locked';
      dom.solutionStatusPill.className = 'solution-status-pill';
      dom.solutionLockedCard.style.display = 'flex';
      dom.solutionUnlockedCard.style.display = 'none';

      updateSolutionCountdownDisplay(timerState.remainingSeconds);
    }
  }

  function updateSolutionCountdownDisplay(seconds) {
    const TOTAL = 20 * 60;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    dom.solutionCountdown.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const percent = Math.min(100, Math.max(0, Math.round(((TOTAL - seconds) / TOTAL) * 100)));
    dom.solutionProgressFill.style.width = `${percent}%`;
  }

  function unlockCurrentSolution() {
    const q = state.questions[state.currentQuestionIndex];
    if (!q) return;

    state.solutionTimers[q.id].isUnlocked = true;
    state.solutionTimers[q.id].remainingSeconds = 0;
    localStorage.setItem(`accenture_solution_unlocked_${q.id}`, 'true');
    localStorage.setItem(`accenture_solution_remaining_${q.id}`, '0');

    renderSolutionState(q);
  }

  // -------------------------------------------------------------------------
  // Global Assessment & Solution Tick Timers
  // -------------------------------------------------------------------------
  function initGlobalTimers() {
    // 20-Min Overall Assessment Timer
    const savedOa = localStorage.getItem('accenture_oa_timer');
    if (savedOa !== null) {
      const parsed = parseInt(savedOa, 10);
      if (parsed > 20 * 60 || isNaN(parsed) || parsed <= 0) {
        state.oaTimeRemaining = 20 * 60;
      } else {
        state.oaTimeRemaining = parsed;
      }
    } else {
      state.oaTimeRemaining = 20 * 60;
    }

    oaInterval = setInterval(() => {
      if (state.oaTimeRemaining > 0) {
        state.oaTimeRemaining--;
        localStorage.setItem('accenture_oa_timer', state.oaTimeRemaining);
        renderOaTimer();
      }
    }, 1000);

    renderOaTimer();

    // Per-question 20-min solution ticker
    solutionInterval = setInterval(() => {
      const q = state.questions[state.currentQuestionIndex];
      if (!q) return;

      const timer = state.solutionTimers[q.id];
      if (timer && !timer.isUnlocked && timer.remainingSeconds > 0) {
        timer.remainingSeconds--;
        localStorage.setItem(`accenture_solution_remaining_${q.id}`, timer.remainingSeconds);

        if (dom.solutionView.classList.contains('active')) {
          updateSolutionCountdownDisplay(timer.remainingSeconds);
        }

        if (timer.remainingSeconds <= 0) {
          unlockCurrentSolution();
        }
      }
    }, 1000);
  }

  function renderOaTimer() {
    const mins = Math.floor(state.oaTimeRemaining / 60);
    const secs = state.oaTimeRemaining % 60;
    dom.oaTimerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (state.oaTimeRemaining <= 5 * 60) {
      dom.oaTimerBox.classList.add('timer-warning');
    } else {
      dom.oaTimerBox.classList.remove('timer-warning');
    }
  }

  // -------------------------------------------------------------------------
  // Anti-Cheat & Proctoring Simulation
  // -------------------------------------------------------------------------
  function handleAntiCheatViolation(actionName) {
    state.violationsCount++;
    dom.violationCount.style.display = 'inline-block';
    dom.violationCount.textContent = `⚠️ ${state.violationsCount} Violation${state.violationsCount > 1 ? 's' : ''}`;

    dom.toastMessage.textContent = `${actionName} is strictly prohibited in the Accenture Online Assessment environment.`;
    dom.antiCheatToast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      dom.antiCheatToast.classList.remove('show');
    }, 3200);
  }

  // -------------------------------------------------------------------------
  // Editor Tabs & Workspaces
  // -------------------------------------------------------------------------
  function switchEditorTab(targetTab) {
    state.activeEditorTab = targetTab;

    dom.editorTabs.forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-editor') === targetTab);
    });

    if (['html', 'css', 'js'].includes(targetTab)) {
      dom.workspaces.code.classList.add('active');
      dom.workspaces.preview.classList.remove('active');
      dom.workspaces.tests.classList.remove('active');
      editorManager.switchLanguage(targetTab);
    } else if (targetTab === 'preview') {
      dom.workspaces.code.classList.remove('active');
      dom.workspaces.preview.classList.add('active');
      dom.workspaces.tests.classList.remove('active');
      refreshPreview();
    } else if (targetTab === 'tests') {
      dom.workspaces.code.classList.remove('active');
      dom.workspaces.preview.classList.remove('active');
      dom.workspaces.tests.classList.add('active');
    }
  }

  function refreshPreview() {
    const bundle = editorManager.getCurrentBundle();
    window.assessmentRunner.renderPreview(dom.previewIframe, bundle.html, bundle.css, bundle.js);
  }

  // -------------------------------------------------------------------------
  // Test Execution & Submission
  // -------------------------------------------------------------------------
  async function submitAndRunTests() {
    const q = state.questions[state.currentQuestionIndex];
    if (!q) return;

    // Switch to Test Console tab immediately
    switchEditorTab('tests');

    dom.testResultsList.innerHTML = `
      <div style="text-align:center; padding:30px; color:#a1a1aa;">
        <span style="font-size:24px; display:block; margin-bottom:8px;">⚙️</span>
        Executing automated assertion tests in sandboxed iframe...
      </div>
    `;

    const bundle = editorManager.getCurrentBundle();
    const result = await window.assessmentRunner.runTestSuite(dom.previewIframe, q, bundle.html, bundle.css, bundle.js);

    // Update Stats
    dom.statTotalTests.textContent = result.total;
    dom.statPassedTests.textContent = result.passed;
    dom.statFailedTests.textContent = result.failed;
    dom.statScorePercent.textContent = `${result.scorePercent}%`;

    dom.testSummaryPill.textContent = `${result.passed}/${result.total}`;
    dom.testSummaryPill.style.backgroundColor = result.passed === result.total ? '#15803d' : '#b91c1c';

    // Mark question solved if 100% passed
    if (result.passed === result.total && result.total > 0) {
      state.solvedMap[q.id] = true;
      localStorage.setItem(`accenture_solved_${q.id}`, 'true');
      const pill = document.getElementById(`pill-${q.id}`);
      if (pill) pill.classList.add('solved');
    }

    // Render detailed test cards
    dom.testResultsList.innerHTML = '';
    result.results.forEach((test, idx) => {
      const card = document.createElement('div');
      card.className = `test-card ${test.passed ? 'passed' : 'failed'}`;
      card.innerHTML = `
        <div class="test-card-top">
          <span class="test-name">Test ${idx + 1}: ${test.name}</span>
          <span class="test-badge ${test.passed ? 'pass' : 'fail'}">${test.passed ? 'PASS' : 'FAIL'}</span>
        </div>
        <div class="test-desc">${test.description}</div>
        ${test.error ? `<div class="test-error-msg"><strong>Error:</strong> ${test.error}</div>` : ''}
      `;
      dom.testResultsList.appendChild(card);
    });
  }

  // -------------------------------------------------------------------------
  // Event Listeners
  // -------------------------------------------------------------------------
  function setupEventListeners() {
    // Left pane tab switching
    dom.paneTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');
        dom.paneTabs.forEach(t => t.classList.toggle('active', t === tab));
        dom.problemView.classList.toggle('active', target === 'problem');
        dom.solutionView.classList.toggle('active', target === 'solution');

        if (target === 'solution') {
          const q = state.questions[state.currentQuestionIndex];
          if (q) renderSolutionState(q);
        }
      });
    });

    // Right editor tab switching
    dom.editorTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        switchEditorTab(tab.getAttribute('data-editor'));
      });
    });

    // Run Code & Submit Buttons
    dom.btnRunCode.addEventListener('click', () => {
      switchEditorTab('preview');
    });

    dom.btnSubmitTests.addEventListener('click', submitAndRunTests);
    dom.btnRefreshPreview.addEventListener('click', refreshPreview);

    // Reset code button
    dom.btnResetCode.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset your code to the starter boilerplate?')) {
        const q = state.questions[state.currentQuestionIndex];
        editorManager.resetToStarter(q);
      }
    });

    // Navigation buttons
    dom.btnPrevQuestion.addEventListener('click', () => {
      if (state.currentQuestionIndex > 0) {
        loadQuestionByIndex(state.currentQuestionIndex - 1);
      }
    });

    dom.btnNextQuestion.addEventListener('click', () => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        loadQuestionByIndex(state.currentQuestionIndex + 1);
      }
    });

    // Revisit Checkbox
    dom.revisitCheckbox.addEventListener('change', (e) => {
      const q = state.questions[state.currentQuestionIndex];
      if (!q) return;
      state.revisitMap[q.id] = e.target.checked;
      localStorage.setItem(`accenture_revisit_${q.id}`, e.target.checked ? 'true' : 'false');
      const pill = document.getElementById(`pill-${q.id}`);
      if (pill) pill.classList.toggle('revisit', e.target.checked);
    });

    // Emergency unlock button
    dom.btnEmergencyUnlock.addEventListener('click', () => {
      if (confirm('Unlock solution immediately? (Recommended only after trying actively for 20 minutes)')) {
        unlockCurrentSolution();
      }
    });

    // Load solution into editor
    dom.btnLoadSolution.addEventListener('click', () => {
      const q = state.questions[state.currentQuestionIndex];
      if (confirm('Replace your current code with the verified solution?')) {
        editorManager.applySolution(q);
        switchEditorTab('html');
      }
    });
  }

  // -------------------------------------------------------------------------
  // Resizable Split Pane Handle
  // -------------------------------------------------------------------------
  function initSplitPaneResizer() {
    let isDragging = false;

    dom.paneResizer.addEventListener('mousedown', (e) => {
      isDragging = true;
      dom.paneResizer.classList.add('resizing');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const containerWidth = document.querySelector('.main-layout').offsetWidth;
      const newWidth = Math.max(300, Math.min(e.clientX, containerWidth - 360));
      dom.leftPane.style.width = `${newWidth}px`;
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        dom.paneResizer.classList.remove('resizing');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    });
  }

  // Simple Markdown helper
  function formatMarkdown(text) {
    return text
      .replace(/^### (.*$)/gim, '<h4 style="margin:8px 0 4px; color:#1e293b;">$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background:#e2e8f0; padding:1px 4px; border-radius:3px;">$1</code>')
      .replace(/\n/g, '<br/>');
  }

  // -------------------------------------------------------------------------
  // Candidate Login & Device Telemetry Tracking
  // -------------------------------------------------------------------------
  function getDeviceTelemetry() {
    let deviceId = localStorage.getItem('accenture_device_id');
    if (!deviceId) {
      deviceId = 'acc-' + Math.random().toString(36).substring(2, 10) + '-' + Date.now().toString(36);
      localStorage.setItem('accenture_device_id', deviceId);
    }

    const ua = navigator.userAgent || '';
    let os = 'Unknown OS';
    if (/Windows NT 10.0/i.test(ua)) os = 'Windows 10/11';
    else if (/Windows/i.test(ua)) os = 'Windows';
    else if (/Macintosh|Mac OS X/i.test(ua)) os = 'macOS';
    else if (/Android/i.test(ua)) os = 'Android';
    else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
    else if (/Linux/i.test(ua)) os = 'Linux';
    else if (/CrOS/i.test(ua)) os = 'ChromeOS';

    let browser = 'Unknown Browser';
    if (/Edg\//i.test(ua)) browser = 'Microsoft Edge';
    else if (/Chrome\//i.test(ua)) browser = 'Chrome';
    else if (/Firefox\//i.test(ua)) browser = 'Firefox';
    else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
    else if (/OPR\//i.test(ua) || /Opera/i.test(ua)) browser = 'Opera';

    const touchPoints = (typeof navigator.maxTouchPoints === 'number') ? navigator.maxTouchPoints : 0;
    const deviceType = (touchPoints > 0)
      ? (touchPoints >= 5 ? 'Mobile / Tablet' : 'Touchscreen Laptop')
      : 'Desktop / Laptop';

    const language = navigator.language || 'en';
    let timezone = 'Asia/Kolkata';
    try {
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
    } catch (e) {}

    const cores = (navigator.hardwareConcurrency != null) ? `${navigator.hardwareConcurrency} Cores` : 'Unknown';
    const memory = (navigator.deviceMemory != null) ? `${navigator.deviceMemory} GB` : 'Unknown';
    const screenRes = `${window.screen.width}x${window.screen.height} (${window.devicePixelRatio || 1}x)`;

    return {
      deviceId,
      os,
      browser,
      screen: screenRes,
      cores,
      memory,
      touchPoints,
      deviceType,
      language,
      timezone,
      userAgent: ua
    };
  }

  function initCandidateTracking() {
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const inputName = document.getElementById('input-candidate-name');
    const inputEmail = document.getElementById('input-candidate-email');
    const previewDeviceId = document.getElementById('preview-device-id');
    const previewOsBrowser = document.getElementById('preview-os-browser');
    const previewHardware = document.getElementById('preview-hardware');
    const previewTimezone = document.getElementById('preview-timezone');
    const candidatePill = document.getElementById('candidate-pill');
    const candidateNameDisplay = document.getElementById('candidate-name-display');

    const adminModal = document.getElementById('admin-modal');
    const btnOpenLogs = document.getElementById('btn-open-logs');
    const btnCloseAdmin = document.getElementById('btn-close-admin');
    const adminLogsTbody = document.getElementById('admin-logs-tbody');

    const telemetry = getDeviceTelemetry();

    if (previewDeviceId) previewDeviceId.textContent = telemetry.deviceId;
    if (previewOsBrowser) previewOsBrowser.textContent = `${telemetry.os} • ${telemetry.browser} (${telemetry.deviceType})`;
    if (previewHardware) previewHardware.textContent = `${telemetry.cores} | RAM: ${telemetry.memory} | Screen: ${telemetry.screen}`;
    if (previewTimezone) previewTimezone.textContent = `${telemetry.timezone} [${telemetry.language}]`;

    const savedName = localStorage.getItem('accenture_candidate_name');
    const savedEmail = localStorage.getItem('accenture_candidate_email');

    if (savedName) {
      if (candidateNameDisplay) candidateNameDisplay.textContent = savedName;
      if (inputName) inputName.value = savedName;
      if (inputEmail && savedEmail) inputEmail.value = savedEmail;
    } else {
      if (loginModal) loginModal.style.display = 'flex';
    }

    if (candidatePill) {
      candidatePill.addEventListener('click', () => {
        if (loginModal) loginModal.style.display = 'flex';
      });
    }

    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = (inputName.value || '').trim();
        const email = (inputEmail.value || '').trim();
        if (!name) return;

        localStorage.setItem('accenture_candidate_name', name);
        localStorage.setItem('accenture_candidate_email', email);

        if (candidateNameDisplay) candidateNameDisplay.textContent = name;
        if (loginModal) loginModal.style.display = 'none';

        try {
          await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              email,
              ...telemetry
            })
          });
        } catch (err) {
          console.warn('Could not post candidate telemetry to server:', err);
        }
      });
    }

    // Admin Logs Modal Logic
    async function loadAdminLogs() {
      if (!adminLogsTbody) return;
      adminLogsTbody.innerHTML = '<tr><td colspan="11" style="text-align:center; padding:16px;">Loading logs...</td></tr>';
      try {
        const res = await fetch('/api/logs');
        const logs = await res.json();
        if (!logs || logs.length === 0) {
          adminLogsTbody.innerHTML = '<tr><td colspan="11" style="text-align:center; padding:16px; color:#a1a1aa;">No candidates logged yet.</td></tr>';
          return;
        }

        adminLogsTbody.innerHTML = logs.slice().reverse().map(item => {
          const isTouch = (item.touchPoints > 0) || (item.deviceType && item.deviceType.toLowerCase().includes('mobile'));
          const typeBadgeColor = isTouch ? 'background:#fef3c7; color:#92400e;' : 'background:#f1f5f9; color:#475569;';
          return `
          <tr>
            <td style="white-space:nowrap; font-size:11px; color:#a1a1aa;">${item.timestamp || '-'}</td>
            <td><strong>${escapeHtml(item.name || '-')}</strong></td>
            <td>${escapeHtml(item.email || '-')}</td>
            <td><code style="font-size:11px; background:#27272a; padding:2px 6px; border-radius:4px;">${escapeHtml(item.deviceId || '-')}</code></td>
            <td><span style="font-size:11px; font-weight:600; padding:2px 8px; border-radius:12px; ${typeBadgeColor}">${escapeHtml(item.deviceType || 'Desktop')}</span></td>
            <td>${escapeHtml(item.os || '-')} • ${escapeHtml(item.browser || '-')}</td>
            <td style="font-size:11px;">${escapeHtml(item.screen || '-')}</td>
            <td style="font-size:11px;">${escapeHtml(item.cores || '-')} / ${escapeHtml(item.memory || '-')}</td>
            <td style="text-align:center; font-size:11px;">${item.touchPoints !== undefined ? item.touchPoints : 0} pts</td>
            <td style="font-size:11px;">${escapeHtml(item.timezone || '-')}<br><small style="color:#64748b;">${escapeHtml(item.language || '-')}</small></td>
            <td><span style="background:#0284c7; color:#fff; padding:2px 6px; border-radius:4px; font-size:11px;">${escapeHtml(item.ip || '-')}</span></td>
          </tr>
        `;
        }).join('');
      } catch (err) {
        adminLogsTbody.innerHTML = `<tr><td colspan="11" style="text-align:center; color:#f87171; padding:16px;">Failed to fetch logs: ${err.message}</td></tr>`;
      }
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    if (btnOpenLogs) {
      btnOpenLogs.addEventListener('click', () => {
        if (adminModal) adminModal.style.display = 'flex';
        loadAdminLogs();
      });
    }

    if (btnCloseAdmin) {
      btnCloseAdmin.addEventListener('click', () => {
        if (adminModal) adminModal.style.display = 'none';
      });
    }

    if (adminModal) {
      adminModal.addEventListener('click', (e) => {
        if (e.target === adminModal) {
          adminModal.style.display = 'none';
        }
      });
    }
  }

  // Boot
  document.addEventListener('DOMContentLoaded', init);
})();

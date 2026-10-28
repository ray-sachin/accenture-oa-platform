/**
 * Code Editor & Anti-Cheat Simulation Module
 * Lightweight zero-dependency editor with line numbering, tab indentation,
 * synchronized scrolling, and proctored clipboard/contextmenu lockdown.
 */

class CodeEditorManager {
  constructor(options = {}) {
    this.textarea = document.getElementById('code-textarea');
    this.gutter = document.getElementById('editor-gutter');
    this.activeLanguage = 'html'; // 'html' | 'css' | 'js'
    this.currentQuestionId = null;
    this.codeCache = {}; // { [qId]: { html: '', css: '', js: '' } }
    this.onAntiCheatViolation = options.onAntiCheatViolation || (() => {});
    this.onCodeChange = options.onCodeChange || (() => {});

    this.initEventListeners();
  }

  initEventListeners() {
    // 1. Line numbers and input tracking
    this.textarea.addEventListener('input', () => {
      this.updateLineNumbers();
      this.saveCurrentBuffer();
      this.onCodeChange(this.activeLanguage, this.textarea.value);
    });

    // 2. Synchronized scrolling
    this.textarea.addEventListener('scroll', () => {
      this.gutter.scrollTop = this.textarea.scrollTop;
    });

    // 3. Tab Key Indentation (Inserts 2 spaces instead of losing focus)
    this.textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;
        const value = this.textarea.value;

        // Insert 2 spaces
        this.textarea.value = value.substring(0, start) + '  ' + value.substring(end);
        this.textarea.selectionStart = this.textarea.selectionEnd = start + 2;

        this.updateLineNumbers();
        this.saveCurrentBuffer();
      }

      // Intercept Ctrl+C, Ctrl+V, Ctrl+X shortcuts for anti-cheat
      if (e.ctrlKey || e.metaKey) {
        const k = e.key.toLowerCase();
        if (k === 'c' || k === 'v' || k === 'x') {
          e.preventDefault();
          this.triggerViolation(k === 'c' ? 'Copy' : k === 'v' ? 'Paste' : 'Cut');
        }
      }
    });

    // 4. Anti-Cheat: Intercept Cut, Copy, Paste events
    ['cut', 'copy', 'paste'].forEach(evtType => {
      this.textarea.addEventListener(evtType, (e) => {
        e.preventDefault();
        const action = evtType.charAt(0).toUpperCase() + evtType.slice(1);
        this.triggerViolation(action);
      });
    });

    // 5. Anti-Cheat: Intercept Context Menu (Right Click)
    this.textarea.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.triggerViolation('Right-Click Context Menu');
    });
  }

  triggerViolation(actionName) {
    this.onAntiCheatViolation(actionName);
  }

  /**
   * Updates the gutter line numbers based on textarea line count.
   */
  updateLineNumbers() {
    const lines = this.textarea.value.split('\n');
    const lineCount = Math.max(1, lines.length);

    let gutterHtml = '';
    for (let i = 1; i <= lineCount; i++) {
      gutterHtml += `<div class="gutter-line">${i}</div>`;
    }

    this.gutter.innerHTML = gutterHtml;
  }

  /**
   * Loads starter code or restored localStorage code for a question.
   */
  loadQuestion(question) {
    this.currentQuestionId = question.id;

    if (!this.codeCache[question.id]) {
      // Check localStorage first
      const savedHtml = localStorage.getItem(`accenture_code_${question.id}_html`);
      const savedCss = localStorage.getItem(`accenture_code_${question.id}_css`);
      const savedJs = localStorage.getItem(`accenture_code_${question.id}_js`);

      // Use saved code only if it exists and has actual code, otherwise load starterCode!
      this.codeCache[question.id] = {
        html: (savedHtml !== null && savedHtml.trim().length > 0) ? savedHtml : (question.starterCode.html || ''),
        css: (savedCss !== null && savedCss.trim().length > 0) ? savedCss : (question.starterCode.css || ''),
        js: (savedJs !== null && savedJs.trim().length > 0) ? savedJs : (question.starterCode.js || '')
      };
    }

    // Set active language to html and populate textarea directly without intermediate save
    this.activeLanguage = 'html';
    this.textarea.value = this.codeCache[question.id]['html'] || '';
    this.updateLineNumbers();
    this.textarea.scrollTop = 0;
  }

  /**
   * Switches editor buffer to HTML, CSS, or JS.
   */
  switchLanguage(lang) {
    if (!['html', 'css', 'js'].includes(lang)) return;

    // Only save buffer if we're changing language and have a current question
    if (this.currentQuestionId && this.activeLanguage !== lang) {
      this.saveCurrentBuffer();
    }

    this.activeLanguage = lang;

    if (this.currentQuestionId && this.codeCache[this.currentQuestionId]) {
      this.textarea.value = this.codeCache[this.currentQuestionId][lang] || '';
    } else {
      this.textarea.value = '';
    }

    this.updateLineNumbers();
    this.textarea.scrollTop = 0;
  }

  /**
   * Saves the current textarea content into cache and localStorage.
   */
  saveCurrentBuffer() {
    if (!this.currentQuestionId) return;

    if (!this.codeCache[this.currentQuestionId]) {
      this.codeCache[this.currentQuestionId] = { html: '', css: '', js: '' };
    }

    const currentText = this.textarea.value;
    this.codeCache[this.currentQuestionId][this.activeLanguage] = currentText;

    if (currentText.trim().length > 0) {
      localStorage.setItem(
        `accenture_code_${this.currentQuestionId}_${this.activeLanguage}`,
        currentText
      );
    }
  }

  /**
   * Returns current code bundle { html, css, js } for current question.
   */
  getCurrentBundle() {
    this.saveCurrentBuffer();
    if (!this.currentQuestionId || !this.codeCache[this.currentQuestionId]) {
      return { html: '', css: '', js: '' };
    }
    return { ...this.codeCache[this.currentQuestionId] };
  }

  /**
   * Resets code to starter boilerplate.
   */
  resetToStarter(question) {
    if (!question) return;

    this.codeCache[question.id] = {
      html: question.starterCode.html || '',
      css: question.starterCode.css || '',
      js: question.starterCode.js || ''
    };

    localStorage.removeItem(`accenture_code_${question.id}_html`);
    localStorage.removeItem(`accenture_code_${question.id}_css`);
    localStorage.removeItem(`accenture_code_${question.id}_js`);

    this.textarea.value = this.codeCache[question.id][this.activeLanguage] || '';
    this.updateLineNumbers();
    this.textarea.scrollTop = 0;
  }

  /**
   * Injects solution code into the editor.
   */
  applySolution(question) {
    if (!question || !question.solution) return;

    this.codeCache[question.id] = {
      html: question.solution.html || '',
      css: question.solution.css || '',
      js: question.solution.js || ''
    };

    // Update active textarea first with the solution code
    this.textarea.value = this.codeCache[question.id][this.activeLanguage] || '';
    this.updateLineNumbers();
    this.textarea.scrollTop = 0;

    // Persist all 3 solution buffers to localStorage
    ['html', 'css', 'js'].forEach(lang => {
      localStorage.setItem(`accenture_code_${question.id}_${lang}`, this.codeCache[question.id][lang] || '');
    });
  }
}

window.CodeEditorManager = CodeEditorManager;

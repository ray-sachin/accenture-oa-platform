/**
 * Automated Grader & Sandboxed Execution Engine
 * Evaluates code inside an isolated iframe context and runs DOM/CSS assertion tests
 */

class AssessmentRunner {
  constructor() {
    this.fontAwesomeCDN = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
  }

  /**
   * Bundles HTML, CSS, and JS into a complete HTML string.
   */
  bundleDocument(html, css, js) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="${this.fontAwesomeCDN}">
  <style>
    /* Default reset inside iframe */
    * { box-sizing: border-box; }
    body { margin: 0; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    ${css || ''}
  </style>
</head>
<body>
  ${html || ''}
  <script>
    window.onerror = function(msg, url, line) {
      console.warn("Iframe Runtime Error:", msg, "at line:", line);
    };
    ${js || ''}
  <\/script>
</body>
</html>`;
  }

  /**
   * Injects the bundled document into the sandboxed iframe and returns a promise
   * resolving when the iframe has fully loaded.
   */
  async injectIntoIframe(iframe, html, css, js) {
    return new Promise((resolve) => {
      const docString = this.bundleDocument(html, css, js);
      
      const onLoaded = () => {
        iframe.removeEventListener('load', onLoaded);
        // Small delay to allow any client-side layout & microtasks to settle
        setTimeout(resolve, 50);
      };

      iframe.addEventListener('load', onLoaded);
      iframe.srcdoc = docString;
    });
  }

  /**
   * Renders preview without running test assertions.
   */
  async renderPreview(iframe, html, css, js) {
    await this.injectIntoIframe(iframe, html, css, js);
  }

  /**
   * Executes the test assertions for a given question against the iframe's DOM.
   */
  async runTestSuite(iframe, question, html, css, js) {
    // 1. Inject fresh document
    await this.injectIntoIframe(iframe, html, css, js);

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    const win = iframe.contentWindow;

    const testResults = [];
    let passedCount = 0;

    const tests = question.tests || [];

    for (const test of tests) {
      const startTime = performance.now();
      let passed = false;
      let error = null;

      try {
        // Execute the assertion code in the iframe window context
        // Assertion has access to `doc` (iframe document) and `win` (iframe window)
        const assertionFn = (win && win.Function) ? win.Function('doc', 'win', test.assert) : new Function('doc', 'win', test.assert);
        assertionFn(doc, win);
        passed = true;
      } catch (err) {
        passed = false;
        error = err.message || String(err);
      }

      const durationMs = Math.round(performance.now() - startTime);

      if (passed) passedCount++;

      testResults.push({
        id: test.id,
        name: test.name,
        description: test.description,
        passed,
        error,
        durationMs
      });
    }

    const total = tests.length;
    const failedCount = total - passedCount;
    const scorePercent = total > 0 ? Math.round((passedCount / total) * 100) : 0;

    return {
      total,
      passed: passedCount,
      failed: failedCount,
      scorePercent,
      results: testResults
    };
  }
}

// Global singleton instance
window.assessmentRunner = new AssessmentRunner();

'use strict';
const https = require('node:https');

/**
 * Brevo Transactional Email Client for CampusReady
 * Uses Brevo v3 REST API (https://api.brevo.com/v3/smtp/email)
 */
function createMailer(env = {}) {
 const apiKey = env.BREVO_API_KEY || process.env.BREVO_API_KEY || '';
 const senderEmail = env.BREVO_SENDER_EMAIL || process.env.BREVO_SENDER_EMAIL || 'support@campusready.live';
 const senderName = 'CampusReady Support';

 async function sendTransactionalEmail({ to, subject, htmlContent, textContent }) {
  if (!apiKey) {
   // Fail open / log when API key is not yet configured
   return { skipped: true, reason: 'BREVO_API_KEY not configured' };
  }

  const payload = JSON.stringify({
   sender: { name: senderName, email: senderEmail },
   to: Array.isArray(to) ? to.map(e => (typeof e === 'string' ? { email: e } : e)) : [{ email: to }],
   subject,
   htmlContent: htmlContent || `<p>${textContent || ''}</p>`,
   textContent: textContent || ''
  });

  return new Promise((resolve, reject) => {
   const req = https.request('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
     'accept': 'application/json',
     'api-key': apiKey,
     'content-type': 'application/json',
     'content-length': Buffer.byteLength(payload)
    }
   }, res => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
     try {
      const data = JSON.parse(body);
      if (res.statusCode >= 200 && res.statusCode < 300) {
       resolve({ success: true, messageId: data.messageId });
      } else {
       resolve({ success: false, error: data.message || body, code: res.statusCode });
      }
     } catch {
      resolve({ success: false, error: body, code: res.statusCode });
     }
    });
   });

   req.on('error', err => resolve({ success: false, error: err.message }));
   req.write(payload);
   req.end();
  });
 }

 async function sendWelcomeEmail(user) {
  return sendTransactionalEmail({
   to: user.email,
   subject: 'Welcome to CampusReady · Your Placement Workspace',
   htmlContent: `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#0f172a">
      <div style="border-bottom:2px solid #0b1a30;padding-bottom:12px;margin-bottom:20px">
        <h2 style="color:#0b1a30;margin:0">&gt; CampusReady</h2>
        <p style="color:#64748b;font-size:13px;margin:4px 0 0">Pan-India Engineering Assessment Preparation</p>
      </div>
      <p>Hello <strong>${user.name || 'Engineer'}</strong>,</p>
      <p>Your workspace is active. You have access to our curated practice bank, authentic diagnostic rehearsals, and study tracks.</p>
      <div style="background:#f8fafc;border-left:4px solid #2563eb;padding:14px;margin:18px 0;border-radius:4px">
        <strong style="color:#1e3a6a">Next Steps:</strong>
        <ul style="margin:8px 0 0;padding-left:18px;color:#334155;font-size:13px">
          <li>Complete the free diagnostic mock on your dashboard</li>
          <li>Rehearse Hands-on Coding (DSA) and Frontend challenges in the split IDE</li>
          <li>Review real exam patterns and question formats</li>
        </ul>
      </div>
      <p style="font-size:12px;color:#64748b;margin-top:28px">CampusReady · Pan-India Engineering Preparation</p>
    </div>
   `
  });
 }

 async function sendPassConfirmationEmail(user) {
  return sendTransactionalEmail({
   to: user.email,
   subject: 'Complete Pass Activated · CampusReady',
   htmlContent: `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#0f172a">
      <div style="border-bottom:2px solid #0b1a30;padding-bottom:12px;margin-bottom:20px">
        <h2 style="color:#0b1a30;margin:0">&gt; CampusReady</h2>
        <p style="color:#64748b;font-size:13px;margin:4px 0 0">Complete Preparation Pass Confirmation</p>
      </div>
      <p>Hello <strong>${user.name || 'Candidate'}</strong>,</p>
      <p>Your Complete Preparation Pass has been confirmed and activated on your account.</p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:16px;border-radius:6px;margin:16px 0">
        <strong style="color:#15803d">Included Features:</strong>
        <ul style="margin:8px 0 0;padding-left:18px;color:#166534;font-size:13px">
          <li>100 Curated Problems (MCQ, DSA, SQL, Web Dev)</li>
          <li>All 10, 20 & 30-day Structured Study Roadmaps</li>
          <li>Full Timed Campus Mock Rehearsals (100 min / 43 tasks)</li>
          <li>Interactive IDE with Code Compilation and Test Cases</li>
        </ul>
      </div>
      <p style="font-size:12px;color:#64748b">Receipt: ₹499 INR · One-time access</p>
    </div>
   `
  });
 }

 return {
  sendTransactionalEmail,
  sendWelcomeEmail,
  sendPassConfirmationEmail
 };
}

module.exports = { createMailer };

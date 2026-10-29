function highlight(source,escape){
 const regex=/(\/\*[\s\S]*?\*\/|\/\/[^\n]*|#[^\n]*|--[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:def|class|function|const|let|var|return|if|else|elif|for|while|in|of|import|from|as|public|static|void|int|string|String|new|try|catch|throw|true|false|null|None|True|False|pass|using|namespace|SELECT|FROM|JOIN|LEFT|WHERE|ON|GROUP|BY|HAVING|ORDER|DESC|ASC|COUNT|SUM|IS|NULL|AND|OR|WITH)\b|\b\d+(?:\.\d+)?\b)/g;
 let output='',last=0;for(const match of source.matchAll(regex)){output+=escape(source.slice(last,match.index));const text=match[0],kind=/^(\/\/|\/\*|#|--)/.test(text)?'comment':/^['"`]/.test(text)?'string':/^\d/.test(text)?'number':'keyword';output+=`<span class="syntax-${kind}">${escape(text)}</span>`;last=match.index+text.length;}return output+escape(source.slice(last))+'\n';
}
function makeEditor(mount,value,onChange,e){
 mount.innerHTML='<div class="local-editor"><pre class="line-gutter" aria-hidden="true"></pre><div class="code-stack"><pre class="code-highlight" aria-hidden="true"></pre><textarea class="code-input" aria-label="Code editor. Tab indents. Escape allows Tab to leave the editor." spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off"></textarea></div></div>';
 const input=mount.querySelector('textarea'),pre=mount.querySelector('.code-highlight'),gutter=mount.querySelector('.line-gutter');input.value=value;let history=[value],position=0,releaseTab=false;
 const paint=()=>{pre.innerHTML=highlight(input.value,e);gutter.textContent=Array.from({length:input.value.split('\n').length},(_,i)=>i+1).join('\n');pre.scrollTop=input.scrollTop;pre.scrollLeft=input.scrollLeft;gutter.scrollTop=input.scrollTop;};
 const changed=()=>{history=history.slice(0,position+1);if(history.at(-1)!==input.value){history.push(input.value);if(history.length>150)history.shift();position=history.length-1;}paint();onChange(input.value);};
 input.addEventListener('input',changed);input.addEventListener('scroll',paint);
 input.addEventListener('keydown',event=>{
  if(input.readOnly)return;
  if(event.key==='Escape'){releaseTab=true;return;}
  if(event.key==='Tab'&&!releaseTab){event.preventDefault();const start=input.selectionStart,end=input.selectionEnd;if(event.shiftKey){const lineStart=input.value.lastIndexOf('\n',start-1)+1;const match=input.value.slice(lineStart).match(/^ {1,2}/);if(match){input.setRangeText('',lineStart,lineStart+match[0].length,'end');changed();}}else{input.setRangeText('  ',start,end,'end');changed();}return;}
  if(event.key!=='Tab')releaseTab=false;
  if(event.key==='Enter'){event.preventDefault();const start=input.selectionStart;const line=input.value.slice(0,start).split('\n').at(-1);const indent=line.match(/^\s*/)[0]+(/[{:]\s*$/.test(line)?'  ':'');input.setRangeText('\n'+indent,start,input.selectionEnd,'end');changed();return;}
  if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='z'){event.preventDefault();const next=position+(event.shiftKey?1:-1);if(next>=0&&next<history.length){position=next;input.value=history[position];paint();onChange(input.value);}return;}
  if((event.ctrlKey||event.metaKey)&&event.key==='/'){event.preventDefault();const start=input.selectionStart,lineStart=input.value.lastIndexOf('\n',start-1)+1;const prefix=mount.dataset.language==='python'?'# ':mount.dataset.language==='sql'?'-- ':'// ';if(input.value.slice(lineStart).startsWith(prefix))input.setRangeText('',lineStart,lineStart+prefix.length,'end');else input.setRangeText(prefix,lineStart,lineStart,'end');changed();}
 });paint();return {value:()=>input.value,focus:()=>input.focus(),destroy:()=>mount.replaceChildren(),search:text=>{const at=input.value.toLowerCase().indexOf(text.toLowerCase(),input.selectionEnd);const index=at>=0?at:input.value.toLowerCase().indexOf(text.toLowerCase());if(index>=0){input.focus();input.setSelectionRange(index,index+text.length);const line=input.value.slice(0,index).split('\n').length;input.scrollTop=Math.max(0,(line-4)*23);paint();return true;}return false;}};
}

export async function mountWorkspace({id,app,api,icon,e,toast,showModal,handleError,onExit}){
 let attempt=await api(`/api/attempts/${id}`),index=0,language='python',file='html',tab='description',editor,saveTimeout,saveQueue=Promise.resolve(),tick,disposed=false,submitting=false,runBusy=false,previewChannel,previewTimeout;
 let answers={...attempt.answers},codes={...attempt.code},flagged=new Set(),visited=new Set([attempt.questions[0]?.id]),resultCache={},customInput='',saved=true,revision=0,showPalette=false;
 const current=()=>attempt.questions[index];
 const sectionOf=q=>q.type!=='mcq'?'Coding':q.category==='behavioral'?'Behavioural':['reasoning','english'].includes(q.category)?'Cognitive':'Technical';
 const active=()=>attempt.status==='active'&&Date.now()<attempt.expires_at;
 const $=s=>app.querySelector(s);

 const candidateEmail = attempt.user?.email || 'sachin@accenture.prep';
 const candidateDate = new Date().toISOString().slice(0, 10).replace(/-/g, '/');

 function watermark(){
  const item = `${candidateEmail} · ${candidateDate}`;
  return `<div class="acc-watermark" aria-hidden="true">${Array(48).fill(`<span>${e(item)}</span>`).join('')}</div>`;
 }

 function proctorPip(){
  return `<div class="acc-proctor-pip-box" id="acc-proctor-box">
    <div class="acc-proctor-video-sim">
      <div class="acc-proctor-silhouette"></div>
      <div class="acc-proctor-scan-beam"></div>
    </div>
    <div class="acc-proctor-status-bar">
      <span class="acc-rec-dot"></span>
      <span class="acc-proctor-label">AI Proctor Active</span>
    </div>
  </div>`;
 }

 function isAnswered(q){
  if(q.type==='mcq') return answers[q.id]!==undefined;
  const c = codes[q.id];
  return !!(c && Object.values(c).some(v => v && typeof v === 'string' && v.trim().length > 0));
 }

 function getQuestionState(q){
  const ans = isAnswered(q);
  const rev = flagged.has(q.id);
  const vis = visited.has(q.id);
  if(rev && ans) return 'answered-flagged';
  if(rev) return 'flagged';
  if(ans) return 'answered';
  if(vis) return 'visited-unanswered';
  return 'not-visited';
 }

 const persist=()=>{
  clearTimeout(saveTimeout);
  if(!active())return saveQueue;
  const savingRevision=revision,q=current();
  const body=q.type==='mcq'?{answers:{...answers}}:{questionId:q.id,code:{...(codes[q.id]||{})}};
  saveQueue=saveQueue.catch(()=>{}).then(()=>api(`/api/attempts/${id}/save`,body)).then(()=>{
   if(savingRevision===revision){
    saved=true;
    if(!disposed&&$('.editor-save'))$('.editor-save').textContent='Saved to your account';
    if(!disposed&&$('#acc-cloud-sync'))$('#acc-cloud-sync').textContent='☁ Saved: 0 seconds ago';
   }
  }).catch(error=>{
   saved=false;
   if(!disposed&&$('.editor-save'))$('.editor-save').textContent='Not saved · retry';
   if(!disposed&&$('#acc-cloud-sync'))$('#acc-cloud-sync').textContent='⚠️ Not saved';
   throw error;
  });
  return saveQueue;
 };

 const changed=value=>{
  const q=current();
  codes[q.id]||={...q.starterCode};
  codes[q.id][q.type==='web'?file:q.type==='sql'?'sql':language]=value;
  revision++;
  saved=false;
  if($('.editor-save'))$('.editor-save').textContent='Saving…';
  if($('#acc-cloud-sync'))$('#acc-cloud-sync').textContent='☁ Saving…';
  clearTimeout(saveTimeout);
  saveTimeout=setTimeout(()=>persist().catch(handleError),1000);
 };

 function header(){
  const attemptedCount=attempt.questions.filter(isAnswered).length;
  return `<header class="acc-workspace-header">
    <div class="acc-brand-block">
      <span class="acc-chevron">&gt;</span>
      <span class="acc-brand-text">accenture</span>
      <span class="acc-divider">|</span>
      <span class="acc-test-title">${attempt.mode==='campus'?'Accenture On-Campus Assessment · 2027 Batch':attempt.mode==='practice'?'Accenture Practice Simulator':'Accenture Assessment Rehearsal'}</span>
      <span class="acc-cloud-sync" id="acc-cloud-sync">☁ Saved: Just now</span>
    </div>
    <div class="acc-header-actions">
      <div class="acc-attempted-pill">Attempted: <strong>${attemptedCount} / ${attempt.questions.length}</strong></div>
      <div class="acc-timer-box" id="acc-timer-box">
        <span class="acc-timer-icon">⏱</span>
        <span class="acc-timer-label">${attempt.mode==='campus'?'Section Time:':'Test Time:'}</span>
        <strong class="timer" id="workspace-timer">--:--:--</strong>
      </div>
      <button class="acc-icon-btn" data-ide="fullscreen" title="Toggle Fullscreen" aria-label="Toggle fullscreen">${icon('expand')}</button>
      <button class="acc-palette-toggle-btn" data-ide="toggle-palette" title="Question Palette">▦ Palette</button>
      <button class="acc-finish-btn" data-ide="finish">Finish Test</button>
    </div>
  </header>`;
 }

 function subToolbar(){
  const q=current();
  const sec=sectionOf(q);
  const sections=['Technical','Coding','Behavioural','Cognitive'];
  const attemptedCount=attempt.questions.filter(isAnswered).length;
  return `<div class="acc-subtoolbar">
    <div class="acc-sub-left">
      <select class="acc-section-select" id="workspace-section" aria-label="Choose assessment section">
        ${sections.map((name,n)=>{
         const first=attempt.questions.findIndex(qu=>sectionOf(qu)===name);
         const count=attempt.questions.filter(qu=>sectionOf(qu)===name).length;
         if(count===0) return '';
         return `<option value="${first}" ${sec===name?'selected':''}>${n+1}. ${name} (${count} tasks)</option>`;
        }).join('')}
      </select>
      <button class="acc-info-btn" data-ide="instructions" title="Instructions & Guidelines" aria-label="Instructions">ℹ</button>
    </div>
    <div class="acc-sub-center">
      <div class="acc-pager">
        <button class="acc-pager-btn" data-ide="previous" ${index===0?'disabled':''} aria-label="Previous question">&lt;</button>
        <div class="acc-pager-numbers">
          ${attempt.questions.map((qu,i)=>{
            const state = getQuestionState(qu);
            const isCur = i === index;
            return `<button class="acc-pager-num ${isCur?'current':''} state-${state}" data-ide="jump" data-index="${i}">${i+1}</button>`;
          }).join('')}
        </div>
        <button class="acc-pager-btn" data-ide="next" ${index===attempt.questions.length-1?'disabled':''} aria-label="Next question">&gt;</button>
        <button class="acc-grid-btn" data-ide="toggle-palette" title="Open question palette">▦</button>
      </div>
      <div class="acc-pager-count">Attempted: ${attemptedCount}/${attempt.questions.length}</div>
    </div>
    <div class="acc-sub-right">
      <button class="acc-revisit-btn ${flagged.has(q.id)?'flagged':''}" data-ide="flag">
        <span class="acc-revisit-icon">${flagged.has(q.id)?'★':'🔖'}</span>
        <span>${flagged.has(q.id)?'Marked for Review':'Revisit Later'}</span>
      </button>
      <select class="select acc-legacy-select" id="workspace-question" style="display:none" aria-label="Question selector">
        ${attempt.questions.map((qu,i)=>`<option value="${i}" ${i===index?'selected':''}>${i+1}. ${e(qu.title)}</option>`).join('')}
      </select>
    </div>
  </div>`;
 }

 function paletteModalHtml(){
  if(!showPalette) return '';
  const counts = {
    'answered': 0,
    'visited-unanswered': 0,
    'flagged': 0,
    'answered-flagged': 0,
    'not-visited': 0
  };
  attempt.questions.forEach(qu => {
    counts[getQuestionState(qu)]++;
  });

  return `<div class="acc-palette-overlay" id="acc-palette-overlay">
    <div class="acc-palette-card">
      <div class="acc-palette-head">
        <h3>Question Palette</h3>
        <button class="acc-icon-btn" data-ide="toggle-palette" aria-label="Close palette">✕</button>
      </div>
      <div class="acc-palette-legend">
        <div class="acc-leg-item"><span class="acc-dot state-answered"></span><strong>${counts['answered']}</strong> Answered</div>
        <div class="acc-leg-item"><span class="acc-dot state-visited-unanswered"></span><strong>${counts['visited-unanswered']}</strong> Not Answered</div>
        <div class="acc-leg-item"><span class="acc-dot state-flagged"></span><strong>${counts['flagged']}</strong> Marked for Review</div>
        <div class="acc-leg-item"><span class="acc-dot state-answered-flagged"></span><strong>${counts['answered-flagged']}</strong> Answered & Marked</div>
        <div class="acc-leg-item"><span class="acc-dot state-not-visited"></span><strong>${counts['not-visited']}</strong> Not Visited</div>
      </div>
      <div class="acc-palette-matrix">
        ${attempt.questions.map((qu,i)=>`
          <button class="acc-matrix-cell state-${getQuestionState(qu)} ${i===index?'current':''}" data-ide="jump" data-index="${i}">
            ${i+1}
          </button>
        `).join('')}
      </div>
      <div class="acc-palette-foot">
        <button class="btn btn-primary" data-ide="toggle-palette">Back to Question</button>
      </div>
    </div>
  </div>`;
 }

 function mcqView(q){
  const state = getQuestionState(q);
  return `<div class="acc-mcq-workspace">
    <div class="acc-mcq-left-pane">
      <div class="acc-q-head">
        <div class="acc-q-title-wrap">
          <h2 class="acc-q-number">Question ${index+1}</h2>
          <span class="acc-q-subtitle">Multiple Choice ( Select 1 out of 4 options, for the question below. )</span>
        </div>
        <button class="acc-revisit-btn ${flagged.has(q.id)?'flagged':''}" data-ide="flag">
          <span class="acc-revisit-icon">${flagged.has(q.id)?'★':'🔖'}</span>
          <span>${flagged.has(q.id)?'Marked for Review':'Revisit Later'}</span>
        </button>
      </div>
      <div class="acc-q-content">
        <p class="acc-q-scenario">${e(q.scenario)}</p>
        ${q.code ? `<pre class="acc-code-snippet"><code>${e(q.code)}</code></pre>` : ''}
      </div>
    </div>
    <div class="acc-mcq-right-pane">
      <div class="acc-opt-head">
        <span class="acc-opt-label">Select an option</span>
        <button class="acc-clear-action-btn" data-ide="clear-answer">🧹 Clear Response</button>
      </div>
      <div class="acc-mcq-options-list">
        ${q.options.map((option,i)=>`
          <label class="acc-option-card ${answers[q.id]===i?'selected':''}">
            <input type="radio" name="answer" value="${i}" ${answers[q.id]===i?'checked':''} ${!active()?'disabled':''}>
            <span class="acc-option-radio"></span>
            <span class="acc-option-letter">${String.fromCharCode(65+i)}.</span>
            <span class="acc-option-text">${e(option)}</span>
          </label>
        `).join('')}
      </div>
      <div class="acc-mcq-foot-actions">
        <button class="btn" data-ide="previous" ${index===0?'disabled':''}>Previous</button>
        <button class="acc-revisit-text-btn" data-ide="flag">${flagged.has(q.id)?'Remove Mark':'Mark for Review'}</button>
        <button class="btn btn-primary" data-ide="next">${index===attempt.questions.length-1?'Review & Finish':'Save & Next →'}</button>
      </div>
      ${attempt.status==='submitted'?`<div class="acc-review-box"><h4>Review Note</h4><p>${e(attempt.review?.find(r=>r.id===q.id)?.explanation||'Answer recorded.')}</p></div>`:''}
    </div>
  </div>`;
 }

 function codingView(q){
  const isWeb=q.type==='web',isSql=q.type==='sql';
  return `<div class="acc-coding-workspace">
    <section class="acc-problem-panel">
      <div class="acc-problem-header">
        <div class="acc-problem-tabs">
          ${[['description','Problem Statement'],['hints','How to Attempt?'],['solution','Reference Solution']].map(([tid,label])=>`
            <button class="acc-tab-btn ${tab===tid?'active':''}" data-ide="problem-tab" data-tab="${tid}">${label}</button>
          `).join('')}
        </div>
      </div>
      <div class="acc-problem-body" id="problem-body">
        ${problem(q)}
      </div>
    </section>

    <section class="acc-editor-panel">
      <div class="acc-editor-toolbar">
        ${isWeb?`
          <div class="acc-file-tabs">
            ${['html','css','js'].map(f=>`
              <button class="acc-file-tab ${file===f?'active':''}" data-ide="file" data-file="${f}">
                ${f==='html'?'&lt;/&gt; HTML':f==='css'?'# CSS':'{} JavaScript'}
              </button>
            `).join('')}
          </div>
        `:`
          <div class="acc-lang-bar">
            <label class="acc-lang-label">Compiler:</label>
            <select id="editor-language" class="acc-lang-select" aria-label="Programming language">
              ${(isSql?[['sql','MySQL 5.7']]:[['python','Python - 3.10'],['javascript','JavaScript (Node)'],['java','Java - 17'],['cpp','C++ 17'],['csharp','C# 10']]).map(([key,lbl])=>`
                <option value="${key}" ${language===key?'selected':''}>${lbl}</option>
              `).join('')}
            </select>
          </div>
        `}
        <span class="editor-save acc-save-note">${saved?'Saved to your account':'Saving…'}</span>
        <div class="acc-editor-tools">
          <button class="acc-icon-btn" data-ide="find" title="Find in code">${icon('search')}</button>
          <button class="acc-icon-btn" data-ide="reset" title="Reset starter code">${icon('refresh')}</button>
        </div>
      </div>

      <div id="editor-find" class="editor-find" hidden>
        <input type="search" aria-label="Find code" placeholder="Find in code…">
        <button class="btn btn-sm" data-ide="find-next">Next</button>
        <button class="acc-icon-btn" data-ide="find-close" aria-label="Close search">${icon('close')}</button>
      </div>

      <div class="editor-mount" id="editor-mount" data-language="${isWeb?file:isSql?'sql':language}"></div>

      <div class="acc-editor-actionbar">
        <div class="acc-input-check">
          ${!isWeb&&!isSql?`<label><input type="checkbox" id="acc-custom-check"> Use Custom Input</label>`:`<span class="acc-env-note">${isWeb?'Frontend Sandbox · Live Browser Engine':isSql?'SQLite DB Engine · Read-only Sandbox':''}</span>`}
        </div>
        <div class="acc-action-buttons">
          <button class="btn acc-compile-btn" data-ide="run" ${!active()?'disabled':''}>${isWeb?'Preview Output':'Compile and Test'}</button>
          <button class="btn btn-primary acc-submit-btn" data-ide="submit-code" ${!active()?'disabled':''}>${isWeb?'Submit Code':'Submit Code'}</button>
        </div>
      </div>

      <section class="acc-editor-output">
        <div class="acc-output-tabs">
          <button class="active" data-ide="output" data-tab="results">${isWeb?'Result View':'Test Cases & Output'}</button>
          ${!isWeb&&!isSql?'<button data-ide="output" data-tab="input">Custom Input</button>':''}
          <span class="acc-output-badge">${isWeb?'Live Component Sandboxed View':'Automated Test Runner'}</span>
        </div>
        <div class="output-area acc-output-body" id="output-area">
          ${resultCache[q.id]||`<div class="output-empty">${icon('terminal')}<span>${isWeb?'Click "Preview Output" to render the interactive component.':'Compile and test to view test case pass/fail evaluations.'}</span></div>`}
        </div>
      </section>
    </section>
  </div>`;
 }

 function problem(q){
  if(tab==='hints'){
   return `<div class="acc-problem-spec">
     <h3 class="acc-spec-blue">How to Attempt?</h3>
     <p class="acc-lead">Follow the structured requirements carefully before submitting your code.</p>
     <div class="acc-spec-card">
       <h4>Instructions</h4>
       <ol>
         <li>Verify the element selectors and classes specified in the requirements.</li>
         <li>Preserve all initial HTML structures and avoid deleting required wrapper divs.</li>
         <li>Test boundary inputs and multiple interaction events.</li>
         <li>Click "Compile and Test" or "Preview" to inspect your output before submitting.</li>
       </ol>
     </div>
   </div>`;
  }
  if(tab==='solution'){
   return `<div class="acc-problem-spec">
     <h3 class="acc-spec-blue">Reference Implementation</h3>
     <p>${attempt.mode==='practice'?'Solutions unlock 20 minutes after this practice session starts.':'Solutions are disabled during timed mock examinations.'}</p>
     <button class="btn btn-primary" data-ide="solution">${icon('lock')} View Solution</button>
     <div id="solution-content"></div>
   </div>`;
  }

  // Authentic Accenture Problem Presentation
  const isWeb = q.type === 'web';
  const isSql = q.type === 'sql';

  return `<div class="acc-problem-spec">
    <div class="acc-prob-meta">
      <span class="acc-prob-domain">${e(q.category.toUpperCase())}</span>
      <span class="acc-prob-diff ${q.difficulty==='Easy'?'green':'amber'}">${e(q.difficulty)}</span>
    </div>

    <h2 class="acc-prob-title">${e(q.title)}</h2>

    <h3 class="acc-spec-blue">How to Attempt?</h3>
    <p class="acc-scenario-text">${e(q.scenario)}</p>

    ${isWeb ? `
      <div class="acc-spec-section">
        <h4 class="acc-spec-heading">Objectives:</h4>
        <ul class="acc-spec-list">
          ${(q.tasks || [
            'Implement the dynamic interaction logic described in the scenario.',
            'Ensure the specified CSS styling and element states are applied correctly.',
            'Handle event triggers and update the DOM elements accordingly.'
          ]).map(t => `<li>${e(t)}</li>`).join('')}
        </ul>
      </div>

      <div class="acc-spec-section">
        <h4 class="acc-spec-heading">Constraints:</h4>
        <ul class="acc-spec-list">
          <li>Do not modify any id or class attributes of provided elements, as these are targeted by verification scripts.</li>
          <li>Ensure that the provided CSS styling is applied correctly.</li>
          <li>Ensure the component functions properly on repeated user interactions.</li>
        </ul>
      </div>
    ` : isSql ? `
      <div class="acc-spec-section">
        <h4 class="acc-spec-heading">Query Specification:</h4>
        <p>Write an SQL query to satisfy the criteria described above.</p>
        <div class="acc-schema-card">
          <strong>Database Schema:</strong>
          <pre class="code-block">${e(q.fixtures?.[0]?.sql || 'Review fixture tables in the Query tab.')}</pre>
        </div>
      </div>
    ` : `
      <div class="acc-spec-section">
        <h4 class="acc-spec-heading">Input Specification:</h4>
        <div class="acc-spec-box">
          ${e(q.inputSpec || 'Line 1 contains the input format specified in the problem statement.')}
        </div>
      </div>

      <div class="acc-spec-section">
        <h4 class="acc-spec-heading">Output Specification:</h4>
        <div class="acc-spec-box">
          ${e(q.outputSpec || 'Return the corresponding result matching the expected standard output.')}
        </div>
      </div>

      ${q.samples?.length ? `
        <div class="acc-spec-section">
          <h4 class="acc-spec-heading">Example 1:</h4>
          <div class="acc-spec-box">
            <div class="acc-sample-row"><strong>Input:</strong><pre>${e(q.samples[0].input)}</pre></div>
            <div class="acc-sample-row"><strong>Output:</strong><pre>${e(q.samples[0].expected)}</pre></div>
          </div>
        </div>
      ` : ''}

      ${q.explanation ? `
        <div class="acc-spec-section">
          <h4 class="acc-spec-heading">Explanation:</h4>
          <p class="acc-explanation-text">${e(q.explanation)}</p>
        </div>
      ` : ''}
    `}
  </div>`;
 }

 function mountCode(){
  const q=current();
  codes[q.id]||={...q.starterCode};
  if(q.type==='sql')language='sql';
  else if(q.type==='code'&&language==='sql')language='python';
  const mount=$('#editor-mount');
  if(!mount)return;
  const key=q.type==='web'?file:q.type==='sql'?'sql':language;
  const initial=codes[q.id]?.[key]??q.starterCode?.[key]??'';
  editor=makeEditor(mount,initial,changed,e);
 }

 function updateTimer(){
  if(disposed)return;
  const left=Math.max(0,Math.ceil((attempt.expires_at-Date.now())/1000));
  const timer=$('#workspace-timer');
  const pill=$('#acc-timer-box');
  if(timer){
   const h = String(Math.floor(left/3600)).padStart(2,'0');
   const m = String(Math.floor((left%3600)/60)).padStart(2,'0');
   const s = String(left%60).padStart(2,'0');
   timer.textContent = `${h}:${m}:${s}`;
  }
  if(pill){
   pill.classList.toggle('urgent',left<300);
   pill.classList.toggle('warning',left>=300&&left<900);
  }
  if(left<=0&&active())finish(true);
 }

 function resultsMarkup(data){
  const rows=(data.results||[]).map((r,idx)=>{
   return `<div class="acc-result-row ${r.passed?'pass':'fail'}">
     <div class="acc-result-status">
       <span class="acc-badge ${r.passed?'green':'red'}">${r.passed?'✓ PASSED':'✕ FAILED'}</span>
       <strong>Test Case #${idx+1}: ${e(r.name||'Evaluation')}</strong>
     </div>
     ${r.error ? `<pre class="acc-result-error">${e(r.error)}</pre>` : ''}
     ${r.output!==undefined ? `<div class="acc-result-diff"><span>Actual Output:</span><pre>${e(String(r.output))}</pre></div>` : ''}
   </div>`;
  }).join('');

  return `<div class="acc-results-container">
    <div class="acc-results-summary">
      <span class="acc-score-pill ${data.passed===data.total?'all-pass':'has-fails'}">
        Score: ${data.passed} / ${data.total} Test Cases Passed
      </span>
      <span class="acc-eval-notice">${data.verified?'Verified Server Evaluation':'Advisory Sandbox Output'}</span>
    </div>
    <div class="acc-results-list">
      ${rows}
    </div>
  </div>`;
 }

 async function run(submit){
  if(runBusy)return;
  runBusy=true;
  const q=current();
  const btns=app.querySelectorAll('[data-ide="run"],[data-ide="submit-code"]');
  btns.forEach(b=>b.disabled=true);
  try{
   await persist();
   if(q.type==='web'){
    const bundle=codes[q.id]||q.starterCode;
    previewChannel=crypto.randomUUID();
    const frameId=`preview-${previewChannel}`;
    $('#output-area').innerHTML=`<div class="acc-preview-mount"><iframe id="${frameId}" sandbox="allow-scripts" src="/api/attempts/${id}/preview?questionId=${encodeURIComponent(q.id)}&channel=${previewChannel}" title="Component Preview"></iframe></div><div id="preview-results" class="acc-preview-feedback"><div class="loading-line">Running verification checks…</div></div>`;
    clearTimeout(previewTimeout);
    previewTimeout=setTimeout(()=>{
     if($('#preview-results'))$('#preview-results').innerHTML='<p class="form-note">Preview loaded. Interact with the component above.</p>';
    },4000);
    return;
   }
   const res=await api(`/api/attempts/${id}/run`,{
    questionId:q.id,
    language:q.type==='sql'?'sql':language,
    code:codes[q.id]?.[q.type==='sql'?'sql':language]||'',
    input:customInput,
    submit:!!submit
   });
   resultCache[q.id]=resultsMarkup(res);
   $('#output-area').innerHTML=resultCache[q.id];
  }catch(err){
   $('#output-area').innerHTML=`<div class="notice amber"><strong>Execution Error:</strong> ${e(err.message)}</div>`;
  }finally{
   runBusy=false;
   btns.forEach(b=>b.disabled=false);
  }
 }

 async function finish(expired=false){
  if(submitting)return;
  if(attempt.status!=='active'){
   await onExit();
   return;
  }
  const answeredCount=attempt.questions.filter(isAnswered).length;
  const unansCount=attempt.questions.length-answeredCount;
  const flaggedCount=flagged.size;

  if(!expired){
   showModal(`<div class="acc-end-confirm-modal">
     <div class="acc-end-icon">⚠️</div>
     <h2 class="modal-heading">End Assessment Test?</h2>
     <p class="modal-subtitle">Are you sure you want to finish and submit your assessment?</p>
     <table class="acc-end-summary-table">
       <thead>
         <tr><th>Total Questions</th><th>Answered</th><th>Unanswered</th><th>Marked for Review</th></tr>
       </thead>
       <tbody>
         <tr>
           <td>${attempt.questions.length}</td>
           <td class="green-text"><strong>${answeredCount}</strong></td>
           <td class="red-text"><strong>${unansCount}</strong></td>
           <td class="purple-text"><strong>${flaggedCount}</strong></td>
         </tr>
       </tbody>
     </table>
     <p class="acc-end-warning">You will not be able to revisit or modify your answers once submitted.</p>
     <div class="button-row" style="justify-content:flex-end;margin-top:20px">
       <button class="btn" data-action="close-modal">Resume Test</button>
       <button class="btn acc-confirm-end-btn" id="confirm-finish">Yes, Submit Assessment</button>
     </div>
   </div>`);
   document.querySelector('#confirm-finish').onclick=()=>{
    document.querySelector('#modal').close();
    finishConfirmed();
   };
   return;
  }
  await finishConfirmed();
 }

 async function finishConfirmed(){
  submitting=true;
  try{
   if(active())await persist();else await saveQueue.catch(()=>{});
   attempt=await api(`/api/attempts/${id}/submit`,{});
   answers=attempt.answers;
   render();
   showModal(`<div class="acc-submission-complete">
     <div class="acc-complete-badge">✓</div>
     <h2 class="modal-heading">Assessment Submitted Successfully</h2>
     <p class="modal-subtitle">Your responses have been recorded on the secure server.</p>
     ${attempt.total?`<div class="result-score">${attempt.score} <span class="muted" style="font-size:20px">/ ${attempt.total}</span></div>`:''}
     <div class="button-row" style="justify-content:center;margin-top:24px">
       <button class="btn btn-primary" id="result-exit">Return to Dashboard</button>
     </div>
   </div>`);
   document.querySelector('#result-exit').onclick=async()=>{
    document.querySelector('#modal').close();
    await onExit();
   };
  }finally{
   submitting=false;
  }
 }

 async function switchQuestion(next){
  await persist();
  index=Math.max(0,Math.min(attempt.questions.length-1,next));
  visited.add(attempt.questions[index]?.id);
  tab='description';
  render();
 }

 function render(){
  editor?.destroy();
  const q=current();
  app.innerHTML=`<main class="acc-workspace-root" id="main">
    ${watermark()}
    ${proctorPip()}
    ${paletteModalHtml()}
    ${header()}
    ${subToolbar()}
    ${q.type==='mcq'?mcqView(q):codingView(q)}
  </main>`;
  if(q.type!=='mcq') mountCode();
  updateTimer();
 }

 async function click(event){
  const btn=event.target.closest('[data-ide]');
  if(!btn)return;
  const action=btn.dataset.ide;
  try{
   if(action==='finish')await finish();
   if(action==='exit'){await persist();await onExit();}
   if(action==='fullscreen'){
    if(document.fullscreenElement)await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
   }
   if(action==='toggle-palette'){
    showPalette=!showPalette;
    render();
   }
   if(action==='instructions'){
    showModal(`<div class="acc-instructions-modal">
      <h2 class="modal-heading">Accenture Assessment Guidelines</h2>
      <p class="modal-subtitle">Review official environment constraints and test integrity rules.</p>
      <ul class="acc-instruction-list">
        <li><strong>Continuous Proctoring:</strong> The camera and tab presence monitor evaluate active integrity. Do not switch windows or tabs.</li>
        <li><strong>Saving Progress:</strong> Responses are synced with the server on every interaction. The timer runs continuously.</li>
        <li><strong>Section Flexibility:</strong> Use the Question Palette or section navigator to navigate between questions.</li>
        <li><strong>Coding Submissions:</strong> Ensure you compile and run test cases before final submission.</li>
      </ul>
      <div class="button-row" style="justify-content:flex-end">
        <button class="btn btn-primary" data-action="close-modal">Back to Test</button>
      </div>
    </div>`);
   }
   if(action==='problem-tab'){
    tab=btn.dataset.tab;
    $('.acc-problem-tabs').querySelectorAll('button').forEach(el=>el.classList.toggle('active',el.dataset.tab===tab));
    $('#problem-body').innerHTML=problem(current());
   }
   if(action==='file'){
    await persist();
    file=btn.dataset.file;
    render();
   }
   if(action==='run'||action==='submit-code') await run(action==='submit-code');
   if(action==='find'){
    $('#editor-find').hidden=false;
    $('#editor-find input').focus();
   }
   if(action==='find-close') $('#editor-find').hidden=true;
   if(action==='find-next'){
    if(!editor.search($('#editor-find input').value)) toast('No matching text in this file.');
   }
   if(action==='reset'){
    showModal(`<h2 class="modal-heading">Reset starter code?</h2><p class="modal-subtitle">This replaces your current file with the starter template.</p><div class="button-row"><button class="btn" data-action="close-modal">Keep my code</button><button class="btn btn-primary" id="confirm-reset">Reset file</button></div>`);
    document.querySelector('#confirm-reset').onclick=()=>{
     document.querySelector('#modal').close();
     const q=current(),key=q.type==='web'?file:q.type==='sql'?'sql':language;
     changed(q.starterCode?.[key]||'');
     render();
    };
   }
   if(action==='solution'){
    btn.disabled=true;
    try{
     const {solution}=await api(`/api/attempts/${id}/solution`,{questionId:current().id});
     $('#solution-content').innerHTML=`<div class="notice">${e(solution?.explanation||'Review implementation.')}</div>${Object.entries(solution||{}).filter(([k])=>k!=='explanation').map(([key,code])=>`<h3>${e(key.toUpperCase())}</h3><pre class="code-block">${e(code)}</pre>`).join('')}`;
    }catch(err){
     $('#solution-content').innerHTML=`<div class="notice amber">${e(err.message)}</div>`;
    }finally{
     btn.disabled=false;
    }
   }
   if(action==='flag'){
    const qid=current().id;
    flagged.has(qid)?flagged.delete(qid):flagged.add(qid);
    render();
   }
   if(action==='clear-answer'){
    const qid=current().id;
    delete answers[qid];
    revision++;
    saved=false;
    await persist();
    render();
   }
   if(action==='next'){
    if(index===attempt.questions.length-1)await finish();
    else await switchQuestion(index+1);
   }
   if(action==='previous')await switchQuestion(index-1);
   if(action==='jump'){
    showPalette=false;
    await switchQuestion(Number(btn.dataset.index));
   }
   if(action==='output'){
    app.querySelectorAll('.acc-output-tabs button').forEach(el=>el.classList.toggle('active',el===btn));
    $('#output-area').innerHTML=btn.dataset.tab==='input'?`<label class="field">Custom Standard Input<textarea class="custom-input" id="custom-input" maxlength="10000">${e(customInput)}</textarea></label><p class="form-note">Used for Run code only. Submit code always evaluates server hidden test cases.</p>`:resultCache[current().id]||'<div class="output-empty">Compile and run to see evaluation results.</div>';
   }
  }catch(err){
   handleError(err);
  }
 }

 async function change(event){
  try{
   if(event.target.id==='workspace-question'||event.target.id==='workspace-section'){
    await switchQuestion(Number(event.target.value));
   }
   if(event.target.id==='editor-language'){
    await persist();
    language=event.target.value;
    render();
   }
   if(event.target.name==='answer'){
    answers[current().id]=Number(event.target.value);
    revision++;
    saved=false;
    await persist();
    if(!disposed)render();
   }
  }catch(err){
   handleError(err);
  }
 }

 const input=event=>{
  if(event.target.id==='custom-input') customInput=event.target.value;
 };

 const message=event=>{
  const frame=$('#output-area iframe');
  if(!frame||event.source!==frame.contentWindow||event.origin!=='null'||event.data?.type!=='campus-preview'||event.data?.channel!==previewChannel||!Array.isArray(event.data.results))return;
  clearTimeout(previewTimeout);
  const results=event.data.results.slice(0,30).map(r=>({name:String(r.name).slice(0,200),passed:r.passed===true,error:r.error?String(r.error).slice(0,1000):undefined}));
  if(results.length&&$('#preview-results'))$('#preview-results').innerHTML=resultsMarkup({results,passed:results.filter(r=>r.passed).length,total:results.length,verified:false})+'<p class="form-note">Browser checks verify dynamic behavior against the problem specification.</p>';
 };

 let lastFocusEvent=0;
 const focusNotice=()=>{
  if(document.hidden&&active()&&attempt.mode!=='practice'&&Date.now()-lastFocusEvent>5000){
   lastFocusEvent=Date.now();
   api(`/api/attempts/${id}/event`,{kind:'tab_hidden'}).catch(()=>{});
   toast('Proctor Alert: Tab switch detected. Proctoring logs tab focus changes.');
  }
 };

 const beforeUnload=event=>{
  if(!saved){
   event.preventDefault();
   event.returnValue='';
  }
 };

 app.addEventListener('click',click);
 app.addEventListener('change',change);
 app.addEventListener('input',input);
 window.addEventListener('message',message);
 window.addEventListener('beforeunload',beforeUnload);
 document.addEventListener('visibilitychange',focusNotice);

 render();
 tick=setInterval(updateTimer,1000);

 return ()=>{
  disposed=true;
  clearInterval(tick);
  clearTimeout(previewTimeout);
  clearTimeout(saveTimeout);
  if(!saved&&active())persist().catch(()=>{});
  editor?.destroy();
  app.removeEventListener('click',click);
  app.removeEventListener('change',change);
  app.removeEventListener('input',input);
  window.removeEventListener('message',message);
  window.removeEventListener('beforeunload',beforeUnload);
  document.removeEventListener('visibilitychange',focusNotice);
 };
}

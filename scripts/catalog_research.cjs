// Curated metadata for the supplied archive. This is an evidence index, not an answer key.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const dir = path.join(root, 'private/research');
const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
const families = {
  idc: ['MeritTrac verbal and analytical paper', 'Mixed practice', 'Undated archival paper', ['Articles and prepositions', 'Reading comprehension', 'Sets', 'Data sufficiency', 'Attention to detail'], 'A legacy MeritTrac paper combines verbal passages, analytical reasoning, symbol arithmetic, and hiring-condition puzzles. Use its topic coverage for additional practice; its format and answer keys do not establish the current internship assessment.'],
  december: ['December placement paper with answer keys', 'Mixed practice', 'Undated archival paper', ['Vocabulary', 'Articles', 'Reading comprehension', 'Sets', 'Symbol arithmetic'], 'This December-labelled paper contains English exercises, arithmetic reasoning, and detail-comparison questions with terse answer keys. Typographical errors and incomplete context require editorial review before any item becomes a scored question.'],
  bangalore: ['Bangalore off-campus candidate recollection', 'Campus recollection', '2007 cohort recollection', ['Verbal ability', 'Venn diagrams', 'Directions', 'Data sufficiency', 'Essay writing'], 'A 2007 graduate recalls a MeritTrac written test and essay at a Bangalore off-campus drive. The account is useful historical context, but omitted options and remembered cutoffs cannot be treated as modern policy.'],
  july: ['July 2008 MeritTrac placement paper', 'Mixed practice', '31 July 2008', ['Reading comprehension', 'Articles', 'Sets', 'Data sufficiency', 'Symbol comparison'], 'The document explicitly dates its paper to 31 July 2008 and includes verbal, analytical, and attention-to-detail sections. Retain it as an archival practice reference rather than a source for 2026 timings or eligibility.'],
  mumbai: ['Mumbai August placement paper', 'Mixed practice', 'Undated archival paper', ['Vocabulary', 'Reading comprehension', 'Sets', 'Operator substitution', 'Conditional reasoning'], 'An August-labelled Mumbai paper repeats much of the MeritTrac verbal and analytical question family. Its substantial overlap with other files means it should not count as independent confirmation of a recruitment pattern.'],
  offline: ['Offline aptitude and essay recollection', 'Campus recollection', 'Undated historical account', ['Prepositions', 'Reading comprehension', 'Percentages', 'Team selection', 'Attention to detail'], 'This account describes a paper-and-pen test with 55 questions and a separate essay. It contributes practice themes, while duplicated options and historical process claims need to remain clearly labelled.'],
  logical: ['Logical reasoning with explanations', 'Reasoning', 'Undated archival collection', ['Classification', 'Cause and effect', 'Ranking', 'Analogies', 'Data sufficiency'], 'A 25-item collection covers classification, ordering, analogies, and data sufficiency with worked explanations. Some explanations are incorrect or tied to historical officeholders, so the keys must be independently checked.'],
  chandigarh: ['Chandigarh September placement paper', 'Mixed practice', 'Undated archival paper', ['Articles', 'Technical reading passages', 'Attention to detail', 'Eligibility puzzles'], 'This September-labelled paper describes 55 questions in 60 minutes and includes verbal and analytical exercises. Re-numbered or missing sections and repeated MeritTrac passages make it a practice source rather than current process evidence.'],
  bhubaneswar: ['Bhubaneswar off-campus recollection', 'Campus recollection', 'Undated historical account', ['Prepositions', 'Synonyms', 'Symbol arithmetic', 'Sets', 'Time and distance'], 'A historical off-campus account describes written testing at ITER and later group-discussion and interview stages at KIIT. Several remembered questions omit necessary data, so use the themes without treating recalled cutoffs or questions as authoritative.'],
  aptitude25: ['Quantitative aptitude with worked explanations', 'Aptitude', 'Undated archival collection', ['Time and work', 'Interest', 'Averages', 'Mixtures', 'Ages', 'Number series'], 'A 25-question collection develops arithmetic and quantitative reasoning through worked solutions. It is useful for foundational drills and revision after each chosen item has been independently solved.'],
  mixed15: ['Arithmetic and computer basics paper', 'Aptitude', 'Historical collection; 2019 page snapshot exists', ['Arithmetic', 'Pipes and cisterns', 'Trains', 'Ratios', 'Computer basics'], 'This short collection combines arithmetic, work-rate, travel, and elementary computer questions. It contains duplicated options and an incorrect mango-count key, so unedited import would produce unreliable grading.'],
  aptitude15: ['Speed, work, ratios and interest drills', 'Aptitude', 'Undated archival collection', ['Unit conversion', 'Time and work', 'Ratios', 'Partnership', 'Simple interest', 'Area growth'], 'Fifteen short exercises cover speed conversions, work rates, ratios, interest, and geometry. Several stems or keys are inconsistent, including the car-speed and joint-work questions, and need correction before use.'],
  amcat: ['Legacy AMCAT practice compilation', 'Mixed practice', 'Undated historical AMCAT pattern', ['Factorials', 'Logarithms', 'Profit and loss', 'Percentages', 'Sentence correction', 'Seating arrangements'], 'This compilation claims an AMCAT pattern of 25 verbal, 25 quantitative, and 24 logical questions and supplies broad practice material. The pattern is historical and conflicts with the project notes, so present the content as supplementary practice only.'],
  technical2011: ['C language and programming interview prompts', 'Technical', '2011-labelled paper', ['Arrays and pointers', 'Structures', 'Command-line arguments', 'Bit fields', 'Recursion', 'Dynamic allocation'], 'A 2011-labelled prompt list covers C fundamentals and small programming exercises such as Fibonacci and string operations. Most entries have no worked answers and are best used as guided interview or fundamentals revision prompts.'],
  technical2004: ['August 2004 written and technical paper', 'Technical', '29 August 2004', ['Grammar', 'Sets', 'OOP', 'C macros', 'Memory allocation', 'File handling'], 'This explicitly dated 2004 paper mixes nontechnical questions with C, C++, and database material. Old compiler assumptions and malformed snippets require modern, language-specific replacements before scoring.'],
  indiabix: ['IndiaBIX quantitative model paper', 'Aptitude', 'Historical page snapshot with 2019 footer', ['Divisibility', 'Pipes', 'HCF and LCM', 'Trains', 'Time and work'], 'A model-paper page provides standard quantitative aptitude questions on divisibility, rates, and arithmetic. Its page footer dates the saved site content, not a verified Accenture assessment event.'],
  english15: ['English vocabulary and grammar drills', 'Verbal', 'Undated archival collection', ['Phrasal verbs', 'Vocabulary', 'Tenses', 'Voice', 'Error spotting'], 'Fifteen English drills cover vocabulary, sentence completion, grammar, and voice. Some prompts lack instructions, such as whether to select a synonym or antonym, and should be rewritten for unambiguous practice.'],
  technicalbank: ['Legacy C, C++, database and interview bank', 'Technical', 'Undated historical technology collection', ['Pointers', 'OOP', 'SQL', 'Database keys', 'Bitwise operations', 'Strings', 'Testing'], 'A mixed technical bank includes C and C++ snippets, database questions, programming prompts, and older platform interview topics. Incorrect keys, broken code, and obsolete tool references make it a topic inventory that needs curation rather than a ready-made exam.'],
};
const mapping = {
  '0b87686f7c76': ['idc', ''], '63dc176f02b3': ['december', ''], '6ee457e35257': ['bangalore', ''],
  'b2e6853e6a63': ['july', ''], '4d1c7eb5d3ff': ['mumbai', ''], '619cc30a88f2': ['offline', ''],
  '3b99800d4f15': ['logical', ''], 'a62b9c9fe05c': ['chandigarh', ''], '7ccd4f260ae5': ['july', 'Repackaged PDF'],
  'd129e3ca5749': ['december', 'Repackaged PDF'], '0d3b1c28bf38': ['offline', 'Repackaged PDF'],
  '7e996ac96435': ['bhubaneswar', 'Repackaged PDF'], '56f59fbc882f': ['bangalore', 'Repackaged PDF'],
  '48ab14a55063': ['aptitude25', 'Repackaged PDF'], '19d7e1405672': ['chandigarh', 'Repackaged PDF'],
  'ea2e2d4b7da7': ['mixed15', 'Repackaged PDF'], '22b3459d6f47': ['aptitude15', ''],
  '564bb18e5ade': ['idc', 'Repackaged PDF'], '7ed5debf6e46': ['amcat', 'Repackaged PDF'],
  'd5b8688931e6': ['amcat', 'PDF'], '351054c4960b': ['aptitude25', ''],
  '60d8661016c9': ['mixed15', '2019 page snapshot'], '5c5271f63d6f': ['technical2004', 'Repackaged PDF'],
  '8a4f7bfbf237': ['indiabix', ''], '4504126d354e': ['bhubaneswar', 'Word document'],
  'f6df7fcb202a': ['technical2011', 'Word document'], 'e45e7e90e4c1': ['amcat', 'Word document'],
  '146d98f6760f': ['english15', ''], '5052bbd7736e': ['technical2011', 'Repackaged PDF'],
  '6d6a79d03358': ['mumbai', 'Repackaged PDF'], 'afd7c9b1a35e': ['technicalbank', 'Repackaged PDF'],
  '5a5e9f034606': ['offline', 'Partial web-page capture'], '80a6ef1e1437': ['technicalbank', 'QuestionPaper compilation'],
};
const library = manifest.filter(e => e.textFile).map(e => {
  const id = e.sha256.slice(0, 12);
  const [family, variant] = mapping[id];
  const [baseTitle, category, era, topics, summary] = families[family];
  // Read every extracted document, both as an integrity check and to measure coverage.
  const text = fs.readFileSync(path.join(dir, e.textFile), 'utf8');
  if (!text.trim()) throw new Error(`Empty source: ${e.name}`);
  return { id, title: baseTitle + (variant ? ` · ${variant}` : ''), originalName: e.name, category, era,
    summary, topics, textFile: e.textFile, evidence: 'archival', family, pages: e.pages,
    characters: text.length, needsAnswerReview: true,
    duplicateNames: manifest.filter(d => d.duplicateOf === e.name).map(d => d.name) };
});
const docs = [
  ['README.md', 'Original simulator overview', 'Existing simulator', ['Frontend widgets', 'Editor', 'Preview', 'Solution unlock'], 'The original README describes the local simulator and its intended assessment-style interface. Its feature claims and question counts need to be read against the actual implementation and the updated project documentation.'],
  ['CAREER_MEMORY.md', 'Campus intelligence and career notes', 'Campus intelligence', ['ATE internship', 'Assessment pipeline', 'DSA', 'SQL', 'Frontend', 'Interview preparation'], 'These October 2026 project notes collect the target internship, stipend, campus reports, and recurring problem themes. Claims labelled verified in the source remain owner-supplied notes unless backed by a retrievable campus notice or first-hand evidence.'],
  ['PRD.md', 'Original product requirements', 'Product planning', ['Cognitive practice', 'Technical practice', 'Coding', 'Communication', 'Payments'], 'The original requirements describe the intended ATE preparation product and its module scope. The current user request supersedes the older price and fixed 30-day framing with a ₹499 unlock and 10-, 20-, and 30-day tracks.'],
  ['ARCHITECTURE.md', 'Original system architecture', 'Product planning', ['Data model', 'Assessment sessions', 'Execution sandbox', 'Payments', 'Authentication'], 'This design document sketches database tables, APIs, execution isolation, payment handling, and assessment telemetry. It records a proposed architecture rather than proof that each service or safeguard was implemented.'],
  ['UI_SPECIFICATION.md', 'Assessment interface design reference', 'Design reference', ['Question palette', 'Split editor', 'Timers', 'Communication', 'Dashboard'], 'The interface specification defines an assessment-style split workspace, navigation states, timers, and dashboard patterns. Vendor-specific branding and unsupported guarantees should be replaced with an independent preparation identity and accurate capabilities.'],
  ['ROADMAP_AND_PHASES.md', 'Original implementation roadmap', 'Product planning', ['Authentication', 'Payments', 'Assessment engine', 'IDE', 'Communication', 'Validation'], 'The original roadmap lists a 48-hour implementation proposal and incomplete phase checklists. It is historical planning context and should not be presented to students as a feature-completion or readiness report.'],
  ['SYLLABUS_AND_QUESTION_BANK.md', 'ATE syllabus and reported coding problems', 'Campus intelligence', ['Parity', 'Prime factorization', 'House robbery', 'Prime neighbours', 'Email writing', 'STAR interviews'], 'The syllabus notes contain concrete coding examples, communication prompts, and interview study themes. Their campus attribution and claimed assessment format are reported context; mathematical correctness and working solutions must be checked separately.'],
];
for (const [name, title, category, topics, summary] of docs) {
  const textFile = 'project-' + name.replace('.md', '').toLowerCase() + '.txt';
  const dest = path.join(dir, textFile);
  // Preserve the original research snapshot when the app owner later updates root documentation.
  if (!fs.existsSync(dest)) fs.copyFileSync(path.join(root, name), dest);
  library.push({id: 'project-' + name.replace('.md', '').toLowerCase(), title, originalName: name,
    category, era: 'Original project notes · October 2026', summary, topics, textFile,
    evidence: 'project-notes', pages: 0, duplicateNames: [], needsAnswerReview: true});
}
const campusNotices=path.join(dir,'campus-notices.json');
if(fs.existsSync(campusNotices))library.unshift(...JSON.parse(fs.readFileSync(campusNotices,'utf8')));
fs.writeFileSync(path.join(dir, 'library.json'), JSON.stringify(library, null, 2) + '\n');
console.log(JSON.stringify({records: library.length, archiveSources: library.filter(s => s.evidence === 'archival').length,
  projectDocuments: docs.length, contentFamilies: Object.keys(families).length}));

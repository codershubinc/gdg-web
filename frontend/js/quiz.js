/**
 * quiz.js — Quiz page logic
 * GDG Campus CSMU
 */

import { api } from './appwrite.js';
import { getCurrentUser, getAvatarURL } from './auth.js';
import { initNavbarUserState } from './dashboard.js';

// ── Quiz bank ────────────────────────────────────────────────────────────────

const QUIZZES = {
    javascript: {
        label: 'JavaScript',
        color: '#FBBC04',
        icon: '⚡',
        desc: 'ES6+, async, DOM, closures & more',
        questions: [
            { q: 'Which keyword declares a block-scoped variable?', options: ['var', 'let', 'function', 'static'], ans: 1 },
            { q: 'What does `typeof null` return?', options: ['"null"', '"undefined"', '"object"', '"boolean"'], ans: 2 },
            { q: 'Which method converts a JSON string to an object?', options: ['JSON.parse()', 'JSON.stringify()', 'Object.parse()', 'JSON.decode()'], ans: 0 },
            { q: 'What is the output of `0.1 + 0.2 === 0.3`?', options: ['true', 'false', 'undefined', 'NaN'], ans: 1 },
            { q: 'Which higher-order method creates a new array from a transformation?', options: ['filter', 'reduce', 'map', 'find'], ans: 2 },
            { q: 'What does the `===` operator check?', options: ['Value only', 'Reference only', 'Value and type', 'Type only'], ans: 2 },
            { q: 'Arrow functions have their own `this`?', options: ['Yes', 'No', 'Only in strict mode', 'Only when named'], ans: 1 },
            { q: 'Which Promise method runs all promises concurrently and resolves when all settle?', options: ['Promise.race()', 'Promise.any()', 'Promise.all()', 'Promise.allSettled()'], ans: 3 },
            { q: 'What does `Array.prototype.splice()` do?', options: ['Returns a shallow copy', 'Adds/removes elements in place', 'Sorts the array', 'Flattens nested arrays'], ans: 1 },
            { q: 'Which statement about closures is correct?', options: ['A closure forgets its outer scope', 'A closure captures its outer scope', 'Closures only work with var', 'Closures are not possible in async code'], ans: 1 },
        ],
    },
    python: {
        label: 'Python',
        color: '#4285F4',
        icon: '🐍',
        desc: 'Core syntax, data structures & OOP',
        questions: [
            { q: 'Which of these is an immutable data type?', options: ['list', 'dict', 'set', 'tuple'], ans: 3 },
            { q: 'What is the output of `bool("")`?', options: ['True', 'False', 'None', 'Error'], ans: 1 },
            { q: 'How do you start a virtual environment (venv)?', options: ['python start venv', 'source venv/activate or venv\\Scripts\\activate', 'pip activate venv', 'python -m activate'], ans: 1 },
            { q: 'Which keyword is used for a generator function?', options: ['return', 'async', 'yield', 'defer'], ans: 2 },
            { q: 'What does `__init__` do in a class?', options: ['Destroys the object', 'Initialises instance attributes', 'Imports the class', 'Defines a class method'], ans: 1 },
            { q: 'Which module is used for regular expressions in Python?', options: ['regex', 're', 'rx', 'pattern'], ans: 1 },
            { q: 'List comprehension `[x*2 for x in range(3)]` gives?', options: ['[0,2,4]', '[1,2,3]', '[2,4,6]', '[0,1,2]'], ans: 0 },
            { q: 'What is the GIL in CPython?', options: ['Global Import Lock', 'Global Interpreter Lock', 'Generic Interface Layer', 'Garbage Iterator Loop'], ans: 1 },
            { q: 'Which decorator makes a method a static method?', options: ['@classmethod', '@property', '@staticmethod', '@abstractmethod'], ans: 2 },
            { q: '`dict.get(key, default)` returns?', options: ['Raises KeyError if missing', 'default if key missing', 'None always', 'False if missing'], ans: 1 },
        ],
    },
    webdev: {
        label: 'Web Dev',
        color: '#34A853',
        icon: '🌐',
        desc: 'HTML, CSS, REST APIs & browsers',
        questions: [
            { q: 'Which HTTP method is idempotent and used to fetch resources?', options: ['POST', 'PUT', 'GET', 'PATCH'], ans: 2 },
            { q: 'What does CSS `position: sticky` do?', options: ['Stays fixed always', 'Scrolls with page until threshold then sticks', 'Removes from flow', 'Snaps to grid'], ans: 1 },
            { q: 'Which HTML tag defines semantic navigation?', options: ['<div>', '<section>', '<nav>', '<header>'], ans: 2 },
            { q: 'What is the default display value of a `<span>`?', options: ['block', 'flex', 'inline', 'grid'], ans: 2 },
            { q: 'CORS stands for?', options: ['Cross-Origin Resource Sharing', 'Client-Origin Request Standard', 'Cross-Origin Request Service', 'Content-Origin Response Spec'], ans: 0 },
            { q: 'Which CSS property controls stacking order?', options: ['order', 'z-index', 'stack', 'layer'], ans: 1 },
            { q: 'REST is based on which architectural style?', options: ['SOAP', 'Stateless client-server', 'Remote Procedure Call', 'Stateful sessions'], ans: 1 },
            { q: 'What does `localStorage.setItem()` persist across?', options: ['Only current tab', 'Only current session', 'Browser restarts', 'Only HTTPS pages'], ans: 2 },
            { q: 'Which HTTP status means "Not Found"?', options: ['401', '403', '404', '500'], ans: 2 },
            { q: 'Which CSS unit is relative to the root font size?', options: ['em', 'rem', 'vh', 'px'], ans: 1 },
        ],
    },
    cloud: {
        label: 'Cloud & GCP',
        color: '#EA4335',
        icon: '☁️',
        desc: 'GCP, Firebase, DevOps basics',
        questions: [
            { q: 'What does GCP stand for?', options: ['Global Cloud Platform', 'Google Cloud Platform', 'General Compute Provider', 'Google Core Products'], ans: 1 },
            { q: 'Firebase Firestore is what type of database?', options: ['Relational SQL', 'Document NoSQL', 'Key-value only', 'Graph database'], ans: 1 },
            { q: 'Which GCP service runs containerised apps without managing servers?', options: ['GKE', 'Cloud Run', 'App Engine Flex', 'Compute Engine'], ans: 1 },
            { q: 'What is a CDN primarily used for?', options: ['Database replication', 'Serving static assets closer to users', 'Authentication tokens', 'Log aggregation'], ans: 1 },
            { q: 'What does IAM stand for in cloud?', options: ['Internet Access Management', 'Identity and Access Management', 'Infrastructure App Manager', 'Internal Auth Module'], ans: 1 },
            { q: 'Cloud Functions are an example of?', options: ['IaaS', 'PaaS', 'FaaS', 'SaaS'], ans: 2 },
            { q: 'Firebase Authentication supports?', options: ['Only Google sign-in', 'Only email/password', 'Multiple providers including Google, email, phone', 'Only OAuth2'], ans: 2 },
            { q: 'Which GCP service is for storing unstructured binary objects?', options: ['BigQuery', 'Cloud SQL', 'Cloud Storage', 'Spanner'], ans: 2 },
            { q: 'What does "horizontal scaling" mean?', options: ['Adding RAM to existing server', 'Adding more server instances', 'Increasing CPU speed', 'Expanding disk storage'], ans: 1 },
            { q: 'Kubernetes manages?', options: ['DNS records', 'Container orchestration', 'SSL certificates', 'Code repositories'], ans: 1 },
        ],
    },
    android: {
        label: 'Android',
        color: '#34A853',
        icon: '📱',
        desc: 'Kotlin, Jetpack & Android APIs',
        questions: [
            { q: 'Default language for modern Android development?', options: ['Java', 'Kotlin', 'Swift', 'Dart'], ans: 1 },
            { q: 'Which Jetpack component manages UI-related data lifecycle-aware?', options: ['LiveData', 'ViewModel', 'Room', 'WorkManager'], ans: 1 },
            { q: 'What is an Activity in Android?', options: ['A background task', 'A single screen with UI', 'A service runner', 'A data class'], ans: 1 },
            { q: 'Which file defines app permissions?', options: ['build.gradle', 'strings.xml', 'AndroidManifest.xml', 'proguard-rules.pro'], ans: 2 },
            { q: 'Jetpack Compose is?', options: ['A REST client', 'A declarative UI toolkit', 'An animation library', 'A dependency injection library'], ans: 1 },
            { q: 'Room is an abstraction over?', options: ['SharedPreferences', 'SQLite', 'Firebase', 'ContentProvider'], ans: 1 },
            { q: 'Which coroutine scope is tied to a ViewModel lifecycle?', options: ['GlobalScope', 'lifecycleScope', 'viewModelScope', 'MainScope'], ans: 2 },
            { q: 'What does `Intent` do in Android?', options: ['Stores preferences', 'Messaging object for component communication', 'Handles HTTP requests', 'Manages databases'], ans: 1 },
            { q: 'Hilt is used for?', options: ['HTTP networking', 'Dependency injection', 'Image loading', 'Push notifications'], ans: 1 },
            { q: 'Which lifecycle method is called when Activity becomes visible?', options: ['onCreate()', 'onStart()', 'onResume()', 'onPause()'], ans: 1 },
        ],
    },
};

// ── State ────────────────────────────────────────────────────────────────────

let currentQuiz = null;
let currentQ = 0;
let selected = null;
let score = 0;
let startTime = 0;
let timerInterval = null;
let timeLeft = 0;
let answered = false;
let user = null;
let userScores = {};  // { quizId: { score, total, attempts } }

const QUESTION_TIME = 20; // seconds per question

// ── Boot ─────────────────────────────────────────────────────────────────────

export async function initQuiz() {
    user = await getCurrentUser();
    if (!user) { window.location.href = 'login.html'; return; }

    await loadUserScores();
    renderLobby();
}

async function loadUserScores() {
    try {
        const { scores } = await api.get('/quiz/scores');
        scores.forEach(s => { userScores[s._id] = s; });
    } catch { /* ignore — scores just won't show */ }
}

// ── Views ─────────────────────────────────────────────────────────────────────

function revealAll() {
    requestAnimationFrame(() => {
        document.querySelectorAll('#quiz-app .reveal, #quiz-app .reveal-left, #quiz-app .reveal-right')
            .forEach(el => el.classList.add('visible'));
    });
}

function renderLobby() {
    const app = document.getElementById('quiz-app');
    app.innerHTML = `
    <div class="quiz-lobby">
      <div class="quiz-lobby-header">
        <h1 class="quiz-lobby-title">Dev Quizzes</h1>
        <p class="quiz-lobby-sub">Test your knowledge · Earn XP · Climb the board</p>
      </div>
      <div class="quiz-grid">
        ${Object.entries(QUIZZES).map(([id, q]) => quizCard(id, q)).join('')}
      </div>
    </div>
  `;

    revealAll();
    app.querySelectorAll('.qcard-start').forEach(btn => {
        btn.addEventListener('click', () => startQuiz(btn.dataset.id));
    });
}

function quizCard(id, q) {
    const s = userScores[id];
    const pct = s ? Math.round((s.score / s.total) * 100) : null;
    const badge = s
        ? `<span class="qcard-badge" style="--qc:${q.color}">${pct}% · ${s.attempts} attempt${s.attempts === 1 ? '' : 's'}</span>`
        : `<span class="qcard-badge qcard-badge--new" style="--qc:${q.color}">New</span>`;

    return `
    <div class="qcard reveal" style="--qc:${q.color}">
      <div class="qcard-top">
        <span class="qcard-icon">${q.icon}</span>
        ${badge}
      </div>
      <h3 class="qcard-title">${q.label}</h3>
      <p class="qcard-desc">${q.desc}</p>
      <div class="qcard-meta">
        <span>${q.questions.length} questions</span>
        <span>${QUESTION_TIME}s each</span>
      </div>
      ${s ? `<div class="qcard-progress"><div class="qcard-progress-bar" style="width:${pct}%;background:${q.color}"></div></div>` : ''}
      <button class="qcard-start btn-auth" data-id="${id}" style="--btn-accent:${q.color}">Start Quiz</button>
    </div>
  `;
}

function startQuiz(id) {
    currentQuiz = id;
    currentQ = 0;
    score = 0;
    selected = null;
    answered = false;
    startTime = Date.now();
    renderQuestion();
}

function renderQuestion() {
    const quiz = QUIZZES[currentQuiz];
    const qs = quiz.questions;
    const q = qs[currentQ];
    const progress = ((currentQ) / qs.length) * 100;
    timeLeft = QUESTION_TIME;

    const app = document.getElementById('quiz-app');
    app.innerHTML = `
    <div class="quiz-active">
      <div class="quiz-topbar">
        <button class="quiz-exit" id="quiz-exit">✕ Exit</button>
        <div class="quiz-title-bar">
          <span>${quiz.icon} ${quiz.label}</span>
          <span class="quiz-counter">${currentQ + 1} / ${qs.length}</span>
        </div>
        <div class="quiz-timer" id="quiz-timer">
          <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2.5"/><circle id="quiz-timer-ring" cx="10" cy="10" r="8" fill="none" stroke="${quiz.color}" stroke-width="2.5" stroke-dasharray="50.3" stroke-dashoffset="0" stroke-linecap="round" style="transform:rotate(-90deg);transform-origin:center;transition:stroke-dashoffset 1s linear,stroke 0.3s"/></svg>
          <span id="quiz-timer-txt">${QUESTION_TIME}</span>
        </div>
      </div>

      <div class="quiz-progress-wrap">
        <div class="quiz-progress-bar-outer">
          <div class="quiz-progress-bar-inner" style="width:${progress}%;background:${quiz.color}"></div>
        </div>
        <span class="quiz-score-live">Score: <strong>${score}</strong></span>
      </div>

      <div class="quiz-q-wrap reveal">
        <p class="quiz-q-label">Question ${currentQ + 1}</p>
        <h2 class="quiz-q-text">${q.q}</h2>
        <div class="quiz-options" id="quiz-options">
          ${q.options.map((opt, i) => `
            <button class="quiz-opt" data-i="${i}">${opt}</button>
          `).join('')}
        </div>
        <div class="quiz-feedback" id="quiz-feedback"></div>
        <button class="btn-auth quiz-next" id="quiz-next" style="display:none;--btn-accent:${quiz.color}">
          ${currentQ + 1 < qs.length ? 'Next Question →' : 'See Results'}
        </button>
      </div>
    </div>
  `;

    document.getElementById('quiz-exit').addEventListener('click', () => {
        clearInterval(timerInterval);
        renderLobby();
    });

    document.querySelectorAll('.quiz-opt').forEach(btn => {
        btn.addEventListener('click', () => handleAnswer(parseInt(btn.dataset.i)));
    });

    document.getElementById('quiz-next').addEventListener('click', nextQuestion);

    revealAll();
    startTimer(quiz.color);
}

function startTimer(color) {
    const ring = document.getElementById('quiz-timer-ring');
    const txt = document.getElementById('quiz-timer-txt');
    const circumference = 50.3;

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        const frac = timeLeft / QUESTION_TIME;
        if (ring) ring.style.strokeDashoffset = circumference * (1 - frac);
        if (txt) txt.textContent = timeLeft;
        if (timeLeft <= 5 && ring) ring.style.stroke = '#EA4335';

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (!answered) handleAnswer(-1); // time out
        }
    }, 1000);
}

function handleAnswer(chosen) {
    if (answered) return;
    answered = true;
    clearInterval(timerInterval);

    const q = QUIZZES[currentQuiz].questions[currentQ];
    const correct = q.ans;
    const isCorrect = chosen === correct;
    if (isCorrect) score++;

    // Style options
    document.querySelectorAll('.quiz-opt').forEach((btn, i) => {
        btn.disabled = true;
        if (i === correct) btn.classList.add('quiz-opt--correct');
        else if (i === chosen) btn.classList.add('quiz-opt--wrong');
    });

    // Feedback
    const fb = document.getElementById('quiz-feedback');
    if (chosen === -1) {
        fb.textContent = `⏱ Time's up! Correct answer: ${q.options[correct]}`;
        fb.className = 'quiz-feedback quiz-feedback--wrong';
    } else if (isCorrect) {
        fb.textContent = '✓ Correct!';
        fb.className = 'quiz-feedback quiz-feedback--correct';
    } else {
        fb.textContent = `✗ Correct answer: ${q.options[correct]}`;
        fb.className = 'quiz-feedback quiz-feedback--wrong';
    }

    document.getElementById('quiz-next').style.display = 'flex';
}

function nextQuestion() {
    currentQ++;
    const total = QUIZZES[currentQuiz].questions.length;
    if (currentQ >= total) {
        finishQuiz();
    } else {
        answered = false;
        selected = null;
        renderQuestion();
    }
}

async function finishQuiz() {
    const quiz = QUIZZES[currentQuiz];
    const total = quiz.questions.length;
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const pct = Math.round((score / total) * 100);

    const grade = pct >= 90 ? { label: 'Excellent!', color: '#34A853', emoji: '🏆' }
        : pct >= 70 ? { label: 'Great job!', color: '#4285F4', emoji: '🎉' }
            : pct >= 50 ? { label: 'Keep going!', color: '#FBBC04', emoji: '💪' }
                : { label: 'Practice more', color: '#EA4335', emoji: '📚' };

    // Save to backend
    let best = null;
    try {
        const res = await api.post('/quiz/score', { quiz: currentQuiz, score, total, timeTaken });
        best = res.best;
        // Refresh userScores
        userScores[currentQuiz] = best;
    } catch { /* show results anyway */ }

    const app = document.getElementById('quiz-app');
    app.innerHTML = `
    <div class="quiz-result reveal">
      <div class="quiz-result-icon">${grade.emoji}</div>
      <h2 class="quiz-result-grade" style="color:${grade.color}">${grade.label}</h2>
      <p class="quiz-result-quiz">${quiz.icon} ${quiz.label}</p>

      <div class="quiz-result-score-ring">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="10"/>
          <circle id="result-ring" cx="70" cy="70" r="58" fill="none" stroke="${quiz.color}" stroke-width="10"
            stroke-dasharray="${2 * Math.PI * 58}"
            stroke-dashoffset="${2 * Math.PI * 58}"
            stroke-linecap="round"
            style="transform:rotate(-90deg);transform-origin:center;transition:stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)"/>
        </svg>
        <div class="quiz-result-pct">${pct}<span>%</span></div>
      </div>

      <div class="quiz-result-stats">
        <div class="quiz-result-stat">
          <span class="qrs-val">${score}/${total}</span>
          <span class="qrs-label">Score</span>
        </div>
        <div class="quiz-result-stat">
          <span class="qrs-val">${timeTaken}s</span>
          <span class="qrs-label">Time</span>
        </div>
        ${best ? `<div class="quiz-result-stat">
          <span class="qrs-val">${Math.round((best.score / best.total) * 100)}%</span>
          <span class="qrs-label">Best</span>
        </div>` : ''}
      </div>

      <div class="quiz-result-actions">
        <button class="btn-auth quiz-retry" id="quiz-retry" style="--btn-accent:${quiz.color}">Retry Quiz</button>
        <button class="btn-auth quiz-home" id="quiz-home" style="--btn-accent:rgba(255,255,255,0.15)">All Quizzes</button>
      </div>
    </div>
  `;

    // Reveal content then animate ring
    revealAll();
    requestAnimationFrame(() => requestAnimationFrame(() => {
        const ring = document.getElementById('result-ring');
        if (ring) ring.style.strokeDashoffset = `${2 * Math.PI * 58 * (1 - pct / 100)}`;
    }));

    document.getElementById('quiz-retry').addEventListener('click', () => startQuiz(currentQuiz));
    document.getElementById('quiz-home').addEventListener('click', () => {
        loadUserScores().then(renderLobby);
    });
}

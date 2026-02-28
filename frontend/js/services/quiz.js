/**
 * quiz.js — Quiz page logic
 * GDG Campus CSMU
 */

import { api } from './appwrite.js';
import { getCurrentUser, getAvatarURL, handleGoogleCredential, getGoogleClientId } from './auth.js';
import { initNavbarUserState } from './dashboard.js';

// ── Quiz metadata (questions fetched from DB) ────────────────────────────────

const QUIZZES = {
    javascript: { label: 'JavaScript', color: '#FBBC04', icon: '⚡', desc: 'ES6+, async, DOM, closures & more', count: 10 },
    python: { label: 'Python', color: '#4285F4', icon: '🐍', desc: 'Core syntax, data structures & OOP', count: 10 },
    webdev: { label: 'Web Dev', color: '#34A853', icon: '🌐', desc: 'HTML, CSS, REST APIs & browsers', count: 10 },
    cloud: { label: 'Cloud & GCP', color: '#EA4335', icon: '☁️', desc: 'GCP, Firebase, DevOps basics', count: 10 },
    android: { label: 'Android', color: '#34A853', icon: '📱', desc: 'Kotlin, Jetpack & Android APIs', count: 10 },
};

// ── State ────────────────────────────────────────────────────────────────────

let currentQuiz = null;
let currentQuestions = [];  // fetched from DB
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
    if (!user) {
        renderLoginPrompt();
        return;
    }

    await loadUserScores();
    renderLobby();
}

async function renderLoginPrompt() {
    const app = document.getElementById('quiz-app');
    app.innerHTML = `
      <div class="quiz-login-prompt reveal">
        <div class="qlp-icon">🧠</div>
        <h2 class="qlp-title">Sign in to take quizzes</h2>
        <p class="qlp-sub">Track your scores, earn XP, and climb the leaderboard.<br>Log in with Google to get started — it's free.</p>
        <div class="qlp-tracks">
          ${Object.values(QUIZZES).map(q =>
        `<span class="qlp-track" style="--qc:${q.color}">${q.icon} ${q.label}</span>`
    ).join('')}
        </div>
        <div id="qlp-google-btn" class="qlp-google-btn-wrap"></div>
        <a href="login.html" class="qlp-email-link">Or sign in with email →</a>
      </div>
    `;
    revealAll();

    // Render GSI button
    const clientId = await getGoogleClientId();
    if (clientId && window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async ({ credential }) => {
                const btnWrap = document.getElementById('qlp-google-btn');
                if (btnWrap) btnWrap.innerHTML = `<p style="color:var(--text-muted);font-size:0.85rem">Signing in…</p>`;
                try {
                    user = await handleGoogleCredential(credential);
                    await loadUserScores();
                    renderLobby();
                    // Refresh navbar to show avatar
                    initNavbarUserState();
                } catch (err) {
                    if (btnWrap) btnWrap.innerHTML = `<p style="color:#EA4335;font-size:0.85rem">Sign-in failed. Please try again.</p>`;
                }
            },
        });
        const btnWrap = document.getElementById('qlp-google-btn');
        if (btnWrap) {
            btnWrap.innerHTML = `
              <button class="btn-google-main" id="qlp-google-signin-btn" type="button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>`;
            document.getElementById('qlp-google-signin-btn').addEventListener('click', () => {
                window.google.accounts.id.prompt();
            });
        }
    } else {
        // GSI not loaded — link to login page
        const btnWrap = document.getElementById('qlp-google-btn');
        if (btnWrap) btnWrap.innerHTML = `
          <a href="login.html" class="btn-google-main" style="text-decoration:none">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </a>`;
    }
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
        <span>${q.count} questions</span>
        <span>${QUESTION_TIME}s each</span>
      </div>
      ${s ? `<div class="qcard-progress"><div class="qcard-progress-bar" style="width:${pct}%;background:${q.color}"></div></div>` : ''}
      <button class="qcard-start btn-auth" data-id="${id}" style="--btn-accent:${q.color}">Start Quiz</button>
    </div>
  `;
}

async function startQuiz(id) {
    currentQuiz = id;
    currentQ = 0;
    score = 0;
    selected = null;
    answered = false;
    startTime = Date.now();

    // Show loading state
    const app = document.getElementById('quiz-app');
    app.innerHTML = `
      <div class="quiz-loading">
        <div class="loader-dots" style="justify-content:center">
          <div class="loader-dot"></div><div class="loader-dot"></div>
          <div class="loader-dot"></div><div class="loader-dot"></div>
        </div>
        <p style="color:var(--text-muted);margin-top:12px;font-size:0.85rem">Loading questions…</p>
      </div>
    `;

    try {
        const data = await api.get(`/quiz/questions/${id}`);
        currentQuestions = data.questions;  // [{ question, options, answer, order }]
    } catch {
        app.innerHTML = `<p style="color:#EA4335;text-align:center;padding:40px">Failed to load questions. Please try again.</p>`;
        setTimeout(renderLobby, 2000);
        return;
    }

    renderQuestion();
}

function renderQuestion() {
    const quiz = QUIZZES[currentQuiz];
    const qs = currentQuestions;
    const raw = qs[currentQ];
    // Normalise field names (DB uses question/answer, legacy used q/ans)
    const q = { q: raw.question, options: raw.options, ans: raw.answer };
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

    const raw = currentQuestions[currentQ];
    const q = { q: raw.question, options: raw.options, ans: raw.answer };
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
    const total = currentQuestions.length;
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
    const total = currentQuestions.length;
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const pct = Math.round((score / total) * 100);

    const grade = pct >= 90 ? { label: 'Excellent!', color: '#34A853', emoji: '🏆' }
        : pct >= 70 ? { label: 'Great job!', color: '#4285F4', emoji: '🎉' }
            : pct >= 50 ? { label: 'Keep going!', color: '#FBBC04', emoji: '💪' }
                : { label: 'Practice more', color: '#EA4335', emoji: '📚' };

    // Save score and fetch global rank concurrently
    let best = null, rankData = null;
    try {
        const res = await api.post('/quiz/score', { quiz: currentQuiz, score, total, timeTaken });
        best = res.best;
        userScores[currentQuiz] = best;
    } catch { /* show results anyway */ }

    try {
        rankData = await api.get('/quiz/global-rank');
    } catch { /* rank is optional */ }

    const rankHTML = rankData && rankData.rank ? (() => {
        const { rank, total: totalUsers } = rankData;
        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '🏅';
        return `
          <div class="quiz-result-rank">
            <span class="qrr-medal">${medal}</span>
            <div>
              <p class="qrr-label">Global Rank</p>
              <p class="qrr-pos">#${rank} <span>of ${totalUsers}</span></p>
            </div>
          </div>`;
    })() : '';

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

      ${rankHTML}

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

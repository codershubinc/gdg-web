import { initDashboard, initNavbarUserState, loadDashboardQuizScores } from '../services/dashboard.js';

initNavbarUserState();
initDashboard();

// Sidebar section navigation
const sidebarLinks = document.querySelectorAll('.sidebar-link[data-section]');
sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.dataset.section;
        document.querySelectorAll('.dash-section').forEach(s => s.style.display = 'none');
        document.getElementById(target).style.display = 'block';
        sidebarLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        if (target === 'quiz-section') loadDashboardQuizScores();
    });
});

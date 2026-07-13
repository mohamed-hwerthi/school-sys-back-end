import { chromium } from 'playwright';

const API = 'http://localhost:8083/api';
const APP = 'http://localhost:5000';
const OUT = new URL('./captures/', import.meta.url).pathname;

const PAGES = [
  ['dashboard',   '/dashboard'],
  ['mon-ecole',   '/dashboard/ecole'],
  ['eleves',      '/dashboard/eleves'],
  ['inscriptions','/dashboard/inscriptions'],
  ['absences',    '/dashboard/absences'],
  ['appel',       '/dashboard/absences/appel'],
  ['discipline',  '/dashboard/discipline'],
  ['calendrier',  '/dashboard/calendrier'],
  ['niveaux',     '/dashboard/config/niveaux'],
  ['enseignants', '/dashboard/enseignants'],
  ['personnel',   '/dashboard/personnel'],
  ['affectations','/dashboard/affectations'],
  ['contrats',    '/dashboard/contrats'],
  ['paie',        '/dashboard/rh/paie'],
  ['formations',  '/dashboard/rh/formations'],
  ['evaluations', '/dashboard/evaluations'],
  // Pédagogie
  ['devoirs',     '/dashboard/devoirs'],
  ['carnets',     '/dashboard/carnets'],
  // Bulletins
  ['bulletins-masse',  '/dashboard/bulletins-masse'],
  ['conseil-classe',   '/dashboard/conseil-classe'],
  ['bilan-annuel',     '/dashboard/bilan-annuel'],
  // Emploi du temps
  ['emploi-du-temps',  '/dashboard/emploi-du-temps'],
  ['emploi-salles',    '/dashboard/emploi-salles'],
  ['volume-horaire',   '/dashboard/volume-horaire'],
  // Quiz
  ['quiz',        '/dashboard/quiz'],
  // Année scolaire
  ['annee-scolaire',   '/dashboard/annee-scolaire'],
  ['reinscriptions',   '/dashboard/reinscriptions'],
  ['cloture',          '/dashboard/cloture'],
  // Vie scolaire
  ['bibliotheque', '/dashboard/bibliotheque'],
  ['cantine',      '/dashboard/cantine'],
  ['transport',    '/dashboard/transport'],
  // Finance
  ['finance',      '/dashboard/finance'],
  ['depenses',     '/dashboard/finance/depenses'],
  ['tresorerie',   '/dashboard/finance/tresorerie'],
  ['paiement',     '/dashboard/finance/paiement'],
  ['relances',     '/dashboard/finance/relances'],
  ['factures',     '/dashboard/factures'],
  ['fin-rapports', '/dashboard/finance/rapports'],
  // Communication
  ['annonces',     '/dashboard/annonces'],
  ['circulaires',  '/dashboard/circulaires'],
  ['reunions',     '/dashboard/reunions'],
  ['notifications','/dashboard/notifications'],
  // Analytics
  ['analytics',    '/dashboard/analytics'],
  ['comparatif',   '/dashboard/comparatif'],
  ['stats-reussite','/dashboard/stats-reussite'],
  ['statistique',  '/dashboard/statistique'],
  // Documents
  ['documents',    '/dashboard/documents'],
  // Administration
  ['utilisateurs', '/dashboard/utilisateurs'],
  ['configuration','/dashboard/configuration'],
  ['integrations', '/dashboard/integrations'],
  ['tracabilite',  '/dashboard/tracabilite'],
];

const res = await fetch(`${API}/auth/login`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'ishak@gmail.com', password: '123456789' }),
});
const { data } = await res.json();
console.log('Login OK:', data.user.email);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

await page.goto(APP);
await page.evaluate(({ token, refresh, user }) => {
  localStorage.setItem('token', token);
  localStorage.setItem('refreshToken', refresh);
  localStorage.setItem('user', JSON.stringify(user));
}, { token: data.accessToken, refresh: data.refreshToken, user: data.user });

for (const [name, path] of PAGES) {
  try {
    await page.goto(APP + path, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: OUT + name + '.png' });
    console.log('✓', name);
  } catch (e) {
    console.log('✗', name, e.message.split('\n')[0]);
  }
}

await browser.close();
console.log('Captures dans:', OUT);

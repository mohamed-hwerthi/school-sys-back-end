import { readFileSync, writeFileSync } from 'fs';

const FILE = new URL('./presentation.html', import.meta.url).pathname;

// module = { icon, name, gradWord, tagline, pills:[], slides:[{ico,h3,h2,bullets:[],img,url}] }
const MODULES = [
  {
    icon:'📚', name:'Module', gradWord:'Pédagogie', tagline:"Le suivi de l'apprentissage, de la note au bulletin.",
    pills:['📝 Devoirs','📚 Domaines','📐 Matières','🧪 Examens','✍️ Saisie','📊 Moyennes','💬 Appréciations','🧾 Bulletins'],
    slides:[
      {h3:'📝 Devoirs', h2:'Devoirs & ressources', bullets:['Devoirs, soumissions & ressources pédagogiques','Suivi par niveau et par classe','Publication et dépôt de fichiers'], img:'devoirs', url:'/dashboard/devoirs'},
      {h3:'📚 Carnet · Domaines', h2:'Structure pédagogique bilingue', bullets:['Domaines en arabe & français','Coefficients & sous-domaines','Organisation par niveau'], img:'carnet-domaines', url:'/dashboard/carnets'},
      {h3:'📐 Carnet · Matières', h2:'Les matières & modules', bullets:['11 modules par niveau','Coefficients École / Privé','Versions & ordre d\'affichage'], img:'carnet-matieres', url:'/dashboard/carnets'},
      {h3:'🧪 Carnet · Examens', h2:'Les évaluations', bullets:['Examens par classe & trimestre','Suivi des saisies (0/20…)','Coefficients & enseignant'], img:'carnet-examens', url:'/dashboard/carnets'},
      {h3:'👁️ Carnet · Aperçu', h2:'Progression de la saisie', bullets:['Statut par matière & trimestre','Barres de progression 100%','Vue claire pour la direction'], img:'carnet-apercu', url:'/dashboard/carnets'},
      {h3:'✍️ Carnet · Saisie des notes', h2:'Saisir vite et bien', bullets:['Note /20 + observation par élève','Observations bilingues','Mise à jour groupée'], img:'carnet-saisie', url:'/dashboard/carnets'},
      {h3:'📊 Carnet · Moyennes', h2:'Moyennes & classement', bullets:['Moyenne par domaine & rang','Détail note par note','Min / Max / Moyenne classe'], img:'carnet-moyennes', url:'/dashboard/carnets'},
      {h3:'📈 Carnet · Statistiques', h2:'Analyse par domaine', bullets:['Distribution des notes & réussite/échec','Quartiles, médiane, écart-type','Top 5 & élèves à surveiller'], img:'carnet-stats-domaine', url:'/dashboard/carnets'},
      {h3:'🔬 Carnet · Stats par matière', h2:'Le détail matière par matière', bullets:['% réussite, mention, échec','Répartition par mention','Indicateurs précis'], img:'carnet-stats-matiere', url:'/dashboard/carnets'},
      {h3:'💬 Carnet · Appréciations', h2:'Appréciations automatiques', bullets:['Recommandations par domaine','« Auto selon moyenne » en un clic','Texte bilingue personnalisable'], img:'carnet-appreciations', url:'/dashboard/carnets'},
      {h3:'📚 Carnet · Carnets de classe', h2:'Vue d\'ensemble de la classe', bullets:['Stats globales & certificats','Répartition par mention','Téléchargement ZIP des carnets'], img:'carnet-carnets', url:'/dashboard/carnets'},
      {h3:'🏆 Carnet · Classement', h2:'Top élèves & élèves à soutenir', bullets:['Classement des 10 meilleurs','Liste des élèves à surveiller','Moyennes, rang & certificats'], img:'carnet-classement', url:'/dashboard/carnets'},
      {h3:'🧾 Carnet · Bulletin officiel', h2:'Le bulletin prêt à imprimer', bullets:['Format officiel conforme','Bilingue arabe / français','Aperçu & impression en un clic'], img:'carnet-bulletin', url:'/dashboard/carnets'},
    ]
  },
  {
    icon:'🖨️', name:'Module', gradWord:'Bulletins', tagline:'De la note imprimée à l\'analyse de réussite.',
    pills:['🖨️ Impression en masse','📊 Stats réussite','⚖️ Comparatif'],
    slides:[
      {h3:'🖨️ Impression en masse', h2:'Toute la classe, classée', bullets:['Classement par rang & moyenne','Certificat attribué à chaque élève','Aperçu & impression en un clic'], img:'bulletin-masse-liste', url:'/dashboard/bulletins-masse'},
      {h3:'🖨️ Impression · Statistiques', h2:'La classe en chiffres', bullets:['Moyenne, médiane, min/max, écart-type','Distribution, réussite/échec, mentions','Répartition par certificat'], img:'bulletin-masse-stats', url:'/dashboard/bulletins-masse'},
      {h3:'📊 Stats de réussite', h2:'Performance par classe & module', bullets:['Taux de réussite & réussis / échecs','Évolution trimestrielle','Moyenne par module'], img:'bulletin-stats1', url:'/dashboard/stats-reussite'},
      {h3:'📊 Stats · Détail', h2:'Mentions & certificats', bullets:['Répartition par mention','Moyennes de la classe (min/moy/max)','Top élèves & élèves à surveiller'], img:'bulletin-stats2', url:'/dashboard/stats-reussite'},
      {h3:'⚖️ Comparatif', h2:'Classes en compétition', bullets:['Podium des classes','Performance & taux par classe','Évolution trimestrielle'], img:'bulletin-comparatif', url:'/dashboard/comparatif'},
    ]
  },
  {
    icon:'📅', name:'Module', gradWord:'Emploi du temps', tagline:'Toute l\'organisation, sans conflit.',
    pills:['🗓️ Emploi du temps','🚪 Salles','⏱️ Volume horaire'],
    slides:[
      {h3:'🗓️ Emploi du temps', h2:'La grille de chaque classe', bullets:['Séances par classe et par jour','Enseignants & matières assignés','Modification visuelle simple'], img:'emploi-du-temps', url:'/dashboard/emploi-du-temps'},
      {h3:'🚪 Occupation des salles', h2:'Plus de conflits de salle', bullets:['Planning d\'occupation des salles','Détection des chevauchements','Optimisation des locaux'], img:'emploi-salles', url:'/dashboard/emploi-salles'},
      {h3:'⏱️ Volume horaire', h2:'Le suivi des heures', bullets:['Heures par matière & par enseignant','Respect des maquettes horaires','Récapitulatifs automatiques'], img:'volume-horaire', url:'/dashboard/volume-horaire'},
    ]
  },
  {
    icon:'❓', name:'Module', gradWord:'Quiz & examens en ligne', tagline:'L\'évaluation numérique, simplifiée.',
    pills:['✏️ Création','🖥️ Passation','✅ Correction auto'],
    slides:[
      {h3:'❓ Quiz', h2:'Évaluations en ligne', bullets:['Création de quiz & examens','Passation par les élèves','Correction automatique & résultats'], img:'quiz', url:'/dashboard/quiz'},
    ]
  },
  {
    icon:'🗓️', name:'Module', gradWord:'Année scolaire', tagline:'Du jour 1 à la clôture.',
    pills:['📆 Années & périodes','🔁 Réinscriptions','🔒 Clôture'],
    slides:[
      {h3:'📆 Année scolaire', h2:'Le cadre de l\'année', bullets:['Gestion des années & trimestres','Périodes et dates clés','Paramétrage central'], img:'annee-scolaire', url:'/dashboard/annee-scolaire'},
      {h3:'🔁 Réinscriptions', h2:'Campagne en masse', bullets:['Réinscription groupée des élèves','Suivi des dossiers','Gain de temps en début d\'année'], img:'reinscriptions', url:'/dashboard/reinscriptions'},
      {h3:'🔒 Clôture d\'année', h2:'Passage & archivage', bullets:['Passage de classe automatisé','Archivage de l\'année écoulée','Transition propre vers la suivante'], img:'cloture', url:'/dashboard/cloture'},
    ]
  },
  {
    icon:'🎒', name:'Module', gradWord:'Vie scolaire', tagline:'Au-delà de la salle de classe.',
    pills:['📖 Bibliothèque','🍽️ Cantine','🚌 Transport'],
    slides:[
      {h3:'📖 Bibliothèque', h2:'Le centre de ressources', bullets:['Catalogue des ouvrages','Emprunts & retours','Suivi des disponibilités'], img:'bibliotheque', url:'/dashboard/bibliotheque'},
      {h3:'🍽️ Cantine', h2:'La restauration scolaire', bullets:['Inscriptions à la cantine','Suivi des repas','Facturation intégrée'], img:'cantine', url:'/dashboard/cantine'},
      {h3:'🚌 Transport', h2:'Le ramassage scolaire', bullets:['Circuits & véhicules','Élèves transportés','Organisation des trajets'], img:'transport', url:'/dashboard/transport'},
    ]
  },
  {
    icon:'💰', name:'Module', gradWord:'Finance', tagline:'La santé financière, sous contrôle.',
    pills:['📊 Tableau de bord','💵 Paiements','📉 Dépenses','🏦 Trésorerie','🧾 Factures'],
    slides:[
      {h3:'📊 Tableau de bord financier', h2:'Vue globale', bullets:['Recettes & dépenses en un écran','Indicateurs clés en direct','Pilotage budgétaire'], img:'finance', url:'/dashboard/finance'},
      {h3:'💵 Paiements', h2:'Encaissements & reçus', bullets:['Paiement + reçu instantané','Suivi par élève & tranche','Historique complet'], img:'paiement', url:'/dashboard/finance/paiement'},
      {h3:'📉 Dépenses', h2:'Maîtrise des coûts', bullets:['Dépenses par catégorie','Justificatifs attachés','Suivi du budget'], img:'depenses', url:'/dashboard/finance/depenses'},
      {h3:'🏦 Trésorerie', h2:'Caisse & soldes', bullets:['Mouvements de caisse','Soldes en temps réel','Rapprochements simples'], img:'tresorerie', url:'/dashboard/finance/tresorerie'},
      {h3:'🧾 Factures', h2:'Facturation claire', bullets:['Génération des factures','Statut payé / impayé','Envoi aux familles'], img:'factures', url:'/dashboard/factures'},
      {h3:'📑 Rapports financiers', h2:'Prêts en fin de mois', bullets:['Bilans recettes / dépenses','Exports comptables','Analyses par période'], img:'fin-rapports', url:'/dashboard/finance/rapports'},
    ]
  },
  {
    icon:'📣', name:'Module', gradWord:'Communication', tagline:'Toute l\'école connectée.',
    pills:['📢 Annonces','📜 Circulaires','🤝 Réunions','🔔 Notifications'],
    slides:[
      {h3:'📢 Annonces', h2:'Diffusion ciblée', bullets:['Annonces aux parents & enseignants','Par classe, niveau ou école','Visibles dans le portail'], img:'annonces', url:'/dashboard/annonces'},
      {h3:'📜 Circulaires', h2:'Documents officiels', bullets:['Circulaires diffusées en ligne','Accusés & suivi de lecture','Archivage centralisé'], img:'circulaires', url:'/dashboard/circulaires'},
      {h3:'🤝 Réunions', h2:'Parents-profs organisés', bullets:['Planification des réunions','Convocations automatiques','Suivi des présences'], img:'reunions', url:'/dashboard/reunions'},
      {h3:'🔔 Notifications', h2:'Le centre de messages', bullets:['Notifications in-app','Envoi par SMS','Historique des envois'], img:'notifications', url:'/dashboard/notifications'},
    ]
  },
  {
    icon:'📈', name:'Module', gradWord:'Analytics', tagline:'Les chiffres qui font décider.',
    pills:['📊 Analytics','⚖️ Comparatif','🏆 Réussite'],
    slides:[
      {h3:'📊 Analytics', h2:'Tableaux de bord avancés', bullets:['KPIs détaillés & graphiques','Tendances et évolutions','Vue 360° de l\'établissement'], img:'analytics', url:'/dashboard/analytics'},
      {h3:'⚖️ Comparatif performances', h2:'Qui progresse, où ?', bullets:['Comparaison par classe & niveau','Performance des enseignants','Identification des écarts'], img:'comparatif', url:'/dashboard/comparatif'},
      {h3:'🏆 Statistiques de réussite', h2:'Le pilotage pédagogique', bullets:['Taux de réussite par classe','Évolution dans le temps','Aide à la décision'], img:'stats-reussite', url:'/dashboard/stats-reussite'},
    ]
  },
  {
    icon:'📁', name:'Module', gradWord:'Documents', tagline:'Tous vos documents, générés en un clic.',
    pills:['📄 Attestations','🎓 Certificats','🖨️ Génération'],
    slides:[
      {h3:'📁 Documents', h2:'La génération automatique', bullets:['Attestations & certificats de scolarité','Modèles prêts à l\'emploi','Export PDF immédiat'], img:'documents', url:'/dashboard/documents'},
    ]
  },
  {
    icon:'⚙️', name:'Module', gradWord:'Administration', tagline:'Le contrôle total de la plateforme.',
    pills:['👤 Utilisateurs','⚙️ Configuration','🔌 Intégrations','📜 Traçabilité'],
    slides:[
      {h3:'👤 Utilisateurs & rôles', h2:'Accès maîtrisés', bullets:['Comptes par rôle','Permissions fines','Activation / désactivation'], img:'utilisateurs', url:'/dashboard/utilisateurs'},
      {h3:'⚙️ Configuration', h2:'L\'école à votre image', bullets:['Paramètres généraux','Personnalisation','Préférences de l\'établissement'], img:'configuration', url:'/dashboard/configuration'},
      {h3:'🔌 Intégrations', h2:'Connecté à vos outils', bullets:['SMS, WhatsApp, paiement en ligne','Activation simple','Écosystème ouvert'], img:'integrations', url:'/dashboard/integrations'},
      {h3:'📜 Traçabilité', h2:'Chaque action tracée', bullets:['Journal d\'audit complet','Qui a fait quoi, quand','Sécurité & conformité'], img:'tracabilite', url:'/dashboard/tracabilite'},
    ]
  },
  {
    icon:'📱', name:'Module', gradWord:'Application mobile', tagline:'Schooly dans la poche de toute l\'école.',
    pills:['👨‍👩‍👧 Parents','👩‍🏫 Enseignants','🎓 Direction','⚙️ Admin'],
    slides:[
      {frame:'phone', h3:'📱 Une app, tous les profils', h2:'Chacun son espace', bullets:['👨‍👩‍👧 <b>Parents</b> : notes, absences, paiements','👩‍🏫 <b>Enseignants</b> : appel, saisie des notes','🎓 <b>Direction</b> : pilotage & alertes','⚙️ <b>Admin</b> : gestion complète','Connexion sécurisée par école'], img:'mobile-login'},
      {frame:'phone', h3:'🏠 Tableau de bord', h2:'L\'école dans la main', bullets:['Effectifs, enseignants, classes','Alertes opérationnelles','Indicateurs finances & réussite'], img:'mobile-dashboard'},
      {frame:'phone', h3:'📊 Statistiques mobiles', h2:'Les chiffres, en direct', bullets:['Revenu mensuel','Élèves par niveau','Présence de la semaine'], img:'mobile-stats-home'},
      {frame:'phone', h3:'👥 Élèves', h2:'Tous les élèves à portée', bullets:['Recherche nom / matricule','Filtres par classe & statut','Fiche élève en un tap'], img:'mobile-eleves'},
      {frame:'phone', h3:'👩‍🏫 Enseignants', h2:'L\'équipe pédagogique', bullets:['Liste & spécialités','Statut actif / inactif','Recherche instantanée'], img:'mobile-enseignants'},
      {frame:'phone', h3:'💰 Finance', h2:'Les finances en mobilité', bullets:['Revenu, dépenses, solde, impayés','Derniers paiements & dépenses','Suivi par année scolaire'], img:'mobile-finance'},
      {frame:'phone', h3:'📈 Stats école', h2:'Réussite & présence', bullets:['Moyenne école & taux de réussite','Meilleures classes','Taux de présence par classe'], img:'mobile-stats-ecole'},
      {frame:'phone', h3:'⭐ Performance enseignants', h2:'Le suivi des saisies', bullets:['Par trimestre (T1/T2/T3)','Devoirs publiés & saisies','Moyenne des notes'], img:'mobile-perf-enseignants'},
      {frame:'phone', h3:'👤 Profil & sécurité', h2:'Compte protégé', bullets:['Profil & école','Sécurité & 2FA','Sessions actives & notifications'], img:'mobile-profil'},
      {frame:'phone', h3:'🌙 Mode sombre', h2:'Clair ou sombre, au choix', bullets:['Thème sombre élégant','Finances & recouvrement','Élèves par niveau en un coup d\'œil'], img:'mobile-dark'},
    ]
  },
];

const li = b => `          <li>${b}</li>`;
function slideHtml(s){
  const visual = s.frame === 'phone'
    ? `      <div class="phone anim"><img src="./captures/${s.img}.png" alt="${s.h2}"></div>`
    : `      <div class="browser anim">
        <div class="bar"><i></i><i></i><i></i><span class="url">localhost:5000${s.url}</span></div>
        <img src="./captures/${s.img}.png" alt="${s.h2}">
      </div>`;
  return `
  <section class="slide">
    <div class="two${s.frame === 'phone' ? ' two-phone' : ''}">
      <div>
        <h3 class="anim">${s.h3}</h3>
        <h2 class="anim">${s.h2}</h2>
        <ul class="anim">
${s.bullets.map(li).join('\n')}
        </ul>
      </div>
${visual}
    </div>
  </section>`;
}
function dividerHtml(m){
  const pills = m.pills.map(p=>`      <span class="pill">${p}</span>`).join('\n');
  return `
  <!-- ============ SECTION ${m.gradWord.toUpperCase()} ============ -->
  <section class="slide center">
    <div class="tag anim"><span class="dot"></span> Visite guidée</div>
    <h1 class="anim">${m.icon} <span class="grad">${m.gradWord}</span></h1>
    <p class="baseline anim">${m.tagline}</p>
    <div class="pills anim">
${pills}
    </div>
  </section>`;
}

const block = MODULES.map(m => dividerHtml(m) + m.slides.map(slideHtml).join('')).join('\n');

let html = readFileSync(FILE, 'utf8');
const MARKER = '  <!-- ============ SECTION RÔLES ============ -->';
if (!html.includes(MARKER)) { console.error('Marker introuvable !'); process.exit(1); }
// Remove any previously generated modules block to stay idempotent
html = html.replace(/\n  <!-- AUTO-MODULES-START -->[\s\S]*?<!-- AUTO-MODULES-END -->\n/, '\n');
const wrapped = `\n  <!-- AUTO-MODULES-START -->${block}\n  <!-- AUTO-MODULES-END -->\n`;
html = html.replace(MARKER, wrapped + '\n' + MARKER);
writeFileSync(FILE, html);

const totalSlides = MODULES.reduce((n,m)=>n+1+m.slides.length,0);
console.log(`OK — ${MODULES.length} sections, ${totalSlides} diapos ajoutées.`);

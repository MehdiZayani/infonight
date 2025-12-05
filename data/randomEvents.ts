// Random events system for the game

import { ReputationImpact } from './reputation';

export interface RandomEventChoice {
  id: string;
  label: string;
  description: string;
  budgetImpact: number;
  scoreNIRDImpact: number;
  dependanceImpact: number;
  reputationImpact: ReputationImpact;
  consequence: string;
}

export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'crisis' | 'opportunity' | 'neutral';
  probability: number; // 0-1, chance to trigger
  minStep: number; // Minimum step to trigger
  maxStep: number; // Maximum step to trigger
  choices: RandomEventChoice[];
}

export const RANDOM_EVENTS: RandomEvent[] = [
  // CRISIS EVENTS
  {
    id: 'cyberattack',
    title: '🚨 Cyberattaque !',
    description: 'Une attaque par ransomware menace les données de l\'établissement. Les systèmes sont paralysés.',
    icon: '🦠',
    type: 'crisis',
    probability: 0.15,
    minStep: 3,
    maxStep: 9,
    choices: [
      {
        id: 'pay',
        label: 'Payer la rançon',
        description: 'Récupérer rapidement l\'accès aux données',
        budgetImpact: -8000,
        scoreNIRDImpact: -15,
        dependanceImpact: 20,
        reputationImpact: { parents: -15, academie: -20 },
        consequence: 'Les données sont récupérées mais vous avez financé des criminels.',
      },
      {
        id: 'restore',
        label: 'Restaurer les sauvegardes',
        description: 'Utiliser les sauvegardes si elles existent',
        budgetImpact: -2000,
        scoreNIRDImpact: 10,
        dependanceImpact: -10,
        reputationImpact: { enseignants: 10, academie: 15 },
        consequence: 'Votre politique de sauvegarde a payé ! Quelques jours de données perdus seulement.',
      },
      {
        id: 'expert',
        label: 'Appeler des experts',
        description: 'Faire appel à une équipe de cybersécurité',
        budgetImpact: -5000,
        scoreNIRDImpact: 5,
        dependanceImpact: 5,
        reputationImpact: { parents: 5, academie: 10 },
        consequence: 'Les experts ont contenu l\'attaque et renforcé vos défenses.',
      },
    ],
  },
  {
    id: 'hardware_failure',
    title: '💥 Panne majeure',
    description: 'Le serveur principal est tombé en panne. Plus de réseau, plus d\'accès aux ressources pédagogiques.',
    icon: '🔧',
    type: 'crisis',
    probability: 0.12,
    minStep: 2,
    maxStep: 8,
    choices: [
      {
        id: 'emergency_buy',
        label: 'Achat d\'urgence',
        description: 'Commander un nouveau serveur en express',
        budgetImpact: -6000,
        scoreNIRDImpact: -5,
        dependanceImpact: 15,
        reputationImpact: { eleves: -5, enseignants: -10 },
        consequence: 'Le nouveau serveur arrive dans 48h. Les cours sont perturbés.',
      },
      {
        id: 'cloud_temp',
        label: 'Solution cloud temporaire',
        description: 'Migrer temporairement vers le cloud',
        budgetImpact: -1500,
        scoreNIRDImpact: -10,
        dependanceImpact: 25,
        reputationImpact: { eleves: 5, enseignants: 5 },
        consequence: 'Continuité assurée mais dépendance accrue aux services externes.',
      },
      {
        id: 'repair',
        label: 'Réparer le serveur',
        description: 'Tenter une réparation avec les moyens du bord',
        budgetImpact: -500,
        scoreNIRDImpact: 15,
        dependanceImpact: -5,
        reputationImpact: { enseignants: -5, academie: 5 },
        consequence: 'Après 3 jours difficiles, le serveur refonctionne. Leçon apprise.',
      },
    ],
  },
  {
    id: 'inspection',
    title: '📋 Inspection RGPD',
    description: 'La CNIL effectue un contrôle surprise de vos pratiques en matière de données personnelles.',
    icon: '🔍',
    type: 'crisis',
    probability: 0.1,
    minStep: 6,
    maxStep: 10,
    choices: [
      {
        id: 'full_coop',
        label: 'Coopération totale',
        description: 'Ouvrir tous les dossiers et être transparent',
        budgetImpact: -500,
        scoreNIRDImpact: 10,
        dependanceImpact: 0,
        reputationImpact: { parents: 15, academie: 20 },
        consequence: 'L\'inspecteur salue votre transparence. Quelques ajustements demandés.',
      },
      {
        id: 'minimal',
        label: 'Minimum légal',
        description: 'Ne fournir que les documents obligatoires',
        budgetImpact: 0,
        scoreNIRDImpact: -5,
        dependanceImpact: 0,
        reputationImpact: { parents: -5, academie: -10 },
        consequence: 'L\'inspection passe mais laisse un sentiment de méfiance.',
      },
      {
        id: 'consultant',
        label: 'Engager un consultant',
        description: 'Faire appel à un expert RGPD pour vous accompagner',
        budgetImpact: -2000,
        scoreNIRDImpact: 15,
        dependanceImpact: 5,
        reputationImpact: { parents: 10, academie: 15 },
        consequence: 'L\'expert a préparé tous les documents. Inspection réussie avec les félicitations.',
      },
    ],
  },

  // OPPORTUNITY EVENTS
  {
    id: 'grant',
    title: '💰 Subvention disponible',
    description: 'La région propose une subvention pour les projets numériques éco-responsables.',
    icon: '🎁',
    type: 'opportunity',
    probability: 0.18,
    minStep: 2,
    maxStep: 8,
    choices: [
      {
        id: 'apply_full',
        label: 'Candidature ambitieuse',
        description: 'Présenter un projet complet et innovant',
        budgetImpact: 12000,
        scoreNIRDImpact: 15,
        dependanceImpact: -10,
        reputationImpact: { enseignants: 10, academie: 15, parents: 5 },
        consequence: 'Votre dossier a séduit le jury. Subvention maximale obtenue !',
      },
      {
        id: 'apply_simple',
        label: 'Candidature simple',
        description: 'Demander un financement modeste',
        budgetImpact: 5000,
        scoreNIRDImpact: 5,
        dependanceImpact: 0,
        reputationImpact: { academie: 5 },
        consequence: 'Subvention partielle accordée. C\'est toujours ça de pris.',
      },
      {
        id: 'skip',
        label: 'Passer son tour',
        description: 'Ne pas candidater cette fois',
        budgetImpact: 0,
        scoreNIRDImpact: 0,
        dependanceImpact: 0,
        reputationImpact: { enseignants: -5, academie: -5 },
        consequence: 'L\'équipe est déçue. Une occasion manquée.',
      },
    ],
  },
  {
    id: 'donation',
    title: '🖥️ Don de matériel',
    description: 'Une entreprise locale propose de donner des équipements informatiques.',
    icon: '📦',
    type: 'opportunity',
    probability: 0.15,
    minStep: 1,
    maxStep: 7,
    choices: [
      {
        id: 'accept_all',
        label: 'Tout accepter',
        description: 'Prendre tout le matériel offert',
        budgetImpact: 3000,
        scoreNIRDImpact: 10,
        dependanceImpact: 10,
        reputationImpact: { eleves: 10, parents: 5 },
        consequence: '30 ordinateurs récupérés ! Mais certains nécessitent des réparations.',
      },
      {
        id: 'select',
        label: 'Sélectionner le meilleur',
        description: 'Ne garder que les équipements en bon état',
        budgetImpact: 2000,
        scoreNIRDImpact: 15,
        dependanceImpact: 0,
        reputationImpact: { eleves: 5, enseignants: 10 },
        consequence: '15 ordinateurs en parfait état intègrent le parc informatique.',
      },
      {
        id: 'refuse',
        label: 'Refuser poliment',
        description: 'Décliner l\'offre pour éviter le matériel obsolète',
        budgetImpact: 0,
        scoreNIRDImpact: 5,
        dependanceImpact: -5,
        reputationImpact: { parents: -5 },
        consequence: 'Vous restez maître de votre parc mais l\'entreprise est déçue.',
      },
    ],
  },
  {
    id: 'student_project',
    title: '💡 Initiative étudiante',
    description: 'Des élèves de terminale proposent de créer une application pour l\'établissement.',
    icon: '🚀',
    type: 'opportunity',
    probability: 0.12,
    minStep: 4,
    maxStep: 9,
    choices: [
      {
        id: 'support',
        label: 'Soutenir le projet',
        description: 'Fournir ressources et encadrement',
        budgetImpact: -1000,
        scoreNIRDImpact: 20,
        dependanceImpact: -15,
        reputationImpact: { eleves: 25, enseignants: 15, academie: 10 },
        consequence: 'L\'application est un succès ! Les élèves sont fiers et compétents.',
      },
      {
        id: 'partial',
        label: 'Soutien limité',
        description: 'Encourager sans investir',
        budgetImpact: 0,
        scoreNIRDImpact: 10,
        dependanceImpact: -5,
        reputationImpact: { eleves: 10, enseignants: 5 },
        consequence: 'Le projet avance doucement. Les élèves font de leur mieux.',
      },
      {
        id: 'outsource',
        label: 'Externaliser',
        description: 'Confier le projet à un professionnel',
        budgetImpact: -3000,
        scoreNIRDImpact: -5,
        dependanceImpact: 15,
        reputationImpact: { eleves: -15, enseignants: -5 },
        consequence: 'Les élèves sont déçus. Le projet professionnel manque d\'âme.',
      },
    ],
  },

  // NEUTRAL EVENTS
  {
    id: 'media_visit',
    title: '📰 Visite de presse',
    description: 'Un journaliste local veut faire un article sur votre transition numérique.',
    icon: '🎤',
    type: 'neutral',
    probability: 0.1,
    minStep: 5,
    maxStep: 10,
    choices: [
      {
        id: 'full_access',
        label: 'Accès total',
        description: 'Laisser le journaliste voir tout',
        budgetImpact: 0,
        scoreNIRDImpact: 10,
        dependanceImpact: 0,
        reputationImpact: { parents: 15, academie: 10, eleves: 5 },
        consequence: 'L\'article est élogieux. Votre établissement fait figure d\'exemple.',
      },
      {
        id: 'guided',
        label: 'Visite guidée',
        description: 'Montrer les aspects positifs uniquement',
        budgetImpact: 0,
        scoreNIRDImpact: 0,
        dependanceImpact: 0,
        reputationImpact: { parents: 5, academie: 5 },
        consequence: 'Article neutre mais positif. Pas de vagues.',
      },
      {
        id: 'decline',
        label: 'Décliner',
        description: 'Refuser la visite',
        budgetImpact: 0,
        scoreNIRDImpact: -5,
        dependanceImpact: 0,
        reputationImpact: { parents: -10, academie: -5 },
        consequence: 'Le journaliste écrit un article mitigé basé sur des rumeurs.',
      },
    ],
  },
  {
    id: 'tech_update',
    title: '⚙️ Mise à jour critique',
    description: 'Une mise à jour de sécurité majeure doit être déployée ce week-end.',
    icon: '🔄',
    type: 'neutral',
    probability: 0.15,
    minStep: 2,
    maxStep: 9,
    choices: [
      {
        id: 'immediate',
        label: 'Déployer immédiatement',
        description: 'Interrompre les services pour la mise à jour',
        budgetImpact: -200,
        scoreNIRDImpact: 10,
        dependanceImpact: 0,
        reputationImpact: { enseignants: -5, academie: 10 },
        consequence: 'Mise à jour réussie. Quelques plaintes mais sécurité renforcée.',
      },
      {
        id: 'scheduled',
        label: 'Planifier ce week-end',
        description: 'Attendre une fenêtre de maintenance',
        budgetImpact: -500,
        scoreNIRDImpact: 5,
        dependanceImpact: 0,
        reputationImpact: { enseignants: 5, academie: 5 },
        consequence: 'Mise à jour propre et sans interruption de service.',
      },
      {
        id: 'delay',
        label: 'Reporter',
        description: 'Attendre la prochaine version',
        budgetImpact: 0,
        scoreNIRDImpact: -10,
        dependanceImpact: 5,
        reputationImpact: { academie: -10 },
        consequence: 'Faille de sécurité exploitée quelques jours plus tard...',
      },
    ],
  },
  {
    id: 'training_opportunity',
    title: '🎓 Formation gratuite',
    description: 'L\'académie propose une formation numérique gratuite pour les enseignants.',
    icon: '📚',
    type: 'opportunity',
    probability: 0.2,
    minStep: 3,
    maxStep: 8,
    choices: [
      {
        id: 'send_many',
        label: 'Envoyer plusieurs enseignants',
        description: 'Libérer 5 enseignants pour la formation',
        budgetImpact: -500,
        scoreNIRDImpact: 15,
        dependanceImpact: -10,
        reputationImpact: { enseignants: 20, academie: 15 },
        consequence: 'Les enseignants reviennent motivés et compétents.',
      },
      {
        id: 'send_few',
        label: 'Envoyer un représentant',
        description: 'Un enseignant formera les autres ensuite',
        budgetImpact: 0,
        scoreNIRDImpact: 8,
        dependanceImpact: -5,
        reputationImpact: { enseignants: 10, academie: 5 },
        consequence: 'Formation en cascade prévue. Effet retardé mais économique.',
      },
      {
        id: 'skip_training',
        label: 'Passer',
        description: 'Les enseignants sont trop occupés',
        budgetImpact: 0,
        scoreNIRDImpact: -5,
        dependanceImpact: 0,
        reputationImpact: { enseignants: -10, academie: -10 },
        consequence: 'Opportunité manquée. Les enseignants sont déçus.',
      },
    ],
  },
  // RETRO GAMING CHALLENGE
  {
    id: 'retro_gaming_challenge',
    title: '🎮 Challenge Rétro Gaming',
    description: 'Un enseignant passionné propose d\'organiser une semaine "Patrimoine Vidéoludique" avec des ordinateurs reconditionnés faisant tourner des jeux éducatifs rétro des années 80-90.',
    icon: '👾',
    type: 'opportunity',
    probability: 0.18,
    minStep: 3,
    maxStep: 9,
    choices: [
      {
        id: 'full_event',
        label: '🕹️ Événement complet',
        description: 'Organiser une semaine entière avec tournois, ateliers et expo',
        budgetImpact: -1500,
        scoreNIRDImpact: 25,
        dependanceImpact: -15,
        reputationImpact: { eleves: 30, enseignants: 15, parents: 10, academie: 5 },
        consequence: 'Succès total ! Les élèves découvrent que l\'informatique existait avant les smartphones. Le club rétro-gaming est né !',
      },
      {
        id: 'educational_focus',
        label: '📚 Focus pédagogique',
        description: 'Utiliser les jeux rétro pour enseigner l\'histoire de l\'informatique',
        budgetImpact: -500,
        scoreNIRDImpact: 20,
        dependanceImpact: -10,
        reputationImpact: { eleves: 15, enseignants: 20, academie: 15 },
        consequence: 'Les cours d\'histoire-techno cartonnent ! "Tetris était un logiciel soviétique ?!"',
      },
      {
        id: 'minimal_setup',
        label: '💻 Installation minimale',
        description: 'Mettre quelques machines en libre accès au CDI',
        budgetImpact: -200,
        scoreNIRDImpact: 10,
        dependanceImpact: -5,
        reputationImpact: { eleves: 10, enseignants: 5 },
        consequence: 'Le coin rétro du CDI devient le spot préféré de certains élèves. Nostalgie 8-bits !',
      },
      {
        id: 'refuse_retro',
        label: '❌ Refuser poliment',
        description: 'Pas le temps pour des "vieux jeux"',
        budgetImpact: 0,
        scoreNIRDImpact: -5,
        dependanceImpact: 5,
        reputationImpact: { eleves: -10, enseignants: -5 },
        consequence: 'L\'enseignant est déçu. Les élèves continuent de penser que Fortnite est le premier jeu vidéo.',
      },
    ],
  },
  // NIRD PILLAR EVENTS
  {
    id: 'linux_classroom',
    title: '🐧 Linux en Classe',
    description: 'Un enseignant de SNT propose de basculer le labo informatique sur Linux. "Les élèves apprendront les vrais principes de l\'informatique libérée !"',
    icon: '🖥️',
    type: 'opportunity',
    probability: 0.16,
    minStep: 2,
    maxStep: 8,
    choices: [
      {
        id: 'full_migration',
        label: '🐧 Migration complète Ubuntu',
        description: 'Installer Ubuntu sur tous les postes du labo',
        budgetImpact: -1000,
        scoreNIRDImpact: 35,
        dependanceImpact: -40,
        reputationImpact: { eleves: 20, enseignants: 25, academie: 15 },
        consequence: 'Révolution pédagogique ! Les élèves découvrent le monde open source. SNT devient incontournable.',
      },
      {
        id: 'dual_boot',
        label: '⚖️ Double amorçage (Linux + Windows)',
        description: 'Garder Windows par défaut, Linux comme option',
        budgetImpact: -300,
        scoreNIRDImpact: 20,
        dependanceImpact: -15,
        reputationImpact: { enseignants: 10, eleves: 10 },
        consequence: 'Transition progressive. Les curiosités testent Linux, d\'autres restent à l\'aise.',
      },
      {
        id: 'skip_linux',
        label: '❌ Maintenir Windows',
        description: 'Trop de changements, c\'est mieux de rester stable',
        budgetImpact: 0,
        scoreNIRDImpact: -10,
        dependanceImpact: 20,
        reputationImpact: { enseignants: -5, academie: -5 },
        consequence: 'Microsoft ne s\'endort pas. Frais de licence augmentent d\'année en année.',
      },
    ],
  },
  {
    id: 'commons_forge',
    title: '🔗 La Forge des Communs',
    description: 'L\'académie lance la Forge des Communs numériques éducatifs. Elle propose de mutualiser les ressources pédagogiques libres entre établissements.',
    icon: '📚',
    type: 'opportunity',
    probability: 0.14,
    minStep: 4,
    maxStep: 9,
    choices: [
      {
        id: 'lead_forge',
        label: '🌟 Devenir établissement pilote',
        description: 'Rejoindre et contribuer activement à la Forge',
        budgetImpact: -2000,
        scoreNIRDImpact: 40,
        dependanceImpact: -30,
        reputationImpact: { enseignants: 30, academie: 35, eleves: 10 },
        consequence: 'Vous devenez référent NIRD de l\'académie ! Les collègues vous imitent.',
      },
      {
        id: 'join_forge',
        label: '✅ Adhésion standard',
        description: 'Utiliser les ressources de la Forge',
        budgetImpact: -500,
        scoreNIRDImpact: 25,
        dependanceImpact: -15,
        reputationImpact: { enseignants: 15, academie: 15 },
        consequence: 'Accès à 500+ ressources libres créées par la communauté éducative.',
      },
      {
        id: 'skip_forge',
        label: '❌ Ne pas rejoindre',
        description: 'Rester autonome avec ses propres outils',
        budgetImpact: 0,
        scoreNIRDImpact: -5,
        dependanceImpact: 5,
        reputationImpact: { enseignants: -10, academie: -15 },
        consequence: 'Occasion manquée de collaboration. Les autres établissements avancent plus vite.',
      },
    ],
  },
  {
    id: 'accessibility_audit',
    title: '♿ Audit Accessibilité Numérique',
    description: 'Une association de défense des personnes en situation de handicap signale que votre site web n\'est pas accessible. WCAG 2.1 AA non respecté.',
    icon: '👥',
    type: 'crisis',
    probability: 0.13,
    minStep: 5,
    maxStep: 10,
    choices: [
      {
        id: 'full_audit',
        label: '✓ Audit complet + remédiation',
        description: 'Cabinet spécialisé pour conformité WCAG 2.1 AA',
        budgetImpact: -5000,
        scoreNIRDImpact: 30,
        dependanceImpact: 0,
        reputationImpact: { parents: 25, eleves: 15, academie: 20 },
        consequence: 'Site 100% accessible. Vous recevez des félicitations du rectorat. Tous les élèves peuvent accéder.',
      },
      {
        id: 'basic_fixes',
        label: '⚙️ Corrections essentielles',
        description: 'Contraste, textes alternatifs, navigation au clavier',
        budgetImpact: -1500,
        scoreNIRDImpact: 15,
        dependanceImpact: 0,
        reputationImpact: { parents: 10, eleves: 10 },
        consequence: 'Grandes améliorations. Pas totalement conforme mais bien mieux.',
      },
      {
        id: 'ignore_accessibility',
        label: '❌ Ignorer la demande',
        description: 'Continuer sans rien changer',
        budgetImpact: 0,
        scoreNIRDImpact: -20,
        dependanceImpact: 0,
        reputationImpact: { parents: -20, eleves: -15, academie: -20 },
        consequence: 'L\'association menace de recours juridiques. Réputation endommagée.',
      },
    ],
  },
  {
    id: 'snt_opensource_project',
    title: '💻 Projet SNT - Créer une App Libre',
    description: 'Les élèves de SNT proposent un projet ambitieux : créer une application open source pour l\'établissement (emploi du temps, absences, notes).',
    icon: '👨‍💻',
    type: 'opportunity',
    probability: 0.15,
    minStep: 5,
    maxStep: 10,
    choices: [
      {
        id: 'full_support',
        label: '🚀 Soutien complet + ressources',
        description: 'Financer le projet, former les élèves, libérer du temps enseignants',
        budgetImpact: -3500,
        scoreNIRDImpact: 45,
        dependanceImpact: -40,
        reputationImpact: { eleves: 40, enseignants: 25, academie: 30 },
        consequence: 'Chef-d\'œuvre ! L\'app est utilisée par 10 établissements. Les élèves deviennent des héros.',
      },
      {
        id: 'minimal_support',
        label: '📝 Autorisation + mentorat',
        description: 'Laisser les élèves faire sur leur temps libre avec encadrement',
        budgetImpact: -500,
        scoreNIRDImpact: 25,
        dependanceImpact: -20,
        reputationImpact: { eleves: 20, enseignants: 10 },
        consequence: 'Projet qui avance lentement mais forge des développeurs passionnés.',
      },
      {
        id: 'reject_project',
        label: '❌ Trop risqué, refuser',
        description: 'Pas le temps pour expérimenter',
        budgetImpact: 0,
        scoreNIRDImpact: -15,
        dependanceImpact: 15,
        reputationImpact: { eleves: -25, enseignants: -10 },
        consequence: 'Les élèves sont déçus. Vous venez de tuer la vocations informatique de 30 futurs devs.',
      },
    ],
  },
  {
    id: 'data_sovereignty',
    title: '🛡️ Souveraineté Numérique',
    description: 'Un audit révèle que 80% des données élèves sont hébergées chez Google, Microsoft ou Amazon. Aucune alternative de stockage local n\'existe.',
    icon: '☁️',
    type: 'crisis',
    probability: 0.12,
    minStep: 6,
    maxStep: 10,
    choices: [
      {
        id: 'nextcloud_infra',
        label: '🏠 Nextcloud auto-hébergé',
        description: 'Serveur local avec stockage et partage souverain',
        budgetImpact: -4000,
        scoreNIRDImpact: 40,
        dependanceImpact: -50,
        reputationImpact: { parents: 30, academie: 35, eleves: 10 },
        consequence: 'Vous reprenez le contrôle ! Les données ne quittent plus l\'école.',
      },
      {
        id: 'owncloud_hybrid',
        label: '🤝 Service français tiers (Atria, Scaleway)',
        description: 'Solution intermédiaire : données en France mais hosted',
        budgetImpact: -2000,
        scoreNIRDImpact: 25,
        dependanceImpact: -25,
        reputationImpact: { parents: 15, academie: 15 },
        consequence: 'Meilleur compromis : données françaises sans maintenance serveur.',
      },
      {
        id: 'keep_gafam',
        label: '☁️ Accepter Google Drive',
        description: 'Continuer avec les géants du cloud',
        budgetImpact: 0,
        scoreNIRDImpact: -20,
        dependanceImpact: 30,
        reputationImpact: { parents: -20, academie: -15 },
        consequence: 'Pratique mais RGPD fragile. Les données restent prisonnières.',
      },
    ],
  },
  {
    id: 'e_waste_program',
    title: '♻️ Programme de Récyclage E-déchets',
    description: 'Vous avez 200 vieux ordinateurs de 2010-2015 à recycler. Une ONG propose un programme de reconditionnement en Afrique de l\'Ouest.',
    icon: '🔄',
    type: 'opportunity',
    probability: 0.13,
    minStep: 3,
    maxStep: 9,
    choices: [
      {
        id: 'repair_reuse',
        label: '🔧 Reconditionnement local',
        description: 'Former des élèves à réparer et reconditionner pour d\'autres écoles',
        budgetImpact: -1000,
        scoreNIRDImpact: 35,
        dependanceImpact: -20,
        reputationImpact: { eleves: 25, enseignants: 15, academie: 15 },
        consequence: 'Projet formateur ! 100 machines réutilisées. Zéro déchet.',
      },
      {
        id: 'responsible_export',
        label: '🌍 Export responsable Afrique',
        description: 'Partenariat ONG : machines réutilisables envoyées labellisées',
        budgetImpact: -800,
        scoreNIRDImpact: 25,
        dependanceImpact: -15,
        reputationImpact: { parents: 20, academie: 20, eleves: 10 },
        consequence: 'Seconde vie pour 150 machines. Solidarité internationale.',
      },
      {
        id: 'normal_recycling',
        label: '🗑️ Recyclage standard',
        description: 'Faire recycler par prestataire local',
        budgetImpact: -500,
        scoreNIRDImpact: 10,
        dependanceImpact: 0,
        reputationImpact: {},
        consequence: 'Écologique mais pas de dimension pédagogique.',
      },
    ],
  },
];

// Get a random event based on current step
export function getRandomEvent(currentStep: number, triggeredEvents: string[]): RandomEvent | null {
  const eligibleEvents = RANDOM_EVENTS.filter(
    event =>
      currentStep >= event.minStep &&
      currentStep <= event.maxStep &&
      !triggeredEvents.includes(event.id) &&
      Math.random() < event.probability
  );

  if (eligibleEvents.length === 0) return null;

  return eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];
}

// Get event type color
export function getEventTypeColor(type: RandomEvent['type']): string {
  switch (type) {
    case 'crisis':
      return 'from-red-500 to-red-700';
    case 'opportunity':
      return 'from-green-500 to-green-700';
    case 'neutral':
      return 'from-blue-500 to-blue-700';
  }
}

// Get event type label
export function getEventTypeLabel(type: RandomEvent['type']): string {
  switch (type) {
    case 'crisis':
      return 'Crise';
    case 'opportunity':
      return 'Opportunité';
    case 'neutral':
      return 'Événement';
  }
}

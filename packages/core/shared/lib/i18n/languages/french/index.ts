const French = {
  common: {
    space: "Espace",
    save: "Enregistrer",
    done: "Terminé",
    close: "Fermer",
    reset: "Réinitialiser",
    back: "Retour",
    next: "Suivant",
    retry: "Réessayer",
    complete: "Terminer",
    start: "Commencer",
    check: "Vérifier",
    welcome: "Bienvenue",
  },

  tabs: {
    boards: "Tableaux",
    learning: "Leçons",
    practice: "Pratique",
    kana: "Kana",
    settings: "Paramètres",
    profile: "Profil",
  },

  practice: {
    question: "Question",

    modes: {
      mixed: { title: "Mixte", subtitle: "Tout à la fois" },
      testing: { title: "Test", subtitle: "Choisissez une réponse contre la montre" },
      drawing: { title: "Dessin", subtitle: "Dessinez l'Hiragana / le Katakana" },
      listening: { title: "Écoute", subtitle: "Sélectionnez la bonne réponse" },
      multipleChoice: { title: "Sélection de mot", subtitle: "Choisissez la bonne réponse" },
      matchingPairs: { title: "Paires correspondantes", subtitle: "Associez les paires de mots" },
      wordBuilding: { title: "Construction de mot", subtitle: "Formez un mot" },
      typing: { title: "Saisie", subtitle: "Tapez la syllabe" },
    },

    playAudio: "Lire l'audio",

    preferences: {
      title: "Préférences",
      autoplaySound: "Lecture automatique du son",
      questionsCount: "Nombre de questions",
      timer: "Minuteur",
      mixMode: "Mode mixte",
      timerSeconds: "Temps par question",
      seconds: "{{count}} s",
    },

    alert: {
      insufficientKanaSelected: {
        title: "Pas assez de caractères",
        subtitle:
          "Veuillez sélectionner {count} caractères Hiragana ou {count} caractères Katakana.",
      },
      insufficientBaseKanaSelected: {
        title: "Pas assez de caractères",
        subtitle:
          "Veuillez sélectionner {count} caractères Hiragana de base ou {count} caractères Katakana de base (sans dakuon, handakuon et yōon).",
      },
      insufficientWordsAvailable: {
        title: "Pas assez de mots disponibles",
        subtitle:
          "Il y a moins de mots disponibles que nécessaire. Veuillez sélectionner plus de syllabes Hiragana ou Katakana.",
      },
    },
  },

  kana: {
    hiragana: "Hiragana",
    katakana: "Katakana",
    romaji: "Romaji",

    basic: "Basique",
    dakuon: "Dakuon",
    handakuon: "Handakuon",
    yoon: "Yōon",
  },

  selectKana: {
    chooseKana: "Choisir les kana",
    words: "Mots pour la pratique",
    nothingSelected: "Rien de sélectionné",
  },

  settings: {
    logout: {
      button: "Se déconnecter",
      title: "Se déconnecter ?",
      subtitle:
        "Vous serez déconnecté et toutes les données locales sur cet appareil seront effacées.",
    },
    deleteAccount: {
      button: "Supprimer le compte",
      confirmTitle: "Voulez-vous vraiment supprimer votre compte ?",
      confirmSubtitle: "Toute votre progression et les données de votre compte seront supprimées.",
      title: "Supprimer le compte ?",
      subtitle:
        "Entrez le code à 6 chiffres que nous avons envoyé à votre e-mail. Cette action est permanente et irréversible.",
      confirm: "Supprimer le compte",
    },
    displayStatistics: "Afficher les statistiques",
    hapticFeedback: "Retour haptique",
    widgets: {
      title: "Widgets",
      statistics: "Widget des statistiques",
      social: "Widget des réseaux sociaux",
    },
    theme: {
      installed: "Installés",
      title: "Thème",
      light: "Clair",
      dark: "Sombre",
      auto: "Automatique",
    },
    language: "Langue",
    termsAndConditions: "Conditions d'utilisation",
    privacyPolicy: "Politique de confidentialité",
    contactSupport: "Contacter le support",

    rateApp: {
      title: "Évaluer l'application",
      subtitle: "Cela nous aide beaucoup",
    },

    joinOurCommunity: {
      title: "Rejoignez notre communauté",
    },

    eraseData: {
      button: "Effacer les données de l'application",
      dataTakesUp: "Données utilisées",
      title: "Êtes-vous sûr de vouloir effacer les données ?",
      subtitle:
        "Toutes les données, y compris les paramètres et la progression, seront supprimées. Cette action est irréversible.",
    },

    sourceCode: {
      title: "Code source",
      githubRepository: "Dépôt GitHub",
    },

    version: "Version",
  },

  result: {
    drawing: "Tracé",
    example: "Exemple",
    you: "Vous",

    title: "Pratique terminée",
    score: "Score",
    percent: "Pourcentage",

    sec: "sec",
    min: "min",
    errors_one: "{{count}} erreur",
    errors_many: "{{count}} erreurs",
    errors_other: "{{count}} erreurs",

    question: "question",
    questionNumber: "Q{{number}}",

    done: "Terminer",

    correct: "Correct",
    wrong: "Incorrect",
  },

  lessonsList: {
    completed: "terminé",
    failedToLoadLessons: "Échec du chargement des leçons, veuillez réessayer plus tard.",
  },

  lesson: {
    matchHiraganaWithTransliteration: "Associez l'Hiragana à la translittération.",
    matchKatakanaWithTransliteration: "Associez le Katakana à la translittération.",
    practiceEveryDay: "Pratiquez tous les jours pour consolider vos connaissances.",
    learningComplete: "Leçon terminée !",
  },

  transliterationSystems: {
    latin: "Latin",
    cyrillic: "Cyrillique",

    tags: {
      mostPopular: "La plus courante",
      officialJapan: "Officiel au Japon",
      strictest: "La plus stricte",
      russianStandard: "Standard en Russie",
    },

    romaji: "Romaji",
    transliterationSystems: "Systèmes de translittération",
    hepburn: "Hepburn",
    kunreiShiki: "Kunrei-shiki",
    nihonShiki: "Nihon-shiki",
    polivanovSystem: "Système Polivanov",
  },

  alert: {
    exitConformation: {
      title: "Êtes-vous sûr de vouloir quitter ?",
      subtitle: "Votre progression ne sera pas enregistrée si vous quittez maintenant.",
    },
    newVersion: {
      title: "Une nouvelle version est disponible.",
      subtitle:
        "Cette leçon a été créée pour une version plus récente de l'application. Veuillez mettre à jour l'application.",
    },
    cancel: "Annuler",
    ok: "OK",
    confirm: "Confirmer",
  },

  auth: {
    welcome: {
      firstStep: "Votre premier pas vers l'apprentissage du japonais !",
    },
    agreement: {
      prefix: "En continuant, vous acceptez : ",
      terms: "Conditions d'utilisation",
      privacy: "Politique de confidentialité",
    },
    continueWithGoogle: "Continuer avec Google",
    googleFailed: "Impossible de se connecter avec Google",
    googleUnavailable: {
      title: "La connexion Google n'est pas disponible en Russie",
      subtitle:
        "La connexion avec Google ne peut pas être utilisée depuis la Russie. Votre adresse IP : {{ip}}. Vous pouvez vous inscrire avec votre e-mail.",
    },
    signUpWithEmail: "S'inscrire avec un e-mail",
    alreadyHaveAccount: "Vous avez déjà un compte ?",
    login: "Se connecter",
    continueWithoutLogin: "Continuer sans se connecter",
    fields: {
      newName: "Nouveau nom",
      oldPassword: "Ancien mot de passe",
      name: "Nom",
      email: "Adresse e-mail",
      password: "Mot de passe",
      newPassword: "Nouveau mot de passe",
      repeatPassword: "Retapez le nouveau mot de passe",
      birthDate: "Date de naissance",
      code: "Code",
    },
    signIn: {
      title: "Connexion",
      submit: "Se connecter",
    },
    signUp: {
      title: "Créer un compte",
      submit: "Créer un compte",
    },
    verifyEmail: {
      title: "Vérifiez votre e-mail",
      subtitle: "Entrez le code de l'e-mail. Nous l'avons envoyé à {{email}}",
      submit: "Suivant",
      resend: "Envoyer un autre code",
      resendCooldown: "Envoyer un autre code ({{seconds}})",
    },
    resetPassword: {
      title: "Mot de passe oublié ?",
      subtitle: "Entrez votre adresse e-mail pour recevoir un code de réinitialisation.",
      changeTitle: "Modifier votre mot de passe",
      confirm: "Confirmer",
    },
    errors: {
      incorrectOldPassword: "Ancien mot de passe incorrect",
      nameTooLong: "Le nom ne doit pas dépasser 16 caractères",
      nameRequired: "Entrez votre nom",
      emailRequired: "Entrez votre e-mail",
      invalidEmail: "E-mail invalide",
      dateRequired: "Sélectionnez votre date de naissance",
      tooYoung: "L'âge minimum est de 13 ans",
      passwordMin: "Au moins 8 caractères",
      passwordLetter: "Ajoutez au moins une lettre",
      passwordDigit: "Ajoutez au moins un chiffre",
      passwordRepeat: "Répétez le mot de passe",
      passwordsMismatch: "Les mots de passe ne correspondent pas",
      emailTaken: "E-mail déjà enregistré",
      weakPassword: "Mot de passe trop faible",
      invalidDate: "Date invalide ou âge inférieur à 13 ans",
      requestFailed: "Impossible d'envoyer la demande. Veuillez réessayer plus tard.",
      somethingWrong: "Une erreur s'est produite. Veuillez réessayer plus tard.",
      codeRequired: "Entrez le code à 6 chiffres",
      invalidCode: "Code invalide",
      codeExpired: "Le code a expiré",
      tooManyAttempts: "Trop de tentatives. Demandez un nouveau code ou réessayez demain.",
      resendCooldown: "Veuillez attendre avant de demander un nouveau code",
      passwordRequired: "Entrez votre mot de passe",
      invalidCredentials: "E-mail ou mot de passe invalide",
      emailNotVerified: "E-mail non vérifié",
      useGoogleToSignIn: "Ce compte utilise la connexion Google",
      invalidResetToken: "La session de réinitialisation a expiré. Demandez un nouveau code.",
      accountMigrating: "Le compte est en cours de transfert. Veuillez réessayer plus tard.",
      serverUnavailable:
        "Le serveur de votre compte est temporairement indisponible. Veuillez réessayer plus tard.",
      tooManyRequests: "Trop de requêtes. Patientez une minute et réessayez.",
      userNotFound: "Aucun compte avec cet e-mail. Vérifiez l'adresse ou inscrivez-vous.",
      loginBlocked:
        "Trop de mots de passe incorrects. La connexion par mot de passe est bloquée pendant une heure. Réinitialisez votre mot de passe ou connectez-vous avec Google.",
      emailTakenOtherRegion: "Cet e-mail est déjà enregistré. Veuillez vous connecter.",
    },
  },
  profile: {
    stats: {
      daysOfStudy: "jours d'étude",
      timesOfPractice: "sessions d'entraînement",
    },

    avatar: {
      title: "Photo de profil",
      takePhoto: "Prendre une photo",
      chooseFromLibrary: "Choisir dans la galerie",
      remove: "Supprimer la photo",
      errors: {
        cameraPermission:
          "Accès à l'appareil photo refusé. Autorisez-le dans les réglages de l'appareil.",
        fileTooLarge: "L'image est trop lourde. Maximum 5 Mo.",
        invalidImage: "Format non pris en charge. Utilisez JPEG, PNG ou WebP.",
        storageUnavailable: "Le stockage est temporairement indisponible. Veuillez réessayer.",
        failed: "Impossible de mettre à jour la photo. Réessayez plus tard.",
      },
    },
    edit: {
      title: "Modifier le profil",
      name: "Nom",
      password: "Mot de passe",
      changeName: "Modifier le nom",
      changePassword: "Modifier le mot de passe",
    },
    signInPrompt:
      "Connectez-vous à {{app}} pour synchroniser votre progression sur tous les appareils.",
    signInButton: "Se connecter ou créer un compte",
    unavailable: {
      title: "Maintenance sur votre serveur",
      text: "Le serveur de votre compte est temporairement indisponible. Les leçons et les exercices fonctionnent, votre profil sera bientôt de retour.",
    },
    offline: {
      title: "Pas de connexion",
      text: "Impossible de joindre le serveur. Vérifiez votre connexion Internet.",
    },
  },
  debug: {
    store: "Magasin",
    deviceId: "ID de l'appareil",
    apiServers: "Serveurs API",
    notificationToken: "Jeton de notification",
    checking: "Vérification…",
    pinging: "Ping…",
    unreachable: "Indisponible",
    autoSelect: "Sélection automatique",
    addHost: "Ajouter",
    removeData: "Supprimer les données",
  },
  verbForm: {
    title: "Formes verbales :",
    teForm: "Forme て :",
    taForm: "Forme た :",
    naiForm: "Forme ない :",
    dictionaryForm: "Forme dictionnaire :",
    potentialForm: "Forme potentielle :",
    volitionalForm: "Forme volitive :",
    imperativeForm: "Forme impérative :",
    prohibitiveForm: "Forme prohibitive :",
    conditionalForm: "Forme conditionnelle - ば :",
    negativeConditionalForm: "Forme conditionnelle négative - ば :",
    passiveForm: "Voix passive :",
    verbCausative: "Forme causative :",
  },
  boards: {
    title: "Tableaux :",
    createOwn: "Créer le sien",
    myBoards: "Mes tableaux",
    publicBoards: "Tableaux publics",
    newBoard: "Nouveau tableau",
    namePlaceholder: "Nom du tableau",
    isPublic: "Tableau public",
    settingsTitle: "Paramètres du tableau",
    editors: "Éditeurs",
    noEditors: "Aucun éditeur",
    createInvite: "Créer un lien d'invitation",
    inviteUntil: "Lien à usage unique, valable jusqu'au {{date}}",
    shareLink: "Partager le lien",
    revoke: "Révoquer",
    remove: "Retirer",
    deleteBoard: "Supprimer le tableau",
    deleteTitle: "Supprimer ce tableau ?",
    deleteSubtitle: "Le tableau et toutes ses cartes seront supprimés définitivement.",
    inviteLimit: "Trop d'invitations actives",
  },
  board: {
    searchPlaceholder: "Rechercher",
    searchResults: "Recherche",
    nothingFound: "Rien trouvé",
    sectionsTitle: "Sections",
  },
  card: {
    examples: "Exemples :",
    open: "Ouvrir",
    alreadySeen: "Déjà vu",
    kanjiOrder: "Ordre des traits :",
    kanjiLevel: "Niveau :",
    kanjiDescription: "Description :",
    kanjiRadicals: "Radicaux :",
    kanjiElements: "Éléments :",
    edit: "Modifier",
    save: "Enregistrer",
    titlePlaceholder: "Titre",
    subtitlePlaceholder: "Traduction",
    examplePlaceholder: "Exemple",
    saveError: "Impossible d'enregistrer la carte",
  },
  promotionTelegram: {
    title: "Félicitations, vous avez trouvé un bug chanceux !",
    reasonSingle:
      "Puisqu'il n'y a plus tellement de bugs dans l'application, beaucoup moins de personnes visitent mon canal Telegram pour signaler des problèmes, et beaucoup moins de personnes s'abonnent à moi",
    reasonMultiple:
      "Puisqu'il n'y a plus tellement de bugs dans l'application, beaucoup moins de personnes visitent nos canaux Telegram pour signaler des problèmes, et beaucoup moins de personnes s'abonnent à nous",
    instructionTitle: "Voici ce que vous devez faire :",
    stepGo: "- Aller sur {{channel}}",
    stepSubscribeSingle: "- S'abonner (je posterai beaucoup de choses intéressantes)",
    stepSubscribeMultiple: "- S'abonner (nous posterons beaucoup de choses intéressantes)",
    dontMakeMe: "Ne me forcez pas à ajouter de vrais bugs :)",
    channelSingle: "Mon canal Telegram",
    channelMultiple: "Nos canaux Telegram",
    fixMyself: "Je le réparerai moi-même",
  },
};

export default French;

const German = {
  common: {
    space: "Leertaste",
    save: "Speichern",
    done: "Fertig",
    close: "Schließen",
    reset: "Zurücksetzen",
    back: "Zurück",
    next: "Weiter",
    retry: "Erneut versuchen",
    complete: "Abschließen",
    start: "Starten",
    check: "Prüfen",
    welcome: "Willkommen",
  },

  tabs: {
    boards: "Boards",
    learning: "Lernen",
    practice: "Üben",
    kana: "Kana",
    settings: "Einstellungen",
    profile: "Profil",
  },

  practice: {
    question: "Frage",

    modes: {
      mixed: { title: "Gemischt", subtitle: "Alles auf einmal" },
      testing: { title: "Test", subtitle: "Antwort gegen die Zeit wählen" },
      drawing: { title: "Zeichnen", subtitle: "Hiragana / Katakana zeichnen" },
      listening: { title: "Hörverstehen", subtitle: "Die richtige Antwort wählen" },
      multipleChoice: { title: "Wortauswahl", subtitle: "Die richtige Antwort wählen" },
      matchingPairs: { title: "Paare bilden", subtitle: "Wortpaare zusammenstellen" },
      wordBuilding: { title: "Wortbildung", subtitle: "Ein Wort bilden" },
      typing: { title: "Eingabe", subtitle: "Die Silbe schreiben" },
    },

    playAudio: "Audio abspielen",

    preferences: {
      title: "Einstellungen",
      autoplaySound: "Ton automatisch abspielen",
      questionsCount: "Anzahl der Fragen",
      timer: "Timer",
      mixMode: "Gemischter Modus",
      timerSeconds: "Zeit pro Frage",
      seconds: "{{count}} s",
    },

    alert: {
      insufficientKanaSelected: {
        title: "Nicht genug Zeichen",
        subtitle: "Bitte wähle {count} Hiragana-Zeichen oder {count} Katakana-Zeichen aus.",
      },
      insufficientBaseKanaSelected: {
        title: "Nicht genug Zeichen",
        subtitle:
          "Bitte wähle {count} grundlegende Hiragana- oder {count} grundlegende Katakana-Zeichen aus (ohne Dakuten, Handakuten und Yōon).",
      },
      insufficientWordsAvailable: {
        title: "Nicht genug verfügbare Wörter",
        subtitle:
          "Es sind weniger Wörter verfügbar als benötigt. Bitte wähle mehr Hiragana- oder Katakana-Silben aus.",
      },
    },
  },

  kana: {
    hiragana: "Hiragana",
    katakana: "Katakana",
    romaji: "Romaji",

    basic: "Grundformen",
    dakuon: "Dakuon",
    handakuon: "Handakuon",
    yoon: "Yōon",
  },

  selectKana: {
    chooseKana: "Kana auswählen",
    words: "Wörter",
    nothingSelected: "Nichts ausgewählt",
  },

  settings: {
    logout: {
      button: "Abmelden",
      title: "Abmelden?",
      subtitle: "Du wirst abgemeldet und alle lokalen Daten auf diesem Gerät werden gelöscht.",
    },
    deleteAccount: {
      button: "Konto löschen",
      confirmTitle: "Möchtest du dein Konto wirklich löschen?",
      confirmSubtitle: "Dein gesamter Fortschritt und alle Kontodaten werden damit gelöscht.",
      title: "Konto löschen?",
      subtitle:
        "Gib den 6-stelligen Code aus der E-Mail ein. Diese Aktion ist unwiderruflich – Konto und alle Daten werden gelöscht.",
      confirm: "Konto löschen",
    },
    displayStatistics: "Statistiken anzeigen",
    hapticFeedback: "Haptisches Feedback",
    widgets: {
      title: "Widgets",
      statistics: "Statistik-Widget",
      social: "Social-Media-Widget",
    },
    theme: {
      installed: "Installiert",
      title: "Design",
      light: "Hell",
      dark: "Dunkel",
      auto: "Automatisch",
    },
    language: "Sprache",
    termsAndConditions: "Nutzungsbedingungen",
    privacyPolicy: "Datenschutzerklärung",
    contactSupport: "Support kontaktieren",

    rateApp: {
      title: "App bewerten",
      subtitle: "Das hilft uns wirklich sehr",
    },

    joinOurCommunity: {
      title: "Tritt unserer Community bei",
    },

    eraseData: {
      button: "App-Daten löschen",
      dataTakesUp: "Daten belegen",
      title: "Bist du sicher, dass du die Daten löschen möchtest?",
      subtitle:
        "Alle gespeicherten Daten, einschließlich Einstellungen und Fortschritt, werden gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.",
    },

    sourceCode: {
      title: "Quellcode",
      githubRepository: "GitHub-Repository",
    },

    version: "Version",
  },

  result: {
    drawing: "Zeichnen",
    example: "Beispiel",
    you: "Du",

    title: "Übung beendet",
    score: "Punkte",
    percent: "Prozent",

    sec: "Sek",
    min: "Min",
    errors_one: "{{count}} Fehler",
    errors_other: "{{count}} Fehler",

    question: "Frage",
    questionNumber: "Nr. {{number}}",

    done: "Fertig",

    correct: "Richtig",
    wrong: "Falsch",
  },

  lessonsList: {
    completed: "abgeschlossen",
    failedToLoadLessons: "Lektionen konnten nicht geladen werden, bitte versuche es später erneut.",
  },

  lesson: {
    matchHiraganaWithTransliteration: "Ordne Hiragana der Transliteration zu.",
    matchKatakanaWithTransliteration: "Ordne Katakana der Transliteration zu.",
    practiceEveryDay: "Übe jeden Tag, um dein Wissen zu festigen.",
    learningComplete: "Lektion abgeschlossen!",
  },

  transliterationSystems: {
    latin: "Lateinisch",
    cyrillic: "Kyrillisch",

    tags: {
      mostPopular: "Am beliebtesten",
      officialJapan: "Offiziell in Japan",
      strictest: "Am striktesten",
      russianStandard: "Standard in Russland",
    },

    romaji: "Romaji",
    transliterationSystems: "Transliterationssysteme",
    hepburn: "Hepburn",
    kunreiShiki: "Kunrei-shiki",
    nihonShiki: "Nihon-shiki",
    polivanovSystem: "Polivanov-System",
  },

  alert: {
    exitConformation: {
      title: "Bist du sicher, dass du beenden möchtest?",
      subtitle: "Dein Fortschritt wird nicht gespeichert, wenn du jetzt beendest.",
    },
    newVersion: {
      title: "Eine neue Version ist verfügbar.",
      subtitle:
        "Diese Lektion wurde für eine neuere App-Version erstellt. Bitte aktualisiere die App.",
    },
    cancel: "Abbrechen",
    ok: "OK",
    confirm: "Bestätigen",
  },

  auth: {
    welcome: {
      firstStep: "Dein erster Schritt zum Japanischlernen!",
    },
    agreement: {
      prefix: "Indem du fortfährst, akzeptierst du: ",
      terms: "Nutzungsbedingungen",
      privacy: "Datenschutzerklärung",
    },
    continueWithGoogle: "Mit Google fortfahren",
    googleFailed: "Anmeldung mit Google fehlgeschlagen",
    googleUnavailable: {
      title: "Google-Anmeldung ist in Russland nicht verfügbar",
      subtitle:
        "Die Google-Anmeldung kann aus Russland nicht genutzt werden. Deine IP-Adresse: {{ip}}. Du kannst dich stattdessen mit E-Mail registrieren.",
    },
    signUpWithEmail: "Mit E-Mail registrieren",
    alreadyHaveAccount: "Hast du bereits ein Konto?",
    login: "Anmelden",
    continueWithoutLogin: "Ohne Anmeldung fortfahren",
    fields: {
      newName: "Neuer Name",
      oldPassword: "Altes Passwort",
      name: "Name",
      email: "E-Mail-Adresse",
      password: "Passwort",
      newPassword: "Neues Passwort",
      repeatPassword: "Neues Passwort wiederholen",
      birthDate: "Geburtsdatum",
      code: "Code",
    },
    signIn: {
      title: "Anmelden",
      submit: "Anmelden",
    },
    signUp: {
      title: "Konto erstellen",
      submit: "Konto erstellen",
    },
    verifyEmail: {
      title: "E-Mail bestätigen",
      subtitle: "Gib den Code aus der E-Mail ein. Wir haben ihn an {{email}} gesendet",
      submit: "Weiter",
      resend: "Neuen Code senden",
      resendCooldown: "Neuen Code senden ({{seconds}})",
    },
    resetPassword: {
      title: "Passwort vergessen?",
      subtitle:
        "Gib deine E-Mail-Adresse ein, um einen Code zum Zurücksetzen des Passworts zu erhalten.",
      changeTitle: "Passwort ändern",
      confirm: "Bestätigen",
    },
    errors: {
      incorrectOldPassword: "Altes Passwort ist falsch",
      nameTooLong: "Name darf höchstens 16 Zeichen lang sein",
      nameRequired: "Gib deinen Namen ein",
      emailRequired: "Gib deine E-Mail ein",
      invalidEmail: "Ungültige E-Mail",
      dateRequired: "Gib dein Geburtsdatum an",
      tooYoung: "Mindestalter ist 13 Jahre",
      passwordMin: "Mindestens 8 Zeichen",
      passwordLetter: "Mindestens ein Buchstabe erforderlich",
      passwordDigit: "Mindestens eine Ziffer erforderlich",
      passwordRepeat: "Passwort wiederholen",
      passwordsMismatch: "Passwörter stimmen nicht überein",
      emailTaken: "E-Mail bereits registriert",
      weakPassword: "Passwort ist zu schwach",
      invalidDate: "Ungültiges Datum oder Alter unter 13",
      requestFailed: "Anfrage konnte nicht gesendet werden. Bitte versuche es später erneut.",
      somethingWrong: "Etwas ist schiefgelaufen. Bitte versuche es später erneut.",
      codeRequired: "Gib den 6-stelligen Code ein",
      invalidCode: "Ungültiger Code",
      codeExpired: "Code ist abgelaufen",
      tooManyAttempts:
        "Zu viele Versuche. Fordere einen neuen Code an oder versuche es morgen erneut.",
      resendCooldown: "Bitte warte, bevor du einen neuen Code anforderst",
      passwordRequired: "Gib dein Passwort ein",
      invalidCredentials: "Ungültige E-Mail oder Passwort",
      emailNotVerified: "E-Mail ist nicht bestätigt",
      useGoogleToSignIn: "Dieses Konto verwendet die Google-Anmeldung",
      invalidResetToken: "Zurücksetzungs-Sitzung abgelaufen. Fordere einen neuen Code an.",
      accountMigrating: "Konto wird übertragen. Bitte versuche es später erneut.",
      serverUnavailable:
        "Der Server deines Kontos ist vorübergehend nicht erreichbar. Bitte versuche es später erneut.",
      tooManyRequests: "Zu viele Anfragen. Bitte warte eine Minute und versuche es erneut.",
      userNotFound: "Kein Konto mit dieser E-Mail. Prüfe die Adresse oder registriere dich.",
      loginBlocked:
        "Zu viele falsche Passwörter. Die Anmeldung mit Passwort ist für eine Stunde gesperrt. Setze dein Passwort zurück oder melde dich mit Google an.",
      emailTakenOtherRegion: "Diese E-Mail ist bereits registriert. Bitte melde dich an.",
    },
  },
  profile: {
    widgets: {
      hide: "Widget ausblenden",
    },

    stats: {
      daysOfStudy: "Lerntage",
      timesOfPractice: "Übungen",
    },

    avatar: {
      title: "Profilbild",
      takePhoto: "Foto aufnehmen",
      chooseFromLibrary: "Aus der Galerie wählen",
      remove: "Foto entfernen",
      errors: {
        cameraPermission: "Kein Zugriff auf die Kamera. Erlaube ihn in den Geräteeinstellungen.",
        fileTooLarge: "Das Bild ist zu groß. Maximal 5 MB.",
        invalidImage: "Nicht unterstütztes Format. Verwende JPEG, PNG oder WebP.",
        storageUnavailable:
          "Der Speicher ist vorübergehend nicht verfügbar. Bitte versuche es erneut.",
        failed: "Foto konnte nicht aktualisiert werden. Bitte versuche es später erneut.",
      },
    },
    edit: {
      title: "Profil bearbeiten",
      name: "Name",
      password: "Passwort",
      changeName: "Name ändern",
      changePassword: "Passwort ändern",
    },
    signInPrompt:
      "Melde dich bei {{app}} an, um deinen Fortschritt auf allen Geräten zu synchronisieren.",
    signInButton: "Anmelden oder Konto erstellen",
    unavailable: {
      title: "Wartungsarbeiten an deinem Server",
      text: "Der Server deines Kontos ist vorübergehend nicht erreichbar. Lektionen und Übungen funktionieren weiter, dein Profil ist bald wieder da.",
    },
    offline: {
      title: "Keine Verbindung",
      text: "Der Server ist nicht erreichbar. Prüfe deine Internetverbindung.",
    },
  },
  debug: {
    store: "Store",
    deviceId: "Geräte-ID",
    apiServers: "API-Server",
    notificationToken: "Benachrichtigungs-Token",
    checking: "prüfe…",
    pinging: "pinge…",
    unreachable: "nicht erreichbar",
    autoSelect: "Automatisch auswählen",
    addHost: "Hinzufügen",
    removeData: "Daten löschen",
  },
  verbForm: {
    title: "Verbformen:",
    teForm: "て-Form:",
    taForm: "た-Form:",
    naiForm: "ない-Form:",
    dictionaryForm: "Wörterbuchform:",
    potentialForm: "Potenzialform:",
    volitionalForm: "Volitivform:",
    imperativeForm: "Imperativ:",
    prohibitiveForm: "Prohibitivform:",
    conditionalForm: "Konditionalform - ば:",
    negativeConditionalForm: "Negative Konditionalform - ば:",
    passiveForm: "Passiv:",
    verbCausative: "Kausativform:",
  },
  boards: {
    title: "Boards:",
    createOwn: "Eigenes erstellen",
    myBoards: "Meine Boards",
    publicBoards: "Öffentliche Boards",
    newBoard: "Neues Board",
    namePlaceholder: "Board-Name",
    isPublic: "Öffentliches Board",
    settingsTitle: "Board-Einstellungen",
    editors: "Bearbeiter",
    noEditors: "Noch keine Bearbeiter",
    createInvite: "Einladungslink erstellen",
    inviteUntil: "Einmal-Link, gültig bis {{date}}",
    shareLink: "Link teilen",
    revoke: "Widerrufen",
    remove: "Entfernen",
    deleteBoard: "Board löschen",
    deleteTitle: "Dieses Board löschen?",
    deleteSubtitle: "Das Board und alle Karten werden endgültig gelöscht.",
    inviteLimit: "Zu viele aktive Einladungen",
  },
  board: {
    searchPlaceholder: "Suche",
    searchResults: "Suchergebnisse",
    nothingFound: "Nichts gefunden",
    sectionsTitle: "Abschnitte",
  },
  card: {
    examples: "Beispiele:",
    open: "Öffnen",
    alreadySeen: "Bereits gesehen",
    kanjiOrder: "Schreibreihenfolge:",
    kanjiLevel: "Niveau:",
    kanjiDescription: "Beschreibung:",
    kanjiRadicals: "Radikale:",
    kanjiElements: "Elemente:",
    edit: "Bearbeiten",
    save: "Speichern",
    titlePlaceholder: "Titel",
    subtitlePlaceholder: "Übersetzung",
    examplePlaceholder: "Beispiel",
    saveError: "Karte konnte nicht gespeichert werden",
  },
  promotionTelegram: {
    title: "Glückwunsch, du hast einen Glücksbug gefunden!",
    reasonSingle:
      "Da es in der App nicht mehr so viele Bugs gibt, schauen viel weniger Leute in meinen Telegram-Kanal, um Probleme zu melden, und viel weniger Leute abonnieren mich",
    reasonMultiple:
      "Da es in der App nicht mehr so viele Bugs gibt, schauen viel weniger Leute in unsere Telegram-Kanäle, um Probleme zu melden, und viel weniger Leute abonnieren uns",
    instructionTitle: "So gehst du vor:",
    stepGo: "- Gehe zu {{channel}}",
    stepSubscribeSingle: "- Abonnieren (ich poste viel Interessantes)",
    stepSubscribeMultiple: "- Abonnieren (wir posten viel Interessantes)",
    dontMakeMe: "Zwing mich nicht, echte Bugs einzubauen :)",
    channelSingle: "Mein Telegram-Kanal",
    channelMultiple: "Unsere Telegram-Kanäle",
    fixMyself: "Ich repariere es selbst",
  },
};

export default German;

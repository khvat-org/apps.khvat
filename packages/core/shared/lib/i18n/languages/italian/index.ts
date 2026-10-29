const Italian = {
  common: {
    space: "Spazio",
    save: "Salva",
    done: "Fatto",
    close: "Chiudi",
    reset: "Reimposta",
    back: "Indietro",
    next: "Avanti",
    retry: "Riprova",
    complete: "Completa",
    start: "Inizia",
    check: "Controlla",
    welcome: "Benvenuto",
  },

  tabs: {
    boards: "Bacheche",
    learning: "Lezioni",
    practice: "Pratica",
    kana: "Kana",
    settings: "Impostazioni",
    profile: "Profilo",
  },

  practice: {
    question: "Domanda",

    modes: {
      mixed: { title: "Misto", subtitle: "Tutto insieme" },
      testing: { title: "Test", subtitle: "Scegli una risposta a tempo" },
      drawing: { title: "Disegno", subtitle: "Disegna hiragana / katakana" },
      listening: { title: "Ascolto", subtitle: "Scegli la risposta corretta" },
      multipleChoice: { title: "Selezione della parola", subtitle: "Scegli la risposta corretta" },
      matchingPairs: { title: "Abbinamento di coppie", subtitle: "Abbina le coppie di parole" },
      wordBuilding: { title: "Costruzione di parole", subtitle: "Forma una parola" },
      typing: { title: "Digitazione", subtitle: "Scrivi la sillaba" },
    },

    playAudio: "Riproduci audio",

    preferences: {
      title: "Preferenze",
      autoplaySound: "Audio automatico",
      questionsCount: "Numero di domande",
      timer: "Timer",
      mixMode: "Modalità mista",
      timerSeconds: "Tempo per domanda",
      seconds: "{{count}} s",
    },

    alert: {
      insufficientKanaSelected: {
        title: "Caratteri insufficienti",
        subtitle: "Seleziona {count} caratteri hiragana o {count} caratteri katakana.",
      },
      insufficientWordsAvailable: {
        title: "Parole insufficienti",
        subtitle:
          "Ci sono meno parole disponibili di quelle richieste. Seleziona più sillabe di hiragana o katakana.",
      },
    },
  },

  kana: {
    hiragana: "Hiragana",
    katakana: "Katakana",
    romaji: "Romaji",

    basic: "Base",
    dakuon: "Dakuon",
    handakuon: "Handakuon",
    yoon: "Yoon",
  },

  selectKana: {
    chooseKana: "Scegli i kana",
    words: "Parole",
    nothingSelected: "Niente selezionato",
  },

  settings: {
    logout: {
      button: "Esci",
      title: "Vuoi uscire dall'account?",
      subtitle:
        "Verrai disconnesso e tutti i dati locali su questo dispositivo verranno eliminati.",
    },
    deleteAccount: {
      button: "Elimina account",
      confirmTitle: "Vuoi davvero eliminare il tuo account?",
      confirmSubtitle: "Tutti i tuoi progressi e i dati del tuo account verranno eliminati.",
      title: "Eliminare l'account?",
      subtitle:
        "Inserisci il codice a 6 cifre che ti abbiamo inviato via email. Questa azione è permanente e irreversibile.",
      confirm: "Elimina",
    },
    displayStatistics: "Mostra statistiche",
    hapticFeedback: "Feedback aptico",
    widgets: {
      title: "Widget",
      statistics: "Widget delle statistiche",
      social: "Widget dei social",
    },
    theme: {
      installed: "Installati",
      title: "Tema",
      light: "Chiaro",
      dark: "Scuro",
      auto: "Automatico",
    },
    language: "Lingua",
    privacyPolicy: "Informativa sulla privacy",
    termsAndConditions: "Termini e condizioni",
    contactSupport: "Contatta il supporto",

    rateApp: {
      title: "Valuta l'app",
      subtitle: "Ci aiuta davvero tanto",
    },

    joinOurCommunity: {
      title: "Unisciti alla nostra community",
    },

    eraseData: {
      button: "Cancella dati dell'app",
      dataTakesUp: "Dati utilizzati",
      title: "Sei sicuro di voler cancellare i dati?",
      subtitle:
        "Tutti i dati salvati, comprese impostazioni e progressi, verranno eliminati. Questa azione è irreversibile.",
    },

    sourceCode: {
      title: "Codice sorgente",
      githubRepository: "Repository GitHub",
    },

    version: "Versione",
  },

  result: {
    drawing: "Disegno",
    example: "Esempio",
    you: "Tu",

    title: "Pratica completata",
    score: "Punti",
    percent: "Riuscita",

    sec: "sec",
    min: "min",
    errors_one: "{{count}} errore",
    errors_many: "{{count}} errori",
    errors_other: "{{count}} errori",

    question: "domanda",
    questionNumber: "D{{number}}",

    done: "Fine",

    correct: "Corretto",
    wrong: "Sbagliato",
  },

  lessonsList: {
    failedToLoadLessons: "Impossibile caricare le lezioni, riprova più tardi.",
    completed: "completato",
  },

  lesson: {
    matchHiraganaWithTransliteration: "Abbina l'hiragana alla traslitterazione.",
    matchKatakanaWithTransliteration: "Abbina il katakana alla traslitterazione.",
    practiceEveryDay: "Pratica ogni giorno per consolidare le tue conoscenze.",
    learningComplete: "Lezione completata!",
  },

  transliterationSystems: {
    latin: "Latino",
    cyrillic: "Cirillico",

    tags: {
      mostPopular: "La più diffusa",
      officialJapan: "Ufficiale in Giappone",
      strictest: "La più rigorosa",
      russianStandard: "Standard in Russia",
    },

    romaji: "Romaji",
    transliterationSystems: "Sistemi di traslitterazione",
    hepburn: "Hepburn",
    kunreiShiki: "Kunrei-shiki",
    nihonShiki: "Nihon-shiki",
    polivanovSystem: "Sistema Polivanov",
  },

  alert: {
    exitConformation: {
      title: "Sei sicuro di voler uscire?",
      subtitle: "I tuoi progressi non verranno salvati se esci adesso.",
    },
    newVersion: {
      title: "È disponibile una nuova versione.",
      subtitle:
        "Questa lezione è stata creata per una versione più recente dell'app. Aggiorna l'applicazione.",
    },
    cancel: "Annulla",
    ok: "OK",
    confirm: "Conferma",
  },

  auth: {
    welcome: {
      firstStep: "Il tuo primo passo verso lo studio del giapponese!",
    },
    agreement: {
      prefix: "Continuando, accetti: ",
      terms: "Termini di servizio",
      privacy: "Informativa sulla privacy",
    },
    continueWithGoogle: "Continua con Google",
    googleFailed: "Impossibile accedere con Google",
    googleUnavailable: {
      title: "L'accesso con Google non è disponibile in Russia",
      subtitle:
        "L'accesso con Google non può essere usato dalla Russia. Il tuo indirizzo IP: {{ip}}. Puoi registrarti con l'email.",
    },
    signUpWithEmail: "Registrati con email",
    alreadyHaveAccount: "Hai già un account?",
    login: "Accedi",
    continueWithoutLogin: "Continua senza accedere",
    fields: {
      newName: "Nuovo nome",
      oldPassword: "Vecchia password",
      name: "Nome",
      email: "Indirizzo email",
      password: "Password",
      newPassword: "Nuova password",
      repeatPassword: "Ripeti la nuova password",
      birthDate: "Data di nascita",
      code: "Codice",
    },
    signIn: {
      title: "Accesso",
      submit: "Accedi",
    },
    signUp: {
      title: "Crea un account",
      submit: "Crea account",
    },
    verifyEmail: {
      title: "Verifica la tua email",
      subtitle: "Inserisci il codice ricevuto via email. L'abbiamo inviato a {{email}}",
      submit: "Avanti",
      resend: "Invia un altro codice",
      resendCooldown: "Invia un altro codice ({{seconds}})",
    },
    resetPassword: {
      title: "Password dimenticata?",
      subtitle:
        "Inserisci il tuo indirizzo email per ricevere un codice di reimpostazione della password.",
      changeTitle: "Cambia la password",
      confirm: "Conferma",
    },
    errors: {
      incorrectOldPassword: "Vecchia password errata",
      nameTooLong: "Il nome può avere al massimo 16 caratteri",
      nameRequired: "Inserisci il nome",
      emailRequired: "Inserisci l'email",
      invalidEmail: "Email non valida",
      dateRequired: "Seleziona la data di nascita",
      tooYoung: "Età minima 13 anni",
      passwordMin: "Almeno 8 caratteri",
      passwordLetter: "Aggiungi almeno una lettera",
      passwordDigit: "Aggiungi almeno una cifra",
      passwordRepeat: "Ripeti la password",
      passwordsMismatch: "Le password non coincidono",
      emailTaken: "Email già registrata",
      weakPassword: "Password troppo debole",
      invalidDate: "Data non valida o età inferiore a 13 anni",
      requestFailed: "Impossibile inviare la richiesta. Riprova più tardi.",
      somethingWrong: "Qualcosa è andato storto. Riprova più tardi.",
      codeRequired: "Inserisci il codice a 6 cifre",
      invalidCode: "Codice non valido",
      codeExpired: "Il codice è scaduto",
      tooManyAttempts: "Troppi tentativi. Richiedi un nuovo codice o riprova domani.",
      resendCooldown: "Attendi prima di richiedere un nuovo codice",
      passwordRequired: "Inserisci la password",
      invalidCredentials: "Email o password non validi",
      emailNotVerified: "Email non verificata",
      useGoogleToSignIn: "Questo account usa l'accesso con Google",
      invalidResetToken: "Sessione di reimpostazione scaduta. Richiedi un nuovo codice.",
      accountMigrating: "Account in fase di trasferimento. Riprova più tardi.",
      serverUnavailable:
        "Il server del tuo account è temporaneamente non disponibile. Riprova più tardi.",
      tooManyRequests: "Troppe richieste. Attendi un minuto e riprova.",
      userNotFound: "Nessun account con questa email. Controlla l'indirizzo o registrati.",
      loginBlocked:
        "Troppe password errate. L'accesso con password è bloccato per un'ora. Reimposta la password o accedi con Google.",
      emailTakenOtherRegion: "Questa email è già registrata. Accedi.",
    },
  },
  profile: {
    widgets: {
      hide: "Nascondi widget",
    },

    stats: {
      daysOfStudy: "giorni di studio",
      timesOfPractice: "sessioni di pratica",
    },

    avatar: {
      title: "Foto del profilo",
      takePhoto: "Scatta una foto",
      chooseFromLibrary: "Scegli dalla galleria",
      remove: "Rimuovi foto",
      errors: {
        cameraPermission:
          "Accesso alla fotocamera negato. Consentilo nelle impostazioni del dispositivo.",
        fileTooLarge: "L'immagine è troppo grande. Massimo 5 MB.",
        invalidImage: "Formato non supportato. Usa JPEG, PNG o WebP.",
        storageUnavailable: "L'archivio è temporaneamente non disponibile. Riprova.",
        failed: "Impossibile aggiornare la foto. Riprova più tardi.",
      },
    },
    edit: {
      title: "Modifica profilo",
      name: "Nome",
      password: "Password",
      changeName: "Cambia nome",
      changePassword: "Cambia password",
    },
    signInPrompt: "Accedi a {{app}} per sincronizzare i progressi su tutti i dispositivi.",
    signInButton: "Accedi o crea un account",
    unavailable: {
      title: "Manutenzione sul tuo server",
      text: "Il server del tuo account è temporaneamente non disponibile. Lezioni ed esercizi funzionano, il profilo tornerà presto.",
    },
    offline: {
      title: "Nessuna connessione",
      text: "Impossibile raggiungere il server. Controlla la connessione a Internet.",
    },
  },
  debug: {
    store: "Store",
    deviceId: "ID dispositivo",
    apiServers: "Server API",
    notificationToken: "Token notifiche",
    checking: "controllo…",
    pinging: "ping…",
    unreachable: "non raggiungibile",
    autoSelect: "Seleziona automaticamente",
    addHost: "Aggiungi",
    removeData: "Cancella dati",
  },
  verbForm: {
    title: "Forme del verbo:",
    teForm: "Forma て:",
    taForm: "Forma た:",
    naiForm: "Forma ない:",
    dictionaryForm: "Forma del dizionario:",
    potentialForm: "Forma potenziale:",
    volitionalForm: "Forma volitiva:",
    imperativeForm: "Forma imperativa:",
    prohibitiveForm: "Forma proibitiva:",
    conditionalForm: "Forma condizionale - ば:",
    negativeConditionalForm: "Forma condizionale negativa - ば:",
    passiveForm: "Forma passiva:",
    verbCausative: "Forma causativa:",
  },
  boards: {
    title: "Bacheche:",
    createOwn: "Crea la tua",
    myBoards: "Le mie bacheche",
    publicBoards: "Bacheche pubbliche",
    newBoard: "Nuova bacheca",
    namePlaceholder: "Nome della bacheca",
    isPublic: "Bacheca pubblica",
    settingsTitle: "Impostazioni bacheca",
    editors: "Editori",
    noEditors: "Nessun editore",
    createInvite: "Crea link di invito",
    inviteUntil: "Link monouso, valido fino al {{date}}",
    shareLink: "Condividi link",
    revoke: "Revoca",
    remove: "Rimuovi",
    deleteBoard: "Elimina bacheca",
    deleteTitle: "Eliminare questa bacheca?",
    deleteSubtitle: "La bacheca e tutte le sue carte saranno eliminate definitivamente.",
    inviteLimit: "Troppi inviti attivi",
  },
  board: {
    searchPlaceholder: "Cerca",
    searchResults: "Ricerca",
    nothingFound: "Nessun risultato",
    sectionsTitle: "Sezioni",
    cardView: "Vista schede",
    tags: "Tag",
    images: "Immagini",
    columns: "Schede per riga",
    settingsLabel: "Impostazioni",
    lessonsLabel: "Lezioni",
    cardsLabel: "Schede",
    bookmarks: "Salvate",
    sectionsLabel: "Sezioni",
    bookmarksEmpty: "Qui appariranno le schede che salvi",
  },
  card: {
    examples: "Esempi:",
    open: "Apri",
    alreadySeen: "Già visto",
    kanjiOrder: "Ordine dei tratti:",
    kanjiLevel: "Livello:",
    kanjiDescription: "Descrizione:",
    kanjiRadicals: "Radicali:",
    kanjiElements: "Elementi:",
    edit: "Modifica",
    save: "Salva",
    titlePlaceholder: "Titolo",
    subtitlePlaceholder: "Traduzione",
    examplePlaceholder: "Esempio",
    saveError: "Impossibile salvare la carta",
    bookmarkAdd: "Salva",
    bookmarkRemove: "Rimuovi",
  },
  promotionTelegram: {
    title: "Congratulazioni, hai trovato un bug fortunato!",
    reasonSingle:
      "Dato che nell'app non ci sono più così tanti bug, molte meno persone vengono sul mio canale Telegram per segnalare problemi e molte meno persone si iscrivono",
    reasonMultiple:
      "Dato che nell'app non ci sono più così tanti bug, molte meno persone vengono sui nostri canali Telegram per segnalare problemi e molte meno persone si iscrivono",
    instructionTitle: "Ecco cosa devi fare:",
    stepGo: "- Vai su {{channel}}",
    stepSubscribeSingle: "- Iscriviti (pubblicherò un sacco di cose interessanti)",
    stepSubscribeMultiple: "- Iscriviti (pubblicheremo un sacco di cose interessanti)",
    dontMakeMe: "Non farmi aggiungere veri bug :)",
    channelSingle: "Il mio canale Telegram",
    channelMultiple: "I nostri canali Telegram",
    fixMyself: "Lo sistemo da solo",
  },

  report: {
    title: "Segnala un errore",
    subtitle: "Cosa non va in questa domanda? Lo correggeremo subito.",
    placeholder: "Testo",
    upload: "Carica",
    send: "Invia",
    success: {
      title: "Grazie!",
      subtitle: "Abbiamo ricevuto la tua segnalazione e correggeremo l'errore.",
    },
    errors: {
      too_large: "Le immagini sono troppo grandi. Prova a rimuoverne alcune.",
      rate_limited: "Troppe segnalazioni. Riprova più tardi.",
      unavailable: "Impossibile inviare la segnalazione. Riprova più tardi.",
      invalid: "Qualcosa è andato storto. Riprova.",
    },
    tags: {
      grammatical_typo: "Errore di battitura",
      interface_error: "Errore dell'interfaccia",
      incorrect_information: "Informazione errata",
      answer_marked_wrong: "Risposta corretta non accettata",
      incorrect_character: "Carattere errato",
      other: "Altro",
    },
  },
};

export default Italian;

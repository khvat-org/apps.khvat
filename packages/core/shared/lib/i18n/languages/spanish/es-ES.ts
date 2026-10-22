const SpanishES = {
  common: {
    space: "Espacio",
    save: "Guardar",
    done: "Hecho",
    close: "Cerrar",
    reset: "Restablecer",
    back: "Atrás",
    next: "Siguiente",
    retry: "Reintentar",
    complete: "Completar",
    start: "Empezar",
    check: "Comprobar",
    welcome: "Bienvenido",
  },

  tabs: {
    boards: "Tableros",
    learning: "Lecciones",
    practice: "Práctica",
    kana: "Kana",
    settings: "Ajustes",
    profile: "Perfil",
  },

  practice: {
    question: "Pregunta",

    modes: {
      mixed: { title: "Mixto", subtitle: "Todo a la vez" },
      testing: { title: "Prueba", subtitle: "Elige una respuesta a contrarreloj" },
      drawing: { title: "Dibujo", subtitle: "Dibuja el hiragana / katakana" },
      listening: { title: "Audición", subtitle: "Selecciona la respuesta correcta" },
      multipleChoice: { title: "Selección de palabra", subtitle: "Elige la respuesta correcta" },
      matchingPairs: { title: "Emparejar pares", subtitle: "Empareja pares de palabras" },
      wordBuilding: { title: "Formar palabra", subtitle: "Forma una palabra" },
      typing: { title: "Escritura", subtitle: "Escribe la sílaba" },
    },

    playAudio: "Reproducir audio",

    preferences: {
      title: "Preferencias",
      autoplaySound: "Reproducir sonido automáticamente",
      questionsCount: "Número de preguntas",
      timer: "Temporizador",
      mixMode: "Modo mixto",
      timerSeconds: "Tiempo por pregunta",
      seconds: "{{count}} s",
    },

    alert: {
      insufficientKanaSelected: {
        title: "No hay suficientes caracteres",
        subtitle:
          "Por favor, selecciona {count} caracteres de hiragana o {count} caracteres de katakana.",
      },
      insufficientBaseKanaSelected: {
        title: "No hay suficientes caracteres",
        subtitle:
          "Por favor, selecciona {count} caracteres básicos de hiragana o {count} caracteres básicos de katakana (sin dakuon, handakuon ni yōon).",
      },
      insufficientWordsAvailable: {
        title: "No hay suficientes palabras disponibles",
        subtitle:
          "Hay menos palabras disponibles de las necesarias. Selecciona más sílabas de hiragana o katakana.",
      },
    },
  },

  kana: {
    hiragana: "Hiragana",
    katakana: "Katakana",
    romaji: "Romaji",

    basic: "Básico",
    dakuon: "Dakuon",
    handakuon: "Handakuon",
    yoon: "Yoon",
  },

  selectKana: {
    chooseKana: "Elegir kana",
    words: "Palabras",
    nothingSelected: "Nada seleccionado",
  },

  settings: {
    logout: {
      button: "Cerrar sesión",
      title: "¿Cerrar sesión?",
      subtitle: "Se cerrará la sesión y se eliminarán todos los datos locales de este dispositivo.",
    },
    deleteAccount: {
      button: "Eliminar cuenta",
      confirmTitle: "¿Seguro que quieres eliminar tu cuenta?",
      confirmSubtitle: "Se eliminarán todo tu progreso y los datos de tu cuenta.",
      title: "¿Eliminar cuenta?",
      subtitle:
        "Introduce el código de 6 dígitos que te enviamos por correo. Esta acción es permanente e irreversible.",
      confirm: "Eliminar cuenta",
    },
    displayStatistics: "Mostrar estadísticas",
    hapticFeedback: "Retroalimentación háptica",
    widgets: {
      title: "Widgets",
      statistics: "Widget de estadísticas",
      social: "Widget de redes sociales",
    },
    theme: {
      installed: "Instalados",
      title: "Tema",
      light: "Claro",
      dark: "Oscuro",
      auto: "Automático",
    },
    language: "Idioma",
    termsAndConditions: "Términos y condiciones",
    privacyPolicy: "Política de privacidad",
    contactSupport: "Contactar con soporte",

    rateApp: {
      title: "Valorar la aplicación",
      subtitle: "Nos ayuda mucho",
    },

    joinOurCommunity: {
      title: "Únete a nuestra comunidad",
    },

    eraseData: {
      button: "Borrar datos de la aplicación",
      dataTakesUp: "Los datos ocupan",
      title: "¿Estás seguro de que quieres borrar los datos?",
      subtitle:
        "Se eliminarán todos los datos, incluidos los ajustes y el progreso. Esta acción no se puede deshacer.",
    },

    sourceCode: {
      title: "Código fuente",
      githubRepository: "Repositorio de GitHub",
    },

    version: "Versión",
  },

  result: {
    drawing: "Trazo",
    example: "Ejemplo",
    you: "Tú",

    title: "Práctica completada",
    score: "Puntos",
    percent: "Aciertos",

    sec: "seg",
    min: "min",
    errors_one: "{{count}} error",
    errors_many: "{{count}} errores",
    errors_other: "{{count}} errores",

    question: "pregunta",
    questionNumber: "P{{number}}",

    done: "Hecho",

    correct: "Correcto",
    wrong: "Incorrecto",
  },

  lessonsList: {
    failedToLoadLessons:
      "No se pudieron cargar las lecciones, por favor inténtalo de nuevo más tarde.",
    completed: "completado",
  },

  lesson: {
    matchHiraganaWithTransliteration: "Empareja el hiragana con la transliteración.",
    matchKatakanaWithTransliteration: "Empareja el katakana con la transliteración.",
    practiceEveryDay: "Practica todos los días para reforzar tus conocimientos.",
    learningComplete: "¡Lección completada!",
  },

  transliterationSystems: {
    latin: "Latino",
    cyrillic: "Cirílico",

    tags: {
      mostPopular: "La más popular",
      officialJapan: "Oficial en Japón",
      strictest: "La más estricta",
      russianStandard: "Estándar en Rusia",
    },

    romaji: "Romaji",
    transliterationSystems: "Sistemas de transliteración",
    hepburn: "Hepburn",
    kunreiShiki: "Kunrei-shiki",
    nihonShiki: "Nihon-shiki",
    polivanovSystem: "Sistema Polivanov",
  },

  alert: {
    exitConformation: {
      title: "¿Estás seguro de que quieres salir?",
      subtitle: "Tu progreso no se guardará si sales ahora.",
    },
    newVersion: {
      title: "Hay una nueva versión disponible.",
      subtitle:
        "Esta lección está hecha para una versión más reciente de la aplicación. Por favor, actualiza la aplicación.",
    },
    cancel: "Cancelar",
    ok: "Aceptar",
    confirm: "Confirmar",
  },

  auth: {
    welcome: {
      firstStep: "¡Tu primer paso para aprender japonés!",
    },
    agreement: {
      prefix: "Al continuar, aceptas: ",
      terms: "Términos de servicio",
      privacy: "Política de privacidad",
    },
    continueWithGoogle: "Continuar con Google",
    googleFailed: "No se pudo iniciar sesión con Google",
    googleUnavailable: {
      title: "El inicio de sesión con Google no está disponible en Rusia",
      subtitle:
        "No se puede usar el inicio de sesión con Google desde Rusia. Tu dirección IP: {{ip}}. Puedes registrarte con tu correo electrónico.",
    },
    signUpWithEmail: "Registrarse con correo electrónico",
    alreadyHaveAccount: "¿Ya tienes una cuenta?",
    login: "Iniciar sesión",
    continueWithoutLogin: "Continuar sin iniciar sesión",
    fields: {
      newName: "Nuevo nombre",
      oldPassword: "Contraseña actual",
      name: "Nombre",
      email: "Dirección de correo electrónico",
      password: "Contraseña",
      newPassword: "Nueva contraseña",
      repeatPassword: "Repite la nueva contraseña",
      birthDate: "Fecha de nacimiento",
      code: "Código",
    },
    signIn: {
      title: "Iniciar sesión",
      submit: "Iniciar sesión",
    },
    signUp: {
      title: "Crear una cuenta",
      submit: "Crear cuenta",
    },
    verifyEmail: {
      title: "Verifica tu correo electrónico",
      subtitle: "Introduce el código del correo. Lo hemos enviado a {{email}}",
      submit: "Siguiente",
      resend: "Enviar otro código",
      resendCooldown: "Enviar otro código ({{seconds}})",
    },
    resetPassword: {
      title: "¿Olvidaste la contraseña?",
      subtitle:
        "Introduce tu dirección de correo electrónico para recibir un código y restablecer tu contraseña.",
      changeTitle: "Cambia tu contraseña",
      confirm: "Confirmar",
    },
    errors: {
      incorrectOldPassword: "La contraseña actual es incorrecta",
      nameTooLong: "El nombre no puede superar los 16 caracteres",
      nameRequired: "Introduce tu nombre",
      emailRequired: "Introduce tu correo electrónico",
      invalidEmail: "Correo electrónico no válido",
      dateRequired: "Selecciona tu fecha de nacimiento",
      tooYoung: "La edad mínima es 13 años",
      passwordMin: "Al menos 8 caracteres",
      passwordLetter: "Añade al menos una letra",
      passwordDigit: "Añade al menos un dígito",
      passwordRepeat: "Repite la contraseña",
      passwordsMismatch: "Las contraseñas no coinciden",
      emailTaken: "El correo electrónico ya está registrado",
      weakPassword: "La contraseña es demasiado débil",
      invalidDate: "Fecha no válida o edad menor de 13",
      requestFailed: "No se pudo enviar la solicitud. Inténtalo de nuevo más tarde.",
      somethingWrong: "Algo salió mal. Inténtalo de nuevo más tarde.",
      codeRequired: "Introduce el código de 6 dígitos",
      invalidCode: "Código no válido",
      codeExpired: "El código ha caducado",
      tooManyAttempts: "Demasiados intentos. Solicita un código nuevo o inténtalo mañana.",
      resendCooldown: "Espera antes de solicitar un nuevo código",
      passwordRequired: "Introduce tu contraseña",
      invalidCredentials: "Correo electrónico o contraseña no válidos",
      emailNotVerified: "El correo electrónico no está verificado",
      useGoogleToSignIn: "Esta cuenta usa el inicio de sesión de Google",
      invalidResetToken: "La sesión de restablecimiento ha caducado. Solicita un nuevo código.",
      accountMigrating: "La cuenta se está transfiriendo. Inténtalo de nuevo más tarde.",
      serverUnavailable:
        "El servidor de tu cuenta no está disponible temporalmente. Inténtalo más tarde.",
      tooManyRequests: "Demasiadas solicitudes. Espera un minuto e inténtalo de nuevo.",
      userNotFound: "No hay ninguna cuenta con este correo. Revisa la dirección o regístrate.",
      loginBlocked:
        "Demasiadas contraseñas incorrectas. El inicio de sesión con contraseña está bloqueado durante una hora. Restablece tu contraseña o inicia sesión con Google.",
      emailTakenOtherRegion: "Este correo ya está registrado. Inicia sesión.",
    },
  },
  profile: {
    widgets: {
      hide: "Ocultar widget",
    },

    stats: {
      daysOfStudy: "días de estudio",
      timesOfPractice: "sesiones de práctica",
    },

    avatar: {
      title: "Foto de perfil",
      takePhoto: "Hacer una foto",
      chooseFromLibrary: "Elegir de la galería",
      remove: "Eliminar foto",
      errors: {
        cameraPermission: "Sin acceso a la cámara. Permítelo en los ajustes del dispositivo.",
        fileTooLarge: "La imagen es demasiado grande. Máximo 5 MB.",
        invalidImage: "Formato no compatible. Usa JPEG, PNG o WebP.",
        storageUnavailable:
          "El almacenamiento no está disponible temporalmente. Inténtalo de nuevo.",
        failed: "No se pudo actualizar la foto. Inténtalo más tarde.",
      },
    },
    edit: {
      title: "Editar perfil",
      name: "Nombre",
      password: "Contraseña",
      changeName: "Cambiar nombre",
      changePassword: "Cambiar contraseña",
    },
    signInPrompt:
      "Inicia sesión en {{app}} para sincronizar tu progreso en todos los dispositivos.",
    signInButton: "Iniciar sesión o crear una cuenta",
    unavailable: {
      title: "Mantenimiento en tu servidor",
      text: "El servidor de tu cuenta no está disponible temporalmente. Las lecciones y la práctica siguen funcionando y tu perfil volverá pronto.",
    },
    offline: {
      title: "Sin conexión",
      text: "No se pudo conectar con el servidor. Comprueba tu conexión a internet.",
    },
  },
  debug: {
    store: "Tienda",
    deviceId: "ID del dispositivo",
    apiServers: "Servidores API",
    notificationToken: "Token de notificaciones",
    checking: "comprobando…",
    pinging: "haciendo ping…",
    unreachable: "no disponible",
    autoSelect: "Seleccionar automáticamente",
    addHost: "Añadir",
    removeData: "Eliminar datos",
  },
  verbForm: {
    title: "Formas del verbo:",
    teForm: "Forma て:",
    taForm: "Forma た:",
    naiForm: "Forma ない:",
    dictionaryForm: "Forma de diccionario:",
    potentialForm: "Forma potencial:",
    volitionalForm: "Modo volitivo:",
    imperativeForm: "Modo imperativo:",
    prohibitiveForm: "Modo prohibitivo:",
    conditionalForm: "Forma condicional - ば:",
    negativeConditionalForm: "Forma condicional negativa - ば:",
    passiveForm: "Voz pasiva:",
    verbCausative: "Forma causativa:",
  },
  boards: {
    title: "Tableros:",
    createOwn: "Crear propio",
    myBoards: "Mis tableros",
    publicBoards: "Tableros públicos",
    newBoard: "Nuevo tablero",
    namePlaceholder: "Nombre del tablero",
    isPublic: "Tablero público",
    settingsTitle: "Ajustes del tablero",
    editors: "Editores",
    noEditors: "Sin editores",
    createInvite: "Crear enlace de invitación",
    inviteUntil: "Enlace de un solo uso, válido hasta {{date}}",
    shareLink: "Compartir enlace",
    revoke: "Revocar",
    remove: "Quitar",
    deleteBoard: "Eliminar tablero",
    deleteTitle: "¿Eliminar este tablero?",
    deleteSubtitle: "El tablero y todas sus tarjetas se eliminarán definitivamente.",
    inviteLimit: "Demasiadas invitaciones activas",
  },
  board: {
    searchPlaceholder: "Buscar",
    searchResults: "Búsqueda",
    nothingFound: "No se encontró nada",
    sectionsTitle: "Secciones",
  },
  card: {
    examples: "Ejemplos:",
    open: "Abrir",
    alreadySeen: "Ya visto",
    kanjiOrder: "Orden de trazos:",
    kanjiLevel: "Nivel:",
    kanjiDescription: "Descripción:",
    kanjiRadicals: "Radicales:",
    kanjiElements: "Elementos:",
    edit: "Editar",
    save: "Guardar",
    titlePlaceholder: "Título",
    subtitlePlaceholder: "Traducción",
    examplePlaceholder: "Ejemplo",
    saveError: "No se ha podido guardar la tarjeta",
  },
  promotionTelegram: {
    title: "¡Enhorabuena, has encontrado un bug de la suerte!",
    reasonSingle:
      "Como ya no hay tantos bugs en la aplicación, mucha menos gente visita mi canal de Telegram para informar de problemas, y mucha menos gente se suscribe a mí",
    reasonMultiple:
      "Como ya no hay tantos bugs en la aplicación, mucha menos gente visita nuestros canales de Telegram para informar de problemas, y mucha menos gente se suscribe a nosotros",
    instructionTitle: "Esto es lo que debes hacer:",
    stepGo: "- Ir a {{channel}}",
    stepSubscribeSingle: "- Suscribirte (publicaré muchas cosas interesantes)",
    stepSubscribeMultiple: "- Suscribirte (publicaremos muchas cosas interesantes)",
    dontMakeMe: "No me obligues a añadir bugs reales :)",
    channelSingle: "Mi canal de Telegram",
    channelMultiple: "Nuestros canales de Telegram",
    fixMyself: "Lo arreglaré yo mismo",
  },
};

export default SpanishES;

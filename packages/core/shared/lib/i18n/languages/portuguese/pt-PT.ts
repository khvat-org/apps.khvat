const PortuguesePT = {
  common: {
    space: "Espaço",
    save: "Guardar",
    done: "Concluído",
    close: "Fechar",
    reset: "Repor",
    back: "Voltar",
    next: "Seguinte",
    retry: "Tentar novamente",
    complete: "Concluir",
    start: "Começar",
    check: "Verificar",
    welcome: "Bem-vindo",
  },

  tabs: {
    boards: "Quadros",
    learning: "Lições",
    practice: "Prática",
    kana: "Kana",
    settings: "Definições",
    profile: "Perfil",
  },

  practice: {
    question: "Pergunta",

    modes: {
      mixed: { title: "Misto", subtitle: "Tudo de uma vez" },
      testing: { title: "Teste", subtitle: "Responda contra o tempo" },
      drawing: { title: "Desenho", subtitle: "Desenhe o Hiragana/Katakana" },
      listening: { title: "Audição", subtitle: "Selecione a resposta correta" },
      multipleChoice: { title: "Seleção de palavra", subtitle: "Escolha a resposta correta" },
      matchingPairs: { title: "Pares correspondentes", subtitle: "Associe pares de palavras" },
      wordBuilding: { title: "Construção de palavras", subtitle: "Forme uma palavra" },
      typing: { title: "Digitação", subtitle: "Escreva a sílaba" },
    },

    playAudio: "Reproduzir áudio",

    preferences: {
      title: "Preferências",
      autoplaySound: "Som automático",
      questionsCount: "Número de perguntas",
      timer: "Temporizador",
      mixMode: "Modo misto",
      timerSeconds: "Tempo por pergunta",
      seconds: "{{count}} s",
    },

    alert: {
      insufficientKanaSelected: {
        title: "Caracteres insuficientes",
        subtitle: "Selecione {count} caracteres de Hiragana ou {count} caracteres de Katakana.",
      },
      insufficientWordsAvailable: {
        title: "Palavras insuficientes disponíveis",
        subtitle:
          "Há menos palavras disponíveis do que o necessário. Selecione mais sílabas de Katakana ou Hiragana.",
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
    chooseKana: "Escolher kana",
    words: "Palavras",
    nothingSelected: "Nada selecionado",
  },

  settings: {
    logout: {
      button: "Terminar sessão",
      title: "Terminar sessão?",
      subtitle: "Vai terminar a sessão e todos os dados locais neste dispositivo serão eliminados.",
    },
    deleteAccount: {
      button: "Eliminar conta",
      confirmTitle: "Tem a certeza de que pretende eliminar a sua conta?",
      confirmSubtitle: "Todo o seu progresso e os dados da sua conta serão eliminados.",
      title: "Eliminar conta?",
      subtitle:
        "Introduza o código de 6 dígitos que enviámos para o seu e-mail. Esta ação é permanente e irreversível.",
      confirm: "Eliminar",
    },
    displayStatistics: "Mostrar estatísticas",
    hapticFeedback: "Feedback háptico",
    widgets: {
      title: "Widgets",
      statistics: "Widget de estatísticas",
      social: "Widget de redes sociais",
    },
    theme: {
      installed: "Instalados",
      title: "Tema",
      light: "Clara",
      dark: "Escura",
      auto: "Automática",
    },
    language: "Idioma",
    termsAndConditions: "Termos e Condições",
    privacyPolicy: "Política de Privacidade",
    contactSupport: "Contactar o suporte",

    rateApp: {
      title: "Avaliar a aplicação",
      subtitle: "Ajuda-nos muito",
    },

    joinOurCommunity: {
      title: "Junte-se à nossa comunidade",
    },

    eraseData: {
      button: "Limpar dados da aplicação",
      dataTakesUp: "Dados ocupam",
      title: "Tem a certeza de que pretende eliminar os dados?",
      subtitle:
        "Todos os dados, incluindo definições e progresso, serão eliminados. Esta ação é irreversível.",
    },

    sourceCode: {
      title: "Código-fonte",
      githubRepository: "Repositório GitHub",
    },

    version: "Versão",
  },

  result: {
    drawing: "Desenho",
    example: "Exemplo",
    you: "Você",

    title: "Prática concluída",
    score: "Pontos",
    percent: "Acertos",

    sec: "seg",
    min: "min",
    errors_one: "{{count}} erro",
    errors_many: "{{count}} erros",
    errors_other: "{{count}} erros",

    question: "pergunta",
    questionNumber: "P{{number}}",

    done: "Concluir",

    correct: "Correto",
    wrong: "Incorreto",
  },

  lessonsList: {
    completed: "concluído",
    failedToLoadLessons: "Não foi possível carregar as lições, tente novamente mais tarde.",
  },

  lesson: {
    matchHiraganaWithTransliteration: "Associe o Hiragana com a transliteração.",
    matchKatakanaWithTransliteration: "Associe o Katakana com a transliteração.",
    practiceEveryDay: "Pratique diariamente para reforçar os seus conhecimentos.",
    learningComplete: "Lição concluída!",
  },

  transliterationSystems: {
    latin: "Latino",
    cyrillic: "Cirílico",

    tags: {
      mostPopular: "Mais popular",
      officialJapan: "Oficial no Japão",
      strictest: "Mais rigoroso",
      russianStandard: "Padrão na Rússia",
    },

    romaji: "Romaji",
    transliterationSystems: "Sistemas de transliteração",
    hepburn: "Hepburn",
    kunreiShiki: "Kunrei-shiki",
    nihonShiki: "Nihon-shiki",
    polivanovSystem: "Sistema Polivanov",
  },

  alert: {
    exitConformation: {
      title: "Tem a certeza de que pretende sair?",
      subtitle: "O seu progresso não será guardado se sair agora.",
    },
    newVersion: {
      title: "Está disponível uma nova versão.",
      subtitle:
        "Esta lição foi criada para uma versão mais recente da aplicação. Atualize a aplicação, por favor.",
    },
    cancel: "Cancelar",
    ok: "OK",
    confirm: "Confirmar",
  },

  auth: {
    welcome: {
      firstStep: "O seu primeiro passo para aprender japonês!",
    },
    agreement: {
      prefix: "Ao continuar, aceita: ",
      terms: "Termos de Serviço",
      privacy: "Política de Privacidade",
    },
    continueWithGoogle: "Continuar com Google",
    googleFailed: "Não foi possível iniciar sessão com o Google",
    googleUnavailable: {
      title: "O início de sessão com a Google não está disponível na Rússia",
      subtitle:
        "Não é possível utilizar o início de sessão com a Google a partir da Rússia. O seu endereço IP: {{ip}}. Pode registar-se com o seu e-mail.",
    },
    signUpWithEmail: "Registar-se com e-mail",
    alreadyHaveAccount: "Já tem uma conta?",
    login: "Iniciar sessão",
    continueWithoutLogin: "Continuar sem iniciar sessão",
    fields: {
      newName: "Novo nome",
      oldPassword: "Palavra-passe atual",
      name: "Nome",
      email: "Endereço de e-mail",
      password: "Palavra-passe",
      newPassword: "Nova palavra-passe",
      repeatPassword: "Repita a nova palavra-passe",
      birthDate: "Data de nascimento",
      code: "Código",
    },
    signIn: {
      title: "Iniciar sessão",
      submit: "Iniciar sessão",
    },
    signUp: {
      title: "Criar uma conta",
      submit: "Criar conta",
    },
    verifyEmail: {
      title: "Verifique o seu e-mail",
      subtitle: "Introduza o código do e-mail. Enviámo-lo para {{email}}",
      submit: "Seguinte",
      resend: "Enviar outro código",
      resendCooldown: "Enviar outro código ({{seconds}})",
    },
    resetPassword: {
      title: "Esqueceu-se da palavra-passe?",
      subtitle:
        "Introduza o seu endereço de e-mail para receber um código para repor a palavra-passe.",
      changeTitle: "Altere a sua palavra-passe",
      confirm: "Confirmar",
    },
    errors: {
      incorrectOldPassword: "Palavra-passe atual incorreta",
      nameTooLong: "O nome deve ter no máximo 16 caracteres",
      nameRequired: "Introduza o nome",
      emailRequired: "Introduza o e-mail",
      invalidEmail: "E-mail inválido",
      dateRequired: "Selecione a data de nascimento",
      tooYoung: "A idade mínima é 13 anos",
      passwordMin: "Pelo menos 8 caracteres",
      passwordLetter: "Adicione pelo menos uma letra",
      passwordDigit: "Adicione pelo menos um dígito",
      passwordRepeat: "Repita a palavra-passe",
      passwordsMismatch: "As palavras-passe não coincidem",
      emailTaken: "E-mail já registado",
      weakPassword: "A palavra-passe é demasiado fraca",
      invalidDate: "Data inválida ou idade inferior a 13",
      requestFailed: "Não foi possível enviar o pedido. Tente novamente mais tarde.",
      somethingWrong: "Algo correu mal. Tente novamente mais tarde.",
      codeRequired: "Introduza o código de 6 dígitos",
      invalidCode: "Código inválido",
      codeExpired: "O código expirou",
      tooManyAttempts: "Demasiadas tentativas. Peça um novo código ou tente amanhã.",
      resendCooldown: "Aguarde antes de solicitar um novo código",
      passwordRequired: "Introduza a palavra-passe",
      invalidCredentials: "E-mail ou palavra-passe inválidos",
      emailNotVerified: "O e-mail não está verificado",
      useGoogleToSignIn: "Esta conta utiliza o início de sessão com Google",
      invalidResetToken: "A sessão de reposição expirou. Solicite um novo código.",
      accountMigrating: "A conta está a ser transferida. Tente novamente mais tarde.",
      serverUnavailable:
        "O servidor da sua conta está temporariamente indisponível. Tente novamente mais tarde.",
      tooManyRequests: "Demasiados pedidos. Aguarde um minuto e tente novamente.",
      userNotFound: "Não existe nenhuma conta com este e-mail. Verifique o endereço ou registe-se.",
      loginBlocked:
        "Demasiadas palavras-passe erradas. O início de sessão com palavra-passe está bloqueado durante uma hora. Reponha a palavra-passe ou inicie sessão com o Google.",
      emailTakenOtherRegion: "Este e-mail já está registado. Inicie sessão.",
    },
  },
  profile: {
    widgets: {
      hide: "Ocultar widget",
    },

    stats: {
      daysOfStudy: "dias de estudo",
      timesOfPractice: "sessões de prática",
    },

    avatar: {
      title: "Fotografia do perfil",
      takePhoto: "Tirar fotografia",
      chooseFromLibrary: "Escolher da galeria",
      remove: "Remover fotografia",
      errors: {
        cameraPermission: "Sem acesso à câmara. Permita nas definições do dispositivo.",
        fileTooLarge: "A imagem é demasiado grande. Máximo de 5 MB.",
        invalidImage: "Formato não suportado. Use JPEG, PNG ou WebP.",
        storageUnavailable: "O armazenamento está temporariamente indisponível. Tente novamente.",
        failed: "Não foi possível atualizar a fotografia. Tente mais tarde.",
      },
    },
    edit: {
      title: "Editar perfil",
      name: "Nome",
      password: "Palavra-passe",
      changeName: "Alterar nome",
      changePassword: "Alterar palavra-passe",
    },
    signInPrompt:
      "Inicie sessão em {{app}} para sincronizar o seu progresso em todos os dispositivos.",
    signInButton: "Iniciar sessão ou criar uma conta",
    unavailable: {
      title: "Manutenção no seu servidor",
      text: "O servidor da sua conta está temporariamente indisponível. As lições e a prática continuam a funcionar e o seu perfil voltará em breve.",
    },
    offline: {
      title: "Sem ligação",
      text: "Não foi possível contactar o servidor. Verifique a sua ligação à Internet.",
    },
  },
  debug: {
    store: "Loja",
    deviceId: "ID do dispositivo",
    apiServers: "Servidores API",
    notificationToken: "Token de notificação",
    checking: "A verificar…",
    pinging: "A fazer ping…",
    unreachable: "Indisponível",
    autoSelect: "Seleção automática",
    addHost: "Adicionar",
    removeData: "Remover dados",
  },
  verbForm: {
    title: "Formas verbais:",
    teForm: "Forma て:",
    taForm: "Forma た:",
    naiForm: "Forma ない:",
    dictionaryForm: "Forma de dicionário:",
    potentialForm: "Forma potencial:",
    volitionalForm: "Modo volitivo:",
    imperativeForm: "Modo imperativo:",
    prohibitiveForm: "Modo proibitivo:",
    conditionalForm: "Forma condicional - ば:",
    negativeConditionalForm: "Forma condicional negativa - ば:",
    passiveForm: "Voz passiva:",
    verbCausative: "Forma causativa:",
  },
  boards: {
    title: "Quadros:",
    createOwn: "Criar o seu",
    myBoards: "Os meus quadros",
    publicBoards: "Quadros públicos",
    newBoard: "Novo quadro",
    namePlaceholder: "Nome do quadro",
    isPublic: "Quadro público",
    settingsTitle: "Definições do quadro",
    editors: "Editores",
    noEditors: "Nenhum editor",
    createInvite: "Criar link de convite",
    inviteUntil: "Link de uso único, válido até {{date}}",
    shareLink: "Partilhar link",
    revoke: "Revogar",
    remove: "Remover",
    deleteBoard: "Eliminar quadro",
    deleteTitle: "Eliminar este quadro?",
    deleteSubtitle: "O quadro e todos os seus cartões serão eliminados permanentemente.",
    inviteLimit: "Demasiados convites ativos",
  },
  board: {
    searchPlaceholder: "Pesquisa",
    searchResults: "Pesquisa",
    nothingFound: "Nada encontrado",
    sectionsTitle: "Secções",
  },
  card: {
    examples: "Exemplos:",
    open: "Abrir",
    alreadySeen: "Já visto",
    kanjiOrder: "Ordem dos traços:",
    kanjiLevel: "Nível:",
    kanjiDescription: "Descrição:",
    kanjiRadicals: "Radicais:",
    kanjiElements: "Elementos:",
    edit: "Editar",
    save: "Guardar",
    titlePlaceholder: "Título",
    subtitlePlaceholder: "Tradução",
    examplePlaceholder: "Exemplo",
    saveError: "Não foi possível guardar o cartão",
  },
  promotionTelegram: {
    title: "Parabéns, encontrou um bug sortudo!",
    reasonSingle:
      "Como já não há tantos bugs na aplicação, muito menos pessoas visitam o meu canal de Telegram para reportar problemas, e muito menos pessoas se subscrevem a mim",
    reasonMultiple:
      "Como já não há tantos bugs na aplicação, muito menos pessoas visitam os nossos canais de Telegram para reportar problemas, e muito menos pessoas se subscrevem a nós",
    instructionTitle: "Eis o que precisa de fazer:",
    stepGo: "- Vá para {{channel}}",
    stepSubscribeSingle: "- Subscreva (vou publicar muitas coisas interessantes)",
    stepSubscribeMultiple: "- Subscreva (vamos publicar muitas coisas interessantes)",
    dontMakeMe: "Não me obrigue a adicionar bugs reais :)",
    channelSingle: "O meu canal de Telegram",
    channelMultiple: "Os nossos canais de Telegram",
    fixMyself: "Eu resolvo sozinho",
  },
};

export default PortuguesePT;

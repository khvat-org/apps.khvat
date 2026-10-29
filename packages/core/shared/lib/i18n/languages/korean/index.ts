const Korean = {
  common: {
    space: "스페이스",
    save: "저장",
    done: "완료",
    close: "닫기",
    reset: "초기화",
    back: "뒤로",
    next: "다음",
    retry: "다시 시도",
    complete: "완료",
    start: "시작",
    check: "확인",
    welcome: "환영합니다",
  },

  tabs: {
    boards: "보드",
    learning: "학습",
    practice: "연습",
    kana: "가나",
    settings: "설정",
    profile: "프로필",
  },

  practice: {
    question: "문제",

    modes: {
      mixed: { title: "혼합", subtitle: "모두 한꺼번에" },
      testing: { title: "테스트", subtitle: "시간 제한으로 답 선택" },
      drawing: { title: "그리기", subtitle: "히라가나 / 가타카나 그리기" },
      listening: { title: "듣기", subtitle: "올바른 답 선택" },
      multipleChoice: { title: "단어 선택", subtitle: "올바른 답 선택" },
      matchingPairs: { title: "짝 맞추기", subtitle: "단어 짝 맞추기" },
      wordBuilding: { title: "단어 만들기", subtitle: "단어 구성하기" },
      typing: { title: "입력", subtitle: "음절 입력하기" },
    },

    playAudio: "오디오 재생",

    preferences: {
      title: "설정",
      autoplaySound: "소리 자동 재생",
      questionsCount: "문제 수",
      timer: "타이머",
      mixMode: "혼합 모드",
      timerSeconds: "문제당 시간",
      seconds: "{{count}}초",
    },

    alert: {
      insufficientKanaSelected: {
        title: "문자가 부족합니다",
        subtitle: "{count}개의 히라가나 문자 또는 {count}개의 가타카나 문자를 선택해 주세요.",
      },
      insufficientWordsAvailable: {
        title: "사용 가능한 단어가 부족합니다",
        subtitle: "필요한 단어 수보다 적습니다. 히라가나 또는 가타카나 음절을 더 선택해 주세요.",
      },
    },
  },

  kana: {
    hiragana: "히라가나",
    katakana: "가타카나",
    romaji: "로마자",

    basic: "기본",
    dakuon: "탁음",
    handakuon: "반탁음",
    yoon: "요음",
  },

  selectKana: {
    chooseKana: "가나 선택",
    words: "단어",
    nothingSelected: "선택된 항목 없음",
  },

  settings: {
    logout: {
      button: "로그아웃",
      title: "로그아웃 하시겠습니까?",
      subtitle: "로그아웃되며 이 기기의 모든 로컬 데이터가 삭제됩니다.",
    },
    deleteAccount: {
      button: "계정 삭제",
      confirmTitle: "정말 계정을 삭제하시겠습니까?",
      confirmSubtitle: "모든 학습 진행 상황과 계정 데이터가 함께 삭제됩니다.",
      title: "계정을 삭제하시겠습니까?",
      subtitle:
        "이메일로 받은 6자리 코드를 입력하세요. 이 작업은 되돌릴 수 없으며 계정과 모든 데이터가 삭제됩니다.",
      confirm: "삭제",
    },
    displayStatistics: "통계 표시",
    hapticFeedback: "햅틱 피드백",
    widgets: {
      title: "위젯",
      statistics: "통계 위젯",
      social: "소셜 미디어 위젯",
    },
    theme: {
      installed: "설치됨",
      title: "테마",
      light: "라이트",
      dark: "다크",
      auto: "자동",
    },
    language: "언어",
    privacyPolicy: "개인정보 처리방침",
    termsAndConditions: "이용약관",
    contactSupport: "고객 지원 문의",

    rateApp: {
      title: "앱 평가하기",
      subtitle: "큰 도움이 됩니다",
    },

    joinOurCommunity: {
      title: "커뮤니티에 참여하기",
    },

    eraseData: {
      button: "앱 데이터 삭제",
      dataTakesUp: "데이터 사용량",
      title: "정말 데이터를 삭제하시겠습니까?",
      subtitle: "설정과 진행 상황을 포함한 모든 데이터가 삭제됩니다. 이 작업은 되돌릴 수 없습니다.",
    },

    sourceCode: {
      title: "소스 코드",
      githubRepository: "GitHub 저장소",
    },

    version: "버전",
  },

  result: {
    drawing: "쓰기",
    example: "예시",
    you: "내 답",

    title: "연습 완료",
    score: "점수",
    percent: "정답률",

    sec: "초",
    min: "분",
    errors_one: "오류 {{count}}개",
    errors_other: "오류 {{count}}개",

    question: "문제",
    questionNumber: "{{number}}번",

    done: "완료",

    correct: "정답",
    wrong: "오답",
  },

  lessonsList: {
    failedToLoadLessons: "레슨을 불러오지 못했습니다. 나중에 다시 시도해 주세요.",
    completed: "완료",
  },

  lesson: {
    matchHiraganaWithTransliteration: "히라가나와 로마자를 짝지어 주세요.",
    matchKatakanaWithTransliteration: "가타카나와 로마자를 짝지어 주세요.",
    practiceEveryDay: "지식을 확실히 하기 위해 매일 연습하세요.",
    learningComplete: "레슨 완료!",
  },

  transliterationSystems: {
    latin: "로마자",
    cyrillic: "키릴 문자",

    tags: {
      mostPopular: "가장 대중적",
      officialJapan: "일본 공식",
      strictest: "가장 엄격",
      russianStandard: "러시아 표준",
    },

    romaji: "로마자",
    transliterationSystems: "로마자 표기 체계",
    hepburn: "Hepburn (헵번식)",
    kunreiShiki: "Kunrei-shiki (훈령식)",
    nihonShiki: "Nihon-shiki (일본식)",
    polivanovSystem: "Polivanov 시스템",
  },

  alert: {
    exitConformation: {
      title: "정말 나가시겠습니까?",
      subtitle: "지금 나가면 진행 상황이 저장되지 않습니다.",
    },
    newVersion: {
      title: "새 버전이 출시되었습니다.",
      subtitle: "이 레슨은 더 새로운 앱 버전용으로 제작되었습니다. 앱을 업데이트해 주세요.",
    },
    cancel: "취소",
    ok: "확인",
    confirm: "확인",
  },

  auth: {
    welcome: {
      firstStep: "일본어 학습의 첫걸음!",
    },
    agreement: {
      prefix: "계속하면 다음에 동의하는 것으로 간주됩니다: ",
      terms: "서비스 이용약관",
      privacy: "개인정보 처리방침",
    },
    continueWithGoogle: "Google로 계속하기",
    googleFailed: "Google로 로그인하지 못했습니다",
    googleUnavailable: {
      title: "러시아에서는 Google 로그인을 사용할 수 없습니다",
      subtitle:
        "러시아에서는 Google 로그인을 사용할 수 없습니다. IP 주소: {{ip}}. 대신 이메일로 가입할 수 있습니다.",
    },
    signUpWithEmail: "이메일로 가입하기",
    alreadyHaveAccount: "이미 계정이 있으신가요?",
    login: "로그인",
    continueWithoutLogin: "로그인 없이 계속하기",
    fields: {
      newName: "새 이름",
      oldPassword: "기존 비밀번호",
      name: "이름",
      email: "이메일 주소",
      password: "비밀번호",
      newPassword: "새 비밀번호",
      repeatPassword: "새 비밀번호 확인",
      birthDate: "생년월일",
      code: "코드",
    },
    signIn: {
      title: "로그인",
      submit: "로그인",
    },
    signUp: {
      title: "계정 만들기",
      submit: "계정 만들기",
    },
    verifyEmail: {
      title: "이메일 인증",
      subtitle: "이메일로 받은 코드를 입력하세요. {{email}}로 보냈습니다",
      submit: "다음",
      resend: "코드 다시 보내기",
      resendCooldown: "코드 다시 보내기 ({{seconds}})",
    },
    resetPassword: {
      title: "비밀번호를 잊으셨나요?",
      subtitle: "비밀번호 재설정 코드를 받으려면 이메일 주소를 입력하세요.",
      changeTitle: "비밀번호 변경",
      confirm: "확인",
    },
    errors: {
      incorrectOldPassword: "기존 비밀번호가 올바르지 않습니다",
      nameTooLong: "이름은 16자 이하여야 합니다",
      nameRequired: "이름을 입력하세요",
      emailRequired: "이메일을 입력하세요",
      invalidEmail: "올바르지 않은 이메일",
      dateRequired: "생년월일을 선택하세요",
      tooYoung: "최소 나이는 13세입니다",
      passwordMin: "최소 8자 이상",
      passwordLetter: "최소 한 글자의 문자가 필요합니다",
      passwordDigit: "최소 한 글자의 숫자가 필요합니다",
      passwordRepeat: "비밀번호를 다시 입력하세요",
      passwordsMismatch: "비밀번호가 일치하지 않습니다",
      emailTaken: "이미 등록된 이메일입니다",
      weakPassword: "비밀번호가 너무 약합니다",
      invalidDate: "올바르지 않은 날짜이거나 13세 미만입니다",
      requestFailed: "요청을 보내지 못했습니다. 나중에 다시 시도해 주세요.",
      somethingWrong: "문제가 발생했습니다. 나중에 다시 시도해 주세요.",
      codeRequired: "6자리 코드를 입력하세요",
      invalidCode: "올바르지 않은 코드",
      codeExpired: "코드가 만료되었습니다",
      tooManyAttempts: "시도 횟수가 너무 많습니다. 새 코드를 요청하거나 내일 다시 시도해 주세요.",
      resendCooldown: "다시 보내기 전에 잠시 기다려 주세요",
      passwordRequired: "비밀번호를 입력하세요",
      invalidCredentials: "이메일 또는 비밀번호가 올바르지 않습니다",
      emailNotVerified: "이메일이 인증되지 않았습니다",
      useGoogleToSignIn: "이 계정은 Google로 로그인합니다",
      invalidResetToken: "재설정 세션이 만료되었습니다. 코드를 다시 요청하세요.",
      accountMigrating: "계정 이전 중입니다. 나중에 다시 시도해 주세요.",
      serverUnavailable: "계정 서버를 일시적으로 사용할 수 없습니다. 나중에 다시 시도해 주세요.",
      tooManyRequests: "요청이 너무 많습니다. 1분 후 다시 시도해 주세요.",
      userNotFound: "이 이메일로 등록된 계정이 없습니다. 주소를 확인하거나 가입해 주세요.",
      loginBlocked:
        "잘못된 비밀번호를 너무 많이 입력했습니다. 비밀번호 로그인이 1시간 동안 잠깁니다. 비밀번호를 재설정하거나 Google로 로그인해 주세요.",
      emailTakenOtherRegion: "이미 등록된 이메일입니다. 로그인해 주세요.",
    },
  },
  profile: {
    widgets: {
      hide: "위젯 숨기기",
    },

    stats: {
      daysOfStudy: "학습일수",
      timesOfPractice: "연습 횟수",
    },

    avatar: {
      title: "프로필 사진",
      takePhoto: "사진 촬영",
      chooseFromLibrary: "갤러리에서 선택",
      remove: "사진 삭제",
      errors: {
        cameraPermission: "카메라 접근이 허용되지 않았습니다. 기기 설정에서 허용해 주세요.",
        fileTooLarge: "이미지가 너무 큽니다. 최대 5MB입니다.",
        invalidImage: "지원하지 않는 형식입니다. JPEG, PNG 또는 WebP를 사용하세요.",
        storageUnavailable: "저장소를 일시적으로 사용할 수 없습니다. 다시 시도해 주세요.",
        failed: "사진을 업데이트하지 못했습니다. 나중에 다시 시도해 주세요.",
      },
    },
    edit: {
      title: "프로필 편집",
      name: "이름",
      password: "비밀번호",
      changeName: "이름 변경",
      changePassword: "비밀번호 변경",
    },
    signInPrompt: "{{app}}에 로그인하여 모든 기기에서 진행 상황을 동기화하세요.",
    signInButton: "로그인 또는 계정 만들기",
    unavailable: {
      title: "서버 점검 중",
      text: "계정 서버를 일시적으로 사용할 수 없습니다. 레슨과 연습은 계속 이용할 수 있으며, 프로필은 곧 다시 표시됩니다.",
    },
    offline: {
      title: "연결 없음",
      text: "서버에 연결할 수 없습니다. 인터넷 연결을 확인해 주세요.",
    },
  },
  debug: {
    store: "스토어",
    deviceId: "기기 ID",
    apiServers: "API 서버",
    notificationToken: "알림 토큰",
    checking: "확인 중…",
    pinging: "핑 중…",
    unreachable: "연결 불가",
    autoSelect: "자동 선택",
    addHost: "추가",
    removeData: "데이터 삭제",
  },
  verbForm: {
    title: "동사 활용형:",
    teForm: "て 형:",
    taForm: "た 형:",
    naiForm: "ない 형:",
    dictionaryForm: "사전형:",
    potentialForm: "가능형:",
    volitionalForm: "의지형:",
    imperativeForm: "명령형:",
    prohibitiveForm: "금지형:",
    conditionalForm: "조건형 - ば:",
    negativeConditionalForm: "부정 조건형 - ば:",
    passiveForm: "수동형:",
    verbCausative: "사역형:",
  },
  boards: {
    title: "보드:",
    createOwn: "직접 만들기",
    myBoards: "내 보드",
    publicBoards: "공개 보드",
    newBoard: "새 보드",
    namePlaceholder: "보드 이름",
    isPublic: "공개 보드",
    settingsTitle: "보드 설정",
    editors: "편집자",
    noEditors: "편집자가 없습니다",
    createInvite: "초대 링크 만들기",
    inviteUntil: "일회용 링크, {{date}}까지 유효",
    shareLink: "링크 공유",
    revoke: "취소",
    remove: "삭제",
    deleteBoard: "보드 삭제",
    deleteTitle: "이 보드를 삭제할까요?",
    deleteSubtitle: "보드와 모든 카드가 영구적으로 삭제됩니다.",
    inviteLimit: "활성 초대가 너무 많습니다",
  },
  board: {
    searchPlaceholder: "검색",
    searchResults: "검색 결과",
    nothingFound: "검색 결과 없음",
    sectionsTitle: "섹션",
    cardView: "카드 보기",
    tags: "태그",
    images: "이미지",
    columns: "한 줄당 카드 수",
    settingsLabel: "설정",
    lessonsLabel: "레슨",
    cardsLabel: "카드",
    bookmarks: "저장됨",
    sectionsLabel: "섹션",
    bookmarksEmpty: "저장한 카드가 여기에 표시됩니다",
  },
  card: {
    examples: "예문:",
    open: "열기",
    alreadySeen: "이미 봤음",
    kanjiOrder: "쓰는 순서:",
    kanjiLevel: "레벨:",
    kanjiDescription: "설명:",
    kanjiRadicals: "부수:",
    kanjiElements: "구성 요소:",
    edit: "편집",
    save: "저장",
    titlePlaceholder: "제목",
    subtitlePlaceholder: "뜻",
    examplePlaceholder: "예문",
    saveError: "카드를 저장하지 못했습니다",
    bookmarkAdd: "저장",
    bookmarkRemove: "삭제",
  },
  promotionTelegram: {
    title: "축하합니다, 행운의 버그를 발견하셨네요!",
    reasonSingle:
      "앱에 버그가 많이 줄어서, 문제 제보를 위해 제 텔레그램 채널에 오는 사람이 훨씬 줄었고, 저를 구독하는 사람도 많이 줄었습니다",
    reasonMultiple:
      "앱에 버그가 많이 줄어서, 문제 제보를 위해 저희 텔레그램 채널에 오는 사람이 훨씬 줄었고, 저희를 구독하는 사람도 많이 줄었습니다",
    instructionTitle: "해야 할 일:",
    stepGo: "- {{channel}}로 이동하기",
    stepSubscribeSingle: "- 구독하기 (재미있는 내용을 많이 올릴 거예요)",
    stepSubscribeMultiple: "- 구독하기 (재미있는 내용을 많이 올릴 거예요)",
    dontMakeMe: "진짜 버그를 추가하게 만들지 마세요 :)",
    channelSingle: "제 텔레그램 채널",
    channelMultiple: "저희 텔레그램 채널",
    fixMyself: "직접 고칠게요",
  },

  report: {
    title: "오류 신고",
    subtitle: "이 문제에 어떤 문제가 있나요? 바로 고치겠습니다.",
    placeholder: "내용",
    upload: "업로드",
    send: "신고 보내기",
    success: {
      title: "감사합니다!",
      subtitle: "신고를 받았습니다. 오류를 수정하겠습니다.",
    },
    errors: {
      too_large: "이미지가 너무 큽니다. 일부를 삭제해 주세요.",
      rate_limited: "신고가 너무 많습니다. 잠시 후 다시 시도해 주세요.",
      unavailable: "신고를 보내지 못했습니다. 잠시 후 다시 시도해 주세요.",
      invalid: "문제가 발생했습니다. 다시 시도해 주세요.",
    },
    tags: {
      grammatical_typo: "오타",
      interface_error: "인터페이스 오류",
      incorrect_information: "잘못된 정보",
      answer_marked_wrong: "정답이 인정되지 않음",
      incorrect_character: "잘못된 문자",
      other: "기타",
    },
  },
};

export default Korean;

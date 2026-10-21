const ChineseTW = {
  common: {
    space: "空格",
    save: "儲存",
    done: "完成",
    close: "關閉",
    reset: "重設",
    back: "返回",
    next: "下一步",
    retry: "重試",
    complete: "完成",
    start: "開始",
    check: "檢查",
    welcome: "歡迎",
  },

  tabs: {
    boards: "看板",
    learning: "課程",
    practice: "練習",
    kana: "假名",
    settings: "設定",
    profile: "個人資料",
  },

  practice: {
    question: "問題",

    modes: {
      mixed: { title: "混合", subtitle: "一次全部" },
      testing: { title: "測驗", subtitle: "限時選擇答案" },
      drawing: { title: "書寫", subtitle: "寫出平假名／片假名" },
      listening: { title: "聽力", subtitle: "選擇正確答案" },
      multipleChoice: { title: "單字選擇", subtitle: "選擇正確答案" },
      matchingPairs: { title: "配對", subtitle: "配對單字" },
      wordBuilding: { title: "組詞", subtitle: "組成單字" },
      typing: { title: "輸入", subtitle: "輸入音節" },
    },

    playAudio: "播放音訊",

    preferences: {
      title: "偏好設定",
      autoplaySound: "自動播放聲音",
      questionsCount: "題目數量",
      timer: "計時器",
      mixMode: "混合模式",
      timerSeconds: "每題時間",
      seconds: "{{count}} 秒",
    },

    alert: {
      insufficientKanaSelected: {
        title: "字元不足",
        subtitle: "請選擇 {count} 個平假名或 {count} 個片假名字元。",
      },
      insufficientBaseKanaSelected: {
        title: "字元不足",
        subtitle: "請選擇 {count} 個基本平假名或 {count} 個基本片假名（不含濁音、半濁音和拗音）。",
      },
      insufficientWordsAvailable: {
        title: "可用單字不足",
        subtitle: "可用單字少於所需數量。請選擇更多平假名或片假名音節。",
      },
    },
  },

  kana: {
    hiragana: "平假名",
    katakana: "片假名",
    romaji: "羅馬字",

    basic: "基本",
    dakuon: "濁音",
    handakuon: "半濁音",
    yoon: "拗音",
  },

  selectKana: {
    chooseKana: "選擇假名",
    words: "練習用單字",
    nothingSelected: "尚未選擇",
  },

  settings: {
    logout: {
      button: "登出",
      title: "要登出嗎？",
      subtitle: "您將登出，此裝置上的所有本機資料將被清除。",
    },
    deleteAccount: {
      button: "刪除帳號",
      confirmTitle: "確定要刪除帳號嗎？",
      confirmSubtitle: "您所有的學習進度與帳號資料都會一併刪除。",
      title: "要刪除帳號嗎？",
      subtitle: "輸入我們寄到您信箱的 6 位數驗證碼。此操作無法復原，帳號與所有資料將被刪除。",
      confirm: "刪除帳號",
    },
    displayStatistics: "顯示統計資料",
    hapticFeedback: "觸覺回饋",
    widgets: {
      title: "小工具",
      statistics: "統計小工具",
      social: "社群媒體小工具",
    },
    theme: {
      installed: "已安裝",
      title: "主題",
      light: "淺色",
      dark: "深色",
      auto: "自動",
    },
    language: "語言",
    termsAndConditions: "服務條款",
    privacyPolicy: "隱私權政策",
    contactSupport: "聯絡支援",

    rateApp: {
      title: "為應用程式評分",
      subtitle: "這對我們幫助很大",
    },

    joinOurCommunity: {
      title: "加入我們的社群",
    },

    eraseData: {
      button: "清除應用程式資料",
      dataTakesUp: "資料佔用",
      title: "確定要清除資料嗎？",
      subtitle: "所有資料（包括設定與進度）都將被刪除。此操作無法復原。",
    },

    sourceCode: {
      title: "原始碼",
      githubRepository: "GitHub 儲存庫",
    },

    version: "版本",
  },

  result: {
    drawing: "書寫",
    example: "範例",
    you: "你的",

    title: "練習完成",
    score: "分數",
    percent: "正確率",

    sec: "秒",
    min: "分",
    errors_one: "{{count}} 個錯誤",
    errors_other: "{{count}} 個錯誤",

    question: "題",
    questionNumber: "第{{number}}題",

    done: "完成",

    correct: "正確",
    wrong: "錯誤",
  },

  lessonsList: {
    completed: "已完成",
    failedToLoadLessons: "無法載入課程，請稍後再試。",
  },

  lesson: {
    matchHiraganaWithTransliteration: "將平假名與音譯配對。",
    matchKatakanaWithTransliteration: "將片假名與音譯配對。",
    practiceEveryDay: "每天練習以鞏固知識。",
    learningComplete: "課程完成！",
  },

  transliterationSystems: {
    latin: "拉丁字母",
    cyrillic: "西里爾字母",

    tags: {
      mostPopular: "最常用",
      officialJapan: "日本官方",
      strictest: "最嚴格",
      russianStandard: "俄羅斯標準",
    },

    romaji: "羅馬字",
    transliterationSystems: "音譯系統",
    hepburn: "Hepburn（黑本式）",
    kunreiShiki: "Kunrei-shiki（訓令式）",
    nihonShiki: "Nihon-shiki（日本式）",
    polivanovSystem: "Polivanov 系統",
  },

  alert: {
    exitConformation: {
      title: "確定要離開嗎？",
      subtitle: "如果現在離開，進度將不會儲存。",
    },
    newVersion: {
      title: "有新版本可用。",
      subtitle: "此課程是為較新版本的應用程式製作的。請更新應用程式。",
    },
    cancel: "取消",
    ok: "好",
    confirm: "確認",
  },

  auth: {
    welcome: {
      firstStep: "您學習日語的第一步！",
    },
    agreement: {
      prefix: "繼續即表示您同意：",
      terms: "服務條款",
      privacy: "隱私權政策",
    },
    continueWithGoogle: "使用 Google 繼續",
    googleFailed: "無法使用 Google 登入",
    googleUnavailable: {
      title: "俄羅斯境內無法使用 Google 登入",
      subtitle: "無法在俄羅斯使用 Google 登入。你的 IP 位址：{{ip}}。你可以改用電子郵件註冊。",
    },
    signUpWithEmail: "使用電子郵件註冊",
    alreadyHaveAccount: "已經有帳號了嗎？",
    login: "登入",
    continueWithoutLogin: "不登入繼續",
    fields: {
      newName: "新名稱",
      oldPassword: "舊密碼",
      name: "姓名",
      email: "電子郵件地址",
      password: "密碼",
      newPassword: "新密碼",
      repeatPassword: "再次輸入新密碼",
      birthDate: "出生日期",
      code: "驗證碼",
    },
    signIn: {
      title: "登入",
      submit: "登入",
    },
    signUp: {
      title: "建立帳號",
      submit: "建立帳號",
    },
    verifyEmail: {
      title: "驗證您的電子郵件",
      subtitle: "輸入信中的驗證碼。我們已將其寄至 {{email}}",
      submit: "下一步",
      resend: "重新寄送驗證碼",
      resendCooldown: "重新寄送驗證碼（{{seconds}}）",
    },
    resetPassword: {
      title: "忘記密碼？",
      subtitle: "輸入您的電子郵件地址以接收重設密碼的驗證碼。",
      changeTitle: "變更密碼",
      confirm: "確認",
    },
    errors: {
      incorrectOldPassword: "舊密碼不正確",
      nameTooLong: "名稱不能超過 16 個字元",
      nameRequired: "請輸入姓名",
      emailRequired: "請輸入電子郵件",
      invalidEmail: "電子郵件格式無效",
      dateRequired: "請選擇出生日期",
      tooYoung: "最低年齡為 13 歲",
      passwordMin: "至少 8 個字元",
      passwordLetter: "至少需要一個字母",
      passwordDigit: "至少需要一個數字",
      passwordRepeat: "請再次輸入密碼",
      passwordsMismatch: "密碼不相符",
      emailTaken: "此電子郵件已註冊",
      weakPassword: "密碼強度不足",
      invalidDate: "日期無效或年齡未滿 13 歲",
      requestFailed: "無法傳送請求。請稍後再試。",
      somethingWrong: "發生錯誤。請稍後再試。",
      codeRequired: "請輸入 6 位數驗證碼",
      invalidCode: "驗證碼無效",
      codeExpired: "驗證碼已過期",
      tooManyAttempts: "嘗試次數過多。請重新取得驗證碼，或明天再試。",
      resendCooldown: "請稍候再重新寄送",
      passwordRequired: "請輸入密碼",
      invalidCredentials: "電子郵件或密碼錯誤",
      emailNotVerified: "電子郵件尚未驗證",
      useGoogleToSignIn: "此帳號使用 Google 登入",
      invalidResetToken: "重設工作階段已過期。請重新請求驗證碼。",
      accountMigrating: "帳號正在轉移中。請稍後再試。",
      serverUnavailable: "你的帳號所在伺服器暫時無法使用，請稍後再試。",
      tooManyRequests: "請求過於頻繁，請等待一分鐘後再試。",
      userNotFound: "沒有使用此電子郵件的帳號。請確認地址或註冊。",
      loginBlocked: "密碼錯誤次數過多，密碼登入已鎖定一小時。請重設密碼或使用 Google 登入。",
      emailTakenOtherRegion: "此電子郵件已註冊，請直接登入。",
    },
  },
  profile: {
    stats: {
      daysOfStudy: "學習天數",
      timesOfPractice: "練習次數",
    },

    avatar: {
      title: "大頭貼",
      takePhoto: "拍照",
      chooseFromLibrary: "從相簿選擇",
      remove: "移除大頭貼",
      errors: {
        cameraPermission: "沒有相機權限，請在系統設定中開啟。",
        fileTooLarge: "圖片過大，上限為 5 MB。",
        invalidImage: "不支援的格式，請使用 JPEG、PNG 或 WebP。",
        storageUnavailable: "儲存空間暫時無法使用，請重試。",
        failed: "更新大頭貼失敗，請稍後再試。",
      },
    },
    edit: {
      title: "編輯個人資料",
      name: "名稱",
      password: "密碼",
      changeName: "變更名稱",
      changePassword: "變更密碼",
    },
    signInPrompt: "登入 {{app}} 以在所有裝置上同步進度。",
    signInButton: "登入或建立帳號",
    unavailable: {
      title: "你的伺服器正在維護",
      text: "你的帳號所在伺服器暫時無法使用。課程和練習仍可正常使用，個人檔案很快就會恢復。",
    },
    offline: {
      title: "沒有網路連線",
      text: "無法連線到伺服器，請檢查網路連線。",
    },
  },
  debug: {
    store: "商店",
    deviceId: "裝置 ID",
    apiServers: "API 伺服器",
    notificationToken: "通知權杖",
    checking: "檢查中…",
    pinging: "連線中…",
    unreachable: "無法連線",
    autoSelect: "自動選擇",
    addHost: "新增",
    removeData: "清除資料",
  },
  verbForm: {
    title: "動詞變化：",
    teForm: "て 形：",
    taForm: "た 形：",
    naiForm: "ない 形：",
    dictionaryForm: "辭書形：",
    potentialForm: "可能形：",
    volitionalForm: "意志形：",
    imperativeForm: "命令形：",
    prohibitiveForm: "禁止形：",
    conditionalForm: "條件形 - ば：",
    negativeConditionalForm: "否定條件形 - ば：",
    passiveForm: "受身形：",
    verbCausative: "使役形：",
  },
  boards: {
    title: "看板：",
    createOwn: "自己建立",
    myBoards: "我的看板",
    publicBoards: "公開看板",
    newBoard: "新增看板",
    namePlaceholder: "看板名稱",
    isPublic: "公開看板",
    settingsTitle: "看板設定",
    editors: "編輯者",
    noEditors: "暫無編輯者",
    createInvite: "建立邀請連結",
    inviteUntil: "邀請連結一次有效，有效期至 {{date}}",
    shareLink: "分享連結",
    revoke: "撤銷",
    remove: "移除",
    deleteBoard: "刪除看板",
    deleteTitle: "確定刪除看板？",
    deleteSubtitle: "看板及其所有卡片將被永久刪除。",
    inviteLimit: "活躍邀請過多",
  },
  board: {
    searchPlaceholder: "搜尋",
    searchResults: "搜尋結果",
    nothingFound: "找不到任何結果",
    sectionsTitle: "章節",
  },
  card: {
    examples: "例句：",
    open: "開啟",
    alreadySeen: "已看過",
    kanjiOrder: "筆順：",
    kanjiLevel: "級別：",
    kanjiDescription: "說明：",
    kanjiRadicals: "部首：",
    kanjiElements: "組成部件：",
    edit: "編輯",
    save: "儲存",
    titlePlaceholder: "標題",
    subtitlePlaceholder: "釋義",
    examplePlaceholder: "例句",
    saveError: "無法儲存卡片",
  },
  promotionTelegram: {
    title: "恭喜，你找到了幸運的 Bug！",
    reasonSingle:
      "由於應用程式裡的 Bug 已經沒那麼多了，來我的 Telegram 頻道回報問題的人變少了很多，訂閱我的人也變少了很多",
    reasonMultiple:
      "由於應用程式裡的 Bug 已經沒那麼多了，來我們的 Telegram 頻道回報問題的人變少了很多，訂閱我們的人也變少了很多",
    instructionTitle: "你需要做的事：",
    stepGo: "- 前往 {{channel}}",
    stepSubscribeSingle: "- 訂閱（我會發很多有趣的內容）",
    stepSubscribeMultiple: "- 訂閱（我們會發很多有趣的內容）",
    dontMakeMe: "別逼我加真正的 Bug 喔 :)",
    channelSingle: "我的 Telegram 頻道",
    channelMultiple: "我們的 Telegram 頻道",
    fixMyself: "我自己修",
  },
};

export default ChineseTW;

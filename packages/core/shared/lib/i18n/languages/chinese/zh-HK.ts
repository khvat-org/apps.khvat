const ChineseHK = {
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
      mixed: { title: "混合", subtitle: "全部一次" },
      testing: { title: "測驗", subtitle: "限時選擇答案" },
      drawing: { title: "書寫", subtitle: "書寫平假名／片假名" },
      listening: { title: "聽力", subtitle: "選擇正確答案" },
      multipleChoice: { title: "單字選擇", subtitle: "選擇正確答案" },
      matchingPairs: { title: "配對", subtitle: "配對單字" },
      wordBuilding: { title: "組字", subtitle: "組成單字" },
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
        subtitle: "請選擇 {count} 個平假名字元或 {count} 個片假名字元。",
      },
      insufficientBaseKanaSelected: {
        title: "字元不足",
        subtitle:
          "請選擇 {count} 個基本平假名或 {count} 個基本片假名字元（不包括濁音、半濁音和拗音）。",
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
    words: "單字",
    nothingSelected: "未選擇任何項目",
  },

  settings: {
    logout: {
      button: "登出",
      title: "登出帳號？",
      subtitle: "你將登出帳號，並清除此裝置上的所有本地資料。",
    },
    deleteAccount: {
      button: "刪除帳號",
      confirmTitle: "確定要刪除帳號嗎？",
      confirmSubtitle: "你所有的學習進度和帳號資料都會一併刪除。",
      title: "刪除帳號？",
      subtitle: "輸入我們寄到你電郵的 6 位數字代碼。此操作永久且無法復原。",
      confirm: "刪除帳號",
    },
    displayStatistics: "顯示統計資料",
    hapticFeedback: "觸覺回饋",
    widgets: {
      title: "小工具",
      statistics: "統計小工具",
      social: "社交媒體小工具",
    },
    theme: {
      installed: "已安裝",
      title: "主題",
      light: "淺色",
      dark: "深色",
      auto: "自動",
    },
    language: "語言",
    termsAndConditions: "條款及細則",
    privacyPolicy: "私隱政策",
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
      title: "你確定要清除資料嗎？",
      subtitle: "所有資料包括設定和進度都將被刪除。此操作無法復原。",
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
    failedToLoadLessons: "無法載入課程，請稍後再試。",
    completed: "已完成",
  },

  lesson: {
    matchHiraganaWithTransliteration: "將平假名與羅馬拼音配對。",
    matchKatakanaWithTransliteration: "將片假名與羅馬拼音配對。",
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
    transliterationSystems: "羅馬拼音系統",
    hepburn: "Hepburn（赫本）",
    kunreiShiki: "Kunrei-shiki（訓令式）",
    nihonShiki: "Nihon-shiki（日本式）",
    polivanovSystem: "Polivanov 系統",
  },

  alert: {
    exitConformation: {
      title: "你確定要退出嗎？",
      subtitle: "如果現在退出，進度將不會被儲存。",
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
      firstStep: "你學習日語的第一步！",
    },
    agreement: {
      prefix: "繼續即表示你接受：",
      terms: "服務條款",
      privacy: "私隱政策",
    },
    continueWithGoogle: "使用 Google 繼續",
    googleFailed: "無法使用 Google 登入",
    googleUnavailable: {
      title: "俄羅斯境內無法使用 Google 登入",
      subtitle: "無法在俄羅斯使用 Google 登入。你的 IP 位址：{{ip}}。你可以改用電郵註冊。",
    },
    signUpWithEmail: "使用電郵註冊",
    alreadyHaveAccount: "已有帳號？",
    login: "登入",
    continueWithoutLogin: "不登入繼續",
    fields: {
      newName: "新名稱",
      oldPassword: "舊密碼",
      name: "姓名",
      email: "電郵地址",
      password: "密碼",
      newPassword: "新密碼",
      repeatPassword: "重新輸入新密碼",
      birthDate: "出生日期",
      code: "代碼",
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
      title: "驗證你的電郵",
      subtitle: "輸入電郵中的代碼。我們已寄到 {{email}}",
      submit: "下一步",
      resend: "再寄一個代碼",
      resendCooldown: "再寄一個代碼（{{seconds}}）",
    },
    resetPassword: {
      title: "忘記密碼？",
      subtitle: "輸入你的電郵地址以接收重設密碼的代碼。",
      changeTitle: "更改你的密碼",
      confirm: "確認",
    },
    errors: {
      incorrectOldPassword: "舊密碼不正確",
      nameTooLong: "名稱不可超過 16 個字元",
      nameRequired: "請輸入姓名",
      emailRequired: "請輸入電郵",
      invalidEmail: "電郵無效",
      dateRequired: "請選擇出生日期",
      tooYoung: "最低年齡為 13 歲",
      passwordMin: "最少 8 個字元",
      passwordLetter: "至少需要一個字母",
      passwordDigit: "至少需要一個數字",
      passwordRepeat: "請重複密碼",
      passwordsMismatch: "密碼不一致",
      emailTaken: "電郵已註冊",
      weakPassword: "密碼太弱",
      invalidDate: "日期無效或年齡未滿 13 歲",
      requestFailed: "無法發送請求。請稍後再試。",
      somethingWrong: "出了點問題。請稍後再試。",
      codeRequired: "請輸入 6 位數字代碼",
      invalidCode: "代碼無效",
      codeExpired: "代碼已過期",
      tooManyAttempts: "嘗試次數過多。請重新索取驗證碼，或明天再試。",
      resendCooldown: "請稍候再要求新代碼",
      passwordRequired: "請輸入密碼",
      invalidCredentials: "電郵或密碼無效",
      emailNotVerified: "電郵尚未驗證",
      useGoogleToSignIn: "此帳號使用 Google 登入",
      invalidResetToken: "重設工作階段已過期。請重新要求代碼。",
      accountMigrating: "帳號正在轉移中。請稍後再試。",
      serverUnavailable: "你的帳號所在伺服器暫時無法使用，請稍後再試。",
      tooManyRequests: "請求過於頻密，請等一分鐘後再試。",
      userNotFound: "沒有使用此電郵的帳號。請檢查地址或註冊。",
      loginBlocked: "密碼錯誤次數過多，密碼登入已鎖定一小時。請重設密碼或使用 Google 登入。",
      emailTakenOtherRegion: "此電郵已註冊，請直接登入。",
    },
  },
  profile: {
    stats: {
      daysOfStudy: "學習天數",
      timesOfPractice: "練習次數",
    },

    avatar: {
      title: "頭像",
      takePhoto: "拍照",
      chooseFromLibrary: "從相簿選擇",
      remove: "移除頭像",
      errors: {
        cameraPermission: "沒有相機權限，請在系統設定中開啟。",
        fileTooLarge: "圖片太大，上限為 5 MB。",
        invalidImage: "不支援的格式，請使用 JPEG、PNG 或 WebP。",
        storageUnavailable: "儲存空間暫時無法使用，請再試一次。",
        failed: "更新頭像失敗，請稍後再試。",
      },
    },
    edit: {
      title: "編輯個人檔案",
      name: "名稱",
      password: "密碼",
      changeName: "變更名稱",
      changePassword: "變更密碼",
    },
    signInPrompt: "登入 {{app}} 以在所有裝置同步進度。",
    signInButton: "登入或建立帳號",
    unavailable: {
      title: "你的伺服器正在維護",
      text: "你的帳號所在伺服器暫時無法使用。課程和練習仍可正常使用，個人檔案很快就會恢復。",
    },
    offline: {
      title: "沒有網絡連線",
      text: "無法連線到伺服器，請檢查網絡連線。",
    },
  },
  debug: {
    store: "商店",
    deviceId: "裝置 ID",
    apiServers: "API 伺服器",
    notificationToken: "通知權杖",
    checking: "檢查中…",
    pinging: "測試中…",
    unreachable: "無法使用",
    autoSelect: "自動選擇",
    addHost: "新增",
    removeData: "清除資料",
  },
  verbForm: {
    title: "動詞形式：",
    teForm: "て 形式：",
    taForm: "た 形式：",
    naiForm: "ない 形式：",
    dictionaryForm: "辭書形：",
    potentialForm: "可能形：",
    volitionalForm: "意向形：",
    imperativeForm: "命令形：",
    prohibitiveForm: "禁止形：",
    conditionalForm: "條件形 - ば：",
    negativeConditionalForm: "否定條件形 - ば：",
    passiveForm: "受身形：",
    verbCausative: "使役形：",
  },
  boards: {
    title: "看板：",
    createOwn: "建立自己的",
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
    examples: "例子：",
    open: "開啟",
    alreadySeen: "已經看過",
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
    title: "恭喜，你發現了幸運的錯誤！",
    reasonSingle:
      "由於應用程式中的錯誤已經不多，較少人會到我的 Telegram 頻道報告問題，也較少人訂閱我",
    reasonMultiple:
      "由於應用程式中的錯誤已經不多，較少人會到我們的 Telegram 頻道報告問題，也較少人訂閱我們",
    instructionTitle: "你需要做的是：",
    stepGo: "- 前往 {{channel}}",
    stepSubscribeSingle: "- 訂閱（我會發佈很多有趣的內容）",
    stepSubscribeMultiple: "- 訂閱（我們會發佈很多有趣的內容）",
    dontMakeMe: "別逼我加入真正的錯誤 :)",
    channelSingle: "我的 Telegram 頻道",
    channelMultiple: "我們的 Telegram 頻道",
    fixMyself: "我自己會修復",
  },
};

export default ChineseHK;

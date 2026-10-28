const ChineseCN = {
  common: {
    space: "空格",
    save: "保存",
    done: "完成",
    close: "关闭",
    reset: "重置",
    back: "返回",
    next: "下一步",
    retry: "重试",
    complete: "完成",
    start: "开始",
    check: "检查",
    welcome: "欢迎",
  },

  tabs: {
    boards: "看板",
    learning: "课程",
    practice: "练习",
    kana: "假名",
    settings: "设置",
    profile: "个人资料",
  },

  practice: {
    question: "问题",

    modes: {
      mixed: { title: "混合", subtitle: "全部一起" },
      testing: { title: "测试", subtitle: "限时选择答案" },
      drawing: { title: "书写", subtitle: "书写平假名 / 片假名" },
      listening: { title: "听力", subtitle: "选择正确答案" },
      multipleChoice: { title: "选词", subtitle: "选择正确答案" },
      matchingPairs: { title: "配对", subtitle: "匹配单词对" },
      wordBuilding: { title: "组词", subtitle: "组成单词" },
      typing: { title: "输入", subtitle: "输入音节" },
    },

    playAudio: "播放音频",

    preferences: {
      title: "偏好设置",
      autoplaySound: "自动播放声音",
      questionsCount: "题目数量",
      timer: "计时器",
      mixMode: "混合模式",
      timerSeconds: "每题时间",
      seconds: "{{count}} 秒",
    },

    alert: {
      insufficientKanaSelected: {
        title: "字符不足",
        subtitle: "请选择 {count} 个平假名或 {count} 个片假名字符。",
      },
      insufficientWordsAvailable: {
        title: "可用单词不足",
        subtitle: "可用单词少于所需数量。请选择更多平假名或片假名音节。",
      },
    },
  },

  kana: {
    hiragana: "平假名",
    katakana: "片假名",
    romaji: "罗马字",

    basic: "基本",
    dakuon: "浊音",
    handakuon: "半浊音",
    yoon: "拗音",
  },

  selectKana: {
    chooseKana: "选择假名",
    words: "单词",
    nothingSelected: "未选择任何内容",
  },

  settings: {
    logout: {
      button: "退出登录",
      title: "退出登录？",
      subtitle: "您将退出登录，此设备上的所有本地数据将被清除。",
    },
    deleteAccount: {
      button: "删除账户",
      confirmTitle: "确定要删除账户吗？",
      confirmSubtitle: "您的所有学习进度和账户数据都将一并删除。",
      title: "删除账户？",
      subtitle: "请输入我们发送到您邮箱的 6 位验证码。此操作不可撤销，账户和所有数据将被删除。",
      confirm: "删除",
    },
    displayStatistics: "显示统计",
    hapticFeedback: "触觉反馈",
    widgets: {
      title: "小组件",
      statistics: "统计小组件",
      social: "社交媒体小组件",
    },
    theme: {
      installed: "已安装",
      title: "主题",
      light: "浅色",
      dark: "深色",
      auto: "自动",
    },
    language: "语言",
    termsAndConditions: "服务条款",
    privacyPolicy: "隐私政策",
    contactSupport: "联系客服",

    rateApp: {
      title: "评价应用",
      subtitle: "这真的对我们很有帮助",
    },

    joinOurCommunity: {
      title: "加入我们的社区",
    },

    eraseData: {
      button: "清除应用数据",
      dataTakesUp: "数据占用",
      title: "确定要清除数据吗？",
      subtitle: "所有数据（包括设置和进度）将被删除。此操作不可撤销。",
    },

    sourceCode: {
      title: "源代码",
      githubRepository: "GitHub 仓库",
    },

    version: "版本",
  },

  result: {
    drawing: "书写",
    example: "示例",
    you: "你的",

    title: "练习完成",
    score: "得分",
    percent: "正确率",

    sec: "秒",
    min: "分",
    errors_one: "{{count}} 个错误",
    errors_other: "{{count}} 个错误",

    question: "题",
    questionNumber: "第{{number}}题",

    done: "完成",

    correct: "正确",
    wrong: "错误",
  },

  lessonsList: {
    failedToLoadLessons: "加载课程失败，请稍后再试。",
    completed: "已完成",
  },

  lesson: {
    matchHiraganaWithTransliteration: "将平假名与转写匹配。",
    matchKatakanaWithTransliteration: "将片假名与转写匹配。",
    practiceEveryDay: "每天练习以巩固知识。",
    learningComplete: "课程完成！",
  },

  transliterationSystems: {
    latin: "拉丁字母",
    cyrillic: "西里尔字母",

    tags: {
      mostPopular: "最常用",
      officialJapan: "日本官方",
      strictest: "最严格",
      russianStandard: "俄罗斯标准",
    },

    romaji: "罗马字",
    transliterationSystems: "转写系统",
    hepburn: "Hepburn（赫本式）",
    kunreiShiki: "Kunrei-shiki（训令式）",
    nihonShiki: "Nihon-shiki（日本式）",
    polivanovSystem: "波利瓦诺夫系统",
  },

  alert: {
    exitConformation: {
      title: "确定要退出吗？",
      subtitle: "如果现在退出，您的进度将不会被保存。",
    },
    newVersion: {
      title: "有新版本可用。",
      subtitle: "此课程是为更新版本的应用程序制作的。请更新应用程序。",
    },
    cancel: "取消",
    ok: "好的",
    confirm: "确认",
  },

  auth: {
    welcome: {
      firstStep: "学习日语的第一步！",
    },
    agreement: {
      prefix: "继续即表示您接受：",
      terms: "服务条款",
      privacy: "隐私政策",
    },
    continueWithGoogle: "使用 Google 继续",
    googleFailed: "无法使用 Google 登录",
    googleUnavailable: {
      title: "俄罗斯境内无法使用 Google 登录",
      subtitle: "无法在俄罗斯使用 Google 登录。你的 IP 地址：{{ip}}。你可以改用邮箱注册。",
    },
    signUpWithEmail: "使用邮箱注册",
    alreadyHaveAccount: "已有账户？",
    login: "登录",
    continueWithoutLogin: "不登录继续",
    fields: {
      newName: "新名称",
      oldPassword: "旧密码",
      name: "姓名",
      email: "电子邮箱",
      password: "密码",
      newPassword: "新密码",
      repeatPassword: "再次输入新密码",
      birthDate: "出生日期",
      code: "验证码",
    },
    signIn: {
      title: "登录",
      submit: "登录",
    },
    signUp: {
      title: "创建账户",
      submit: "创建账户",
    },
    verifyEmail: {
      title: "验证邮箱",
      subtitle: "请输入邮件中的验证码。我们已发送至 {{email}}",
      submit: "下一步",
      resend: "重新发送验证码",
      resendCooldown: "重新发送验证码（{{seconds}}）",
    },
    resetPassword: {
      title: "忘记密码？",
      subtitle: "请输入您的电子邮箱以接收重置密码的验证码。",
      changeTitle: "修改密码",
      confirm: "确认",
    },
    errors: {
      incorrectOldPassword: "旧密码不正确",
      nameTooLong: "名称不能超过 16 个字符",
      nameRequired: "请输入姓名",
      emailRequired: "请输入邮箱",
      invalidEmail: "邮箱格式无效",
      dateRequired: "请选择出生日期",
      tooYoung: "最低年龄为 13 岁",
      passwordMin: "至少 8 个字符",
      passwordLetter: "至少包含一个字母",
      passwordDigit: "至少包含一个数字",
      passwordRepeat: "请重复输入密码",
      passwordsMismatch: "两次密码不一致",
      emailTaken: "该邮箱已被注册",
      weakPassword: "密码强度太弱",
      invalidDate: "日期无效或年龄未满 13 岁",
      requestFailed: "请求发送失败，请稍后再试。",
      somethingWrong: "出了点问题，请稍后再试。",
      codeRequired: "请输入 6 位验证码",
      invalidCode: "验证码无效",
      codeExpired: "验证码已过期",
      tooManyAttempts: "尝试次数过多。请重新获取验证码，或明天再试。",
      resendCooldown: "请稍候再重新发送",
      passwordRequired: "请输入密码",
      invalidCredentials: "邮箱或密码错误",
      emailNotVerified: "邮箱未验证",
      useGoogleToSignIn: "此账户使用 Google 登录",
      invalidResetToken: "重置会话已过期，请重新获取验证码。",
      accountMigrating: "账户正在迁移中，请稍后再试。",
      serverUnavailable: "你的账户所在服务器暂时不可用，请稍后再试。",
      tooManyRequests: "请求过于频繁，请等待一分钟后再试。",
      userNotFound: "没有使用该邮箱的账户。请检查地址或注册。",
      loginBlocked: "密码错误次数过多，密码登录已锁定一小时。请重置密码或使用 Google 登录。",
      emailTakenOtherRegion: "该邮箱已注册，请直接登录。",
    },
  },
  profile: {
    widgets: {
      hide: "隐藏小组件",
    },

    stats: {
      daysOfStudy: "学习天数",
      timesOfPractice: "练习次数",
    },

    avatar: {
      title: "头像",
      takePhoto: "拍照",
      chooseFromLibrary: "从相册选择",
      remove: "移除头像",
      errors: {
        cameraPermission: "没有相机权限，请在系统设置中开启。",
        fileTooLarge: "图片过大，上限为 5 MB。",
        invalidImage: "不支持的格式，请使用 JPEG、PNG 或 WebP。",
        storageUnavailable: "存储暂时不可用，请重试。",
        failed: "更新头像失败，请稍后重试。",
      },
    },
    edit: {
      title: "编辑资料",
      name: "名称",
      password: "密码",
      changeName: "修改名称",
      changePassword: "修改密码",
    },
    signInPrompt: "登录 {{app}} 以在所有设备上同步进度。",
    signInButton: "登录或创建账户",
    unavailable: {
      title: "你的服务器正在维护",
      text: "你的账户所在服务器暂时不可用。课程和练习仍可正常使用，个人资料很快就会恢复。",
    },
    offline: {
      title: "无网络连接",
      text: "无法连接到服务器，请检查网络连接。",
    },
  },
  debug: {
    store: "商店",
    deviceId: "设备 ID",
    apiServers: "API 服务器",
    notificationToken: "通知令牌",
    checking: "检查中…",
    pinging: "正在 ping…",
    unreachable: "不可用",
    autoSelect: "自动选择",
    addHost: "添加",
    removeData: "清除数据",
  },
  verbForm: {
    title: "动词形式：",
    teForm: "て 形：",
    taForm: "た 形：",
    naiForm: "ない 形：",
    dictionaryForm: "词典形：",
    potentialForm: "可能形：",
    volitionalForm: "意向形：",
    imperativeForm: "命令形：",
    prohibitiveForm: "禁止形：",
    conditionalForm: "条件形 - ば：",
    negativeConditionalForm: "否定条件形 - ば：",
    passiveForm: "被动形：",
    verbCausative: "使役形：",
  },
  boards: {
    title: "看板：",
    createOwn: "创建自己的",
    myBoards: "我的看板",
    publicBoards: "公开看板",
    newBoard: "新建看板",
    namePlaceholder: "看板名称",
    isPublic: "公开看板",
    settingsTitle: "看板设置",
    editors: "编辑者",
    noEditors: "暂无编辑者",
    createInvite: "创建邀请链接",
    inviteUntil: "邀请链接一次性有效，有效期至 {{date}}",
    shareLink: "分享链接",
    revoke: "撤销",
    remove: "移除",
    deleteBoard: "删除看板",
    deleteTitle: "确定删除看板？",
    deleteSubtitle: "看板及其所有卡片将被永久删除。",
    inviteLimit: "活动邀请过多",
  },
  board: {
    searchPlaceholder: "搜索",
    searchResults: "搜索结果",
    nothingFound: "未找到任何内容",
    sectionsTitle: "分区",
    cardView: "卡片视图",
    tags: "标签",
    images: "图片",
    columns: "每行卡片数",
    settingsLabel: "设置",
    lessonsLabel: "课程",
    cardsLabel: "卡片",
    bookmarks: "已保存",
    sectionsLabel: "分区",
    bookmarksEmpty: "你保存的卡片会显示在这里",
  },
  card: {
    examples: "例句：",
    open: "打开",
    alreadySeen: "已见过",
    kanjiOrder: "笔顺：",
    kanjiLevel: "级别：",
    kanjiDescription: "说明：",
    kanjiRadicals: "部首：",
    kanjiElements: "构成部件：",
    edit: "编辑",
    save: "保存",
    titlePlaceholder: "标题",
    subtitlePlaceholder: "释义",
    examplePlaceholder: "例句",
    saveError: "无法保存卡片",
    bookmarkAdd: "保存",
    bookmarkRemove: "移除",
  },
  promotionTelegram: {
    title: "恭喜，你发现了一个幸运的 bug！",
    reasonSingle:
      "由于应用中的 bug 已经不多了，来我的 Telegram 频道报告问题的人少了很多，订阅我的人也少了很多",
    reasonMultiple:
      "由于应用中的 bug 已经不多了，来我们的 Telegram 频道报告问题的人少了很多，订阅我们的人也少了很多",
    instructionTitle: "你需要做的是：",
    stepGo: "- 前往 {{channel}}",
    stepSubscribeSingle: "- 订阅（我会发布很多有趣的内容）",
    stepSubscribeMultiple: "- 订阅（我们会发布很多有趣的内容）",
    dontMakeMe: "别逼我加真正的 bug 哦 :)",
    channelSingle: "我的 Telegram 频道",
    channelMultiple: "我们的 Telegram 频道",
    fixMyself: "我自己会修",
  },
};

export default ChineseCN;

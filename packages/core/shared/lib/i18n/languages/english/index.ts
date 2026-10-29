const English = {
  common: {
    space: "Space",
    save: "Save",
    done: "Done",
    close: "Close",
    reset: "Reset",
    back: "Back",
    next: "Next",
    retry: "Retry",
    complete: "Complete",
    start: "Start",
    check: "Check",
    welcome: "Welcome",
  },

  tabs: {
    boards: "Boards",
    learning: "Lessons",
    practice: "Practice",
    kana: "Kana",
    settings: "Settings",
    profile: "Profile",
  },

  practice: {
    question: "Question",

    modes: {
      mixed: { title: "Mixed", subtitle: "All at once" },
      testing: { title: "Test", subtitle: "Answer against the clock" },
      drawing: { title: "Drawing", subtitle: "Draw the Hiragana/Katakana" },
      listening: { title: "Listening", subtitle: "Select the correct answer" },
      multipleChoice: { title: "Word Selection", subtitle: "Choose the correct answer" },
      matchingPairs: { title: "Matching Pairs", subtitle: "Match word pairs" },
      wordBuilding: { title: "Word Building", subtitle: "Form a word" },
      typing: { title: "Typing", subtitle: "Type the syllable" },
    },

    playAudio: "Play Audio",

    preferences: {
      title: "Preferences",
      autoplaySound: "Autoplay sound",
      questionsCount: "Question count",
      timer: "Timer",
      mixMode: "Mix mode",
      timerSeconds: "Time per question",
      seconds: "{{count}} s",
    },

    alert: {
      insufficientKanaSelected: {
        title: "Not Enough Characters",
        subtitle: "Please select {count} Hiragana characters or {count} Katakana characters.",
      },
      insufficientWordsAvailable: {
        title: "Not Enough Words Available",
        subtitle:
          "There are fewer available words than required. Please select more Hiragana or Katakana syllables.",
      },
    },
  },

  kana: {
    hiragana: "Hiragana",
    katakana: "Katakana",
    romaji: "Romaji",

    basic: "Basic",
    dakuon: "Dakuon",
    handakuon: "Handakuon",
    yoon: "Yoon",
    row: "{{row}} row",
  },

  selectKana: {
    chooseKana: "Choose kana",
    words: "Words",
    nothingSelected: "Nothing selected",
  },

  settings: {
    logout: {
      button: "Log out",
      title: "Log out?",
      subtitle: "You will be logged out and all local data on this device will be cleared.",
    },
    deleteAccount: {
      button: "Remove account",
      confirmTitle: "Are you sure you want to delete your account?",
      confirmSubtitle: "All your progress and account data will be deleted along with it.",
      title: "Delete account?",
      subtitle:
        "Enter the 6-digit code we sent to your email. This action is permanent and cannot be undone.",
      confirm: "Delete",
    },
    displayStatistics: "Show statistics",
    hapticFeedback: "Haptic feedback",
    widgets: {
      title: "Widgets",
      statistics: "Statistics widget",
      social: "Social media widget",
    },
    theme: {
      installed: "Installed",
      title: "Theme",
      light: "Light",
      dark: "Dark",
      auto: "Automatic",
    },
    language: "Language",
    termsAndConditions: "Terms & Conditions",
    privacyPolicy: "Privacy Policy",
    contactSupport: "Contact support",

    rateApp: {
      title: "Rate the app",
      subtitle: "It really helps us a lot",
    },

    joinOurCommunity: {
      title: "Join our community",
    },

    eraseData: {
      button: "Clear app data",
      dataTakesUp: "Data used",
      title: "Are you sure you want to erase data?",
      subtitle:
        "All data including settings and progress will be deleted. This action cannot be undone.",
    },

    sourceCode: {
      title: "Source code",
      githubRepository: "GitHub Repository",
    },

    version: "Version",
  },

  result: {
    drawing: "Drawing",
    example: "Example",
    you: "You",

    title: "Practice Complete",
    score: "Score",
    percent: "Percent",

    sec: "sec",
    min: "min",
    errors_one: "{{count}} error",
    errors_other: "{{count}} errors",

    question: "question",
    questionNumber: "Q{{number}}",

    done: "Done",

    correct: "Correct",
    wrong: "Incorrect",
  },

  lessonsList: {
    completed: "completed",
    failedToLoadLessons: "Failed to load lessons, please try again later.",
  },

  lesson: {
    matchHiraganaWithTransliteration: "Match Hiragana with transliteration.",
    matchKatakanaWithTransliteration: "Match Katakana with transliteration.",
    practiceEveryDay: "Practice daily to reinforce your knowledge.",
    learningComplete: "Lesson completed!",
  },

  transliterationSystems: {
    latin: "Latin",
    cyrillic: "Cyrillic",

    tags: {
      mostPopular: "Most popular",
      officialJapan: "Official in Japan",
      strictest: "Strictest",
      russianStandard: "Standard in Russia",
    },

    romaji: "Romaji",
    transliterationSystems: "Transliteration Systems",
    hepburn: "Hepburn",
    kunreiShiki: "Kunrei-shiki",
    nihonShiki: "Nihon-shiki",
    polivanovSystem: "Polivanov System",
  },

  alert: {
    exitConformation: {
      title: "Are you sure you want to exit?",
      subtitle: "Your progress will not be saved if you exit now.",
    },
    newVersion: {
      title: "A new version is available.",
      subtitle: "This lesson was made for a newer app version. Please update the app.",
    },
    cancel: "Cancel",
    ok: "OK",
    confirm: "Confirm",
  },

  auth: {
    welcome: {
      firstStep: "Your first step to learning Japanese!",
    },
    agreement: {
      prefix: "By continuing, you accept: ",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
    },
    continueWithGoogle: "Continue with Google",
    googleFailed: "Couldn't sign in with Google",
    googleUnavailable: {
      title: "Google sign-in is unavailable in Russia",
      subtitle:
        "Google sign-in can't be used from Russia. Your IP address: {{ip}}. You can sign up with email instead.",
    },
    signUpWithEmail: "Sign up with email",
    alreadyHaveAccount: "Already have an account?",
    login: "Log in",
    continueWithoutLogin: "Continue without signing in",
    fields: {
      newName: "New name",
      oldPassword: "Old password",
      name: "Name",
      email: "Email address",
      password: "Password",
      newPassword: "New password",
      repeatPassword: "Retype new password",
      birthDate: "Date of birth",
      code: "Code",
    },
    signIn: {
      title: "Sign in",
      submit: "Log in",
    },
    signUp: {
      title: "Create an account",
      submit: "Create account",
    },
    verifyEmail: {
      title: "Verify your email",
      subtitle: "Enter the code from the email. We sent it to {{email}}",
      submit: "Next",
      resend: "Send another code",
      resendCooldown: "Send another code ({{seconds}})",
    },
    resetPassword: {
      title: "Forgot password?",
      subtitle: "Enter your email address to receive a code to reset your password.",
      changeTitle: "Change your password",
      confirm: "Confirm",
    },
    errors: {
      incorrectOldPassword: "Incorrect old password",
      nameTooLong: "Name must be 16 characters or fewer",
      nameRequired: "Enter your name",
      emailRequired: "Enter your email",
      invalidEmail: "Invalid email",
      dateRequired: "Select your date of birth",
      tooYoung: "Minimum age is 13",
      passwordMin: "At least 8 characters",
      passwordLetter: "Add at least one letter",
      passwordDigit: "Add at least one digit",
      passwordRepeat: "Repeat the password",
      passwordsMismatch: "Passwords do not match",
      emailTaken: "Email already registered",
      weakPassword: "Password is too weak",
      invalidDate: "Invalid date or age under 13",
      requestFailed: "Couldn't send the request. Please try again later.",
      somethingWrong: "Something went wrong. Please try again later.",
      codeRequired: "Enter the 6-digit code",
      invalidCode: "Invalid code",
      codeExpired: "The code has expired",
      tooManyAttempts: "Too many attempts. Request a new code or try again tomorrow.",
      resendCooldown: "Please wait before requesting a new code",
      passwordRequired: "Enter your password",
      invalidCredentials: "Invalid email or password",
      emailNotVerified: "Email is not verified",
      useGoogleToSignIn: "This account uses Google sign-in",
      invalidResetToken: "Reset session expired. Request a new code.",
      accountMigrating: "Account is being transferred. Please try again later.",
      serverUnavailable:
        "The server for your account is temporarily unavailable. Please try again later.",
      tooManyRequests: "Too many requests. Please wait a minute and try again.",
      userNotFound: "No account with this email. Check the address or sign up.",
      loginBlocked:
        "Too many wrong passwords. Password sign-in is locked for an hour. Reset your password or sign in with Google.",
      emailTakenOtherRegion: "This email is already registered. Please sign in instead.",
    },
  },
  profile: {
    widgets: {
      hide: "Hide widget",
    },

    stats: {
      daysOfStudy: "days of study",
      timesOfPractice: "times of practice",
    },

    avatar: {
      title: "Profile photo",
      takePhoto: "Take photo",
      chooseFromLibrary: "Choose from library",
      remove: "Remove photo",
      errors: {
        cameraPermission: "Camera access is not allowed. Enable it in your device settings.",
        fileTooLarge: "The image is too large. Maximum size is 5 MB.",
        invalidImage: "Unsupported image. Use JPEG, PNG or WebP.",
        storageUnavailable: "Storage is temporarily unavailable. Please try again.",
        failed: "Couldn't update the photo. Please try again later.",
      },
    },
    edit: {
      title: "Edit profile",
      name: "Name",
      password: "Password",
      changeName: "Change name",
      changePassword: "Change password",
    },
    signInPrompt: "Sign in to {{app}} to sync your progress across devices.",
    signInButton: "Sign in or create an account",
    unavailable: {
      title: "Technical work on your server",
      text: "Your account's server is temporarily unavailable. Lessons and practice keep working, and your profile will be back soon.",
    },
    offline: {
      title: "No connection",
      text: "Couldn't reach the server. Check your internet connection.",
    },
  },
  debug: {
    store: "Store",
    deviceId: "Device ID",
    apiServers: "API Servers",
    notificationToken: "Notification Token",
    checking: "Checking…",
    pinging: "Pinging…",
    unreachable: "Unavailable",
    autoSelect: "Auto-select",
    addHost: "Add",
    removeData: "Remove data",
  },
  verbForm: {
    title: "Verb forms:",
    teForm: "て form:",
    taForm: "た form:",
    naiForm: "ない form:",
    dictionaryForm: "Dictionary form:",
    potentialForm: "Potential form:",
    volitionalForm: "Volitional mood:",
    imperativeForm: "Imperative mood:",
    prohibitiveForm: "Prohibitive mood:",
    conditionalForm: "Conditional form - ば:",
    negativeConditionalForm: "Negative conditional form - ば:",
    passiveForm: "Passive voice:",
    verbCausative: "Causative form:",
  },
  boards: {
    title: "Boards:",
    createOwn: "Create own",
    myBoards: "My boards",
    publicBoards: "Public boards",
    newBoard: "New board",
    namePlaceholder: "Board name",
    isPublic: "Public board",
    settingsTitle: "Board settings",
    editors: "Editors",
    noEditors: "No editors yet",
    createInvite: "Create invite link",
    inviteUntil: "Single-use link, valid until {{date}}",
    shareLink: "Share link",
    revoke: "Revoke",
    remove: "Remove",
    deleteBoard: "Delete board",
    deleteTitle: "Delete this board?",
    deleteSubtitle: "The board and all its cards will be deleted permanently.",
    inviteLimit: "Too many active invites",
  },
  board: {
    searchPlaceholder: "Search",
    searchResults: "Search",
    nothingFound: "Nothing found",
    sectionsTitle: "Sections",
    cardView: "Card view",
    tags: "Tags",
    images: "Images",
    columns: "Cards per row",
    settingsLabel: "Settings",
    lessonsLabel: "Lessons",
    cardsLabel: "Cards",
    bookmarks: "Saved",
    sectionsLabel: "Sections",
    bookmarksEmpty: "Cards you save will appear here",
  },
  card: {
    examples: "Examples:",
    open: "Open",
    alreadySeen: "Already seen",
    kanjiOrder: "Writing order:",
    kanjiLevel: "Level:",
    kanjiDescription: "Description:",
    kanjiRadicals: "Radicals:",
    kanjiElements: "Elements:",
    edit: "Edit",
    save: "Save",
    titlePlaceholder: "Title",
    subtitlePlaceholder: "Translation",
    examplePlaceholder: "Example",
    saveError: "Failed to save the card",
    bookmarkAdd: "Save",
    bookmarkRemove: "Remove",
  },
  promotionTelegram: {
    title: "Congratulations, you've found a lucky bug!",
    reasonSingle:
      "Since there aren't that many bugs in the app anymore, far fewer people visit my Telegram channel to report issues, and far fewer people subscribe to me",
    reasonMultiple:
      "Since there aren't that many bugs in the app anymore, far fewer people visit our Telegram channels to report issues, and far fewer people subscribe to us",
    instructionTitle: "Here's what you need to do:",
    stepGo: "- Go to {{channel}}",
    stepSubscribeSingle: "- Subscribe (I'll be posting lots of interesting stuff)",
    stepSubscribeMultiple: "- Subscribe (we'll be posting lots of interesting stuff)",
    dontMakeMe: "Don't make me add real bugs :)",
    channelSingle: "My Telegram channel",
    channelMultiple: "Our Telegram channels",
    fixMyself: "I'll fix it myself",
  },

  report: {
    title: "Report an error",
    subtitle: "What's wrong with this question? We'll fix it right away.",
    placeholder: "Text",
    upload: "Upload",
    send: "Send report",
    success: {
      title: "Thank you!",
      subtitle: "We've received your report and will fix the error.",
    },
    errors: {
      too_large: "The images are too large. Try removing some of them.",
      rate_limited: "Too many reports. Please try again later.",
      unavailable: "Couldn't send the report. Please try again later.",
      invalid: "Something went wrong. Please try again.",
    },
    tags: {
      grammatical_typo: "Grammatical typo",
      interface_error: "Interface error",
      incorrect_information: "Incorrect information",
      answer_marked_wrong: "Correct answer not accepted",
      incorrect_character: "Incorrect character",
      other: "Other",
    },
  },
};

export default English;

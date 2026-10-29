const Indonesian = {
  common: {
    space: "Spasi",
    save: "Simpan",
    done: "Selesai",
    close: "Tutup",
    reset: "Atur ulang",
    back: "Kembali",
    next: "Berikutnya",
    retry: "Coba lagi",
    complete: "Selesai",
    start: "Mulai",
    check: "Periksa",
    welcome: "Selamat datang",
  },

  tabs: {
    boards: "Papan",
    learning: "Pelajaran",
    practice: "Latihan",
    kana: "Kana",
    settings: "Pengaturan",
    profile: "Profil",
  },

  practice: {
    question: "Pertanyaan",

    modes: {
      mixed: { title: "Campuran", subtitle: "Semuanya sekaligus" },
      testing: { title: "Tes", subtitle: "Jawab dengan batas waktu" },
      drawing: { title: "Menggambar", subtitle: "Gambar Hiragana / Katakana" },
      listening: { title: "Mendengarkan", subtitle: "Pilih jawaban yang benar" },
      multipleChoice: { title: "Pilihan Kata", subtitle: "Pilih jawaban yang benar" },
      matchingPairs: { title: "Pasangkan", subtitle: "Cocokkan pasangan kata" },
      wordBuilding: { title: "Membentuk Kata", subtitle: "Susun sebuah kata" },
      typing: { title: "Mengetik", subtitle: "Ketik suku kata" },
    },

    playAudio: "Putar Audio",

    preferences: {
      title: "Preferensi",
      autoplaySound: "Suara otomatis",
      questionsCount: "Jumlah pertanyaan",
      timer: "Pengatur waktu",
      mixMode: "Mode campuran",
      timerSeconds: "Waktu per pertanyaan",
      seconds: "{{count}} dtk",
    },

    alert: {
      insufficientKanaSelected: {
        title: "Karakter tidak cukup",
        subtitle: "Silakan pilih {count} karakter Hiragana atau {count} karakter Katakana.",
      },
      insufficientWordsAvailable: {
        title: "Kata yang tersedia tidak cukup",
        subtitle:
          "Jumlah kata yang tersedia kurang dari yang dibutuhkan. Silakan pilih lebih banyak suku kata Hiragana atau Katakana.",
      },
    },
  },

  kana: {
    hiragana: "Hiragana",
    katakana: "Katakana",
    romaji: "Romaji",

    basic: "Dasar",
    dakuon: "Dakuon",
    handakuon: "Handakuon",
    yoon: "Yoon",
  },

  selectKana: {
    chooseKana: "Pilih kana",
    words: "Kata",
    nothingSelected: "Tidak ada yang dipilih",
  },

  settings: {
    logout: {
      button: "Keluar",
      title: "Keluar dari akun?",
      subtitle: "Anda akan keluar dari akun, dan semua data lokal di perangkat ini akan dihapus.",
    },
    deleteAccount: {
      button: "Hapus akun",
      confirmTitle: "Yakin ingin menghapus akun Anda?",
      confirmSubtitle: "Semua progres dan data akun Anda akan ikut terhapus.",
      title: "Hapus akun?",
      subtitle:
        "Masukkan kode 6 digit dari email. Tindakan ini permanen dan tidak dapat dibatalkan — akun serta semua data akan dihapus.",
      confirm: "Hapus",
    },
    displayStatistics: "Tampilkan statistik",
    hapticFeedback: "Umpan balik haptic",
    widgets: {
      title: "Widget",
      statistics: "Widget statistik",
      social: "Widget media sosial",
    },
    theme: {
      installed: "Terpasang",
      title: "Tema",
      light: "Terang",
      dark: "Gelap",
      auto: "Otomatis",
    },
    language: "Bahasa",
    privacyPolicy: "Kebijakan Privasi",
    termsAndConditions: "Syarat & Ketentuan",
    contactSupport: "Hubungi dukungan",

    rateApp: {
      title: "Beri rating aplikasi",
      subtitle: "Ini sangat membantu kami",
    },

    joinOurCommunity: {
      title: "Bergabung dengan komunitas kami",
    },

    eraseData: {
      button: "Hapus data aplikasi",
      dataTakesUp: "Data menggunakan",
      title: "Apakah Anda yakin ingin menghapus data?",
      subtitle:
        "Semua data tersimpan, termasuk pengaturan dan progres, akan dihapus. Tindakan ini tidak dapat dibatalkan.",
    },

    sourceCode: {
      title: "Kode sumber",
      githubRepository: "Repositori GitHub",
    },

    version: "Versi",
  },

  result: {
    drawing: "Menggambar",
    example: "Contoh",
    you: "Kamu",

    title: "Latihan selesai",
    score: "Skor",
    percent: "Akurasi",

    sec: "detik",
    min: "menit",
    errors_one: "{{count}} kesalahan",
    errors_other: "{{count}} kesalahan",

    question: "pertanyaan",
    questionNumber: "No. {{number}}",

    done: "Selesai",

    correct: "Benar",
    wrong: "Salah",
  },

  lessonsList: {
    failedToLoadLessons: "Gagal memuat pelajaran, silakan coba lagi nanti.",
    completed: "selesai",
  },

  lesson: {
    matchHiraganaWithTransliteration: "Cocokkan Hiragana dengan transliterasi.",
    matchKatakanaWithTransliteration: "Cocokkan Katakana dengan transliterasi.",
    practiceEveryDay: "Berlatih setiap hari untuk memperkuat pengetahuan Anda.",
    learningComplete: "Pelajaran selesai!",
  },

  transliterationSystems: {
    latin: "Latin",
    cyrillic: "Kiril",

    tags: {
      mostPopular: "Paling populer",
      officialJapan: "Resmi di Jepang",
      strictest: "Paling ketat",
      russianStandard: "Standar di Rusia",
    },

    romaji: "Romaji",
    transliterationSystems: "Sistem Transliterasi",
    hepburn: "Hepburn",
    kunreiShiki: "Kunrei-shiki",
    nihonShiki: "Nihon-shiki",
    polivanovSystem: "Sistem Polivanov",
  },

  alert: {
    exitConformation: {
      title: "Apakah Anda yakin ingin keluar?",
      subtitle: "Progres Anda tidak akan disimpan jika Anda keluar sekarang.",
    },
    newVersion: {
      title: "Versi baru tersedia.",
      subtitle:
        "Pelajaran ini dibuat untuk versi aplikasi yang lebih baru. Silakan perbarui aplikasi.",
    },
    cancel: "Batal",
    ok: "OK",
    confirm: "Konfirmasi",
  },

  auth: {
    welcome: {
      firstStep: "Langkah pertama Anda dalam belajar bahasa Jepang!",
    },
    agreement: {
      prefix: "Dengan melanjutkan, Anda menerima: ",
      terms: "Syarat Layanan",
      privacy: "Kebijakan Privasi",
    },
    continueWithGoogle: "Lanjutkan dengan Google",
    googleFailed: "Gagal masuk dengan Google",
    googleUnavailable: {
      title: "Masuk dengan Google tidak tersedia di Rusia",
      subtitle:
        "Masuk dengan Google tidak dapat digunakan dari Rusia. Alamat IP Anda: {{ip}}. Anda dapat mendaftar dengan email.",
    },
    signUpWithEmail: "Daftar dengan email",
    alreadyHaveAccount: "Sudah punya akun?",
    login: "Masuk",
    continueWithoutLogin: "Lanjutkan tanpa masuk",
    fields: {
      newName: "Nama baru",
      oldPassword: "Kata sandi lama",
      name: "Nama",
      email: "Alamat email",
      password: "Kata sandi",
      newPassword: "Kata sandi baru",
      repeatPassword: "Ulangi kata sandi baru",
      birthDate: "Tanggal lahir",
      code: "Kode",
    },
    signIn: {
      title: "Masuk",
      submit: "Masuk",
    },
    signUp: {
      title: "Buat akun",
      submit: "Buat akun",
    },
    verifyEmail: {
      title: "Verifikasi email Anda",
      subtitle: "Masukkan kode dari email. Kami mengirimkannya ke {{email}}",
      submit: "Berikutnya",
      resend: "Kirim kode lagi",
      resendCooldown: "Kirim kode lagi ({{seconds}})",
    },
    resetPassword: {
      title: "Lupa kata sandi?",
      subtitle: "Masukkan alamat email Anda untuk menerima kode reset kata sandi.",
      changeTitle: "Ubah kata sandi Anda",
      confirm: "Konfirmasi",
    },
    errors: {
      incorrectOldPassword: "Kata sandi lama salah",
      nameTooLong: "Nama maksimal 16 karakter",
      nameRequired: "Masukkan nama",
      emailRequired: "Masukkan email",
      invalidEmail: "Email tidak valid",
      dateRequired: "Pilih tanggal lahir",
      tooYoung: "Usia minimum adalah 13 tahun",
      passwordMin: "Minimal 8 karakter",
      passwordLetter: "Harus ada setidaknya satu huruf",
      passwordDigit: "Harus ada setidaknya satu angka",
      passwordRepeat: "Ulangi kata sandi",
      passwordsMismatch: "Kata sandi tidak cocok",
      emailTaken: "Email sudah terdaftar",
      weakPassword: "Kata sandi terlalu lemah",
      invalidDate: "Tanggal tidak valid atau usia di bawah 13",
      requestFailed: "Gagal mengirim permintaan. Silakan coba lagi nanti.",
      somethingWrong: "Terjadi kesalahan. Silakan coba lagi nanti.",
      codeRequired: "Masukkan kode 6 digit",
      invalidCode: "Kode tidak valid",
      codeExpired: "Kode telah kedaluwarsa",
      tooManyAttempts: "Terlalu banyak percobaan. Minta kode baru atau coba lagi besok.",
      resendCooldown: "Harap tunggu sebelum meminta kode baru",
      passwordRequired: "Masukkan kata sandi",
      invalidCredentials: "Email atau kata sandi tidak valid",
      emailNotVerified: "Email belum diverifikasi",
      useGoogleToSignIn: "Akun ini menggunakan masuk dengan Google",
      invalidResetToken: "Sesi reset telah kedaluwarsa. Minta kode baru.",
      accountMigrating: "Akun sedang dipindahkan. Silakan coba lagi nanti.",
      serverUnavailable: "Server akunmu sedang tidak tersedia. Silakan coba lagi nanti.",
      tooManyRequests: "Terlalu banyak permintaan. Tunggu satu menit lalu coba lagi.",
      userNotFound: "Tidak ada akun dengan email ini. Periksa alamatnya atau daftar.",
      loginBlocked:
        "Terlalu banyak kata sandi salah. Masuk dengan kata sandi dikunci selama satu jam. Atur ulang kata sandi atau masuk dengan Google.",
      emailTakenOtherRegion: "Email ini sudah terdaftar. Silakan masuk.",
    },
  },
  profile: {
    widgets: {
      hide: "Sembunyikan widget",
    },

    stats: {
      daysOfStudy: "hari belajar",
      timesOfPractice: "kali latihan",
    },

    avatar: {
      title: "Foto profil",
      takePhoto: "Ambil foto",
      chooseFromLibrary: "Pilih dari galeri",
      remove: "Hapus foto",
      errors: {
        cameraPermission: "Akses kamera ditolak. Izinkan di pengaturan perangkat.",
        fileTooLarge: "Gambar terlalu besar. Maksimal 5 MB.",
        invalidImage: "Format tidak didukung. Gunakan JPEG, PNG, atau WebP.",
        storageUnavailable: "Penyimpanan sementara tidak tersedia. Coba lagi.",
        failed: "Gagal memperbarui foto. Coba lagi nanti.",
      },
    },
    edit: {
      title: "Edit profil",
      name: "Nama",
      password: "Kata sandi",
      changeName: "Ubah nama",
      changePassword: "Ubah kata sandi",
    },
    signInPrompt: "Masuk ke {{app}} untuk menyinkronkan progres di semua perangkat.",
    signInButton: "Masuk atau buat akun",
    unavailable: {
      title: "Pemeliharaan di servermu",
      text: "Server akunmu sedang tidak tersedia. Pelajaran dan latihan tetap berjalan, profilmu akan segera kembali.",
    },
    offline: {
      title: "Tidak ada koneksi",
      text: "Tidak dapat terhubung ke server. Periksa koneksi internetmu.",
    },
  },
  debug: {
    store: "Toko",
    deviceId: "ID Perangkat",
    apiServers: "Server API",
    notificationToken: "Token Notifikasi",
    checking: "memeriksa…",
    pinging: "ping…",
    unreachable: "tidak tersedia",
    autoSelect: "Pilih otomatis",
    addHost: "Tambah",
    removeData: "Hapus data",
  },
  verbForm: {
    title: "Bentuk kata kerja:",
    teForm: "Bentuk て:",
    taForm: "Bentuk た:",
    naiForm: "Bentuk ない:",
    dictionaryForm: "Bentuk kamus:",
    potentialForm: "Bentuk potensial:",
    volitionalForm: "Bentuk volisional:",
    imperativeForm: "Bentuk imperatif:",
    prohibitiveForm: "Bentuk larangan:",
    conditionalForm: "Bentuk kondisional - ば:",
    negativeConditionalForm: "Bentuk kondisional negatif - ば:",
    passiveForm: "Bentuk pasif:",
    verbCausative: "Bentuk kausatif:",
  },
  boards: {
    title: "Papan:",
    createOwn: "Buat sendiri",
    myBoards: "Papan saya",
    publicBoards: "Papan publik",
    newBoard: "Papan baru",
    namePlaceholder: "Nama papan",
    isPublic: "Papan publik",
    settingsTitle: "Pengaturan papan",
    editors: "Editor",
    noEditors: "Belum ada editor",
    createInvite: "Buat tautan undangan",
    inviteUntil: "Tautan sekali pakai, berlaku hingga {{date}}",
    shareLink: "Bagikan tautan",
    revoke: "Cabut",
    remove: "Hapus",
    deleteBoard: "Hapus papan",
    deleteTitle: "Hapus papan ini?",
    deleteSubtitle: "Papan dan semua kartunya akan dihapus permanen.",
    inviteLimit: "Terlalu banyak undangan aktif",
  },
  board: {
    searchPlaceholder: "Cari",
    searchResults: "Hasil pencarian",
    nothingFound: "Tidak ditemukan",
    sectionsTitle: "Bagian",
    cardView: "Tampilan kartu",
    tags: "Tag",
    images: "Gambar",
    columns: "Kartu per baris",
    settingsLabel: "Pengaturan",
    lessonsLabel: "Pelajaran",
    cardsLabel: "Kartu",
    bookmarks: "Tersimpan",
    sectionsLabel: "Bagian",
    bookmarksEmpty: "Kartu yang Anda simpan akan muncul di sini",
  },
  card: {
    examples: "Contoh:",
    open: "Buka",
    alreadySeen: "Sudah pernah dilihat",
    kanjiOrder: "Urutan penulisan:",
    kanjiLevel: "Level:",
    kanjiDescription: "Deskripsi:",
    kanjiRadicals: "Radikal:",
    kanjiElements: "Elemen:",
    edit: "Ubah",
    save: "Simpan",
    titlePlaceholder: "Judul",
    subtitlePlaceholder: "Terjemahan",
    examplePlaceholder: "Contoh",
    saveError: "Gagal menyimpan kartu",
    bookmarkAdd: "Simpan",
    bookmarkRemove: "Hapus",
  },
  promotionTelegram: {
    title: "Selamat, Anda menemukan bug keberuntungan!",
    reasonSingle:
      "Karena bug di aplikasi sudah tidak terlalu banyak, jauh lebih sedikit orang yang mengunjungi channel Telegram saya untuk melaporkan masalah, dan jauh lebih sedikit orang yang berlangganan ke saya",
    reasonMultiple:
      "Karena bug di aplikasi sudah tidak terlalu banyak, jauh lebih sedikit orang yang mengunjungi channel Telegram kami untuk melaporkan masalah, dan jauh lebih sedikit orang yang berlangganan ke kami",
    instructionTitle: "Berikut yang perlu Anda lakukan:",
    stepGo: "- Buka {{channel}}",
    stepSubscribeSingle: "- Berlangganan (saya akan memposting banyak hal menarik)",
    stepSubscribeMultiple: "- Berlangganan (kami akan memposting banyak hal menarik)",
    dontMakeMe: "Jangan buat saya menambahkan bug sungguhan :)",
    channelSingle: "Channel Telegram saya",
    channelMultiple: "Channel Telegram kami",
    fixMyself: "Saya akan perbaiki sendiri",
  },

  report: {
    title: "Laporkan kesalahan",
    subtitle: "Apa yang salah dengan pertanyaan ini? Kami akan segera memperbaikinya.",
    placeholder: "Teks",
    upload: "Unggah",
    send: "Kirim",
    success: {
      title: "Terima kasih!",
      subtitle: "Kami sudah menerima laporanmu dan akan memperbaiki kesalahannya.",
    },
    errors: {
      too_large: "Gambar terlalu besar. Coba hapus beberapa.",
      rate_limited: "Terlalu banyak laporan. Coba lagi nanti.",
      unavailable: "Laporan gagal dikirim. Coba lagi nanti.",
      invalid: "Terjadi kesalahan. Coba lagi.",
    },
    tags: {
      grammatical_typo: "Salah ketik",
      interface_error: "Kesalahan antarmuka",
      incorrect_information: "Informasi salah",
      answer_marked_wrong: "Jawaban benar tidak diterima",
      incorrect_character: "Karakter salah",
      other: "Lainnya",
    },
  },
};

export default Indonesian;

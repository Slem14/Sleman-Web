import type { PartialMessages } from "../fallback";

/**
 * Turkish — locale "tr", LTR.
 *
 * ⚠ STATUS: PENDING NATIVE REVIEW. Plain register, "siz" throughout: the
 * reader is being addressed about official mail and should be treated with
 * the same respect an office letter would use.
 */
export const tr: PartialMessages = {
  common: {
    appName: "Welcome Deutschland",
    tagline: "Almanca mektuplarınızı kendi dilinizde anlayın.",
    continue: "Devam",
    back: "Geri",
    languageSwitch: "Dili değiştir",
    skipToContent: "Ana içeriğe geç",
    themeToDark: "Koyu moda geç",
    themeToLight: "Açık moda geç",
  },
  languageSelect: {
    title: "Dilinizi seçin",
    subtitle: "Choose your language",
    hint: "Bunu istediğiniz zaman değiştirebilirsiniz.",
    continueSaved: "Şu dilde devam et:",
  },
  home: {
    heroTitle: "Anlamadığınız bir Almanca mektup mu geldi?",
    heroLead:
      "Mektubunuzun fotoğrafını çekin. Ne yazdığını, sizden ne istendiğini ve son tarihin ne zaman olduğunu kendi dilinizde açıklayalım — kanıt olarak orijinal Almanca cümlelerle birlikte.",
    stepsTitle: "Nasıl çalışır",
    steps: [
      { title: "Mektubunuzu gönderin", text: "Telefonunuzla fotoğraf çekin veya bir PDF seçin." },
      {
        title: "Açıklamayı okuyun",
        text: "Kimin gönderdiği, ne yazdığı, son tarihler ve istenen belgeler.",
      },
      { title: "Kanıtı görün", text: "Her sonuç, alındığı Almanca cümleyi gösterir." },
      {
        title: "Bitti — hiçbir şey saklanmaz",
        text: "Mektubunuz işlendikten sonra silinir. Hesap gerekmez.",
      },
    ],
    privacyTitle: "Göndermeden önce — mektubunuza ne oluyor",
    privacyPoints: [
      "Mektubunuz yapay zekâ tarafından analiz edilir.",
      "Mektubunuz saklanmaz. İşlendikten sonra sistemlerimizden silinir.",
      "Hesap, isim veya e-posta gerekmez.",
      "Yapay zekâ hata yapabilir. Önemli tarihleri her zaman orijinal mektuptan doğrulayın.",
      "Bu hizmet mektupları açıklar. Hukuk bürosu değildir ve hukuki danışmanlık vermez.",
    ],
    privacyMore: "Gizlilik bildiriminin tamamını okuyun",
    uploadCta: "Mektubumu açıkla",
    seriousTitle: "Bazı mektuplar bir uygulamadan fazlasını gerektirir",
    seriousText:
      "Mahkeme, iltica kararı, sınır dışı etme veya konut kaybıyla ilgili mektuplarda bilinçli olarak temkinli davranır ve sizi nitelikli bir uzmana yönlendiririz.",
    mock: {
      letterLabel: "Mektubunuz",
      resultLabel: "Açıklamanız",
      deadline: "Son tarih bulundu",
      deadlineValue: "15 Ağustos 2026",
      action: "Sizden isteneni",
      actionValue: "İki belge gönderin",
      sender: "Gönderen",
    },
  },
  upload: {
    title: "Mektubunuzu gönderin",
    lead: "Sayfanın tamamının fotoğrafını çekin veya bir PDF seçin. Mektubunuz analiz edilir ve sonra silinir — hiçbir şey saklanmaz.",
    pickTitle: "Mektubunuzu ekleyin",
    chooseFile: "Dosya seç",
    takePhoto: "Fotoğraf çek",
    fileHint: "PDF, JPG, PNG veya WebP · en fazla 15 MB",
    photoTips:
      "İyi bir fotoğraf için: mektubu düz koyun, iyi ışık kullanın ve sayfanın tamamını çerçeveye alın.",
    selectedFile: "Seçilen dosya",
    selectedFiles: "{n} dosya — tek bir mektup olarak birlikte okunur",
    multiPageNote:
      "Bunlar gösterilen sırayla, tek bir mektup olarak birlikte okunur. Devam etmeden önce bir sayfayı kaldırabilir veya yenisini ekleyebilirsiniz.",
    addAnotherFile: "Başka sayfa ekle",
    removeFile: "Kaldır",
    analyze: "Bu mektubu açıkla",
    stateChecking: "Dosyanız kontrol ediliyor…",
    stateUploading: "Mektubunuz güvenli şekilde gönderiliyor…",
    stateAnalyzing: "Mektubunuz okunuyor…",
    stateDone: "Açıklamanız hazır.",
    processingNote: "Bu genellikle bir dakikadan kısa sürer. Lütfen bu sayfayı açık tutun.",
    resultTitle: "Bu mektup ne diyor",
    from: "Gönderen",
    documentType: "Mektup türü",
    deadlineTitle: "Son tarih",
    originalGerman: "Orijinal Almanca metin",
    actionsTitle: "Sizden isteneni",
    documentsTitle: "İstenen belgeler",
    nextStepsTitle: "Yapabilecekleriniz",
    basisDocument: "Mektubun kendisinden",
    basisGeneral: "Genel bilgi",
    aiNotice:
      "Bu açıklama yapay zekâ ile oluşturuldu ve hata içerebilir. Geçerli olan orijinal Almanca mektuptur. Ciddi konularda nitelikli bir kişiden yardım alın.",
    startOver: "Sil ve yeniden başla",
    deletedConfirm: "Mektubunuz ve açıklaması bu sayfadan kaldırıldı.",
    consequencesTitle: "Mektup ne olacağını söylüyor",
    contactTitle: "Mektuptaki iletişim bilgileri",
    limitationsTitle: "Bu açıklamanın söyleyemedikleri",
    seriousTitle: "Bu mektup ciddi görünüyor",
    seriousLead: "Böyle bir mektup için lütfen nitelikli bir kişiden yardım alın.",
    helpCategoriesTitle: "Nereden yardım alabilirsiniz",
    askTitle: "Bu mektup hakkında soru sorun",
    askLead: "Daha iyi anlamak istediğiniz her şeyi sorun. Yanıtlar yalnızca mektubunuzdan gelir.",
    askPlaceholder: "Örnek: Tam olarak neyi göndermem gerekiyor?",
    askButton: "Sor",
    askThinking: "Mektubunuz okunuyor…",
    askNotInLetter: "Mektubunuz bunu yanıtlamıyor",
    askOutOfScope: "Bu, nitelikli bir kişi gerektiriyor",
    askEmptyHint: "Önce bir soru yazın.",
    askYourQuestion: "Sorunuz",
    askAnswerLabel: "Yanıt",
    errorTitle: "Bu işe yaramadı",
    errors: {
      FILE_TOO_LARGE: "Bu dosya çok büyük. Lütfen 15 MB'tan küçük bir dosya gönderin.",
      UNSUPPORTED_TYPE: "Bu dosya türü desteklenmiyor. Lütfen PDF, JPG, PNG veya WebP gönderin.",
      CORRUPT_FILE: "Bu dosya okunamadı. Lütfen yeni bir fotoğraf çekin.",
      TOO_MANY_PAGES: "Bu belgede çok fazla sayfa var. Lütfen yalnızca ilgili sayfaları gönderin.",
      TOO_MANY_FILES:
        "Bu, tek seferde okuyabileceğimizden fazla dosya. Lütfen daha az sayfa gönderin.",
      IMAGE_TOO_LARGE: "Bu görsel çok büyük. Lütfen daha düşük çözünürlükte bir fotoğraf çekin.",
      INVALID_LANGUAGE: "Dil ayarında bir sorun oluştu. Lütfen sayfayı yeniden yükleyin.",
      NO_FILE: "Hiçbir dosya alınmadı. Lütfen bir dosya seçip tekrar deneyin.",
      RATE_LIMITED: "Şu anda çok fazla istek var. Lütfen bir dakika bekleyip tekrar deneyin.",
      PROVIDER_ERROR:
        "Analiz hizmeti şu anda kullanılamıyor. Lütfen kısa süre sonra tekrar deneyin.",
      ANALYSIS_REFUSED:
        "Bu mektubu otomatik olarak analiz edemedik. Bu, hukuki veya resmi konulardaki mektuplarda olur. Lütfen nitelikli bir kişiden — göçmen danışma merkezi veya avukat — yardım alın.",
      INTERNAL_ERROR: "Bizim tarafımızda bir sorun oluştu. Lütfen tekrar deneyin.",
      NETWORK: "Hizmete ulaşamadık. Lütfen internet bağlantınızı kontrol edin.",
    },
    tryAgain: "Tekrar dene",
    unavailableTitle: "Gönderme geçici olarak kullanılamıyor",
    unavailableText:
      "Analiz hizmetine şu anda ulaşamıyoruz. Lütfen kısa süre sonra tekrar deneyin.",
  },
  guidesPage: {
    title: "Sık gelen Almanca mektuplar, açıklandı",
    lead: "Bunlar her mektup türünün ne olduğunu ve genellikle ne istediğini açıklar. Genel açıklamalardır; kendi durumunuza dair tavsiye değildir.",
  },
  donate: {
    label: "Bu siteyi destekleyin",
    note: "Bu hizmet ücretsizdir ve ücretsiz kalacaktır. Bağışlar masrafların karşılanmasına yardımcı olur — mektubunuzla ilgili hiçbir şeyi ya da aldığınız yanıtı değiştirmez.",
  },
  footer: {
    guides: "Mektup rehberleri",
    privacy: "Gizlilik",
    terms: "Koşullar ve sorumluluk reddi",
    ai: "Yapay zekâ hakkında",
    impressum: "Künye",
    notLegalAdvice: "Yalnızca bilgi amaçlıdır — hukuki danışmanlık değildir.",
  },
};

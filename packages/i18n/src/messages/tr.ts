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
  privacyPage: {
    title: "Gizlilik Bildirimi",
    draftBadge: "Taslak — uzman hukuki inceleme bekliyor",
    intro:
      "Bu sayfa, Welcome Deutschland kullandığınızda verilerinize ne olduğunu sade bir dille açıklar. Kısacası: bu hizmeti sizin hakkınızda mümkün olduğunca az şey bilecek şekilde tasarladık.",
    sections: [
      {
        heading: "Mektubunuz",
        body: "Yüklediğiniz mektup yalnızca açıklamanızı oluşturmak için işlenir. Analizin sürdüğü birkaç saniye boyunca bellekte tutulur, sonra atılır. Diske kaydetmeyiz, kopya saklamayız ve sonrasında geri getiremeyiz — bizden istesiniz bile.",
      },
      {
        heading: "Kullandığımız yapay zekâ hizmeti",
        body: "Mektubunuzu okumak için onu Google Gemini hizmetine gönderiyoruz. Bu, mektubunuzun içeriğinin sistemlerimizden çıkması ve Google tarafından kendi koşullarına göre işlenmesi anlamına gelir. Şu anda ücretsiz katmanı kullanıyoruz ve Google koşullarına göre bu katmanda gönderilen içerik saklanabilir ve modellerini geliştirmek için kullanılabilir. Bunu hariç tutan ücretli bir anlaşma için çalışıyoruz. O zamana kadar, özellikle hassas gördüğünüz mektuplarda bunu göz önünde bulundurun.",
      },
      {
        heading: "Hesap yok, profil yok",
        body: "Hesap oluşturmuyorsunuz. Sizinle ilgili bir profil oluşturmuyoruz. Kim olduğunuzu bilmiyoruz.",
      },
      {
        heading: "Neyi kaydediyoruz",
        body: "Hizmeti güvenle çalıştırmak için gereken anonim teknik bilgiler: örneğin bir isteğin gerçekleştiği, ne kadar sürdüğü, kabaca dosya boyutu ve başarılı olup olmadığı. Buna hiçbir zaman mektubunuzun içeriği, adınız veya adresiniz dâhil değildir.",
      },
      {
        heading: "Dil seçiminiz",
        body: "Seçtiğiniz dil yalnızca kendi tarayıcınızda saklanır, böylece site bir dahaki sefere sizin dilinizde açılır. Bize gönderilmez.",
      },
      {
        heading: "Reklam ve takip",
        body: "Herhangi bir reklam göstermeden önce size sorarız. Hayır derseniz hiçbir reklam kodu yüklenmez — gizlenmez, ertelenmez, hiç istenmez. Evet derseniz reklamlar Google tarafından sunulur ve çerez kullanır. Her iki durumda da: mektuplarınız asla reklam için kullanılmaz, asla reklamverenlerle paylaşılmaz ve asla saklanmaz. Sizi takip eden analiz betiği ve oturum kaydı yoktur.",
      },
      {
        heading: "Sorular ve haklarınız",
        body: "AB Genel Veri Koruma Tüzüğü (GDPR) kapsamında erişim ve silme dâhil haklarınız vardır. Belge ve hesap saklamadığımız için hakkınızda bakabileceğimiz bir şey genellikle yoktur — ancak her zaman bize ulaşabilirsiniz.",
      },
    ],
  },
  termsPage: {
    title: "Kullanım Koşulları ve Sorumluluk Reddi",
    draftBadge: "Taslak — uzman hukuki inceleme bekliyor",
    sections: [
      {
        heading: "Bu hizmet nedir",
        body: "Welcome Deutschland, Almanca resmi mektupların içeriğini anlamanıza yardımcı olur. Bilgilendirme amacıyla yapay zekâ tarafından üretilmiş bir açıklama sunar.",
      },
      {
        heading: "Bu hizmet ne değildir",
        body: "Bir hukuk bürosu değildir, resmi bir kurum değildir ve hukuki danışmanlık değildir. Haklarınıza karar vermez, sonuç öngörmez ve nitelikli hukuk, göç, vergi veya sosyal danışmanlığın yerini almaz.",
      },
      {
        heading: "Yapay zekâ hata yapabilir",
        body: "Açıklama yapay zekâ tarafından üretilir. Özellikle düşük kaliteli fotoğraflarda belgeleri yanlış okuyabilir. Geçerli belge her zaman orijinal Almanca mektuptur. Önemli süreleri doğrulayın ve ciddi konularda nitelikli yardım alın.",
      },
      {
        heading: "Sorumluluğunuz",
        body: "Yalnızca yüklemeye hakkınız olan belgeleri yükleyin. Hukuki sonuç doğuran kararlarda bu hizmeti tek kaynağınız olarak kullanmayın.",
      },
    ],
  },
  aiPage: {
    title: "Yapay zekâ nasıl çalışır — şeffaflık",
    intro:
      "Bu hizmetin açıklamalarını nasıl ürettiğini bilme hakkınız var. Bu sayfa konuyu dürüst ve kısa tutuyor.",
    points: [
      "Mektubunuz, sözleşmeli sağlayıcımızın işlettiği büyük bir dil modeli (yapay zekâ) tarafından okunur.",
      "Yapay zekâya yalnızca mektubun gerçekten söylediğini bildirmesi, her sonucu destekleyen Almanca metni göstermesi ve bir şey belirsizse bunu açıkça söylemesi talimatı verilmiştir.",
      "Yapay zekâya asla hukuki sonuç çıkarmaması ve ciddi mektupları nitelikli insan yardımı için işaretlemesi talimatı verilmiştir.",
      "Bu güvencelere rağmen yapay zekâ metni yanlış anlayabilir. Sonucu iyi hazırlanmış bir açıklama olarak görün; onaylı bir çeviri veya danışmanlık olarak değil.",
      "Mektubunuzu saklamıyoruz ve kendimiz asla herhangi bir şeyi eğitmek için kullanmıyoruz. Yapay zekâ sağlayıcısı ise ayrı bir konu: şu anda kullandığımız ücretsiz katmanda koşulları içeriği saklamalarına ve modellerini onunla geliştirmelerine izin veriyor. Gizlilik bildirimi bunu ayrıntılı açıklıyor.",
    ],
  },
  impressumPage: {
    title: "Künye (Impressum)",
    placeholder:
      "Alman hukukunun gerektirdiği şekilde (§ 5 DDG), hizmet sağlayıcı bilgileri (Impressum) kamuya açılıştan önce burada yayımlanacaktır.",
    legalBasis: "§ 5 DDG (Dijital Hizmetler Kanunu) uyarınca hizmet sağlayıcı bilgileri.",
  },
  donate: {
    label: "Bu siteyi destekleyin",
    note: "Bu hizmet ücretsizdir ve ücretsiz kalacaktır. Bağışlar masrafların karşılanmasına yardımcı olur — mektubunuzla ilgili hiçbir şeyi ya da aldığınız yanıtı değiştirmez.",
  },
  consent: {
    title: "Bu sitede reklam gösterebilir miyiz?",
    body: "Reklamlar bu hizmetin masraflarını karşılamaya yardımcı olur. Google tarafından sunulur ve çerez kullanır. Mektuplarınız asla reklam için kullanılmaz, asla reklamverenlere gönderilmez ve asla saklanmaz — bu iki durumda da değişmez. Hayır diyebilirsiniz ve her şey tamamen aynı şekilde çalışmaya devam eder.",
    accept: "Evet, reklamlara izin ver",
    reject: "Hayır, reklam istemiyorum",
    more: "Verilerinizle ne yaptığımızı okuyun",
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

import type { PartialMessages } from "../fallback";

/**
 * Kurmanji Kurdish — locale "ku", LTR (Latin script).
 *
 * ⚠ STATUS: PENDING NATIVE REVIEW. Kurmanji specifically, not Sorani — the
 * Latin-script variety most Kurdish speakers in Germany read.
 */
export const ku: PartialMessages = {
  common: {
    appName: "Welcome Deutschland",
    tagline: "Nameyên xwe yên almanî bi zimanê xwe fêm bikin.",
    continue: "Berdewam",
    back: "Vegere",
    languageSwitch: "Ziman biguhêre",
    skipToContent: "Biçe naveroka sereke",
    themeToDark: "Moda tarî",
    themeToLight: "Moda ronî",
  },
  languageSelect: {
    title: "Zimanê xwe hilbijêrin",
    subtitle: "Choose your language",
    hint: "Hûn dikarin vê her dem biguherînin.",
    continueSaved: "Bi vî zimanî berdewam bike:",
  },
  home: {
    heroTitle: "Nameyeke almanî hat û hûn jê fêm nakin?",
    heroLead:
      "Wêneyê nameya xwe bikişînin. Em ê rave bikin çi tê de hatiye nivîsandin, çi ji we tê xwestin û dawiya dem kengî ye — bi zimanê we, digel hevokên orîjînal ên almanî wek belge.",
    stepsTitle: "Çawa dixebite",
    steps: [
      {
        title: "Nameya xwe bişînin",
        text: "Bi telefona xwe wêne bikişînin an pelekî PDF hilbijêrin.",
      },
      {
        title: "Ravekirinê bixwînin",
        text: "Kî şandiye, çi hatiye nivîsandin, dawiya dem û belgeyên pêwîst.",
      },
      {
        title: "Belgeyê bibînin",
        text: "Her encam hevoka almanî ya ku jê hatiye girtin nîşan dide.",
      },
      {
        title: "Temam — tiştek nayê tomarkirin",
        text: "Nameya we piştî pêvajoyê tê jêbirin. Hesab ne hewce ye.",
      },
    ],
    privacyTitle: "Berî ku bişînin — bi nameya we çi tê kirin",
    privacyPoints: [
      "Nameya we ji aliyê zîrekiya çêkirî ve tê analîzkirin.",
      "Em nameya we tomar nakin. Piştî pêvajoyê ji sîstemên me tê jêbirin.",
      "Hesab, nav an e-name ne hewce ne.",
      "Zîrekiya çêkirî dikare şaş bike. Dawiyên dem ên girîng her dem bi nameya orîjînal re berhev bikin.",
      "Ev xizmet nameyan rave dike. Ne buroyeke hiqûqî ye û şêwirmendiya hiqûqî nade.",
    ],
    privacyMore: "Agahdariya nepenîtiyê ya tevahî bixwînin",
    uploadCta: "Nameya min rave bike",
    seriousTitle: "Hin name ji sepanekê zêdetir hewce dikin",
    seriousText:
      "Di nameyên li ser dadgeh, biryarên penaberiyê, dersînorkirin an windakirina malê de em bi zanetî hişyar dimînin û we ber bi alîkariya mirovî ya pispor ve dişînin.",
    mock: {
      letterLabel: "Nameya we",
      resultLabel: "Ravekirina we",
      deadline: "Dawiya dem hat dîtin",
      deadlineValue: "15ê Tebaxa 2026",
      action: "Çi ji we tê xwestin",
      actionValue: "Du belgeyan bişînin",
      sender: "Şandar",
    },
  },
  upload: {
    title: "Nameya xwe bişînin",
    lead: "Wêneyê tevahiya rûpelê bikişînin an PDF hilbijêrin. Nameya we tê analîzkirin û paşê tê jêbirin — tiştek nayê tomarkirin.",
    pickTitle: "Nameya xwe lê zêde bikin",
    chooseFile: "Pel hilbijêre",
    takePhoto: "Wêne bikişîne",
    fileHint: "PDF, JPG, PNG an WebP · heta 15 MB",
    photoTips:
      "Ji bo wêneyekî baş: nameyê rast deynin, ronahiya baş bikar bînin û tevahiya rûpelê bigirin.",
    selectedFile: "Pelê hilbijartî",
    selectedFiles: "{n} pel — wek nameyek tên xwendin",
    multiPageNote:
      "Ev bi hev re û bi vê rêzê wek nameyek tên xwendin. Berî ku berdewam bikin dikarin rûpelekê rakin an yekî din lê zêde bikin.",
    addAnotherFile: "Rûpelekî din lê zêde bike",
    removeFile: "Rake",
    analyze: "Vê nameyê ji min re rave bike",
    stateChecking: "Pelê we tê kontrolkirin…",
    stateUploading: "Nameya we bi ewlehî tê şandin…",
    stateAnalyzing: "Nameya we tê xwendin…",
    stateDone: "Ravekirina we amade ye.",
    processingNote:
      "Ev bi gelemperî kêmtir ji deqeyekê digire. Ji kerema xwe vê rûpelê vekirî bihêlin.",
    resultTitle: "Ev name çi dibêje",
    from: "Şandar",
    documentType: "Cureyê nameyê",
    deadlineTitle: "Dawiya dem",
    originalGerman: "Nivîsa orîjînal a almanî",
    actionsTitle: "Çi ji we tê xwestin",
    documentsTitle: "Belgeyên xwestî",
    nextStepsTitle: "Hûn çi dikarin bikin",
    basisDocument: "Ji nameyê bi xwe",
    basisGeneral: "Rêbernameya giştî",
    aiNotice:
      "Ev ravekirin bi zîrekiya çêkirî hatiye çêkirin û dikare xeletî hebe. Nameya orîjînal a almanî derbasdar e. Di mijarên giran de ji kesekî pispor alîkarî bixwazin.",
    startOver: "Jê bibe û ji nû ve dest pê bike",
    deletedConfirm: "Nameya we û ravekirina wê ji vê rûpelê hat rakirin.",
    consequencesTitle: "Name dibêje wê çi bibe",
    contactTitle: "Agahiyên têkiliyê ji nameyê",
    limitationsTitle: "Tiştên ku ev ravekirin nikare bibêje",
    seriousTitle: "Ev name giran xuya dike",
    seriousLead: "Ji bo nameyeke wisa, ji kerema xwe ji kesekî pispor alîkarî bixwazin.",
    helpCategoriesTitle: "Li ku derê alîkarî bibînin",
    askTitle: "Li ser vê nameyê bipirsin",
    askLead: "Her tiştê ku dixwazin baştir fêm bikin bipirsin. Bersiv tenê ji nameya we tên.",
    askPlaceholder: "Mînak: divê ez bi rastî çi bişînim?",
    askButton: "Bipirse",
    askThinking: "Nameya we tê xwendin…",
    askNotInLetter: "Nameya we bersiva vê nade",
    askOutOfScope: "Ev kesekî pispor hewce dike",
    askEmptyHint: "Pêşî pirsekê binivîsin.",
    askYourQuestion: "We pirsî",
    askAnswerLabel: "Bersiv",
    errorTitle: "Ev bi ser neket",
    errors: {
      FILE_TOO_LARGE: "Ev pel pir mezin e. Ji kerema xwe pelekî ji 15 MB piçûktir bişînin.",
      UNSUPPORTED_TYPE:
        "Ev cureyê pelî nayê destekkirin. Ji kerema xwe PDF, JPG, PNG an WebP bişînin.",
      CORRUPT_FILE: "Ev pel nehat xwendin. Ji kerema xwe wêneyekî nû bikişînin.",
      TOO_MANY_PAGES: "Ev belge pir rûpel hene. Ji kerema xwe tenê rûpelên girîng bişînin.",
      TOO_MANY_FILES:
        "Ev ji ya ku em dikarin carekê bixwînin zêdetir pel in. Kêmtir rûpel bişînin.",
      IMAGE_TOO_LARGE: "Ev wêne pir mezin e. Ji kerema xwe wêneyekî bi kalîteya kêmtir bikişînin.",
      INVALID_LANGUAGE: "Di sazkirina ziman de pirsgirêkek çêbû. Ji kerema xwe rûpelê nû bikin.",
      NO_FILE: "Tu pel nehat wergirtin. Ji kerema xwe pelekî hilbijêrin û dîsa biceribînin.",
      RATE_LIMITED: "Niha pir daxwaz hene. Ji kerema xwe deqeyekê bisekinin û dîsa biceribînin.",
      PROVIDER_ERROR:
        "Xizmeta analîzê niha ne berdest e. Ji kerema xwe piştî demekê dîsa biceribînin.",
      ANALYSIS_REFUSED:
        "Me nekarî vê nameyê bi otomatîkî analîz bike. Ev di nameyên li ser mijarên hiqûqî an fermî de diqewime. Ji kerema xwe ji kesekî pispor alîkarî bixwazin — navendeke şêwirmendiya koçberiyê an parêzerek.",
      INTERNAL_ERROR: "Ji aliyê me ve pirsgirêkek çêbû. Ji kerema xwe dîsa biceribînin.",
      NETWORK: "Me nekarî bigihîje xizmetê. Ji kerema xwe girêdana înternetê kontrol bikin.",
    },
    tryAgain: "Dîsa biceribîne",
    unavailableTitle: "Şandin bi demkî ne berdest e",
    unavailableText:
      "Em niha nikarin bigihîjin xizmeta analîzê. Ji kerema xwe piştî demekê biceribînin.",
  },
  guidesPage: {
    title: "Nameyên almanî yên berbelav — ravekirin",
    lead: "Ev rûpel rave dikin ku her cureyê nameyê çi ye û bi gelemperî çi dixwaze. Ev ravekirinên giştî ne, ne şêwirmendî li ser doza we ya kesane.",
  },
  privacyPage: {
    title: "Agahdariya Nepenîtiyê",
    draftBadge: "Reşnivîs — li benda vekolîna hiqûqî ya pispor",
    intro:
      "Ev rûpel bi zimanekî sade rave dike ku dema hûn Welcome Deutschland bikar tînin çi bi daneyên we tê kirin. Bi kurtî: me ev xizmet wisa çêkir ku em çiqas kêm dikarin der barê we de zanibin.",
    sections: [
      {
        heading: "Nameya we",
        body: "Nameya ku we bar kiriye tenê ji bo çêkirina ravekirina we tê hilanîn. Em wê çend saniyeyên ku analîz didome di bîrê de digirin û paşê davêjin. Em wê li ser dîskê tomar nakin, kopyayekê naparêzin, û paşê nikarin wê vegerînin — tewra heke hûn ji me bixwazin jî.",
      },
      {
        heading: "Xizmeta AI ya ku em bikar tînin",
        body: "Ji bo xwendina nameya we, em wê ji xizmeta Gemini ya Google re dişînin. Ev tê wateya ku naveroka nameya we ji pergalên me derdikeve û ji aliyê Google ve li gorî mercên wan tê birêvebirin. Em niha asta belaş bikar tînin, û li gorî mercên Google naveroka ku li ser vê astê tê şandin dikare bê parastin û ji bo baştirkirina modelên wan bê bikaranîn. Em li ser peymaneke bi pere dixebitin ku vê derdixe. Heta wê demê, ji kerema xwe vê ji bo nameyên ku hûn bi taybetî hesas dibînin li ber çavan bigirin.",
      },
      {
        heading: "Ne hesab, ne profîl",
        body: "Hûn hesabekê çênakin. Em profîleke we ava nakin. Em nizanin hûn kî ne.",
      },
      {
        heading: "Em çi tomar dikin",
        body: "Agahiyên teknîkî yên bênav ku ji bo xebitandina ewle ya xizmetê pêwîst in: mînak ku daxwazek çêbû, çiqas dom kir, mezinahiya nêzîk a pelî, û gelo bi ser ket. Ev tu carî naveroka nameya we, navê we an navnîşana we nagire nav xwe.",
      },
      {
        heading: "Hilbijartina zimanê we",
        body: "Zimanê ku we hilbijartiye tenê di geroka we de tê tomarkirin, da ku cara din malper bi zimanê we vebe. Ji me re nayê şandin.",
      },
      {
        heading: "Reklam û şopandin",
        body: "Berî ku em reklamekê nîşan bidin em ji we dipirsin. Heke hûn na bibêjin, tu koda reklamê qet nayê barkirin — ne veşartî, ne dereng, bi tenê qet nayê xwestin. Heke hûn erê bibêjin, reklam ji aliyê Google ve têne pêşkêşkirin û çerezan bikar tînin. Di her du rewşan de: nameyên we tu carî ji bo reklamê nayên bikaranîn, tu carî bi reklamkeran re nayên parvekirin, û tu carî nayên tomarkirin. Tu skrîptên analîtîk we naşopînin û tomarkirina danişînê tune ye.",
      },
      {
        heading: "Pirs û maf",
        body: "Li gorî Rêziknameya Giştî ya Parastina Daneyan a YE (GDPR) mafên we hene, di nav de gihîştin û jêbirin. Ji ber ku em ne belge û ne hesaban tomar dikin, bi gelemperî tiştek tune ku em der barê we de lê binêrin — lê hûn her dem dikarin bi me re têkilî deynin.",
      },
    ],
  },
  termsPage: {
    title: "Mercên Bikaranînê û Redkirina Berpirsiyariyê",
    draftBadge: "Reşnivîs — li benda vekolîna hiqûqî ya pispor",
    sections: [
      {
        heading: "Ev xizmet çi ye",
        body: "Welcome Deutschland alîkariya we dike ku hûn naveroka nameyên îdarî yên almanî fêm bikin. Ew ji bo agahdariyê ravekirineke ku bi aqilê çêkirî hatiye çêkirin pêşkêş dike.",
      },
      {
        heading: "Ev xizmet çi ne ye",
        body: "Ew ne buroyeke hiqûqî ye, ne saziyeke dewletê ye, û ne şêwirmendiya hiqûqî ye. Ew biryarê li ser mafên we nade, encaman pêşbînî nake, û cihê şêwirmendiya hiqûqî, koçberî, bacê an civakî ya pispor nagire.",
      },
      {
        heading: "AI dikare şaş bike",
        body: "Ravekirin bi aqilê çêkirî tê hilberandin. Ew dikare belgeyan şaş bixwîne, bi taybetî wêneyên kalîteya nizm. Belgeya derbasdar her dem nameya orîjînal a almanî ye. Demên girîng piştrast bikin û ji bo mijarên giran alîkariya pispor bixwazin.",
      },
      {
        heading: "Berpirsiyariya we",
        body: "Tenê belgeyên ku destûra we heye bar bikin. Ji bo biryarên ku encamên hiqûqî hene, xwe bi vê xizmetê wek çavkaniya xwe ya tenê nespêrin.",
      },
    ],
  },
  aiPage: {
    title: "AI çawa dixebite — şefafî",
    intro:
      "Mafê we heye ku hûn zanibin ev xizmet ravekirinên xwe çawa çêdike. Ev rûpel wê rast û kurt digire.",
    points: [
      "Nameya we ji aliyê modeleke zimanî ya mezin (AI) ve tê xwendin ku pêşkêşkarê me yê bi peyman wê dimeşîne.",
      "Ji AI hatiye xwestin ku tenê tiştê ku name bi rastî dibêje ragihîne, nivîsa almanî ya ku her encamekê piştgirî dike nîşan bide, û dema tiştek ne diyar be wê zelal bibêje.",
      "Ji AI hatiye xwestin ku tu carî encamên hiqûqî nede û nameyên giran ji bo alîkariya mirovî ya pispor nîşan bike.",
      "Digel van parastinan, AI dikare nivîsê şaş fêm bike. Encamê wek ravekirineke baş amadekirî bibînin, ne wek wergereke pejirandî an şêwirmendî.",
      "Em nameya we tomar nakin û em bi xwe tu carî wê ji bo perwerdekirina tiştekî bikar naynin. Pêşkêşkarê AI mijareke cuda ye: li ser asta belaş a ku em niha bikar tînin, mercên wan destûrê didin ku naverokê biparêzin û modelên xwe pê baştir bikin. Agahdariya nepenîtiyê vê bi tevahî rave dike.",
    ],
  },
  impressumPage: {
    title: "Agahiyên Weşanger (Impressum)",
    placeholder:
      "Agahiyên hiqûqî yên pêşkêşkarê xizmetê (Impressum) wê berî destpêkirina giştî li vir bên weşandin, wek ku qanûna almanî (§ 5 DDG) dixwaze.",
    legalBasis: "Agahiyên pêşkêşkarê xizmetê li gorî § 5 DDG (Qanûna Xizmetên Dîjîtal).",
  },
  donate: {
    label: "Piştgiriya vê malperê bikin",
    note: "Ev xizmet belaş e û wê belaş bimîne. Bexş alîkariya lêçûnan dikin — ew tiştekî di nameya we de an di bersiva ku hûn distînin de naguherînin.",
  },
  consent: {
    title: "Ma em dikarin li ser vê malperê reklaman nîşan bidin?",
    body: "Reklam alîkariya lêçûnên vê xizmetê dikin. Ew ji Google tên û çerezan bikar tînin. Nameyên we tu carî ji bo reklamê nayên bikaranîn, tu carî ji reklamkeran re nayên şandin, û tu carî nayên tomarkirin — ev di her du rewşan de naguhere. Hûn dikarin na bibêjin û her tişt bi tevahî wek berê dixebite.",
    accept: "Erê, destûrê bide reklaman",
    reject: "Na, bê reklam",
    more: "Bixwînin em bi daneyên we çi dikin",
  },
  footer: {
    guides: "Rêbernameyên nameyan",
    privacy: "Nepenîtî",
    terms: "Mercan û redkirin",
    ai: "Der barê zîrekiya çêkirî de",
    impressum: "Agahiyên weşanger",
    notLegalAdvice: "Tenê agahî — ne şêwirmendiya hiqûqî ye.",
  },
};

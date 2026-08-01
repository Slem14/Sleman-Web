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
  footer: {
    privacy: "Nepenîtî",
    terms: "Mercan û redkirin",
    ai: "Der barê zîrekiya çêkirî de",
    impressum: "Agahiyên weşanger",
    notLegalAdvice: "Tenê agahî — ne şêwirmendiya hiqûqî ye.",
  },
};

import type { GuideTranslations } from "./guide-data";

/**
 * Kurmanji Kurdish guide text — locale "ku", LTR (Latin script).
 *
 * ⚠ PENDING NATIVE REVIEW. Kurmanji in Latin script — NOT Sorani, and not
 * Arabic script. German letter names stay German.
 */
const DEADLINE_NOTE =
  "Dema ku ji we re derbasdar e li ser nameya we ya bi xwe hatiye çapkirin — bi gelemperî li jorê, an li dawiya beşa ku dibêje divê hûn çi bikin. Li tarîxekê bigerin, an li hevokeke wek „innerhalb von zwei Wochen“ (di nav du hefteyan de) an „bis zum“ (heta). Xwe nespêrin demeke ku we li ser înternetê xwendiye, di nav de ev rûpel jî: heman cureyê nameyê li gorî sedema şandinê demên cuda dihewîne.";

const HELP_NOTE =
  "Ji bo nameyeke bi vî rengî, li şûna ku hûn bi tenê tevbigerin, ji kesekî pispor alîkarî bixwazin. Navendeke Migrationsberatung (şêwirmendiya koçberiyê), Sozialberatung, Verbraucherzentrale an parêzerek dikare nameyê bi xwe bixwîne û ji we re bibêje çi vebijark hene. Gelek ji van xizmetan belaş in.";

export const kuGuides: GuideTranslations = {
  "jobcenter-bescheid": {
    title: "Nameya biryarê ji Jobcenter",
    summary:
      "Bescheid ji Jobcenter çi ye, hûn çawa fêm dikin ka pere dide an kêm dike, û dem li ku derê hatiye çapkirin.",
    sender: "Jobcenter",
    sections: [
      {
        heading: "Ev name çi ye",
        paragraphs: [
          "„Bescheid“ tê wateya biryareke fermî. Bescheid ji Jobcenter ji we re dibêje ku Jobcenter der barê alîkariyên we de çi biryar daye — hûn çiqas distînin, ji bo kîjan mehan, û li ser çi bingehî.",
          "Ev name ramana we napirse. Biryar berê hatiye dayîn. Tiştê ku name dide we sedem in û demek e ku hûn dikarin tê de bersiv bidin.",
        ],
      },
      {
        heading: "Hûn çawa fêm dikin çi biryar hatiye dayîn",
        paragraphs: [
          "Di destpêkê de li „Bewilligung“ (pejirandin) an „Ablehnung“ (redkirin) bigerin. „Aufhebung“ tê wateya ku biryareke berê tê betalkirin, û „Erstattung“ tê wateya ku Jobcenter perî ji we vedigere dixwaze.",
          "Mîqdar bi gelemperî meh bi meh di tabloyekê de hatine rêzkirin, pir caran di bin „Berechnung“ (hesab) de. Dema ku biryar digire nav xwe wek „Bewilligungszeitraum“ tê nivîsandin.",
        ],
      },
      {
        heading: "Bi gelemperî çi ji we tê xwestin",
        paragraphs: [
          "Gelek Bescheide tiştekî naxwazin — tenê ji biryarekê agahdar dikin. Yên din belge dixwazin, ku pir caran di bin „Mitwirkungspflicht“ an „bitte reichen Sie ein“ (ji kerema xwe pêşkêş bikin) de hatine rêzkirin.",
          "Heke hûn bi Bescheid re ne razî bin, name demekê ji bo „Widerspruch“ (îtîraz) diyar dike. Lê ka îtîraz di rewşa we de watedar e an na, ev pirsek e ji bo navendeke şêwirmendiyê, ne ji bo malperekê.",
          DEADLINE_NOTE,
        ],
      },
    ],
  },

  mahnung: {
    title: "Bîranîna dayînê",
    summary: "Mahnung çi ye, ji Mahnbescheid a dadgehê bi çi cuda dibe, û çima ev cudahî girîng e.",
    sender: "Şirket, sîgorte, saziyên dewletê",
    sections: [
      {
        heading: "Ev name çi ye",
        paragraphs: [
          "„Mahnung“ bîranînek e ku kesek dibîne hûn perî deyndar in. Ji şirket an saziyê bi xwe tê, ne ji dadgehekê.",
          "Bi gelemperî mîqdara resen, xercên zêdekirî („Mahngebühr“) û tarîxa ku heta wê dayînê dixwazin diyar dike.",
        ],
      },
      {
        heading: "Cudahiya girîng",
        paragraphs: [
          "„Mahnung“ ne wek „Mahnbescheid“ e. Mahnbescheid ji dadgehekê (Amtsgericht) tê, di zerfeke zer de digihîje, û ji bo bersivê demeke qanûnî ya kurt dihewîne. Heke li ser nameya we Mahnbescheid hatibe nivîsandin, wê wek mijareke dadgehê bibînin û zû şêwirmendî bixwazin.",
          "Tevlihevkirina van herduyan berbelav e û encam dide, ji ber ku tenê yek ji wan pêvajoyeke qanûnî dide destpêkirin.",
        ],
      },
      {
        heading: "Bi gelemperî çi ji we tê xwestin",
        paragraphs: [
          "Dayîn, an bi şanderî re têkilî danîn der barê daxwazê de. Heke hûn bawer dikin daxwaz şaş e, Verbraucherzentrale (navenda parastina xerîdaran) dikare wê bi we re binirxîne — di nav de ev jî ka ew yek ji wan nameyên berbelav e ku fermî xuya dikin lê ne fermî ne.",
          DEADLINE_NOTE,
        ],
      },
    ],
  },

  "auslaenderbehoerde-anhoerung": {
    title: "Nameya guhdarkirinê ji nivîsgeha biyaniyan",
    summary:
      "Anhörung ji Ausländerbehörde çi tê wateyê û çima divê ev name bibe cem şêwirmendekî, ne ku bi tenê bersiv were dayîn.",
    sender: "Ausländerbehörde",
    sections: [
      {
        heading: "Ev name çi ye",
        paragraphs: [
          "„Anhörung“ tê wateya ku nivîsgeh biryarekê der barê mayîna we de dinirxîne û mecbûr e ku pêşî derfetê bide we ku hûn ramana xwe bibêjin. Ev gavekî fermî ye berî biryarê, ne biryar bi xwe.",
          "Ji ber ku berî biryarê tê, tiştê ku hûn di bersivê de dinivîsin dikare pir girîng be.",
        ],
      },
      {
        heading: "Çima ji bo vê yekê alîkarî bixwazin",
        paragraphs: [
          "Ev name der barê mafê we yê mayînê de ye. Tiştê ku divê hûn bibêjin û tiştê ku divê nebêjin bi tevahî bi rewşa we ya kesane ve girêdayî ye — tu rêbernameyeke giştî cihê kesekî ku dosyeya we dixwîne nagire.",
          HELP_NOTE,
          DEADLINE_NOTE,
        ],
      },
    ],
  },

  "krankenkasse-beitragsbescheid": {
    title: "Agahdariya bêşa sîgorteya tenduristiyê",
    summary: "Beitragsbescheid ji Krankenkasse çi dibêje û heke mîqdar şaş xuya bike hûn çi bikin.",
    sender: "Krankenkasse",
    sections: [
      {
        heading: "Ev name çi ye",
        paragraphs: [
          "„Beitragsbescheid“ ji we re dibêje ku divê hûn ji bo sîgorteya tenduristiyê çiqas bidin, ji kîjan tarîxê ve, û mîqdar çawa hatiye hesibandin.",
          "Pir caran piştî guhertinekê tê: karekî nû, xebata serbixwe, dawiya xwendinê, an dawiya vegirtineke din.",
        ],
      },
      {
        heading: "Bi gelemperî çi ji we tê xwestin",
        paragraphs: [
          "Bi gelemperî: dayîna bêşa diyarkirî, an pêşkêşkirina belgeya dahatê da ku mîqdar ji nû ve were hesibandin. Li „Einkommensnachweis“ (belgeya dahatê) bigerin.",
          "Heke mîqdar li ser dahateke ku we tune ye hatibe hesibandin, Krankenkassen bi gelemperî piştî wergirtina belgeyê ji nû ve dihesibînin. Sozialberatung alîkariya we dike ku hûn zanibin kîjan belge pêwîst e.",
          DEADLINE_NOTE,
        ],
      },
    ],
  },

  "kuendigung-wohnung": {
    title: "Nameya bidawîkirina kirêya malê",
    summary:
      "Kündigung ji xwedîmalî çi ye, cudahiya di navbera forma asayî û ya tavilê de çi ye, û çima divê hûn zû tevbigerin.",
    sender: "Xwedîmal an rêveberiya milkê",
    sections: [
      {
        heading: "Ev name çi ye",
        paragraphs: [
          "„Kündigung“ ji xwedîmalê we tê wateya ku ew dixwaze kirêya we bi dawî bike, û ji kîjan tarîxê ve.",
          "„Ordentliche Kündigung“ forma asayî ye bi dema agahdarkirinê. Lê „Fristlose Kündigung“ mafê bidawîkirina tavilê ya peymanê îdia dike, bi gelemperî ji ber kirêya nedayî.",
        ],
      },
      {
        heading: "Çima ji bo vê yekê alîkarî bixwazin",
        paragraphs: [
          "Wendakirina malê bandorê li her tiştê din dike, di nav de rewşa we ya mayînê û alîkariyên we. Ka Kündigung derbasdar e an na bi hûrgiliyan ve girêdayî ye ku tenê kesekî ku nameyê û peymana we dixwîne dikare binirxîne.",
          HELP_NOTE,
          "Ji bo vî cureyî nameyê, Mieterverein (yekîtiya kirêdaran) navenda taybet e.",
          DEADLINE_NOTE,
        ],
      },
    ],
  },

  "bamf-bescheid": {
    title: "Biryara der barê serlêdana we ya penaberiyê de",
    summary:
      "Bescheid ji BAMF çi ye, çima dema bersivê kurt e, û çima divê ev name di heman hefteyê de bibe cem şêwirmendekî.",
    sender: "Bundesamt für Migration und Flüchtlinge (BAMF)",
    sections: [
      {
        heading: "Ev name çi ye",
        paragraphs: [
          "Bescheid ji BAMF biryara der barê serlêdana we ya penaberiyê de ye. Encam û sedemên wê diyar dike.",
          "Encam dikare naskirin, formeke kêmtir a parastinê, an redkirin be — û redkirin ji yekê zêdetir form heye, ku bandorê li tiştê piştî wê dike.",
        ],
      },
      {
        heading: "Çima ev name lezgîn e",
        paragraphs: [
          "Demên bersivdana Bescheid a BAMF kurt in, û di hin rewşan de bi rojan têne jimartin, ne bi hefteyan. Windakirina demekê dikare îmkana îtîraza li biryarê ji holê rake.",
          "Ev ew cureyê nameyê ye ku zû gihîştina kesekî pispor tê de ji her tiştî girîngtir e. Li bendê nemînin ku hûn nameyê bi tevahî fêm bikin — wê bibin cem kesekî.",
          HELP_NOTE,
          DEADLINE_NOTE,
        ],
      },
    ],
  },

  rundfunkbeitrag: {
    title: "Nameya bêşa weşanê",
    summary:
      "Rundfunkbeitrag çi ye, çima her çend televizyona we tune be jî tê, û kengî muafî mimkun e.",
    sender: "Beitragsservice (ARD, ZDF, Deutschlandradio)",
    sections: [
      {
        heading: "Ev name çi ye",
        paragraphs: [
          "„Rundfunkbeitrag“ bêşek e ji bo her malbatê, ne ji bo her kesî û ne ji bo her amûrê. Çi televizyon an radyoya we hebe çi tunebe, tê.",
          "Nameyên Beitragsservice an malbata we tomar dikin, an dayînê dixwazin, an mîqdareke nedayî dişopînin.",
        ],
      },
      {
        heading: "Bi gelemperî çi ji we tê xwestin",
        paragraphs: [
          "Dayîn, tomarkirina malbatê, an agahdarkirin ku kesekî din di heman malbatê de jixwe dide — di wê rewşê de malbat carekê tê hesibandin.",
          "Muafî („Befreiung“) ji bo hin kesên ku alîkariyên diyarkirî distînin mimkun e, di nav de hin wergirên alîkariya Jobcenter. Name an malpera Beitragsservice rave dike kîjan belge pêwîst e.",
          DEADLINE_NOTE,
        ],
      },
    ],
  },

  gerichtspost: {
    title: "Name ji dadgehê",
    summary:
      "Hûn çawa posteya dadgehê nas dikin, zerfa zer çi tê wateyê, û çima tarîxa li ser wê girîng e.",
    sender: "Amtsgericht, Landgericht an dadgeheke din",
    sections: [
      {
        heading: "Ev name çi ye",
        paragraphs: [
          "Nameyên dadgehê ji „Gericht“ tên — bi gelemperî ji Amtsgericht. Dikarin der barê deynekî, kirêyekê, cezayekî, an dozeke li dijî we hatiye vekirin de bin.",
          "Zerfa zer („Zustellungsurkunde“) tê wateya ragihandina fermî: tarîxa radestkirinê tê tomarkirin û demên qanûnî ji wê tarîxê ve têne jimartin. Tarîxa li ser zerfê binivîsin û zerfê biparêzin.",
        ],
      },
      {
        heading: "Çima ji bo vê yekê alîkarî bixwazin",
        paragraphs: [
          "Demên dadgehê kurt in, û windakirina yekê dikare dozekê bêyî ku aliyê we were bihîstin biryar bide. Ev ne nameyek e ku heta dema we hebe were paşxistin.",
          HELP_NOTE,
          DEADLINE_NOTE,
        ],
      },
    ],
  },
};

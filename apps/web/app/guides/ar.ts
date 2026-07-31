import type { GuideTranslations } from "./guide-data";

/**
 * Arabic guide text — locale "ar", RTL.
 *
 * ⚠ PENDING NATIVE REVIEW. Modern Standard Arabic kept deliberately plain.
 *
 * The German letter names are NOT translated anywhere in here: „Bescheid“,
 * „Mahnung“, „Anhörung“ stay German, because they are the words printed on
 * the reader's letter. Translating them would break the one thing the reader
 * needs — matching what is on the page in front of them to what we are
 * explaining. Where a German term appears mid-sentence it is given in German
 * with the Arabic meaning beside it, never replaced.
 */
const DEADLINE_NOTE =
  "المهلة التي تخصّك مطبوعة على رسالتك أنت — عادةً قرب الأعلى أو في نهاية الفقرة التي تشرح ما عليك فعله. ابحث عن تاريخ، أو عن عبارة مثل „innerhalb von zwei Wochen“ (خلال أسبوعين) أو „bis zum“ (حتى تاريخ). لا تعتمد على مدة قرأتها على الإنترنت، بما في ذلك هنا: النوع نفسه من الرسائل يحمل مهلًا مختلفة حسب سبب إرساله.";

const HELP_NOTE =
  "في رسالة من هذا النوع، اطلب مساعدة شخص مختص بدل التصرف وحدك. مركز Migrationsberatung (استشارات الهجرة)، أو Sozialberatung، أو Verbraucherzentrale، أو محامٍ — يمكن لأي منهم قراءة رسالتك الفعلية وإخبارك بخياراتك. كثير من هذه الخدمات مجانية.";

export const arGuides: GuideTranslations = {
  "jobcenter-bescheid": {
    title: "قرار من الـ Jobcenter",
    summary:
      "ما هو الـ Bescheid من الـ Jobcenter، وكيف تعرف إن كان يمنح مالًا أو يخفّضه، وأين تُطبع المهلة.",
    sender: "Jobcenter",
    sections: [
      {
        heading: "ما هي هذه الرسالة",
        paragraphs: [
          "كلمة „Bescheid“ تعني قرارًا رسميًا. والـ Bescheid من الـ Jobcenter يخبرك بما قرّره الـ Jobcenter بشأن مخصصاتك — كم تستلم، ولأي أشهر، وعلى أي أساس.",
          "هذه ليست رسالة تسألك عن رأيك. القرار اتُّخذ بالفعل. ما تمنحه لك الرسالة هو الأسباب ومدة يمكنك خلالها الرد.",
        ],
      },
      {
        heading: "كيف تعرف ما الذي تقرّر",
        paragraphs: [
          "ابحث عن „Bewilligung“ (موافقة) أو „Ablehnung“ (رفض) قرب البداية. وكلمة „Aufhebung“ تعني إلغاء قرار سابق، و„Erstattung“ تعني أن الـ Jobcenter يطلب استرداد مال منك.",
          "المبالغ تُدرج عادةً لكل شهر في جدول، غالبًا تحت „Berechnung“ (الحساب). والفترة التي يغطيها القرار تُذكر كـ „Bewilligungszeitraum“.",
        ],
      },
      {
        heading: "ما الذي تطلبه منك عادةً",
        paragraphs: [
          "كثير من الـ Bescheide لا تطلب شيئًا على الإطلاق — بل تُعلمك بقرار. وأخرى تطلب مستندات، تُدرج غالبًا تحت „Mitwirkungspflicht“ أو „bitte reichen Sie ein“ (يرجى تقديم).",
          "إذا كنت لا توافق على الـ Bescheid، فستذكر الرسالة مدة لتقديم „Widerspruch“ (اعتراض). أما إن كان الاعتراض مناسبًا في وضعك أنت، فهذا سؤال لمركز استشارات، لا لموقع إلكتروني.",
          DEADLINE_NOTE,
        ],
      },
    ],
  },

  mahnung: {
    title: "تذكير بالدفع",
    summary:
      "ما هي الـ Mahnung، وكيف تختلف عن الـ Mahnbescheid الصادر عن المحكمة، ولماذا يهمّ الفرق.",
    sender: "شركات، شركات تأمين، جهات رسمية",
    sections: [
      {
        heading: "ما هي هذه الرسالة",
        paragraphs: [
          "الـ „Mahnung“ تذكير بأن جهة ما ترى أنك مدين لها بمال. تأتي من الشركة أو الجهة نفسها، لا من محكمة.",
          "تذكر عادةً المبلغ الأصلي، وأي رسوم مضافة („Mahngebühr“)، وتاريخًا يريدون الدفع قبله.",
        ],
      },
      {
        heading: "الفرق المهم",
        paragraphs: [
          "الـ „Mahnung“ ليست الـ „Mahnbescheid“. الـ Mahnbescheid يأتي من محكمة (Amtsgericht)، ويصل في ظرف أصفر، ويحمل مدة قانونية قصيرة للرد. إذا كانت رسالتك تقول Mahnbescheid، فتعامل معها كمسألة قضائية واطلب استشارة بسرعة.",
          "الخلط بينهما شائع وله عواقب، لأن واحدة منهما فقط تبدأ إجراءً قانونيًا.",
        ],
      },
      {
        heading: "ما الذي تطلبه منك عادةً",
        paragraphs: [
          "الدفع، أو التواصل مع المرسِل بشأن المطالبة. وإذا كنت ترى أن المطالبة خاطئة، يمكن لـ Verbraucherzentrale (مركز حماية المستهلك) أن ينظر فيها معك — بما في ذلك ما إذا كانت من الرسائل الشائعة التي تبدو رسمية وهي ليست كذلك.",
          DEADLINE_NOTE,
        ],
      },
    ],
  },

  "auslaenderbehoerde-anhoerung": {
    title: "رسالة استماع من مكتب شؤون الأجانب",
    summary:
      "ماذا تعني الـ Anhörung من الـ Ausländerbehörde، ولماذا هي رسالة تُؤخذ إلى مستشار بدل الرد عليها وحدك.",
    sender: "Ausländerbehörde",
    sections: [
      {
        heading: "ما هي هذه الرسالة",
        paragraphs: [
          "كلمة „Anhörung“ تعني أن المكتب يدرس اتخاذ قرار بشأن إقامتك، وهو ملزَم بأن يتيح لك التعليق أولًا. إنها خطوة رسمية قبل القرار، وليست القرار نفسه.",
          "ولأنها تسبق القرار، فإن ما تكتبه في ردّك قد يكون بالغ الأهمية.",
        ],
      },
      {
        heading: "لماذا تطلب المساعدة في هذه تحديدًا",
        paragraphs: [
          "هذه رسالة تتعلق بحقك في البقاء. وما ينبغي أن تقوله، وما لا ينبغي، يعتمد كليًا على ظروفك الفردية — ولا يمكن لأي إرشاد عام أن يحل محل شخص يقرأ ملفك.",
          HELP_NOTE,
          DEADLINE_NOTE,
        ],
      },
    ],
  },

  "krankenkasse-beitragsbescheid": {
    title: "إشعار اشتراك التأمين الصحي",
    summary:
      "ما الذي يذكره الـ Beitragsbescheid من الـ Krankenkasse، وما العمل إذا بدا الاشتراك خاطئًا.",
    sender: "Krankenkasse",
    sections: [
      {
        heading: "ما هي هذه الرسالة",
        paragraphs: [
          "الـ „Beitragsbescheid“ يخبرك بالمبلغ الذي عليك دفعه للتأمين الصحي، ومن أي تاريخ، وكيف حُسب المبلغ.",
          "غالبًا ما يأتي بعد تغيير: عمل جديد، أو عمل حر، أو انتهاء الدراسة، أو انتهاء تغطية أخرى.",
        ],
      },
      {
        heading: "ما الذي يطلبه منك عادةً",
        paragraphs: [
          "عادةً: دفع الاشتراك المذكور، أو تقديم إثبات دخل ليُعاد حساب المبلغ. ابحث عن „Einkommensnachweis“ (إثبات الدخل).",
          "إذا كان المبلغ يفترض دخلًا لا تملكه، فإن شركات الـ Krankenkassen تعيد الحساب عادةً بمجرد إرسالك ما يثبت ذلك. ويمكن لـ Sozialberatung مساعدتك في تحديد الإثبات المطلوب.",
          DEADLINE_NOTE,
        ],
      },
    ],
  },

  "kuendigung-wohnung": {
    title: "رسالة بإنهاء عقد سكنك",
    summary:
      "ما هي الـ Kündigung من المؤجّر، والفرق بين الشكل العادي والفوري، ولماذا عليك التحرك بسرعة.",
    sender: "المؤجّر أو إدارة العقار",
    sections: [
      {
        heading: "ما هي هذه الرسالة",
        paragraphs: [
          "الـ „Kündigung“ من مؤجّرك تعني أنه ينوي إنهاء عقد سكنك، واعتبارًا من أي تاريخ.",
          "„Ordentliche Kündigung“ هو الشكل العادي مع مهلة إشعار. أما „Fristlose Kündigung“ فيدّعي الحق في إنهاء العقد فورًا، وغالبًا بسبب إيجار غير مدفوع.",
        ],
      },
      {
        heading: "لماذا تطلب المساعدة في هذه تحديدًا",
        paragraphs: [
          "فقدان المسكن يؤثر على كل شيء آخر، بما في ذلك وضع إقامتك ومخصصاتك. وصحة الـ Kündigung تعتمد على تفاصيل لا يستطيع تقييمها إلا شخص يقرأ الرسالة وعقدك.",
          HELP_NOTE,
          "الـ Mieterverein (جمعية المستأجرين) هي الجهة المختصة تحديدًا بهذا النوع من الرسائل.",
          DEADLINE_NOTE,
        ],
      },
    ],
  },

  "bamf-bescheid": {
    title: "قرار بشأن طلب لجوئك",
    summary:
      "ما هو الـ Bescheid من الـ BAMF، ولماذا مدة الرد قصيرة، ولماذا ينبغي أن تصل هذه الرسالة إلى مستشار في الأسبوع نفسه.",
    sender: "Bundesamt für Migration und Flüchtlinge (BAMF)",
    sections: [
      {
        heading: "ما هي هذه الرسالة",
        paragraphs: [
          "الـ Bescheid من الـ BAMF هو القرار بشأن طلب لجوئك. يذكر النتيجة وأسبابها.",
          "قد تكون النتيجة اعترافًا، أو شكلًا أقل من الحماية، أو رفضًا — والرفض يأتي بأكثر من صورة، وهذا يؤثر على ما يحدث بعده.",
        ],
      },
      {
        heading: "لماذا هذه الرسالة عاجلة",
        paragraphs: [
          "مدد الرد على الـ Bescheid من الـ BAMF قصيرة، وفي بعض الحالات تُحسب بالأيام لا بالأسابيع. وتفويت واحدة منها قد ينهي إمكانية الطعن في القرار.",
          "هذا هو نوع الرسائل الذي يكون فيه الوصول السريع إلى شخص مختص أهم ما يكون. لا تنتظر حتى تفهمها كاملة قبل طلب المساعدة — خذها إلى شخص.",
          HELP_NOTE,
          DEADLINE_NOTE,
        ],
      },
    ],
  },

  rundfunkbeitrag: {
    title: "رسالة رسوم البث",
    summary: "ما هو الـ Rundfunkbeitrag، ولماذا يصل حتى إن لم تملك تلفزيونًا، ومتى يمكن الإعفاء.",
    sender: "Beitragsservice (ARD, ZDF, Deutschlandradio)",
    sections: [
      {
        heading: "ما هي هذه الرسالة",
        paragraphs: [
          "الـ „Rundfunkbeitrag“ رسم يُفرض على كل مسكن، لا على كل شخص ولا على كل جهاز. ويصل سواء ملكت تلفزيونًا أو راديو أو لم تملك.",
          "رسائل الـ Beitragsservice إما تسجّل مسكنك، أو تطلب الدفع، أو تتابع مبلغًا غير مدفوع.",
        ],
      },
      {
        heading: "ما الذي تطلبه منك عادةً",
        paragraphs: [
          "الدفع، أو تسجيل المسكن، أو الإفادة بأن شخصًا آخر في المسكن نفسه يدفع بالفعل — وعندها يُحتسب الرسم على المسكن مرة واحدة.",
          "الإعفاء („Befreiung“) ممكن لبعض من يتلقون مخصصات معينة، ومنهم بعض متلقي مخصصات الـ Jobcenter. والرسالة أو موقع الـ Beitragsservice يوضح الإثبات المطلوب.",
          DEADLINE_NOTE,
        ],
      },
    ],
  },

  gerichtspost: {
    title: "رسالة من محكمة",
    summary:
      "كيف تتعرّف على بريد المحاكم، وماذا يعني الظرف الأصفر، ولماذا يهمّ التاريخ المكتوب عليه.",
    sender: "Amtsgericht أو Landgericht أو محكمة أخرى",
    sections: [
      {
        heading: "ما هي هذه الرسالة",
        paragraphs: [
          "رسائل المحاكم تصل من „Gericht“ — وغالبًا من Amtsgericht. وقد تتعلق بدين، أو بعقد سكن، أو بغرامة، أو بدعوى مرفوعة ضدك.",
          "الظرف الأصفر („Zustellungsurkunde“) يعني تبليغًا رسميًا: تاريخ التسليم مسجَّل، والمدد القانونية تُحسب من ذلك التاريخ. دوّن التاريخ المكتوب على الظرف واحتفظ به.",
        ],
      },
      {
        heading: "لماذا تطلب المساعدة في هذه تحديدًا",
        paragraphs: [
          "مدد المحاكم قصيرة، وتفويت واحدة منها قد يحسم قضية دون سماع جانبك. هذه ليست رسالة تؤجّلها حتى يتوفر لديك وقت.",
          HELP_NOTE,
          DEADLINE_NOTE,
        ],
      },
    ],
  },
};

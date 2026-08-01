import type { GuideTranslations } from "./guide-data";

/**
 * Tigrinya guide text — locale "ti", LTR (Ge'ez script).
 *
 * ⚠ PENDING NATIVE REVIEW — and this is the file to review hardest. Tigrinya
 * has the thinnest training data of the ten languages here, so reviewers
 * should treat every string as suspect rather than spot-checking. If anything
 * reads as legal advice rather than explanation, that is a defect, not a
 * stylistic preference.
 *
 * German letter names stay German; they are the words printed on the letter.
 */
const DEADLINE_NOTE =
  "እቲ ንዓኻ ዝምልከት ግዜ ኣብ ናትካ ደብዳበ ተጻሒፉ ኣሎ — መብዛሕትኡ ግዜ ኣብ ላዕሊ ወይ ኣብ መወዳእታ እታ እንታይ ክትገብር ከም ዘለካ እትገልጽ ክፍሊ። ዕለት ድለ፡ ወይ ከም „innerhalb von zwei Wochen“ (ኣብ ውሽጢ ክልተ ሰሙን) ወይ „bis zum“ (ክሳብ) ዝኣመሰለ ሓረግ ድለ። ኣብ ኢንተርነት ዘንበብካዮ ግዜ ኣይትእመን፡ እዚ ገጽ እውን ሓዊስካ፦ ሓደ ዓይነት ደብዳበ በቲ ዝተላእከሉ ምኽንያት ዝተፈላለየ ግዜ ኣለዎ።";

const HELP_NOTE =
  "ንኸምዚ ዝኣመሰለ ደብዳበ፡ በይንኻ ኣብ ክንዲ ምንቅስቓስ ካብ ብቑዕ ሰብ ሓገዝ ሕተት። ማእከል Migrationsberatung (ምኽሪ ስደተኛታት)፡ Sozialberatung፡ Verbraucherzentrale ወይ ጠበቓ ነቲ ደብዳበ ባዕሉ ኣንቢቡ እንታይ ኣማራጺታት ከም ዘለካ ክነግረካ ይኽእል። ብዙሓት ካብዞም ኣገልግሎታት ብነጻ እዮም።";

export const tiGuides: GuideTranslations = {
  "jobcenter-bescheid": {
    title: "ናይ ውሳነ ደብዳበ ካብ Jobcenter",
    summary: "Bescheid ካብ Jobcenter እንታይ እዩ፡ ገንዘብ ይህብ ወይ ይንክይ ከመይ ጌርካ ትፈልጥ፡ ግዜ ኸኣ ኣበይ ተጻሒፉ።",
    sender: "Jobcenter",
    sections: [
      {
        heading: "እዚ ደብዳበ እንታይ እዩ",
        paragraphs: [
          "„Bescheid“ ማለት ወግዓዊ ውሳነ ማለት እዩ። Bescheid ካብ Jobcenter Jobcenter ብዛዕባ ሓገዝካ እንታይ ከም ዝወሰነ ይነግረካ — ክንደይ ከም እትቕበል፡ ንኣየኖት ኣዋርሕ፡ ብኣየናይ መሰረት።",
          "እዚ ደብዳበ ርእይቶኻ ኣይሓትትን። ውሳነ ድሮ ተወሲኑ እዩ። እቲ ደብዳበ ዝህበካ ምኽንያታትን ክትምልሰሉ እትኽእል ግዜን እዩ።",
        ],
      },
      {
        heading: "እንታይ ከም ዝተወሰነ ከመይ ትፈልጥ",
        paragraphs: [
          "ኣብ መጀመርታ „Bewilligung“ (ምጽዳቕ) ወይ „Ablehnung“ (ነጸጋ) ድለ። „Aufhebung“ ማለት ናይ ቅድሚ ሕጂ ውሳነ ይስረዝ ኣሎ፡ „Erstattung“ ከኣ Jobcenter ገንዘብ ክምለሰሉ ይሓትት ኣሎ ማለት እዩ።",
          "እቶም መጠናት መብዛሕትኡ ግዜ ወርሒ ብወርሒ ኣብ ሰደቓ ተዘርዚሮም ኣለዉ፡ ብዙሕ ግዜ ኣብ ትሕቲ „Berechnung“ (ጸብጻብ)። እቲ ውሳነ ዝሽፍኖ ግዜ ከም „Bewilligungszeitraum“ ተጻሒፉ ይርከብ።",
        ],
      },
      {
        heading: "መብዛሕትኡ ግዜ እንታይ ይሕተተካ",
        paragraphs: [
          "ብዙሓት Bescheide ዋላ ሓደ ኣይሓቱን — ብዛዕባ ውሳነ ጥራይ የፍልጡ። ካልኦት ሰነዳት ይሓቱ፡ መብዛሕትኡ ግዜ ኣብ ትሕቲ „Mitwirkungspflicht“ ወይ „bitte reichen Sie ein“ (በጃኻ ኣቕርብ) ተዘርዚሮም።",
          "ምስ Bescheid እንተዘይተሰማሚዕካ፡ እቲ ደብዳበ ን„Widerspruch“ (ተቓውሞ) ግዜ ይሕብር። ተቓውሞ ኣብ ናትካ ኩነታት ትርጉም ኣለዎ ወይ የብሉን ግና ንማእከል ምኽሪ ዝምልከት ሕቶ እዩ፡ ንመርበብ ሓበሬታ ኣይኮነን።",
          DEADLINE_NOTE,
        ],
      },
    ],
  },

  mahnung: {
    title: "መዘኻኸሪ ክፍሊት",
    summary: "Mahnung እንታይ እዩ፡ ካብ ናይ ቤት ፍርዲ Mahnbescheid ብምንታይ ይፍለ፡ እቲ ፍልልይ ስለምንታይ ኣገዳሲ።",
    sender: "ትካላት፡ መድሕን፡ መንግስታዊ ኣካላት",
    sections: [
      {
        heading: "እዚ ደብዳበ እንታይ እዩ",
        paragraphs: [
          "„Mahnung“ ሓደ ሰብ ገንዘብ ዕዳ ኣለካ ኢሉ ከም ዝኣምን ዘዘኻኽር እዩ። ካብቲ ትካል ወይ ቤት ጽሕፈት ባዕሉ እዩ ዝመጽእ፡ ካብ ቤት ፍርዲ ኣይኮነን።",
          "መብዛሕትኡ ግዜ እቲ በዅሪ መጠን፡ ዝተወሰኸ ክፍሊት („Mahngebühr“) ከምኡ እውን ክሳብ መዓስ ክፍሊት ከም ዝደልዩ ዝሕብር ዕለት ይጠቅስ።",
        ],
      },
      {
        heading: "እቲ ኣገዳሲ ፍልልይ",
        paragraphs: [
          "„Mahnung“ ምስ „Mahnbescheid“ ሓደ ኣይኮነን። Mahnbescheid ካብ ቤት ፍርዲ (Amtsgericht) ይመጽእ፡ ብብጫ ወረቐት ይበጽሕ፡ ንመልሲ ኸኣ ሓጺር ሕጋዊ ግዜ ኣለዎ። ኣብ ደብዳበኻ Mahnbescheid ተጻሒፉ እንተሎ፡ ከም ናይ ቤት ፍርዲ ጉዳይ ርኣዮ እሞ ቀልጢፍካ ምኽሪ ሕተት።",
          "ንኽልቲኦም ምድንጋር ልሙድ እዩ ውጽኢት ከኣ ኣለዎ፡ ምኽንያቱ ሓደ ካብኦም ጥራይ እዩ ሕጋዊ መስርሕ ዝጅምር።",
        ],
      },
      {
        heading: "መብዛሕትኡ ግዜ እንታይ ይሕተተካ",
        paragraphs: [
          "ምኽፋል፡ ወይ ብዛዕባ እቲ ጠለብ ምስቲ ላኣኺ ምርኻብ። እቲ ጠለብ ጌጋ እዩ ኢልካ እንተኣሚንካ፡ Verbraucherzentrale (ማእከል ሓለዋ ተጠቀምቲ) ምሳኻ ክርእዮ ይኽእል — እዚ ውን ሓዊስካ ካብቶም ወግዓዊ ዝመስሉ ግና ዘይኮኑ ልሙዳት ደብዳበታት ሓደ ድዩ ኣይኮነን።",
          DEADLINE_NOTE,
        ],
      },
    ],
  },

  "auslaenderbehoerde-anhoerung": {
    title: "ናይ ምስማዕ ደብዳበ ካብ ቤት ጽሕፈት ወጻእተኛታት",
    summary:
      "Anhörung ካብ Ausländerbehörde እንታይ ማለት እዩ፡ ስለምንታይ ከኣ በይንኻ ኣብ ክንዲ ምምላስ ናብ ኣማኻሪ ክውሰድ ዘለዎ።",
    sender: "Ausländerbehörde",
    sections: [
      {
        heading: "እዚ ደብዳበ እንታይ እዩ",
        paragraphs: [
          "„Anhörung“ ማለት እቲ ቤት ጽሕፈት ብዛዕባ መንበሪ ፍቓድካ ውሳነ ይሓስብ ኣሎ፡ ቅድሚኡ ከኣ ርእይቶኻ ክትህብ ዕድል ክህበካ ግዴታ ኣለዎ ማለት እዩ። እዚ ቅድሚ ውሳነ ዘሎ ወግዓዊ ስጉምቲ እዩ፡ ውሳነ ባዕሉ ኣይኮነን።",
          "ቅድሚ ውሳነ ስለ ዝመጽእ፡ እቲ ኣብ መልስኻ እትጽሕፎ ኣዝዩ ኣገዳሲ ክኸውን ይኽእል።",
        ],
      },
      {
        heading: "ስለምንታይ ኣብዚ ሓገዝ ትሓትት",
        paragraphs: [
          "እዚ ደብዳበ ብዛዕባ መሰል ምጽናሕካ እዩ። እንታይ ክትብል ከም ዘለካን እንታይ ከም ዘይብልካን ብምሉእ ኣብ ውልቃዊ ኩነታትካ ይምርኮስ — ዝኾነ ሓፈሻዊ መምርሒ ነቲ ፋይልካ ዘንብብ ሰብ ኣይትክኦን።",
          HELP_NOTE,
          DEADLINE_NOTE,
        ],
      },
    ],
  },

  "krankenkasse-beitragsbescheid": {
    title: "ናይ ጥዕና መድሕን መዋጮ ሓበሬታ",
    summary: "Beitragsbescheid ካብ Krankenkasse እንታይ ይብል፡ እቲ መጠን ጌጋ እንተመሲሉ ከኣ እንታይ ትገብር።",
    sender: "Krankenkasse",
    sections: [
      {
        heading: "እዚ ደብዳበ እንታይ እዩ",
        paragraphs: [
          "„Beitragsbescheid“ ንጥዕና መድሕን ክንደይ ክትከፍል ከም ዘለካ፡ ካብ ኣየናይ ዕለት፡ እቲ መጠን ከኣ ከመይ ከም እተጸብጸበ ይነግረካ።",
          "መብዛሕትኡ ግዜ ድሕሪ ለውጢ ይመጽእ፦ ሓድሽ ስራሕ፡ ናጻ ስራሕ፡ መወዳእታ ትምህርቲ፡ ወይ መወዳእታ ካልእ ሽፋን።",
        ],
      },
      {
        heading: "መብዛሕትኡ ግዜ እንታይ ይሕተተካ",
        paragraphs: [
          "መብዛሕትኡ ግዜ፦ እቲ ተጠቒሱ ዘሎ መዋጮ ምኽፋል፡ ወይ እቲ መጠን ከም ብሓድሽ ምእንቲ ክጽብጸብ ናይ እቶት መረጋገጺ ምቕራብ። „Einkommensnachweis“ (መረጋገጺ እቶት) ድለ።",
          "እቲ መጠን ኣብ ዘይብልካ እቶት ተመርኲሱ እንተኾይኑ፡ Krankenkassen መብዛሕትኡ ግዜ መረጋገጺ ምስ ለኣኽካ ከም ብሓድሽ ይጽብጽብዎ። Sozialberatung ኣየናይ ሰነድ ከም ዘድሊ ክትፈልጥ ይሕግዘካ።",
          DEADLINE_NOTE,
        ],
      },
    ],
  },

  "kuendigung-wohnung": {
    title: "ናይ ገዛ ውዕል ምቁራጽ ደብዳበ",
    summary:
      "Kündigung ካብ ዋና ገዛ እንታይ እዩ፡ ኣብ መንጎ ልሙድን ቅልጡፍን ቅርጺ ዘሎ ፍልልይ እንታይ እዩ፡ ስለምንታይ ከኣ ቀልጢፍካ ክትንቀሳቐስ ዘለካ።",
    sender: "ዋና ገዛ ወይ ምምሕዳር ንብረት",
    sections: [
      {
        heading: "እዚ ደብዳበ እንታይ እዩ",
        paragraphs: [
          "„Kündigung“ ካብ ዋና ገዛኻ ማለት ንውዕል ክራይካ ክቖርጾ ይደሊ ኣሎ፡ ካብ ኣየናይ ዕለት ከኣ የመልክት።",
          "„Ordentliche Kündigung“ እቲ ልሙድ ቅርጺ ምስ ናይ መፍለጢ ግዜ እዩ። „Fristlose Kündigung“ ግና ብቕጽበት ውዕል ናይ ምቁራጽ መሰል ይጠልብ፡ መብዛሕትኡ ግዜ ብሰንኪ ዘይተኸፍለ ክራይ።",
        ],
      },
      {
        heading: "ስለምንታይ ኣብዚ ሓገዝ ትሓትት",
        paragraphs: [
          "ገዛ ምጥፋእ ኣብ ኩሉ ካልእ ነገር ይጸልው፡ ኣብ ውሽጡ ኸኣ ኩነታት መንበሪ ፍቓድካን ሓገዝካን። Kündigung ቅቡል ድዩ ኣይኮነን ኣብቲ ደብዳበን ውዕልካን ዘንብብ ሰብ ጥራይ ክግምግሞ ዝኽእል ዝርዝራት ይምርኮስ።",
          HELP_NOTE,
          "ነዚ ዓይነት ደብዳበ፡ Mieterverein (ማሕበር ተኻረይቲ) ፍሉይ ኣካል እዩ።",
          DEADLINE_NOTE,
        ],
      },
    ],
  },

  "bamf-bescheid": {
    title: "ውሳነ ብዛዕባ ናይ ዑቕባ ሕቶኻ",
    summary:
      "Bescheid ካብ BAMF እንታይ እዩ፡ ስለምንታይ ግዜ መልሲ ሓጺር ዝኾነ፡ ስለምንታይ ከኣ እዚ ደብዳበ ኣብታ ሰሙን ናብ ኣማኻሪ ክውሰድ ዘለዎ።",
    sender: "Bundesamt für Migration und Flüchtlinge (BAMF)",
    sections: [
      {
        heading: "እዚ ደብዳበ እንታይ እዩ",
        paragraphs: [
          "Bescheid ካብ BAMF እቲ ብዛዕባ ናይ ዑቕባ ሕቶኻ ዝተውሃበ ውሳነ እዩ። ውጽኢቱን ምኽንያታቱን ይገልጽ።",
          "እቲ ውጽኢት ምፍላጥ፡ ትሑት ዓይነት ሓለዋ፡ ወይ ነጸጋ ክኸውን ይኽእል — ነጸጋ ኸኣ ካብ ሓደ ንላዕሊ ዓይነት ኣለዎ፡ እዚ ድማ ኣብቲ ድሕሪኡ ዝመጽእ ይጸልው።",
        ],
      },
      {
        heading: "ስለምንታይ እዚ ደብዳበ ህጹጽ ዝኾነ",
        paragraphs: [
          "ናይ Bescheid ካብ BAMF ናይ መልሲ ግዜታት ሓጺር እዮም፡ ኣብ ገሊኡ ኩነታት ከኣ ብመዓልቲ እምበር ብሰሙን ኣይቁጸሩን። ሓደ ግዜ ምጥፋእ ነቲ ውሳነ ናይ ምቅዋም ዕድል ከጥፍኦ ይኽእል።",
          "እዚ እቲ ቀልጢፍካ ናብ ብቑዕ ሰብ ምብጻሕ ዝያዳ ዝጠቅመሉ ዓይነት ደብዳበ እዩ። ነቲ ደብዳበ ምሉእ ብምሉእ ክሳብ እትርድኦ ኣይትጸበ — ናብ ሰብ ውሰዶ።",
          HELP_NOTE,
          DEADLINE_NOTE,
        ],
      },
    ],
  },

  rundfunkbeitrag: {
    title: "ናይ ስርጭት መዋጮ ደብዳበ",
    summary: "Rundfunkbeitrag እንታይ እዩ፡ ስለምንታይ ተለቪዥን ዘይብልካ እውን ዝመጽእ፡ መዓስ ከኣ ምግላል ዝከኣል።",
    sender: "Beitragsservice (ARD፡ ZDF፡ Deutschlandradio)",
    sections: [
      {
        heading: "እዚ ደብዳበ እንታይ እዩ",
        paragraphs: [
          "„Rundfunkbeitrag“ ንነፍሲ ወከፍ ስድራቤት ዝኽፈል መዋጮ እዩ፡ ንነፍሲ ወከፍ ሰብ ወይ ንነፍሲ ወከፍ መሳርሒ ኣይኮነን። ተለቪዥን ወይ ራድዮ ይሃሉኻ ኣይሃሉኻ ይመጽእ።",
          "ደብዳበታት Beitragsservice ወይ ስድራቤትካ ይምዝግቡ፡ ወይ ክፍሊት ይሓቱ፡ ወይ ዘይተኸፍለ መጠን ይከታተሉ።",
        ],
      },
      {
        heading: "መብዛሕትኡ ግዜ እንታይ ይሕተተካ",
        paragraphs: [
          "ምኽፋል፡ ስድራቤት ምምዝጋብ፡ ወይ ኣብታ ሓንቲ ስድራቤት ካልእ ሰብ ድሮ ይኸፍል ከም ዘሎ ምሕባር — ኣብዚ ኩነታት ስድራቤት ሓደ ግዜ ጥራይ ይሕሰብ።",
          "ምግላል („Befreiung“) ንገሊኦም ፍሉይ ሓገዝ ንዝቕበሉ ሰባት ክከኣል ይኽእል፡ ገለ ካብ ተቐበልቲ ሓገዝ Jobcenter ሓዊሱ። እቲ ደብዳበ ወይ መርበብ ሓበሬታ Beitragsservice ኣየናይ መረጋገጺ ከም ዘድሊ ይገልጽ።",
          DEADLINE_NOTE,
        ],
      },
    ],
  },

  gerichtspost: {
    title: "ደብዳበ ካብ ቤት ፍርዲ",
    summary: "ናይ ቤት ፍርዲ ፖስጣ ከመይ ጌርካ ትፈልጦ፡ እቲ ብጫ ወረቐት እንታይ ማለት እዩ፡ እታ ኣብኡ ዘላ ዕለት ስለምንታይ ኣገዳሲት።",
    sender: "Amtsgericht፡ Landgericht ወይ ካልእ ቤት ፍርዲ",
    sections: [
      {
        heading: "እዚ ደብዳበ እንታይ እዩ",
        paragraphs: [
          "ደብዳበታት ቤት ፍርዲ ካብ „Gericht“ ይመጹ — መብዛሕትኡ ግዜ ካብ Amtsgericht። ብዛዕባ ዕዳ፡ ክራይ ገዛ፡ መቕጻዕቲ፡ ወይ ኣብ ልዕሌኻ ዝቐረበ ክሲ ክኾኑ ይኽእሉ።",
          "እቲ ብጫ ወረቐት („Zustellungsurkunde“) ወግዓዊ ምብጻሕ ማለት እዩ፦ ዕለት ምርካብ ይምዝገብ፡ ሕጋዊ ግዜታት ከኣ ካብታ ዕለት እቲኣ ይቑጸሩ። እታ ኣብቲ ወረቐት ተጻሒፋ ዘላ ዕለት መዝግባ እሞ እቲ ወረቐት ሓዞ።",
        ],
      },
      {
        heading: "ስለምንታይ ኣብዚ ሓገዝ ትሓትት",
        paragraphs: [
          "ናይ ቤት ፍርዲ ግዜታት ሓጺር እዮም፡ ሓደ ምጥፋእ ከኣ ጉዳይ ወገንካ ከይተሰምዐ ክውስን ይኽእል። እዚ ግዜ ክሳብ እትረክብ ጎኒ ዝግደፍ ደብዳበ ኣይኮነን።",
          HELP_NOTE,
          DEADLINE_NOTE,
        ],
      },
    ],
  },
};

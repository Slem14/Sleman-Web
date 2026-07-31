import type { GuideTranslations } from "./guide-data";

/**
 * Turkish guide text — locale "tr", LTR.
 *
 * ⚠ PENDING NATIVE REVIEW. Formal "siz" throughout.
 *
 * German letter names stay German — „Bescheid“, „Mahnung“, „Anhörung“ are the
 * words printed on the reader's letter, and replacing them would break the one
 * thing the reader needs: matching the page in their hand to the explanation.
 */
const DEADLINE_NOTE =
  "Sizin için geçerli olan süre kendi mektubunuzun üzerinde yazılıdır — genellikle en üstte ya da ne yapmanız gerektiğini anlatan bölümün sonunda. Bir tarih arayın veya „innerhalb von zwei Wochen“ (iki hafta içinde) ya da „bis zum“ (şu tarihe kadar) gibi bir ifade arayın. İnternette okuduğunuz bir süreye güvenmeyin, buradakiler dahil: aynı tür mektup, gönderilme sebebine göre farklı süreler taşır.";

const HELP_NOTE =
  "Bu türden bir mektupta tek başınıza hareket etmek yerine bir uzmandan yardım alın. Bir Migrationsberatung (göçmen danışma merkezi), bir Sozialberatung, bir Verbraucherzentrale veya bir avukat mektubunuzu gerçekten okuyup seçeneklerinizi söyleyebilir. Bu hizmetlerin çoğu ücretsizdir.";

export const trGuides: GuideTranslations = {
  "jobcenter-bescheid": {
    title: "Jobcenter'dan gelen karar mektubu",
    summary:
      "Jobcenter Bescheid nedir, para verdiğini mi yoksa kestiğini mi nasıl anlarsınız ve süre nerede yazar.",
    sender: "Jobcenter",
    sections: [
      {
        heading: "Bu mektup nedir",
        paragraphs: [
          "„Bescheid“ resmi bir karar demektir. Jobcenter'dan gelen bir Bescheid, Jobcenter'ın yardımlarınız hakkında ne karar verdiğini bildirir — ne kadar alacağınızı, hangi aylar için ve hangi esasa göre.",
          "Bu, fikrinizi soran bir mektup değildir. Karar zaten verilmiştir. Mektubun size verdiği şey gerekçeler ve itiraz edebileceğiniz bir süredir.",
        ],
      },
      {
        heading: "Ne karar verildiğini nasıl anlarsınız",
        paragraphs: [
          "Başlarda „Bewilligung“ (onay) veya „Ablehnung“ (ret) kelimesini arayın. „Aufhebung“ önceki bir kararın iptal edildiği, „Erstattung“ ise Jobcenter'ın sizden para geri istediği anlamına gelir.",
          "Tutarlar genellikle aylık olarak bir tabloda, çoğunlukla „Berechnung“ (hesaplama) başlığı altında verilir. Kararın kapsadığı dönem „Bewilligungszeitraum“ olarak yazılır.",
        ],
      },
      {
        heading: "Sizden genellikle ne istenir",
        paragraphs: [
          "Birçok Bescheid hiçbir şey istemez — sadece bir kararı bildirir. Diğerleri belge ister; bunlar çoğunlukla „Mitwirkungspflicht“ ya da „bitte reichen Sie ein“ (lütfen teslim edin) altında sıralanır.",
          "Bir Bescheid'e katılmıyorsanız mektupta „Widerspruch“ (itiraz) için bir süre belirtilir. İtirazın sizin durumunuzda mantıklı olup olmadığı ise bir danışma merkezine sorulacak bir sorudur, bir web sitesine değil.",
          DEADLINE_NOTE,
        ],
      },
    ],
  },

  mahnung: {
    title: "Ödeme hatırlatması",
    summary:
      "Mahnung nedir, mahkemeden gelen Mahnbescheid'den nasıl ayrılır ve bu fark neden önemlidir.",
    sender: "Şirketler, sigortalar, kamu kurumları",
    sections: [
      {
        heading: "Bu mektup nedir",
        paragraphs: [
          "„Mahnung“, birinin sizden para alacağı olduğunu düşündüğünü bildiren bir hatırlatmadır. Mahkemeden değil, şirketin veya kurumun kendisinden gelir.",
          "Genellikle asıl tutarı, eklenen ücretleri („Mahngebühr“) ve ödeme istedikleri tarihi belirtir.",
        ],
      },
      {
        heading: "Önemli ayrım",
        paragraphs: [
          "„Mahnung“ ile „Mahnbescheid“ aynı şey değildir. Mahnbescheid bir mahkemeden (Amtsgericht) gelir, sarı bir zarfla ulaşır ve yanıt için kısa, yasal bir süre taşır. Mektubunuzda Mahnbescheid yazıyorsa bunu bir mahkeme meselesi olarak görün ve hızlıca danışın.",
          "İkisini karıştırmak yaygındır ve sonuç doğurur, çünkü yalnızca biri yasal bir süreç başlatır.",
        ],
      },
      {
        heading: "Sizden genellikle ne istenir",
        paragraphs: [
          "Ödeme yapmanız ya da alacak konusunda göndericiyle iletişime geçmeniz. Alacağın hatalı olduğunu düşünüyorsanız bir Verbraucherzentrale (tüketici danışma merkezi) sizinle birlikte inceleyebilir — resmi görünen ama olmayan yaygın mektuplardan biri olup olmadığı dahil.",
          DEADLINE_NOTE,
        ],
      },
    ],
  },

  "auslaenderbehoerde-anhoerung": {
    title: "Yabancılar dairesinden dinleme yazısı",
    summary:
      "Ausländerbehörde'den gelen Anhörung ne demektir ve neden tek başınıza cevaplamak yerine bir danışmana götürülmelidir.",
    sender: "Ausländerbehörde",
    sections: [
      {
        heading: "Bu mektup nedir",
        paragraphs: [
          "„Anhörung“, dairenin oturum durumunuz hakkında bir karar vermeyi düşündüğü ve önce size görüş bildirme hakkı tanımak zorunda olduğu anlamına gelir. Kararın kendisi değil, karardan önceki resmi bir adımdır.",
          "Karardan önce geldiği için, cevabınızda yazdıklarınız çok önemli olabilir.",
        ],
      },
      {
        heading: "Neden özellikle bunda yardım almalısınız",
        paragraphs: [
          "Bu, kalma hakkınızla ilgili bir mektuptur. Ne söylemeniz ve ne söylememeniz gerektiği tamamen kendi koşullarınıza bağlıdır — hiçbir genel bilgi, dosyanızı okuyan birinin yerini tutmaz.",
          HELP_NOTE,
          DEADLINE_NOTE,
        ],
      },
    ],
  },

  "krankenkasse-beitragsbescheid": {
    title: "Sağlık sigortası prim bildirimi",
    summary:
      "Krankenkasse'den gelen Beitragsbescheid ne bildirir ve prim yanlış görünüyorsa ne yapmalısınız.",
    sender: "Krankenkasse",
    sections: [
      {
        heading: "Bu mektup nedir",
        paragraphs: [
          "„Beitragsbescheid“, sağlık sigortası için ne kadar ödemeniz gerektiğini, hangi tarihten itibaren ve tutarın nasıl hesaplandığını bildirir.",
          "Genellikle bir değişiklikten sonra gelir: yeni bir iş, serbest çalışma, öğrenciliğin bitmesi veya başka bir kapsamın sona ermesi.",
        ],
      },
      {
        heading: "Sizden genellikle ne istenir",
        paragraphs: [
          "Genellikle: belirtilen primi ödemeniz ya da tutarın yeniden hesaplanabilmesi için gelir belgesi göndermeniz. „Einkommensnachweis“ (gelir belgesi) ifadesini arayın.",
          "Tutar sahip olmadığınız bir geliri varsayıyorsa, Krankenkassen belge gönderdiğinizde genellikle yeniden hesaplar. Hangi belgenin gerektiğini bir Sozialberatung ile birlikte çözebilirsiniz.",
          DEADLINE_NOTE,
        ],
      },
    ],
  },

  "kuendigung-wohnung": {
    title: "Kira sözleşmenizi sona erdiren mektup",
    summary:
      "Ev sahibinden gelen Kündigung nedir, olağan ve derhal fesih arasındaki fark nedir ve neden hızlı hareket etmelisiniz.",
    sender: "Ev sahibi veya emlak yönetimi",
    sections: [
      {
        heading: "Bu mektup nedir",
        paragraphs: [
          "Ev sahibinizden gelen „Kündigung“, kira sözleşmenizi hangi tarihten itibaren sona erdirmek istediğini bildirir.",
          "„Ordentliche Kündigung“ ihbar süreli olağan biçimdir. „Fristlose Kündigung“ ise sözleşmeyi derhal sona erdirme hakkı iddia eder, genellikle ödenmemiş kira nedeniyle.",
        ],
      },
      {
        heading: "Neden özellikle bunda yardım almalısınız",
        paragraphs: [
          "Evinizi kaybetmek, oturum durumunuz ve yardımlarınız dahil her şeyi etkiler. Bir Kündigung'un geçerli olup olmadığı, ancak mektubu ve sözleşmenizi okuyan birinin değerlendirebileceği ayrıntılara bağlıdır.",
          HELP_NOTE,
          "Bu tür mektuplar için özel olarak ilgili kurum bir Mieterverein'dır (kiracılar derneği).",
          DEADLINE_NOTE,
        ],
      },
    ],
  },

  "bamf-bescheid": {
    title: "İltica başvurunuza ilişkin karar",
    summary:
      "BAMF Bescheid nedir, yanıt süresi neden kısadır ve bu mektup neden aynı hafta bir danışmana götürülmelidir.",
    sender: "Bundesamt für Migration und Flüchtlinge (BAMF)",
    sections: [
      {
        heading: "Bu mektup nedir",
        paragraphs: [
          "BAMF'den gelen Bescheid, iltica başvurunuza ilişkin karardır. Sonucu ve gerekçelerini belirtir.",
          "Sonuç; tanınma, daha sınırlı bir koruma biçimi ya da ret olabilir — ve ret birden fazla biçimde gelir, bu da sonrasında ne olacağını etkiler.",
        ],
      },
      {
        heading: "Bu mektup neden acildir",
        paragraphs: [
          "BAMF Bescheid'ine yanıt süreleri kısadır ve bazı durumlarda haftalarla değil günlerle sayılır. Birini kaçırmak, karara itiraz etme imkânını tümüyle ortadan kaldırabilir.",
          "Nitelikli bir kişiye hızla ulaşmanın en çok önem taşıdığı mektup türü budur. Tam olarak anlamayı beklemeyin — mektubu birine götürün.",
          HELP_NOTE,
          DEADLINE_NOTE,
        ],
      },
    ],
  },

  rundfunkbeitrag: {
    title: "Yayın katkı payı mektubu",
    summary:
      "Rundfunkbeitrag nedir, televizyonunuz olmasa bile neden gelir ve muafiyet ne zaman mümkündür.",
    sender: "Beitragsservice (ARD, ZDF, Deutschlandradio)",
    sections: [
      {
        heading: "Bu mektup nedir",
        paragraphs: [
          "„Rundfunkbeitrag“ kişi başına veya cihaz başına değil, hane başına alınan bir katkı payıdır. Televizyonunuz ya da radyonuz olsa da olmasa da gelir.",
          "Beitragsservice'ten gelen mektuplar genellikle ya hanenizi kaydeder, ya ödeme ister, ya da ödenmemiş bir tutarı takip eder.",
        ],
      },
      {
        heading: "Sizden genellikle ne istenir",
        paragraphs: [
          "Ödeme yapmanız, haneyi kaydetmeniz ya da aynı hanede başka birinin zaten ödediğini bildirmeniz — bu durumda hane bir kez ücretlendirilir.",
          "Muafiyet („Befreiung“), belirli yardımları alan bazı kişiler için mümkündür; bunlara bazı Jobcenter yardımı alanlar da dahildir. Hangi belgenin gerektiğini mektup ya da Beitragsservice'in web sitesi açıklar.",
          DEADLINE_NOTE,
        ],
      },
    ],
  },

  gerichtspost: {
    title: "Mahkemeden gelen mektup",
    summary:
      "Mahkeme postasını nasıl tanırsınız, sarı zarf ne anlama gelir ve üzerindeki tarih neden önemlidir.",
    sender: "Amtsgericht, Landgericht veya başka bir mahkeme",
    sections: [
      {
        heading: "Bu mektup nedir",
        paragraphs: [
          "Mahkeme mektupları bir „Gericht“ten gelir — çoğunlukla bir Amtsgericht'ten. Bir borçla, bir kira ilişkisiyle, bir cezayla ya da size karşı açılmış bir davayla ilgili olabilir.",
          "Sarı zarf („Zustellungsurkunde“) resmi tebligat demektir: teslim tarihi kayda geçer ve yasal süreler o tarihten itibaren sayılır. Zarfın üzerindeki tarihi not edin ve zarfı saklayın.",
        ],
      },
      {
        heading: "Neden özellikle bunda yardım almalısınız",
        paragraphs: [
          "Mahkeme süreleri kısadır ve birini kaçırmak, sizin tarafınız dinlenmeden bir davanın sonuçlanmasına yol açabilir. Bu, vaktiniz olunca bakılacak bir mektup değildir.",
          HELP_NOTE,
          DEADLINE_NOTE,
        ],
      },
    ],
  },
};

export type Locale = 'en' | 'tr' | 'hi' | 'ar' | 'de' | 'it' | 'fr';
export type Region = 'TR' | 'IN' | 'MENA' | 'EU' | 'GLOBAL';
export type Topic = 'family' | 'ai' | 'crypto' | 'career' | 'habits' | 'relationships' | 'money' | 'education' | 'health' | 'productivity';

export interface SeedTrace {
  seedId: string;
  problem: string;
  steps: string[];
  tags: string[];
}

export interface SeedTraceV2 extends SeedTrace {
  localeHint?: Locale;
  regionHint?: Region;
  topic?: Topic;
}

// Original English seeds (global)
export const seedTraces: SeedTraceV2[] = [
  {
    seedId: 'raise-during-layoffs',
    problem: "Should I ask for a raise at work when the company is going through layoffs?",
    steps: [
      "I considered the timing — layoffs signal financial stress, but my role might be more valuable now.",
      "I thought about my leverage — am I essential or replaceable in this climate?",
      "I weighed the risk of seeming tone-deaf versus the cost of staying silent.",
      "I researched what others in similar situations have done.",
      "I decided to document my contributions first and wait for performance review cycle."
    ],
    tags: ["career", "money", "timing", "risk"],
    topic: 'career',
    regionHint: 'GLOBAL'
  },
  {
    seedId: 'move-to-new-city',
    problem: "I'm considering moving to a new city for better opportunities, but I'm scared of starting over.",
    steps: [
      "I listed what I'm actually trying to change (career, friends, lifestyle).",
      "I separated 'fear of unknown' from 'real risks' like money and housing.",
      "I talked to two people who moved recently and compared their experience to my assumptions.",
      "I priced the move realistically and checked if I can return if it fails.",
      "I realized the decision isn't forever; it's a 12-month experiment."
    ],
    tags: ["decisions", "change", "risk", "life"],
    topic: 'career',
    regionHint: 'GLOBAL'
  },
  {
    seedId: 'end-friendship',
    problem: "I don't know whether to end a friendship that keeps draining me.",
    steps: [
      "I noticed I feel tense before meeting them, not relaxed after.",
      "I reviewed patterns: do they apologize and change, or repeat the same behavior?",
      "I asked what boundary I've never actually stated clearly.",
      "I decided to try one direct conversation before making a final decision.",
      "I defined what 'better' would look like in the next month."
    ],
    tags: ["relationships", "boundaries", "communication"],
    topic: 'relationships',
    regionHint: 'GLOBAL'
  },
  {
    seedId: 'procrastination-perfectionism',
    problem: "I keep procrastinating because I want everything to be perfect.",
    steps: [
      "I recognized procrastination is protecting me from feeling incompetent.",
      "I changed the goal from 'perfect output' to 'first ugly draft'.",
      "I set a 25-minute timer and promised I can stop after it.",
      "I chose a tiny deliverable that is impossible to overthink.",
      "I tracked the feeling of progress rather than the quality."
    ],
    tags: ["productivity", "perfectionism", "habits"],
    topic: 'productivity',
    regionHint: 'GLOBAL'
  },
  {
    seedId: 'two-job-offers',
    problem: "I have two job offers and I can't decide.",
    steps: [
      "I listed the non-negotiables (growth, manager, location, work-life).",
      "I compared the day-to-day work, not only salary and title.",
      "I imagined 'Monday morning' in each role and which one I'd dread less.",
      "I evaluated downside risk: what happens if it's a bad fit?",
      "I picked the option with the better learning curve even if pay is slightly lower."
    ],
    tags: ["career", "decisions", "growth"],
    topic: 'career',
    regionHint: 'GLOBAL'
  },
  {
    seedId: 'start-exercising-again',
    problem: "I want to start exercising again but I keep failing after one week.",
    steps: [
      "I admitted my plan was too intense and punished missed days.",
      "I lowered the bar to '10 minutes, 3 times a week'.",
      "I linked it to an existing routine (after coffee).",
      "I focused on consistency metrics, not weight or performance.",
      "I planned a 'restart rule' for missed weeks."
    ],
    tags: ["health", "habits", "consistency"],
    topic: 'health',
    regionHint: 'GLOBAL'
  },
  {
    seedId: 'sleep-racing-mind',
    problem: "I'm having trouble sleeping because my mind won't stop racing.",
    steps: [
      "I noticed the racing thoughts are usually about tomorrow's tasks.",
      "I tried writing everything down before bed to 'close the loops'.",
      "I considered whether caffeine or screen time is contributing.",
      "I thought about what helps me wind down — reading, stretching, music.",
      "I decided to create a consistent pre-sleep routine."
    ],
    tags: ["sleep", "anxiety", "habits", "health"],
    topic: 'health',
    regionHint: 'GLOBAL'
  }
];

// Türkçe seed'ler - Tamamen Türkçe içerik
export const seedTraces_tr: SeedTraceV2[] = [
  {
    seedId: 'tr-inflation-budget',
    problem: "Enflasyon yüzünden bütçemi nasıl yönetmeliyim, sürekli plan yapamıyorum.",
    steps: [
      "Sabit giderlerimi listeledim ve hangilerinden kaçınamayacağımı gördüm.",
      "İhtiyaçları isteklerden daha sıkı bir şekilde ayırdım.",
      "Sorunları erken yakalamak için aylık yerine haftalık takip etmeye başladım.",
      "İsteğe bağlı harcamalardan önce küçük bir acil durum fonu oluşturdum.",
      "Planların değişeceğini kabul ettim ve esnekliğin asıl beceri olduğunu anladım."
    ],
    tags: ["para", "planlama", "enflasyon", "bütçe"],
    localeHint: 'tr',
    regionHint: 'TR',
    topic: 'money'
  },
  {
    seedId: 'tr-family-pressure-marriage',
    problem: "Ailem evlenmem için baskı yapıyor ama ben hazır değilim.",
    steps: [
      "Benim için 'hazır' olmanın ne anlama geldiğini netleştirdim — maddi mi, duygusal mı, doğru kişiyi bulmak mı.",
      "Evlilikten mi yoksa onların baskısından mı kaçındığımı düşündüm.",
      "Saldırmayan veya savunmayan sakin bir yanıt hazırladım.",
      "Bir sınır koydum: hazır olduğumda paylaşacağım, talep üzerine değil.",
      "Endişelerinin sevgiden geldiğini, kontrol gibi hissettirse bile, kendime hatırlattım."
    ],
    tags: ["aile", "evlilik", "sınırlar", "baskı"],
    localeHint: 'tr',
    regionHint: 'TR',
    topic: 'family'
  },
  {
    seedId: 'tr-kpss-career',
    problem: "KPSS'ye mi hazırlanmalıyım yoksa özel sektörde mi kalmalıyım?",
    steps: [
      "İşten gerçekte ne istediğimi listeledim: istikrar, büyüme, anlam veya gelir.",
      "Gerçekçi zaman çizelgelerini karşılaştırdım: geçene kadar ne kadar sürer vs. burada büyümek ne kadar sürer.",
      "Her iki yolda da insanlarla konuştum ve pişmanlıklarını sordum.",
      "Hibrit bir seçenek düşündüm: çalışırken yarı zamanlı hazırlanmak.",
      "Karar vermek için bir son tarih belirledim ve zihinsel gidip gelmeyi durdurmak istedim."
    ],
    tags: ["kariyer", "sınav", "kararlar", "istikrar"],
    localeHint: 'tr',
    regionHint: 'TR',
    topic: 'career'
  },
  {
    seedId: 'tr-istanbul-rent',
    problem: "İstanbul'da kira çok yükseldi, taşınmalı mıyım başka şehre?",
    steps: [
      "Maaş değişiklikleri dahil gerçek maliyet farkını hesapladım.",
      "Kaybedeceğim şeyleri listeledim: network, fırsatlar, arkadaşlar.",
      "Daha ucuza yaşamamı sağlayabilecek uzaktan çalışma seçeneklerini araştırdım.",
      "Tam bir taşınmaya karar vermeden önce deneme süresi düşündüm.",
      "Bir sorundan mı kaçıyorum yoksa bir çözüme mi koşuyorum diye kendime sordum."
    ],
    tags: ["konut", "yaşam-maliyeti", "kararlar", "şehir"],
    localeHint: 'tr',
    regionHint: 'TR',
    topic: 'money'
  },
  {
    seedId: 'tr-side-hustle',
    problem: "Ek iş yapmalı mıyım yoksa tek işe mi odaklanmalıyım?",
    steps: [
      "Gerçekte ne kadar ek gelire ihtiyacım olduğunu hesapladım.",
      "Enerji seviyelerimi dürüstçe değerlendirdim — zaten tükenmiş miyim?",
      "Sadece fatura ödeyen değil, beceri geliştiren yan işler aradım.",
      "Bir zaman sınırı koydum: 3 ay dene, sonra değerlendir.",
      "Dinlenme zamanımı pazarlık edilemez olarak korudum."
    ],
    tags: ["gelir", "iş", "denge", "ek-iş"],
    localeHint: 'tr',
    regionHint: 'TR',
    topic: 'career'
  },
  {
    seedId: 'tr-abroad-stay',
    problem: "Yurtdışına gitmeli miyim yoksa Türkiye'de kalıp mücadele mi etmeliyim?",
    steps: [
      "Yurtdışı fantezisini sıfırdan başlamanın gerçekliğinden ayırdım.",
      "Özleyeceğim şeyleri listeledim: aile, yemek, kültür, aidiyet.",
      "Sadece Instagram hikayeleri değil, gerçek maliyetleri ve zaman çizelgelerini araştırdım.",
      "Giderek hangi sorunu çözmeye çalıştığımı kendime sordum.",
      "Orta bir yol düşündüm: yabancı şirketler için uzaktan çalışma."
    ],
    tags: ["göç", "kararlar", "kariyer", "hayat"],
    localeHint: 'tr',
    regionHint: 'TR',
    topic: 'career'
  },
  {
    seedId: 'tr-parents-aging',
    problem: "Yaşlanan aileme nasıl bakacağım, hem çalışıp hem ilgilenmek zor.",
    steps: [
      "Gerçekte neye ihtiyaçları olduğunu varsaydığım şeylerden ayırdım.",
      "Sorumlulukları adil bir şekilde paylaşmak için kardeşlerimle konuştum.",
      "Destek seçeneklerini araştırdım: evde bakım, topluluk yardımı, esnek çalışma.",
      "Kendi sağlığımı ve ilişkilerimi korumak için sınırlar koydum.",
      "Her şeyi mükemmel yapamayacağımı kabul ettim."
    ],
    tags: ["aile", "bakım", "denge", "sorumluluk"],
    localeHint: 'tr',
    regionHint: 'TR',
    topic: 'family'
  },
  {
    seedId: 'tr-social-comparison',
    problem: "Arkadaşlarım ev/araba aldı, ben hâlâ kiradayım, kendimi başarısız hissediyorum.",
    steps: [
      "Onların tam hikayesini bilmediğimi hatırlattım — borç, aile yardımı, stres.",
      "Başarıyı görünür satın almalara göre değil, kendi şartlarıma göre tanımladım.",
      "Instagram'a koymadığım kendi ilerlemelerimi listeledim.",
      "Karşılaştırmayı tetikleyen içeriklere maruziyeti azalttım.",
      "Onların büyük kilometre taşlarına değil, kendi küçük hedefime odaklandım."
    ],
    tags: ["karşılaştırma", "öz-değer", "para", "sosyal-medya"],
    localeHint: 'tr',
    regionHint: 'TR',
    topic: 'money'
  },
  {
    seedId: 'tr-burnout-work',
    problem: "İş yerinde tükenmişlik hissediyorum ama istifa edemiyorum.",
    steps: [
      "Beni özellikle neyin tükettiğini belirledim — iş yükü mü, insanlar mı, anlam mı.",
      "Büyük değişikliklerden önce küçük değişiklikler aradım: sınırlar, delegasyon, molalar.",
      "İstifa etsem mali dayanıklılığımı hesapladım.",
      "Seçeneklerim olması için sessizce iş aramaya başladım.",
      "Akşamları ve hafta sonlarını toparlanma zamanı olarak korudum."
    ],
    tags: ["tükenmişlik", "iş", "ruh-sağlığı", "kariyer"],
    localeHint: 'tr',
    regionHint: 'TR',
    topic: 'career'
  },
  {
    seedId: 'tr-savings-inflation',
    problem: "Paramı nerede tutmalıyım, TL'de eriyip gidiyor.",
    steps: [
      "Finansal uzman olmadığımı ve temelleri öğrenmem gerektiğini kabul ettim.",
      "Her şeyi tek bir yere koymak yerine çeşitlendirdim.",
      "Acil durum fonunu yatırım parasından ayırdım.",
      "Bir kural koydum: günlük kontrol etme, aylık gözden geçir.",
      "Sadece birikimleri korumaya değil, geliri artırmaya odaklandım."
    ],
    tags: ["para", "birikim", "enflasyon", "yatırım"],
    localeHint: 'tr',
    regionHint: 'TR',
    topic: 'money'
  },
  {
    seedId: 'tr-relationship-distance',
    problem: "Uzak mesafe ilişkim var, ne zaman bitireceğimizi bilemiyorum.",
    steps: [
      "'Birlikte' olmanın gerçekte nasıl görüneceğini sordum — kim taşınacak, ne zaman.",
      "İkimizin de mesafeyi kapatmaya eşit derecede yatırım yapıp yapmadığını değerlendirdim.",
      "Gerçekçi bir zaman çizelgesi belirledim ve ikimizin de hemfikir olup olmadığını kontrol ettim.",
      "Beklerken nelerden vazgeçtiğimi düşündüm.",
      "Gerçek planlarımız hakkında dürüst bir konuşma yapmaya karar verdim."
    ],
    tags: ["ilişkiler", "mesafe", "kararlar", "gelecek"],
    localeHint: 'tr',
    regionHint: 'TR',
    topic: 'relationships'
  },
  {
    seedId: 'tr-university-choice',
    problem: "Hangi bölümü seçmeliyim, ailem başka istiyor ben başka.",
    steps: [
      "Ne istediğimi, onları gururlandıracağını düşündüğüm şeyden ayırdım.",
      "Her iki seçenek için gerçek iş sonuçlarını araştırdım.",
      "Her iki alanda çalışan insanlarla günlük gerçeklik hakkında konuştum.",
      "Her ikisini de kısmen tatmin eden bir yol olup olmadığını düşündüm.",
      "Kararımı ve sonuçlarını sahiplenmeye hazırlandım."
    ],
    tags: ["eğitim", "aile", "kararlar", "kariyer"],
    localeHint: 'tr',
    regionHint: 'TR',
    topic: 'education'
  }
];

// Hindi seed'ler - Tamamen Hindi içerik
export const seedTraces_hi: SeedTraceV2[] = [
  {
    seedId: 'hi-family-career-pressure',
    problem: "मेरा परिवार चाहता है कि मैं सरकारी नौकरी करूं, लेकिन मैं स्टार्टअप में काम करना चाहता हूं।",
    steps: [
      "मैंने समझा कि उनकी चिंता मेरी सुरक्षा के लिए है।",
      "मैंने दोनों रास्तों की वास्तविक सफलता की कहानियां खोजीं।",
      "मैंने स्टार्टअप वेतन और विकास क्षमता के बारे में डेटा तैयार किया।",
      "मैंने एक समय सीमा प्रस्तावित की: मुझे अपना रास्ता साबित करने के लिए 2 साल दो।",
      "मैंने उनके विचार का सम्मान दिखाया जबकि अपने पर दृढ़ रहा।"
    ],
    tags: ["परिवार", "करियर", "दबाव", "निर्णय"],
    localeHint: 'hi',
    regionHint: 'IN',
    topic: 'family'
  },
  {
    seedId: 'hi-marriage-pressure-age',
    problem: "मैं 28 साल का हूं और मेरे माता-पिता चिंतित हैं कि शादी के लिए 'बहुत देर' हो जाएगी।",
    steps: [
      "मैंने स्वीकार किया कि उनकी चिंता सामाजिक दबाव से आती है।",
      "मैंने स्पष्ट किया कि मैं क्या खोज रहा हूं और अभी तक क्यों नहीं मिला।",
      "मैंने इस विषय पर कितनी बार चर्चा करें इसकी सीमाएं तय कीं।",
      "मैंने उनसे अपने जीवन पर मेरे फैसले पर भरोसा करने को कहा।",
      "मैंने खुद को याद दिलाया कि उनकी समय सीमा मेरी समय सीमा नहीं है।"
    ],
    tags: ["शादी", "परिवार", "उम्र", "दबाव"],
    localeHint: 'hi',
    regionHint: 'IN',
    topic: 'family'
  },
  {
    seedId: 'hi-competitive-exam',
    problem: "मैं 3 साल से UPSC की तैयारी कर रहा हूं और अभी तक पास नहीं हुआ।",
    steps: [
      "मैंने ईमानदारी से आकलन किया कि मेरी तैयारी में क्या काम नहीं कर रहा।",
      "मैंने अंतहीन चक्रों से बचने के लिए अंतिम प्रयास सीमा तय की।",
      "मैंने असफल महसूस किए बिना बैकअप विकल्प खोजे।",
      "मैंने उन लोगों से बात की जिन्होंने कई प्रयासों के बाद दिशा बदली।",
      "मैंने अपनी पहचान को इस एक परीक्षा से अलग किया।"
    ],
    tags: ["परीक्षा", "करियर", "दृढ़ता", "पहचान"],
    localeHint: 'hi',
    regionHint: 'IN',
    topic: 'education'
  },
  {
    seedId: 'hi-joint-family-privacy',
    problem: "संयुक्त परिवार में रहते हुए मुझे कोई निजता या व्यक्तिगत स्थान नहीं मिलता।",
    steps: [
      "मैंने पहचाना कि मुझे सबसे ज्यादा किस तरह की निजता चाहिए।",
      "मैंने छोटी जगहें या समय खोजे जो मैं अपना मान सकूं।",
      "मैंने परिवार की संरचना की आलोचना किए बिना अपनी जरूरत बताई।",
      "मैंने सोचा कि क्या अलग रहना संभव है और क्या यह समझौतों के लायक है।",
      "मैंने साझा भौतिक स्थान में भी मानसिक स्थान बनाने के तरीके खोजे।"
    ],
    tags: ["परिवार", "निजता", "सीमाएं", "रहन-सहन"],
    localeHint: 'hi',
    regionHint: 'IN',
    topic: 'family'
  },
  {
    seedId: 'hi-salary-negotiation',
    problem: "मुझे पता है कि मुझे कम वेतन मिल रहा है लेकिन इस नौकरी बाजार में मांगने से डर लगता है।",
    steps: [
      "मैंने अपनी भूमिका और अनुभव के लिए बाजार दरों की खोज की।",
      "मैंने पिछले साल अपने योगदान और प्रभाव का दस्तावेज बनाया।",
      "मैंने एक दोस्त के साथ बातचीत का अभ्यास किया।",
      "मैंने हां और ना दोनों परिणामों के लिए तैयारी की।",
      "मैंने खुद को याद दिलाया कि मांगना लालची होना नहीं है।"
    ],
    tags: ["वेतन", "करियर", "बातचीत", "आत्मविश्वास"],
    localeHint: 'hi',
    regionHint: 'IN',
    topic: 'career'
  },
  {
    seedId: 'hi-parents-expectations',
    problem: "मेरे माता-पिता मेरी तुलना मेरे चचेरे भाइयों से करते हैं जो ज्यादा 'सफल' हैं।",
    steps: [
      "मैंने पहचाना कि यह दुखता है क्योंकि मैं भी खुद की तुलना करता हूं।",
      "मैंने अपनी उपलब्धियां सूचीबद्ध कीं जो उनकी परिभाषा में नहीं आतीं।",
      "मैंने शांति से बातचीत की कि तुलनाएं मुझे कैसे प्रभावित करती हैं।",
      "मैंने तुलना को बढ़ावा देने वाली जानकारी साझा करना कम किया।",
      "मैंने सापेक्ष रैंकिंग नहीं, अपने विकास मापदंडों पर ध्यान दिया।"
    ],
    tags: ["परिवार", "तुलना", "आत्म-मूल्य", "अपेक्षाएं"],
    localeHint: 'hi',
    regionHint: 'IN',
    topic: 'family'
  },
  {
    seedId: 'hi-work-life-balance',
    problem: "मेरी नौकरी में 24/7 उपलब्ध रहने की उम्मीद है और मैं थक रहा हूं।",
    steps: [
      "मैंने वास्तविकता देखने के लिए अपने वास्तविक काम के घंटे ट्रैक किए।",
      "मैंने पहचाना कि कौन से ऑफिस के बाद के अनुरोध वास्तव में जरूरी हैं।",
      "मैंने छोटी सीमाएं लगाना शुरू किया और प्रतिक्रियाएं देखीं।",
      "मैंने उन सहयोगियों को खोजा जो भी बेहतर सीमाएं चाहते हैं।",
      "मैंने नौकरी खोजने की तैयारी की अगर संस्कृति नहीं बदलेगी।"
    ],
    tags: ["काम", "थकान", "सीमाएं", "संतुलन"],
    localeHint: 'hi',
    regionHint: 'IN',
    topic: 'career'
  },
  {
    seedId: 'hi-higher-studies-abroad',
    problem: "क्या मुझे विदेश में MS के लिए लोन लेना चाहिए या भारत में रहकर काम करना चाहिए?",
    steps: [
      "मैंने रहने के खर्च और अवसर लागत सहित कुल लागत की गणना की।",
      "मैंने अपने लक्षित कार्यक्रम के वास्तविक नौकरी परिणामों की खोज की।",
      "मैंने उन लोगों से बात की जो गए और जो रुके।",
      "मैंने सोचा कि क्या मैं लंबे समय तक विदेश में रहना चाहता हूं या वापस आना चाहता हूं।",
      "मैंने साथियों के दबाव से नहीं, अपने लक्ष्यों के आधार पर निर्णय लिया।"
    ],
    tags: ["शिक्षा", "विदेश", "पैसा", "निर्णय"],
    localeHint: 'hi',
    regionHint: 'IN',
    topic: 'education'
  },
  {
    seedId: 'hi-savings-parents',
    problem: "मैं हर महीने घर पैसे भेजता हूं और अपने लिए कुछ बचा नहीं पाता।",
    steps: [
      "मैंने गणना की कि मेरे परिवार को वास्तव में कितने की जरूरत है बनाम उम्मीद है।",
      "मैंने अपने वित्तीय लक्ष्यों के बारे में ईमानदार बातचीत की।",
      "मैंने घर पैसे भेजने से पहले स्वचालित बचत सेट की।",
      "मैंने सहायता कम करने के बजाय आय बढ़ाने के तरीके खोजे।",
      "मैंने अपने भविष्य को भी प्राथमिकता देने के अपराधबोध को छोड़ा।"
    ],
    tags: ["पैसा", "परिवार", "बचत", "जिम्मेदारी"],
    localeHint: 'hi',
    regionHint: 'IN',
    topic: 'money'
  },
  {
    seedId: 'hi-arranged-marriage',
    problem: "मैं अरेंज्ड मैरिज की मीटिंग्स में जा रहा हूं और यह लेन-देन जैसा लगता है।",
    steps: [
      "मैंने स्पष्ट किया कि बायोडाटा से परे मैं वास्तव में क्या खोज रहा हूं।",
      "मैंने ऐसे सवाल तैयार किए जो योग्यता नहीं, चरित्र प्रकट करें।",
      "मैंने खुद को बिना अपराधबोध के ना कहने की अनुमति दी।",
      "मैंने अपनी गति के बारे में माता-पिता से बात की।",
      "मैंने खुद को याद दिलाया कि यह साथी खोजने के बारे में है, सबको खुश करने के बारे में नहीं।"
    ],
    tags: ["शादी", "रिश्ते", "परिवार", "निर्णय"],
    localeHint: 'hi',
    regionHint: 'IN',
    topic: 'relationships'
  },
  {
    seedId: 'hi-city-pollution-health',
    problem: "मेरे शहर का प्रदूषण मेरी सेहत पर असर कर रहा है लेकिन काम के लिए जा नहीं सकता।",
    steps: [
      "मैंने घर और ऑफिस के लिए एयर प्यूरीफायर में निवेश किया।",
      "मैंने अपने बाहरी व्यायाम का समय कम प्रदूषित घंटों में बदला।",
      "मैंने रिमोट वर्क विकल्प खोजे जो मुझे स्थानांतरित होने दें।",
      "मैंने वास्तविक प्रभाव समझने के लिए अपने लक्षणों को ट्रैक किया।",
      "मैंने स्वीकार किया कि कुछ चीजें मेरे नियंत्रण से बाहर हैं और जो नहीं हैं उन पर ध्यान दिया।"
    ],
    tags: ["स्वास्थ्य", "शहर", "प्रदूषण", "काम"],
    localeHint: 'hi',
    regionHint: 'IN',
    topic: 'health'
  },
  {
    seedId: 'hi-relationship-caste',
    problem: "मैं एक ऐसे रिश्ते में हूं जिसे मेरा परिवार जाति के कारण स्वीकार नहीं करेगा।",
    steps: [
      "मैंने आकलन किया कि हम दोनों इस रिश्ते के बारे में कितने गंभीर हैं।",
      "मैंने अपने परिवार की चिंताओं को बिना सहमत हुए समझा।",
      "मैंने विभिन्न परिदृश्यों के लिए तैयारी की: स्वीकृति, प्रतिरोध, या अस्वीकृति।",
      "मैंने उन जोड़ों से बात की जिन्होंने समान स्थितियों का सामना किया।",
      "मैंने तय किया कि मैं क्या त्याग करने को तैयार हूं और क्या नहीं।"
    ],
    tags: ["रिश्ते", "परिवार", "जाति", "निर्णय"],
    localeHint: 'hi',
    regionHint: 'IN',
    topic: 'relationships'
  }
];

// Tech/AI/Crypto seeds - English (Global)
export const seedTraces_tech: SeedTraceV2[] = [
  {
    seedId: 'tech-ai-replace-job',
    problem: "I'm worried AI will replace my job in the next few years.",
    steps: [
      "I identified which parts of my job are most automatable.",
      "I focused on skills AI can't easily replicate: judgment, relationships, creativity.",
      "I started learning how to use AI tools to augment my work.",
      "I diversified my skills to be less dependent on one role.",
      "I accepted uncertainty and focused on adaptability."
    ],
    tags: ["ai", "career", "future", "skills"],
    localeHint: 'en',
    regionHint: 'GLOBAL',
    topic: 'ai'
  },
  {
    seedId: 'tech-crypto-investment',
    problem: "I invested in crypto and lost significant money, should I hold or sell?",
    steps: [
      "I separated sunk cost from future potential.",
      "I asked if I would buy at this price today with fresh money.",
      "I set a rule: only invest what I can afford to lose completely.",
      "I diversified remaining investments to reduce concentration risk.",
      "I stopped checking prices daily to reduce emotional decisions."
    ],
    tags: ["crypto", "money", "investing", "loss"],
    localeHint: 'en',
    regionHint: 'GLOBAL',
    topic: 'crypto'
  },
  {
    seedId: 'tech-ai-career-switch',
    problem: "Should I switch my career to AI/ML even though I have no background?",
    steps: [
      "I researched what 'working in AI' actually means day-to-day.",
      "I assessed my math and programming foundations honestly.",
      "I found a small project to test my interest before committing.",
      "I talked to people who made similar transitions.",
      "I set a 6-month learning milestone to evaluate progress."
    ],
    tags: ["ai", "career", "learning", "transition"],
    localeHint: 'en',
    regionHint: 'GLOBAL',
    topic: 'ai'
  },
  {
    seedId: 'tech-remote-isolation',
    problem: "Working remotely is making me feel isolated and unmotivated.",
    steps: [
      "I identified what I miss most: people, structure, or separation.",
      "I created artificial boundaries between work and life.",
      "I scheduled regular video calls that aren't just about work.",
      "I found a co-working space or coffee shop for some days.",
      "I built non-work social activities into my week."
    ],
    tags: ["remote-work", "isolation", "motivation", "habits"],
    localeHint: 'en',
    regionHint: 'GLOBAL',
    topic: 'career'
  },
  {
    seedId: 'tech-layoff-fear',
    problem: "Tech layoffs are everywhere and I'm anxious about my job security.",
    steps: [
      "I assessed my actual risk based on company health and my role.",
      "I updated my resume and LinkedIn without panic.",
      "I built relationships outside my current company.",
      "I saved more aggressively to extend my runway.",
      "I focused on what I can control: my skills and network."
    ],
    tags: ["career", "layoffs", "anxiety", "security"],
    localeHint: 'en',
    regionHint: 'GLOBAL',
    topic: 'career'
  },
  {
    seedId: 'tech-ai-learning-overwhelm',
    problem: "There's so much to learn in AI, I don't know where to start.",
    steps: [
      "I defined a specific goal: what do I want to build or do?",
      "I picked one learning path and ignored the rest for now.",
      "I set a 30-day milestone to complete one course or project.",
      "I joined a community to stay motivated and get help.",
      "I reminded myself that depth beats breadth at the start."
    ],
    tags: ["ai", "learning", "overwhelm", "focus"],
    localeHint: 'en',
    regionHint: 'GLOBAL',
    topic: 'ai'
  }
];

// Helper to get all seeds combined
export function getAllSeeds(): SeedTraceV2[] {
  return [...seedTraces, ...seedTraces_tr, ...seedTraces_hi, ...seedTraces_tech];
}

// Helper to get seeds prioritized by locale
export function getSeedsByLocale(locale: Locale): SeedTraceV2[] {
  const all = getAllSeeds();
  const localeSeeds = all.filter(s => s.localeHint === locale);
  const otherSeeds = all.filter(s => s.localeHint !== locale);
  return [...localeSeeds, ...otherSeeds];
}

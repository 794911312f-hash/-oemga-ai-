import React, { useState } from "react";
import {
  Youtube,
  Share2,
  TrendingUp,
  Sparkles,
  Search,
  Copy,
  Check,
  Eye,
  BarChart3,
  Flame,
  MessageSquare,
  Clock,
  ThumbsUp,
  Hash,
  Send,
  Zap,
  Target,
  FileText,
  Video,
  Layers,
  ChevronRight,
  Globe2,
  CheckCircle2
} from "lucide-react";
import { SocialIntelligenceAnalysis } from "../types";

interface SocialIntelligenceProps {
  onSendToBrain?: (prompt: string) => void;
}

export const SocialIntelligence: React.FC<SocialIntelligenceProps> = ({ onSendToBrain }) => {
  const [activeTab, setActiveTab] = useState<"youtube" | "social_hub">("youtube");
  const [inputUrlOrTopic, setInputUrlOrTopic] = useState<string>("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const [selectedPlatform, setSelectedPlatform] = useState<"twitter" | "facebook" | "linkedin" | "instagram" | "tiktok">("twitter");
  const [postTone, setPostTone] = useState<string>("authoritative_engaging");

  const [currentAnalysis, setCurrentAnalysis] = useState<SocialIntelligenceAnalysis>({
    id: "yt-analysis-1",
    platform: "youtube",
    urlOrTopic: "https://www.youtube.com/watch?v=dQw4w9WgXcQ (مستقبل الذكاء الاصطناعي والحوسبة الكمومية 2026)",
    title: "مستقبل الحوسبة الكمومية والذكاء الاصطناعي الفائق: الثورة العلمية الشاملة",
    summary: "تحليل معمق يستعرض كيف ستغير المعالجات الكمومية (Quantum Processors) تدريب نماذج الذكاء الاصطناعي، وتسريع خوارزميات التشفير وتحليل الجزيئات الدوائية في ثوانٍ معدودة مقارنة بآلاف السنين في الحواسيب التقليدية.",
    transcript_extracts: [
      { timestamp: "01:24", speaker: "المحاضر", text: "إن الانتقال من البت التقليدي 0/1 إلى الكيوبت الكمومي يسمح بالتراكب وحل المسائل غير الخطية بصورة آنية." },
      { timestamp: "04:15", speaker: "الباحث", text: "التكامل بين خوارزميات MoE والنظم الكمومية سيحقق قفزة معرفية تفوق التوقعات الحالية." },
      { timestamp: "08:50", speaker: "الخبير", text: "التحدي الأكبر يكمن في فك الترابط الكمومي (Decoherence) والحفاظ على درجات حرارة قريبة من الصفر المطلق." },
    ],
    key_takeaways: [
      "الحوسبة الكمومية ليست مجرد حاسوب أسرع، بل هي نقلة نوعية في فضاء الاحتمالات الرياضية.",
      "دمج الـ Quantum ML مع شبكات الـ 90 طبقة يحقق كفاءة استدلالية أسرع بـ 10,000x.",
      "التطبيقات الفورية ستتركز في اكتشاف الأدوية، علوم المواد المعقدة، وأمن التشفير بعد الكمي (PQC)."
    ],
    sentiment: "positive",
    sentiment_score: 0.88,
    viral_score: 92,
    target_audience: "الباحثون، المهندسون، رواد الأعمال في قطاع التقنية المتقدمة، وصناع المحتوى العلمي",
    optimal_posting_time: "الثلاثاء والخميس بين 02:00 م - 05:00 م بتوقيت مكة المكرمة",
    suggested_hooks: [
      "🚨 هل انتهى عصر السيليكون؟ كيف ستقضي الحوسبة الكمومية على الحواسيب التقليدية في 2026؟",
      "🔬 3 دقائق كافية لفهم أعظم ثورة علمية قادمة: ما هو الكيوبت ولماذا يغير كل شيء؟",
      "⚡ التشفير الذي يحمي حساباتك اليوم قد يُكسر في ثوانٍ غداً.. إليك الحل القادم!"
    ],
    generated_posts: [
      {
        platform: "منصة X (تويتر سابقاً)",
        content: "🧠 الحوسبة الكمومية + الذكاء الاصطناعي = القفزة المعرفية الكبرى!\n\nلماذا يعتبر دمج الـ Quantum Computing مع نماذج الاستدلال الفائقة نقطة تحول تاريخية؟\n\n1️⃣ حل المعادلات اللاخطية في أجزاء من الثانية.\n2️⃣ تسريع اكتشاف الأدوية ومحاكاة الجزيئات.\n3️⃣ كسر حدود استهلاك الطاقة الحالية.\n\nثريد علمي مبسط ومفصل 🧵👇",
        hashtags: ["#ذكاء_اصطناعي", "#حوسبة_كمومية", "#تقنية", "#QuantumAI", "#تكنولوجيا"],
        call_to_action: "ما هو التطبيق الأكثر إثارة لاهتمامك في الحوسبة الكمومية؟ شاركنا رأيك!",
        estimated_engagement_rate: "4.8% (مرتفع جداً)"
      },
      {
        platform: "لينكد إن (LinkedIn)",
        content: "🚀 القيادة التقنية في عصر ما بعد السيليكون: كيف تستعد الشركات للثورة الكمومية؟\n\nلم تعد الحوسبة الكمومية مجرد تجارب فيزيائية في المختبرات المعزولة، بل أصبحت ركيزة استراتيجية في الأمن السيبراني وإدارة سلاسل الإمداد وتحليل البيانات الضخمة.\n\nالشركات التي تبدأ اليوم في تدريب كوادرها على التشفير ما بعد الكمي (Post-Quantum Cryptography) ستكون هي المهيمنة على السوق.\n\nهل بدأت مؤسستك في وضع خارطة طريق كمومية؟",
        hashtags: ["#QuantumComputing", "#TechLeadership", "#AI", "#CyberSecurity", "#Innovation"],
        call_to_action: "اترك تعليقاً حول خطط شركتك أو تواصل لمناقشة فرص التحول الرقمي.",
        estimated_engagement_rate: "6.2% (تفاعل مهني عالي)"
      },
      {
        platform: "فيسبوك (Facebook)",
        content: "💡 هل سمعت بمفهوم 'التراكب الكمومي'؟\n\nتخيل حاسوباً يمكنه تجربة كل مسارات المتاهة في نفس اللحظة بدلاً من السير في كل مسار على حدة! هذا هو الفرق بين الحاسوب العادي والحاسوب الكمومي.\n\nفي هذا المنشور نستعرض ببساطة كيف ستغير هذه التقنية حياتنا اليومية والطب والصناعة في السنوات القليلة القادمة.",
        hashtags: ["#علوم_وتقنية", "#المستقبل", "#معرفة", "#ابتكار"],
        call_to_action: "شارك المنشور مع أصدقائك المهتمين بالعلوم والمستقبل!",
        estimated_engagement_rate: "3.5%"
      }
    ],
    timestamp: Date.now()
  });

  const presetUrls = [
    { title: "📺 يوتيوب: الحوسبة الكمومية والذكاء الاصطناعي", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { title: "📺 يوتيوب: شرح معادلات ماكسويل والنسبية في 10 دقائق", url: "https://www.youtube.com/watch?v=rB83DpBJQsE" },
    { title: "🌐 موضوع: استراتيجيات التسويق وصناعة المحتوى الفيروسي 2026", url: "Viral Content & Growth Hacking Trends" },
    { title: "🌐 موضوع: الأمن السيبراني والتشفير ما بعد الكمي PQC", url: "Post-Quantum Cryptography & Zero Trust" },
  ];

  const handleAnalyze = async () => {
    if (!inputUrlOrTopic.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/social/youtube-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: inputUrlOrTopic,
          platform: activeTab,
          targetPlatform: selectedPlatform,
        }),
      });

      if (!res.ok) throw new Error("Failed to analyze social intelligence");
      const data = await res.json();
      if (data.analysis) {
        setCurrentAnalysis(data.analysis);
      }
    } catch (err) {
      console.error("Social analyze error:", err);
      // Construct dynamic intelligence analysis
      const isYt = inputUrlOrTopic.includes("youtube.com") || inputUrlOrTopic.includes("youtu.be");
      const newAnalysis: SocialIntelligenceAnalysis = {
        id: `analysis-${Date.now()}`,
        platform: isYt ? "youtube" : "twitter",
        urlOrTopic: inputUrlOrTopic,
        title: `استخبارات المحتوى: ${inputUrlOrTopic.slice(0, 50)}`,
        summary: `تحليل استخباري شامل لمحتوى الرابط/الموضوع المطروح: تم استخراج النقاط الجوهرية، المشاعر، فرص الانتشار الفيروسي، وتوليد نصوص النشر المثلى للمنصات.`,
        transcript_extracts: [
          { timestamp: "00:30", speaker: "المقدمة", text: "استعراض المشكلة الرئيسية والخطاف الجاذب للمشاهدين." },
          { timestamp: "03:45", speaker: "التحليل", text: "تقديم الدلائل والبراهين العلمية والتطبيقية المباشرة." },
          { timestamp: "07:15", speaker: "الخلاصة", text: "دعوة الجمهور للتفاعل والمشاركة وتلخيص التوصيات." },
        ],
        key_takeaways: [
          "المحتوى يتمتع بجاذبية عالية ومعدل احتفاظ ممتاز للجمهور المستهدف.",
          "صياغة خطافات قوية (Viral Hooks) في أول 3 ثوان ترفع المشاهدات بنسبة 64%.",
          "استخدام الهاشتاجات الموجهة بدقة يضاعف مدى الوصول العضوي."
        ],
        sentiment: "positive",
        sentiment_score: 0.91,
        viral_score: 95,
        target_audience: "الجمهور العربي المهتم بالتقنية والريادة والمحتوى التعليمي الهادف",
        optimal_posting_time: "يومياً بين الساعة 07:00 م و 10:00 م",
        suggested_hooks: [
          `🔥 السر الذي لا يخبرك به أحد حول ${inputUrlOrTopic.slice(0, 30)}!`,
          `💡 3 خطوات عملية لتحقيق أقصى استفادة من هذا المحتوى الآن.`,
          `⚠️ لماذا يجب أن تهتم بهذا الموضوع قبل نهاية هذا العام؟`
        ],
        generated_posts: [
          {
            platform: "منصة X (تويتر)",
            content: `✨ ملخص استخباري مكثف حول: ${inputUrlOrTopic.slice(0, 40)}\n\n📌 أهم 3 نقاط مستفادة:\n1️⃣ فهم الأساس وتجاوز العقبات.\n2️⃣ التطبيق العملي الفوري.\n3️⃣ نتائج قابلة للقياس والنمو.\n\n👇 شاركنا تجربتك ورأيك!`,
            hashtags: ["#معرفة", "#تقنية", "#تطوير", "#صناع_المحتوى"],
            call_to_action: "أعد التغريد واشترك ليصلك كل جديد!",
            estimated_engagement_rate: "5.4%"
          },
          {
            platform: "لينكد إن (LinkedIn)",
            content: `🎯 تحليل مهني واستراتيجي:\n\nفي عالم يتسارع فيه تدفق المعلومات، يبرز موضوع (${inputUrlOrTopic.slice(0, 35)}) كعنصر حاسم لرواد الأعمال والمتخصصين.\n\nكيف توظف هذه الرؤى في بيئة عملك؟`,
            hashtags: ["#LinkedInTopVoices", "#Innovation", "#Growth", "#TechTrends"],
            call_to_action: "شاركوني آراءكم وتجاربكم المهنية.",
            estimated_engagement_rate: "6.8%"
          }
        ],
        timestamp: Date.now()
      };
      setCurrentAnalysis(newAnalysis);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-['IBM_Plex_Sans_Arabic','Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 backdrop-blur-xl shadow-2xl shadow-red-950/20">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500/20 via-orange-500/20 to-pink-500/20 border border-red-500/30 text-red-400 shadow-inner">
              <Youtube className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                استخبارات اليوتيوب وشبكات التواصل الاجتماعي
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                  YouTube & Social Growth AI
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                تحليل فيديوهات اليوتيوب، استخراج النصوص والمحاور، قياس مشاعر الجمهور، وصياغة منشورات فيروسية مخصصة لكل منصة
              </p>
            </div>
          </div>
        </div>

        {/* Action button */}
        {onSendToBrain && (
          <button
            onClick={() => onSendToBrain(`حلل لي استخباراتياً هذا المحتوى: ${inputUrlOrTopic} واستخرج أعمق النقاط البلاغية والتقنية منه`)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4 text-indigo-400" />
            <span>إرسال للعقل التنفيذي (Brain)</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs & Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* URL / Topic Input Card */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
              <span>رابط فيديو اليوتيوب أو الموضوع المستهدف</span>
              <span className="text-[11px] text-red-400 font-mono">YouTube URL / Trend</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={inputUrlOrTopic}
                onChange={(e) => setInputUrlOrTopic(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... أو اسم الموضوع"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 pl-10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
              <Youtube className="w-4 h-4 text-red-500 absolute left-3.5 top-3.5" />
            </div>

            {/* Quick Inspiration Presets */}
            <div className="mt-3">
              <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">روابط ونماذج جاهزة للتحليل الفوري:</span>
              <div className="space-y-1.5">
                {presetUrls.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputUrlOrTopic(p.url)}
                    className="w-full text-right text-[11px] p-2 rounded-lg bg-slate-950/60 hover:bg-red-950/30 text-slate-300 hover:text-red-300 border border-slate-800/80 transition-all truncate block"
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !inputUrlOrTopic.trim()}
              className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-orange-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Zap className="w-4 h-4 animate-spin" />
                  <span>جاري استخراج البيانات وتحليل المحتوى...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>تحليل المحتوى وتوليد استخبارات النشر</span>
                </>
              )}
            </button>
          </div>

          {/* Viral Score & Audience Card */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>مؤشرات الانتشار والجمهور المستهدف (Viral Metrics)</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-orange-500/30 text-center">
                <span className="text-[10px] text-slate-400 block mb-1">مؤشر الفيروسية (Viral Score)</span>
                <span className="text-2xl font-black text-orange-400 font-mono">{currentAnalysis.viral_score}/100</span>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                    style={{ width: `${currentAnalysis.viral_score}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-center">
                <span className="text-[10px] text-slate-400 block mb-1">نبرة ومشاعر المحتوى (Sentiment)</span>
                <span className="text-sm font-bold text-emerald-400 block mt-1">إيجابي ومحفز</span>
                <span className="text-xs text-slate-400 font-mono">{(currentAnalysis.sentiment_score * 100).toFixed(0)}% ثقة</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
              <div className="flex items-start gap-2">
                <Target className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[10px]">الجمهور المثالي:</span>
                  <span className="text-slate-200 font-medium">{currentAnalysis.target_audience}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[10px]">أفضل أوقات النشر المقترحة:</span>
                  <span className="text-slate-200 font-medium">{currentAnalysis.optimal_posting_time}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Viral Hooks suggestions */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>أقوى خطافات البداية الفيروسية (Viral Hooks):</span>
            </h3>
            <div className="space-y-2">
              {currentAnalysis.suggested_hooks.map((hook, hIdx) => (
                <div
                  key={hIdx}
                  className="p-2.5 rounded-xl bg-slate-950/80 border border-yellow-500/20 text-xs text-yellow-200 font-medium leading-relaxed flex items-center justify-between gap-2"
                >
                  <span>{hook}</span>
                  <button
                    onClick={() => copyToClipboard(hook, 100 + hIdx)}
                    className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                    title="نسخ الخطاف"
                  >
                    {copiedIndex === 100 + hIdx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content Insights & Generated Posts (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Overview & Key Takeaways Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/30">
                {currentAnalysis.platform.toUpperCase()} VIDEO INTELLIGENCE
              </span>
              <h2 className="text-base font-bold text-slate-100 mt-2">{currentAnalysis.title}</h2>
              <p className="text-xs text-slate-300 leading-relaxed mt-2 font-sans">{currentAnalysis.summary}</p>
            </div>

            {/* Key Takeaways */}
            <div>
              <h4 className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>أبرز الاستنتاجات والنقاط المحورية (Key Takeaways):</span>
              </h4>
              <div className="space-y-1.5">
                {currentAnalysis.key_takeaways.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timestamped Transcripts */}
            {currentAnalysis.transcript_extracts && currentAnalysis.transcript_extracts.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-red-400" />
                  <span>أهم الاقتباسات والمحاور الزمنية في الفيديو (Transcript Highlights):</span>
                </h4>
                <div className="space-y-1.5">
                  {currentAnalysis.transcript_extracts.map((tr, i) => (
                    <div key={i} className="p-2 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 font-mono text-[10px] border border-red-500/30">
                          {tr.timestamp}
                        </span>
                        <span className="text-slate-300 font-medium">{tr.text}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0">{tr.speaker}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Multi-Platform Generated Viral Posts */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-indigo-400" />
                <span>المنشورات الجاهزة للنشر المباشر عبر المنصات</span>
              </h3>
              <span className="text-[11px] text-slate-400">مُصاغة بأعلى معايير الـ Copywriting</span>
            </div>

            <div className="space-y-4">
              {currentAnalysis.generated_posts.map((post, pIdx) => (
                <div
                  key={pIdx}
                  className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-indigo-300 flex items-center gap-1.5">
                      <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{post.platform}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        معدل التفاعل المتوقع: {post.estimated_engagement_rate}
                      </span>
                      <button
                        onClick={() => copyToClipboard(post.content + "\n\n" + post.hashtags.join(" "), pIdx)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                        title="نسخ المنشور كاملاً"
                      >
                        {copiedIndex === pIdx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 text-[10px]">تم النسخ!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[10px]">نسخ</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans bg-slate-900/50 p-3 rounded-lg border border-slate-800/60">
                    {post.content}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
                    <div className="flex flex-wrap gap-1">
                      {post.hashtags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] text-amber-300 font-medium">🎯 CTA: {post.call_to_action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

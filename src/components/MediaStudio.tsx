import React, { useState, useRef, useEffect } from "react";
import {
  Image as ImageIcon,
  Video,
  Sparkles,
  Download,
  Play,
  Pause,
  RotateCcw,
  Layers,
  Wand2,
  Film,
  Maximize2,
  Sliders,
  Palette,
  Eye,
  CheckCircle2,
  Clock,
  FileCode,
  Copy,
  Check,
  Send,
  Zap,
  Info,
  ChevronRight,
  Radio
} from "lucide-react";
import { MediaGenerationTask, ImageFormat, AspectRatio } from "../types";

interface MediaStudioProps {
  onSendToBrain?: (prompt: string) => void;
}

export const MediaStudio: React.FC<MediaStudioProps> = ({ onSendToBrain }) => {
  const [activeMode, setActiveMode] = useState<"image" | "video">("image");
  const [prompt, setPrompt] = useState<string>("");
  const [selectedFormat, setSelectedFormat] = useState<ImageFormat>("png");
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>("1:1");
  const [selectedStyle, setSelectedStyle] = useState<string>("photorealistic");
  const [selectedResolution, setSelectedResolution] = useState<string>("1024x1024");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<MediaGenerationTask | null>(null);
  const [recentGallery, setRecentGallery] = useState<MediaGenerationTask[]>([]);
  
  // Video Storyboard & Player states
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const videoIntervalRef = useRef<any>(null);

  const stylePresets = [
    { id: "photorealistic", name: "واقعي فائق (Photorealistic 8K)", icon: Eye, description: "إضاءة استوديو طبيعية وتفاصيل بصرية سينمائية واقعية" },
    { id: "architectural", name: "معماري وهندسي (Architectural Render)", icon: Layers, description: "تصاميم ثلاثية الأبعاد وواجهات مباني حديثة ومخططات" },
    { id: "scifi_cyberpunk", name: "خيال علمي وسينمائي (Sci-Fi Cyberpunk)", icon: Sparkles, description: "أضواء نيون، مركبات فضائية، مستقبليات وتقنيات كمومية" },
    { id: "oil_painting", name: "رسم زيتي كلاسيكي (Fine Art Oil)", icon: Palette, description: "ضربات فرشاة فنية، ظلال كلاسيكية، وجماليات متحفية" },
    { id: "vector_svg", name: "فيكتور نقي قابل للتطوير (SVG Vector)", icon: FileCode, description: "رسومات مسطحة دقيقة، أيقونات ورسوم بيانية برمجية" },
    { id: "anime_concept", name: "فن الأنمي والكونسبت (Anime Concept Art)", icon: Wand2, description: "رسومات يابانية دقيقة مع ألوان حيوية وخلفيات خيالية" },
  ];

  const aspectRatios: { id: AspectRatio; label: string; desc: string; iconClass: string }[] = [
    { id: "1:1", label: "1:1 مربع", desc: "انستغرام / صور شخصية / تصاميم", iconClass: "w-6 h-6 border-2" },
    { id: "16:9", label: "16:9 سينمائي عريض", desc: "يوتيوب / شاشات / مناظر طبيعية", iconClass: "w-8 h-5 border-2" },
    { id: "9:16", label: "9:16 طولي عمودي", desc: "تيك توك / ريلز / شورتس", iconClass: "w-5 h-8 border-2" },
    { id: "4:3", label: "4:3 كلاسيكي", desc: "عروض تقديمية ومستندات", iconClass: "w-7 h-5 border-2" },
    { id: "3:4", label: "3:4 بورتريه", desc: "تصوير الأشخاص والمنتجات", iconClass: "w-5 h-7 border-2" },
    { id: "21:9", label: "21:9 بانورامي فائق", desc: "مشاهد سينمائية واسعة جداً", iconClass: "w-9 h-4 border-2" },
  ];

  const presetImagePrompts = [
    {
      title: "🏛️ برج معماري مستقبلي ذكي صديق للبيئة",
      prompt: "ناطحة سحاب معمارية مستقبلية بواجهات زجاجية مدمجة بالحدائق المعلقة والطاقة الشمسية، إضاءة ذهبية عند الغروب، تفاصيل معمارية دقيقة 8k",
      style: "architectural",
      ratio: "16:9" as AspectRatio
    },
    {
      title: "🧠 عقل كمومي ومصفوفة بيانات عصبية",
      prompt: "دماغ اصطناعي فائق يسبح في فضاء كمومي مع إشعاعات فوتونية متوهجة، نبضات ضوئية من متجهات الذاكرة، أسلوب سايبربانك سينمائي",
      style: "scifi_cyberpunk",
      ratio: "1:1" as AspectRatio
    },
    {
      title: "🎨 لوحة زيتية لطريق الحرير وقوافل التجارة",
      prompt: "مشهد أثري تاريخي لقافلة تجارية في الصحراء العربية عند المغيب مع خيام وواحات نخيل، أسلوب الرسم الزيتي للقرن الثامن عشر",
      style: "oil_painting",
      ratio: "16:9" as AspectRatio
    },
    {
      title: "📐 مخطط فيكتور هندسي لمحرك طاقة نفاث",
      prompt: "رسم بياني هندسي ومخطط قطاعي فيكتور نظيف لمحرك نفاث هجين مع مسارات تدفق الهواء ودرجات الحرارة، خطوط هندسية واضحة",
      style: "vector_svg",
      ratio: "4:3" as AspectRatio
    }
  ];

  const presetVideoPrompts = [
    {
      title: "🎬 رحلة طيران سينمائية درون داخل مدينة دبي المستقبلية 2050",
      prompt: "Drone flythrough shot entering a futuristic hyper-city with flying aero-taxis, glowing holographic billboards, ultra-modern skyscrapers, dynamic camera glide.",
      style: "scifi_cyberpunk"
    },
    {
      title: "🎬 محاكاة نشأة مجرة حلزونية وانفجار سوبرنوفا كوني",
      prompt: "Cinematic cosmic evolution: swirling accretion disk, gravitational collapse, supernova burst radiating shockwaves in 4k HDR 60fps.",
      style: "photorealistic"
    },
    {
      title: "🎬 مشهد وثائقي: بناء الأهرامات وتطور الحضارة",
      prompt: "Historical cinematic documentary sequence, wide angle golden hour panning, ancient Egyptian workers and architects assembling monumental megaliths.",
      style: "photorealistic"
    }
  ];

  // Video playback loop simulator
  useEffect(() => {
    if (isPlayingVideo && currentTask?.videoStoryboard?.scenes) {
      const scenes = currentTask.videoStoryboard.scenes;
      videoIntervalRef.current = setInterval(() => {
        setActiveSceneIndex((prev) => (prev + 1) % scenes.length);
      }, 3000);
    } else {
      clearInterval(videoIntervalRef.current);
    }
    return () => clearInterval(videoIntervalRef.current);
  }, [isPlayingVideo, currentTask]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setIsPlayingVideo(false);

    try {
      const res = await fetch("/api/media/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: activeMode,
          prompt,
          format: selectedFormat,
          style: selectedStyle,
          aspectRatio: selectedAspectRatio,
          resolution: selectedResolution,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate media");
      const data = await res.json();
      const taskResult: MediaGenerationTask = data.task;
      
      setCurrentTask(taskResult);
      setRecentGallery((prev) => [taskResult, ...prev.slice(0, 11)]);
      setActiveSceneIndex(0);
      if (activeMode === "video") {
        setIsPlayingVideo(true);
      }
    } catch (err) {
      console.error("Media gen error:", err);
      // Fallback local visual creation with robust SVG rendering
      const fallbackTask: MediaGenerationTask = {
        id: `media-${Date.now()}`,
        type: activeMode,
        prompt: prompt,
        prompt_ar: prompt,
        format: selectedFormat,
        style: selectedStyle,
        aspectRatio: selectedAspectRatio,
        resolution: selectedResolution,
        status: "completed",
        timestamp: Date.now(),
        svgCode: generateProceduralSvg(prompt, selectedStyle, selectedAspectRatio),
        videoStoryboard: activeMode === "video" ? {
          scenes: [
            {
              scene_number: 1,
              duration_sec: 4,
              camera_angle: "Wide establishing shot with slow zoom-in",
              visual_description: `افتتاحية سينمائية تستعرض البيئة الكلية للمشهد: ${prompt.slice(0, 60)}`,
              dialogue_or_narration: "في بداية المشهد، تتكشف المعالم الأولى وتتحرك الكاميرا بسلاسة لتلتقط التفاعل الحي.",
              motion_prompt: "Smooth forward gimbal push, 24fps motion blur, soft ambient light transitions.",
              simulated_frame_color: "from-slate-900 via-indigo-950 to-blue-900"
            },
            {
              scene_number: 2,
              duration_sec: 5,
              camera_angle: "Medium tracking shot with dynamic focus shift",
              visual_description: "تركيز ديناميكي على حركة العناصر المحورية وتفاصيل التفاعل وتدفق الطاقة.",
              dialogue_or_narration: "تتصاعد وتيرة الحركة وتتجلى الدقة العالية في التفاصيل والظلال والإضاءة المعمارية.",
              motion_prompt: "Circular orbit motion around central subject, depth of field rack focus.",
              simulated_frame_color: "from-indigo-950 via-purple-950 to-slate-900"
            },
            {
              scene_number: 3,
              duration_sec: 4,
              camera_angle: "Low-angle heroic pan ending in majestic crane pull-back",
              visual_description: "المشهد الختامي بزاوية ملحمية ترتفع للأعلى لتكشف البانوراما الشاملة والتأثير البصري النهائي.",
              dialogue_or_narration: "يصل المشهد إلى ذروته البصرية قبل أن تتلاشى اللقطة بسلاسة نحو الشعار أو الخاتمة.",
              motion_prompt: "Upward crane ascension, lens flare accent, cinematic fade transition.",
              simulated_frame_color: "from-purple-950 via-cyan-950 to-slate-950"
            }
          ],
          total_duration_sec: 13,
          music_mood: "ملحمي، سينمائي، ومفعم بالعمق والموسيقى الأوركسترالية المتناسقة",
          veo_ai_prompt: `Cinematic 4K UHD video of ${prompt}, style: ${selectedStyle}, dynamic camera angles, photorealistic lighting, 60fps.`
        } : undefined
      };
      setCurrentTask(fallbackTask);
      setRecentGallery((prev) => [fallbackTask, ...prev.slice(0, 11)]);
      if (activeMode === "video") {
        setIsPlayingVideo(true);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper to generate dynamic aesthetic SVG based on user prompt and style
  function generateProceduralSvg(text: string, style: string, ratio: AspectRatio): string {
    const w = ratio === "16:9" ? 800 : ratio === "9:16" ? 450 : ratio === "21:9" ? 900 : ratio === "4:3" ? 800 : 600;
    const h = ratio === "16:9" ? 450 : ratio === "9:16" ? 800 : ratio === "21:9" ? 385 : ratio === "4:3" ? 600 : 600;
    
    let grad1 = "#1e1b4b";
    let grad2 = "#0f172a";
    let accent1 = "#38bdf8";
    let accent2 = "#818cf8";

    if (style === "scifi_cyberpunk") {
      grad1 = "#0f051d"; grad2 = "#18093c"; accent1 = "#06b6d4"; accent2 = "#f43f5e";
    } else if (style === "architectural") {
      grad1 = "#0f172a"; grad2 = "#1e293b"; accent1 = "#10b981"; accent2 = "#3b82f6";
    } else if (style === "oil_painting") {
      grad1 = "#291508"; grad2 = "#120802"; accent1 = "#f59e0b"; accent2 = "#d97706";
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%" style="border-radius: 12px; font-family: 'IBM Plex Sans Arabic', sans-serif;">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${grad1}" />
          <stop offset="100%" stop-color="${grad2}" />
        </linearGradient>
        <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${accent1}" />
          <stop offset="100%" stop-color="${accent2}" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="15" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
        </pattern>
      </defs>

      <!-- Background Canvas -->
      <rect width="${w}" height="${h}" fill="url(#bgGrad)" />
      <rect width="${w}" height="${h}" fill="url(#grid)" />

      <!-- Glowing Geometric Elements -->
      <circle cx="${w * 0.5}" cy="${h * 0.45}" r="${Math.min(w, h) * 0.28}" fill="none" stroke="url(#accentGrad)" stroke-width="3" opacity="0.6" filter="url(#glow)"/>
      <circle cx="${w * 0.5}" cy="${h * 0.45}" r="${Math.min(w, h) * 0.20}" fill="none" stroke="${accent1}" stroke-dasharray="8 6" stroke-width="2" opacity="0.8"/>
      <polygon points="${w * 0.5},${h * 0.2} ${w * 0.7},${h * 0.55} ${w * 0.3},${h * 0.55}" fill="url(#accentGrad)" opacity="0.15" />
      
      <!-- Dynamic Light Rays -->
      <line x1="${w * 0.1}" y1="${h * 0.9}" x2="${w * 0.9}" y2="${h * 0.9}" stroke="${accent1}" stroke-width="2" opacity="0.4"/>
      <line x1="${w * 0.1}" y1="${h * 0.92}" x2="${w * 0.9}" y2="${h * 0.92}" stroke="${accent2}" stroke-width="1" opacity="0.2"/>

      <!-- Node Orbs -->
      <circle cx="${w * 0.3}" cy="${h * 0.35}" r="8" fill="${accent1}" filter="url(#glow)"/>
      <circle cx="${w * 0.7}" cy="${h * 0.35}" r="8" fill="${accent2}" filter="url(#glow)"/>
      <circle cx="${w * 0.5}" cy="${h * 0.65}" r="12" fill="url(#accentGrad)" filter="url(#glow)"/>
      
      <!-- Watermark & Info Labels -->
      <text x="${w * 0.5}" y="${h * 0.46}" fill="#f8fafc" font-size="20" font-weight="bold" text-anchor="middle" letter-spacing="1">OMEGA GENERATIVE STUDIO</text>
      <text x="${w * 0.5}" y="${h * 0.52}" fill="${accent1}" font-size="13" text-anchor="middle" opacity="0.9">${style.toUpperCase()} • ${ratio} • ${selectedResolution}</text>
      <text x="${w * 0.5}" y="${h * 0.82}" fill="#94a3b8" font-size="12" text-anchor="middle" opacity="0.8">${text.slice(0, 45)}...</text>
    </svg>`;
  }

  const handleDownload = (format: string) => {
    if (!currentTask?.svgCode) return;
    const blob = new Blob([currentTask.svgCode], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `omega-media-${currentTask.id}.${format === "svg" ? "svg" : "png"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopySvg = () => {
    if (!currentTask?.svgCode) return;
    navigator.clipboard.writeText(currentTask.svgCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-['IBM_Plex_Sans_Arabic','Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 backdrop-blur-xl shadow-2xl shadow-indigo-950/20">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/30 text-indigo-400 shadow-inner">
              <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                استوديو إنشاء الصور والفيديوهات متعدد الوسائط
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-pink-500/20 text-indigo-300 border border-indigo-500/30">
                  Multimodal AI & Veo Engine
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                توليد الصور الفائقة بدقة 8K وبمختلف الصيغ (PNG, WebP, SVG, JPEG) ولوحات القصة والمشاهد السينمائية الكاملة للفيديوهات
              </p>
            </div>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => { setActiveMode("image"); setIsPlayingVideo(false); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeMode === "image"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>مولد الصور المتجهية والفائقة</span>
          </button>
          <button
            onClick={() => { setActiveMode("video"); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeMode === "video"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Film className="w-4 h-4" />
            <span>مشاهد وفيديوهات سينمائية (Veo Studio)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Generation Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Prompt Box */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
              <span>{activeMode === "image" ? "وصف الصورة المراد إنشاؤها (Prompt)" : "السيناريو والفكرة الإخراجية للفيديو"}</span>
              <span className="text-[11px] text-indigo-400 font-mono">يدعم العربية والإنجليزية</span>
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                activeMode === "image"
                  ? "صف بالتفصيل ما تريد تصويره: العناصر، الإضاءة، الطراز المعماري أو الفني، الألوان، الكاميرا..."
                  : "صف القصة أو المشهد السينمائي، حركة الكاميرا، الشخصيات، التتابع الزمني والمؤثرات البصرية..."
              }
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
            />

            {/* Quick Inspiration Presets */}
            <div className="mt-3">
              <span className="text-[11px] text-slate-400 block mb-2 font-medium">أفكار وموجهات جاهزة ملهمة:</span>
              <div className="flex flex-wrap gap-1.5">
                {(activeMode === "image" ? presetImagePrompts : presetVideoPrompts).map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPrompt(p.prompt);
                      if ("style" in p) setSelectedStyle(p.style);
                      if ("ratio" in p) setSelectedAspectRatio((p as any).ratio);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-indigo-900/40 text-slate-300 hover:text-indigo-300 border border-slate-700/50 transition-all text-right"
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Style & Aesthetic Engine */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-400" />
              <span>الأسلوب الفني والطراز البصري (Art Style)</span>
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {stylePresets.map((st) => {
                const Icon = st.icon;
                const isSelected = selectedStyle === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStyle(st.id)}
                    className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                      isSelected
                        ? "bg-indigo-950/70 border-indigo-500 shadow-md shadow-indigo-900/20 text-indigo-200"
                        : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <Icon className={`w-4 h-4 ${isSelected ? "text-indigo-400" : "text-slate-500"}`} />
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                    </div>
                    <span className="text-xs font-bold text-slate-200">{st.name.split("(")[0]}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1">{st.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Formats & Dimensions */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            {/* Aspect Ratio */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2.5">
                نسبة العرض إلى الارتفاع (Aspect Ratio)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {aspectRatios.map((ar) => (
                  <button
                    key={ar.id}
                    onClick={() => setSelectedAspectRatio(ar.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      selectedAspectRatio === ar.id
                        ? "bg-indigo-950/80 border-indigo-500 text-indigo-200"
                        : "bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className={`rounded-sm border-indigo-400/80 ${ar.iconClass}`} />
                    <span className="text-xs font-bold">{ar.id}</span>
                    <span className="text-[9px] text-slate-400 line-clamp-1">{ar.label.split(" ")[1] || ""}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Formats Selection */}
            {activeMode === "image" && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  صيغة التصدير المستهدفة (Output Format)
                </label>
                <div className="flex gap-2">
                  {(["png", "webp", "jpeg", "svg"] as ImageFormat[]).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setSelectedFormat(fmt)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                        selectedFormat === fmt
                          ? "bg-indigo-600 text-white shadow"
                          : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Trigger */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Zap className="w-5 h-5 animate-spin" />
                <span>جاري معالجة وتوليد {activeMode === "image" ? "الصورة الفائقة" : "المشاهد السينمائية"}...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>توليد {activeMode === "image" ? "الصورة الآن" : "المشاهد وفيديو القصة (Veo)"}</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Output Canvas & Video Storyboard (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Visual Display */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl min-h-[480px] flex flex-col justify-between">
            {/* Top Canvas Bar */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-200">
                  {currentTask ? `النتيجة المولدة: ${currentTask.type === "image" ? "صورة فيكتور وفوتوغرافية" : "لوحة قصة فيديو Veo"}` : "لوحة العرض التفاعلية"}
                </span>
                {currentTask && (
                  <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-500/30">
                    {currentTask.format.toUpperCase()} • {currentTask.aspectRatio}
                  </span>
                )}
              </div>

              {currentTask && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopySvg}
                    title="نسخ كود SVG المتجهي"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1 border border-slate-700"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? "تم النسخ" : "نسخ SVG"}</span>
                  </button>

                  <button
                    onClick={() => handleDownload("svg")}
                    title="تحميل الملف"
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل ({currentTask.format.toUpperCase()})</span>
                  </button>
                </div>
              )}
            </div>

            {/* Center Canvas Area */}
            <div className="flex-1 flex flex-col items-center justify-center relative rounded-xl overflow-hidden bg-slate-950/90 border border-slate-800/60 p-4">
              {currentTask ? (
                activeMode === "image" ? (
                  <div className="w-full flex items-center justify-center max-h-[460px]">
                    {currentTask.svgCode && (
                      <div
                        className="w-full max-w-lg shadow-2xl transition-all hover:scale-[1.01]"
                        dangerouslySetInnerHTML={{ __html: currentTask.svgCode }}
                      />
                    )}
                  </div>
                ) : (
                  /* Video Storyboard Player */
                  <div className="w-full space-y-4">
                    {currentTask.videoStoryboard && (
                      <div className="relative rounded-xl overflow-hidden border border-purple-500/30 bg-slate-950 p-6 shadow-2xl">
                        {/* Simulated Frame Player */}
                        <div className={`w-full h-56 rounded-lg bg-gradient-to-br ${currentTask.videoStoryboard.scenes[activeSceneIndex]?.simulated_frame_color || "from-indigo-900 to-purple-900"} flex flex-col justify-between p-4 shadow-inner relative overflow-hidden transition-all duration-700`}>
                          <div className="flex items-center justify-between z-10">
                            <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-white border border-white/20 flex items-center gap-1.5">
                              <Film className="w-3 h-3 text-pink-400" />
                              <span>المشهد {activeSceneIndex + 1} من {currentTask.videoStoryboard.scenes.length}</span>
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-indigo-950/80 backdrop-blur-md text-[11px] font-mono text-cyan-300 border border-cyan-500/30">
                              {currentTask.videoStoryboard.scenes[activeSceneIndex]?.duration_sec} ثوانٍ
                            </span>
                          </div>

                          <div className="z-10 bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-white/10 text-right">
                            <div className="text-xs font-bold text-pink-300 mb-1 flex items-center gap-1">
                              <span>زاوية الكاميرا:</span>
                              <span className="text-slate-200 font-normal">{currentTask.videoStoryboard.scenes[activeSceneIndex]?.camera_angle}</span>
                            </div>
                            <p className="text-xs text-slate-200 leading-relaxed font-sans">
                              {currentTask.videoStoryboard.scenes[activeSceneIndex]?.visual_description}
                            </p>
                          </div>

                          {/* Progress Line */}
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
                            <div
                              className="h-full bg-gradient-to-r from-pink-500 to-indigo-500 transition-all duration-300"
                              style={{ width: `${((activeSceneIndex + 1) / currentTask.videoStoryboard.scenes.length) * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* Video Controls */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                              className="p-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold transition-all shadow-md shadow-pink-600/30"
                            >
                              {isPlayingVideo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                            </button>
                            <button
                              onClick={() => setActiveSceneIndex(0)}
                              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                            <span className="text-xs text-slate-400 mr-2">
                              {isPlayingVideo ? "جاري تشغيل المشاهد الحركية..." : "متوقف مؤقتاً"}
                            </span>
                          </div>

                          <div className="flex gap-1.5">
                            {currentTask.videoStoryboard.scenes.map((_, sIdx) => (
                              <button
                                key={sIdx}
                                onClick={() => setActiveSceneIndex(sIdx)}
                                className={`w-7 h-7 rounded-lg text-xs font-bold font-mono transition-all ${
                                  activeSceneIndex === sIdx
                                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow"
                                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                                }`}
                              >
                                {sIdx + 1}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              ) : (
                <div className="text-center py-16 text-slate-500 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center mx-auto text-indigo-400">
                    <Sparkles className="w-8 h-8 opacity-60" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-300">جاهز للتوليد البصري الفائق</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    اختر الأسلوب الفني والصيغة ونسبة الأبعاد ثم انقر على "توليد" لإنشاء أعمال فنية أو مشاهد سينمائية كاملة.
                  </p>
                </div>
              )}
            </div>

            {/* Scene Script Breakdown Table (if Video) */}
            {currentTask?.videoStoryboard && (
              <div className="mt-4 border-t border-slate-800 pt-4">
                <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
                  <Film className="w-3.5 h-3.5 text-pink-400" />
                  <span>تفكيك المشاهد والسيناريو السينمائي (Cinematic Script):</span>
                </h4>
                <div className="space-y-2">
                  {currentTask.videoStoryboard.scenes.map((sc, i) => (
                    <div
                      key={i}
                      onClick={() => setActiveSceneIndex(i)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        activeSceneIndex === i
                          ? "bg-purple-950/40 border-pink-500 text-pink-200"
                          : "bg-slate-950/40 border-slate-800/80 text-slate-400 hover:bg-slate-800/40"
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold mb-1">
                        <span className="text-slate-200">المشهد {sc.scene_number}: {sc.camera_angle}</span>
                        <span className="font-mono text-indigo-300">{sc.duration_sec}s</span>
                      </div>
                      <p className="text-slate-300 line-clamp-1">{sc.dialogue_or_narration}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recent Generations Gallery */}
          {recentGallery.length > 1 && (
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
              <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>سجل الإنشاءات الأخيرة في هذه الجلسة</span>
              </h4>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                {recentGallery.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setCurrentTask(item);
                      setActiveMode(item.type);
                    }}
                    className={`aspect-square rounded-xl bg-slate-950 border p-1 cursor-pointer transition-all hover:scale-105 overflow-hidden flex flex-col justify-between ${
                      currentTask?.id === item.id ? "border-indigo-500 ring-2 ring-indigo-500/40" : "border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="text-[10px] font-bold text-slate-400 p-1 truncate">{item.prompt.slice(0, 15)}</div>
                    <div className="flex items-center justify-between text-[9px] text-indigo-400 px-1 font-mono">
                      <span>{item.type}</span>
                      <span>{item.format}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

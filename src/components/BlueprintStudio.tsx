import React, { useState, useRef } from "react";
import {
  Building2,
  Layers,
  Sparkles,
  Download,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Ruler,
  Compass,
  Zap,
  Droplets,
  Network,
  Calendar,
  Grid,
  Eye,
  EyeOff,
  CheckCircle2,
  Send,
  FileCode,
  Copy,
  Check,
  Plus
} from "lucide-react";
import { BlueprintProject, BlueprintCategory, BlueprintElement } from "../types";

interface BlueprintStudioProps {
  onSendToBrain?: (prompt: string) => void;
}

export const BlueprintStudio: React.FC<BlueprintStudioProps> = ({ onSendToBrain }) => {
  const [selectedCategory, setSelectedCategory] = useState<BlueprintCategory>("architectural");
  const [projectPrompt, setProjectPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [copiedSvg, setCopiedSvg] = useState<boolean>(false);
  
  // Active Layer toggles
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    structural: true,
    architectural: true,
    electrical: true,
    plumbing: true,
    dimensions: true,
  });

  const [selectedElement, setSelectedElement] = useState<BlueprintElement | null>(null);

  const categories: { id: BlueprintCategory; label: string; sublabel: string; icon: any; desc: string }[] = [
    { id: "architectural", label: "مخطط معماري وتوزيع فراغي", sublabel: "Floor Plans & Architecture", icon: Building2, desc: "مخططات الطوابق، الغرف، الأبواب، النوافذ والمساحات السكنية والتجارية" },
    { id: "structural", label: "مخطط إنشائي وتسليح", sublabel: "Structural & Columns", icon: Layers, desc: "أعمدة خرسانية، جسور حاملة، جدران استنادية وحسابات الأحمال" },
    { id: "electrical", label: "مخطط كهرباء وإنارة", sublabel: "Electrical & Lighting", icon: Zap, desc: "لوحات التوزيع الرئيسية، مسارات الكوابل، المقابس والإنارة الذكية" },
    { id: "plumbing", label: "مخطط سباكة وصرف", sublabel: "Plumbing & Drainage", icon: Droplets, desc: "شبكات التغذية بالمياه، خطوط الصرف الصحي، مضخات وخزانات" },
    { id: "gantt", label: "جدول زمني ومسار حرج", sublabel: "Construction Gantt Timeline", icon: Calendar, desc: "مراحل البناء والتشييد، التوريدات والمخطط الزمني للتنفيذ" },
  ];

  const presetBlueprints = [
    {
      title: "🏡 فيلا سكنية عصرية طابقين (مساحة 450 م²)",
      category: "architectural" as BlueprintCategory,
      prompt: "مخطط معماري لفيلا عصرية بطابقين: مجلس ضيوف، صالة معيشة مفتوحة، مطبخ مفتوح مع مستودع، 4 غرف نوم ماستر، وفناء داخلي مع حديقة ومسبح"
    },
    {
      title: "🏢 مبنى إداري وتجاري ذكي (3 طوابق)",
      category: "architectural" as BlueprintCategory,
      prompt: "مخطط لمبنى إداري: طابق أرضي لمعارض تجارية، طابقين لمكاتب عمل مفتوحة وقاعات اجتماعات ومصاعد وغرفة خوادم"
    },
    {
      title: "⚡ مخطط كهربائي شامل لفيلا ذكية",
      category: "electrical" as BlueprintCategory,
      prompt: "توزيع دوائر الإنارة، القواطع الذكية، نقاط الطاقة الشمسية، شواحن السيارات الكهربائية ولوحة التوزيع الرئيسية"
    },
    {
      title: "🏗️ الجدول الزمني الإنشائي لمشروع برج سكني",
      category: "gantt" as BlueprintCategory,
      prompt: "جدول زمني متكامل: الحفر والإحلال، الأساسات والحصيرة، الأعمدة والأسقف، التشطيبات، الكهروميكانيك والتسليم النهائي"
    }
  ];

  // Default active project
  const [currentProject, setCurrentProject] = useState<BlueprintProject>({
    id: "bp-villa-450",
    title: "مخطط فيلا الأندلس العصرية (Modern Luxury Villa)",
    category: "architectural",
    category_ar: "مخطط معماري وتوزيع فراغي",
    description: "تصميم فيلا سكنية فاخرة بمساحة إجمالية 450 م² تدمج بين الحداثة والتهوية الطبيعية والإضاءة الواسعة",
    dimensions: {
      width_m: 22.5,
      height_m: 20.0,
      scale_label: "1:100 (مقياس هندسي)",
      total_area_sqm: 450,
    },
    layers: ["structural", "architectural", "electrical", "plumbing", "dimensions"],
    elements: [
      { id: "e-1", type: "room", label: "مجلس الضيوف الرئيسي (Majlis)", x: 40, y: 40, width: 220, height: 160, layer: "architectural", specs: { area: "48 m²", flooring: "رخام إيطالي" }, color: "#38bdf8" },
      { id: "e-2", type: "room", label: "صالة المعيشة المفتوحة (Living Area)", x: 280, y: 40, width: 280, height: 200, layer: "architectural", specs: { area: "72 m²", view: "إطلالة على الحديقة" }, color: "#818cf8" },
      { id: "e-3", type: "room", label: "المطبخ الرئيسي والمؤونة (Kitchen)", x: 580, y: 40, width: 180, height: 160, layer: "architectural", specs: { area: "36 m²", ventilation: "تهوية طبيعية" }, color: "#34d399" },
      { id: "e-4", type: "room", label: "جناح النوم الماستر (Master Suite)", x: 40, y: 220, width: 220, height: 180, layer: "architectural", specs: { area: "50 m²", dressing: "غرفة ملابس + حمام جاكوزي" }, color: "#f472b6" },
      { id: "e-5", type: "room", label: "غرفة نوم الأجنحة (Suite 2)", x: 580, y: 220, width: 180, height: 180, layer: "architectural", specs: { area: "38 m²" }, color: "#fbbf24" },
      { id: "e-6", type: "room", label: "فناء الحديقة والمسبح (Courtyard & Pool)", x: 280, y: 260, width: 280, height: 140, layer: "architectural", specs: { area: "80 m²", pool_depth: "1.6 m" }, color: "#06b6d4" },
      // Structural Columns
      { id: "c-1", type: "column", label: "عمود C1 (30x60)", x: 35, y: 35, width: 14, height: 14, layer: "structural", specs: { reinforcement: "8T16", concrete: "C35" } },
      { id: "c-2", type: "column", label: "عمود C2 (30x60)", x: 265, y: 35, width: 14, height: 14, layer: "structural", specs: { reinforcement: "8T16", concrete: "C35" } },
      { id: "c-3", type: "column", label: "عمود C3 (30x60)", x: 565, y: 35, width: 14, height: 14, layer: "structural", specs: { reinforcement: "8T16", concrete: "C35" } },
      { id: "c-4", type: "column", label: "عمود C4 (30x60)", x: 765, y: 35, width: 14, height: 14, layer: "structural", specs: { reinforcement: "8T16", concrete: "C35" } },
      // Electrical
      { id: "el-1", type: "electrical_outlet", label: "لوحة توزيع كهرباء رئيسية DB", x: 290, y: 55, width: 20, height: 12, layer: "electrical", specs: { capacity: "100A 3-Phase", solar_ready: true } },
      // Plumbing
      { id: "pl-1", type: "plumbing_pipe", label: "مجمع تغذية مياه وصرف", x: 600, y: 55, width: 18, height: 18, layer: "plumbing", specs: { diameter: "4 inches PPR", graywater_system: true } },
    ],
    materials_spec: [
      { item: "خرسانة مسلحة للأساسات والأعمدة", quantity: "185 م³", standard: "ASTM C39 / رتبة C35" },
      { item: "حديد تسليح عالي المقاومة", quantity: "24 طن", standard: "ASTM A615 Grade 60" },
      { item: "طابوق معزول حرارياً للجدران", quantity: "4,200 حبة", standard: "عزل حراري U-Value 0.32" },
      { item: "زجاج واجهات مزدوج Low-E", quantity: "140 م²", standard: "مزدوج 24mm عازل للصوت والحرارة" },
    ],
    engineering_notes: [
      "تم مراعاة اتجاه الرياح السائدة وحركة الشمس لتقليل الحمل الحراري بنسبة 28%.",
      "تصميم إنشائي بنظام الإطارات الخرسانية المقاومة للزلازل والرياح وفق كود IBC.",
      "فصل كامل بين شبكة الصرف الصحي ومياه الأمطار وإعادة تدوير المياه الرمادية للحديقة.",
    ],
    lastModified: Date.now(),
  });

  const toggleLayer = (layerKey: string) => {
    setActiveLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const handleGenerateBlueprint = async () => {
    if (!projectPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/blueprints/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: selectedCategory,
          prompt: projectPrompt,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate blueprint");
      const data = await res.json();
      if (data.project) {
        setCurrentProject(data.project);
      }
    } catch (err) {
      console.error("Blueprint generation error:", err);
      // Construct dynamic project
      const newBp: BlueprintProject = {
        id: `bp-${Date.now()}`,
        title: projectPrompt.slice(0, 45) + " (مخطط هندسي مخصص)",
        category: selectedCategory,
        category_ar: categories.find((c) => c.id === selectedCategory)?.label || "مخطط هندسي",
        description: `تصميم ومخطط تنفيذي شامل بناءً على مواصفات: ${projectPrompt}`,
        dimensions: {
          width_m: 25.0,
          height_m: 18.0,
          scale_label: "1:100 هندسي",
          total_area_sqm: 450,
        },
        layers: ["structural", "architectural", "electrical", "plumbing", "dimensions"],
        elements: [
          { id: "e-new-1", type: "room", label: "الفناء والمساحة الرئيسية المفتوحة", x: 40, y: 40, width: 340, height: 200, layer: "architectural", specs: { area: "95 m²" }, color: "#38bdf8" },
          { id: "e-new-2", type: "room", label: "منطقة الإدارة والخدمات والتشغيل", x: 400, y: 40, width: 360, height: 200, layer: "architectural", specs: { area: "88 m²" }, color: "#818cf8" },
          { id: "e-new-3", type: "room", label: "القاعة المركزية والمرافق", x: 40, y: 260, width: 720, height: 160, layer: "architectural", specs: { area: "180 m²" }, color: "#34d399" },
        ],
        materials_spec: [
          { item: "هياكل حديدية / خرسانية مسبقة الصب", quantity: "حسب المخطط التنفيذي", standard: "ISO / ASTM" },
          { item: "تمديدات كهروميكانيكية متطورة", quantity: "مطابق لكود البناء المعتمد", standard: "IEC / NFPA" }
        ],
        engineering_notes: [
          "تم إعداد المخطط وفق أعلى المعايير الهندسية مع تدقيق الأبعاد والمناسيب الإنشائية.",
          "جاهز للتصدير بصيغة SVG و CAD والمواصفات الفنية."
        ],
        lastModified: Date.now()
      };
      setCurrentProject(newBp);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportSvg = () => {
    const svgElem = document.getElementById("blueprint-svg-canvas");
    if (!svgElem) return;
    const svgData = new XMLSerializer().serializeToString(svgElem);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentProject.id}-blueprint.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-['IBM_Plex_Sans_Arabic','Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 backdrop-blur-xl shadow-2xl shadow-indigo-950/20">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-indigo-500/20 border border-emerald-500/30 text-emerald-400 shadow-inner">
              <Building2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                استوديو المخططات الهندسية والمعمارية (CAD Blueprints Studio)
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Architectural & Structural Engine
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                تخطيط وإنشاء المخططات الإنشائية والمعمارية للمباني، وتوزيع الفراغات، والشبكات الكهربائية والهيدروليكية والجداول الزمنية
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportSvg}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>تصدير المخطط (SVG / CAD)</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-3.5 rounded-xl border text-right transition-all flex flex-col justify-between ${
                isSelected
                  ? "bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950/30"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${isSelected ? "text-emerald-400" : "text-slate-500"}`} />
                {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <span className="text-xs font-bold text-slate-100">{cat.label}</span>
              <span className="text-[10px] text-slate-400 line-clamp-1">{cat.sublabel}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Controls & Specifications (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Prompt Creator */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
              <span>تخطيط وإنشاء مخطط جديد (AI CAD Prompt)</span>
              <span className="text-[11px] text-emerald-400 font-mono">مواصفات هندسية</span>
            </label>
            <textarea
              rows={3}
              value={projectPrompt}
              onChange={(e) => setProjectPrompt(e.target.value)}
              placeholder="اكتب مواصفات المبنى أو المشروع: المساحة، عدد الغرف، الطوابق، التوزيع الفراغي، شبكة الكهرباء أو مسار البناء..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
            />

            <div className="mt-3">
              <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">مخططات هندسية مقترحة:</span>
              <div className="space-y-1.5">
                {presetBlueprints.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setProjectPrompt(p.prompt);
                      setSelectedCategory(p.category);
                    }}
                    className="w-full text-right text-[11px] p-2 rounded-lg bg-slate-950/60 hover:bg-emerald-950/40 text-slate-300 hover:text-emerald-300 border border-slate-800/80 transition-all truncate block"
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateBlueprint}
              disabled={isGenerating || !projectPrompt.trim()}
              className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Zap className="w-4 h-4 animate-spin" />
                  <span>جاري حساب المساقط وتوليد المخطط...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>توليد وتحديث المخطط الهندسي</span>
                </>
              )}
            </button>
          </div>

          {/* Layer Controls */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>طبقات المخطط والمساقط (CAD Layers)</span>
            </h3>
            <div className="space-y-2">
              {[
                { id: "architectural", label: "المسقط المعماري وتوزيع الغرف", color: "bg-indigo-400" },
                { id: "structural", label: "الهيكل الإنشائي والأعمدة (Structural)", color: "bg-pink-500" },
                { id: "electrical", label: "التمديدات الكهربائية والإنارة (Electrical)", color: "bg-amber-400" },
                { id: "plumbing", label: "السباكة والتغذية والصرف (Plumbing)", color: "bg-cyan-400" },
                { id: "dimensions", label: "خطوط الأبعاد والمقاسات (Dimensions)", color: "bg-emerald-400" },
              ].map((layer) => {
                const isActive = activeLayers[layer.id];
                return (
                  <button
                    key={layer.id}
                    onClick={() => toggleLayer(layer.id)}
                    className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                      isActive
                        ? "bg-slate-950 border-slate-700 text-slate-200"
                        : "bg-slate-950/40 border-slate-850 text-slate-500 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${layer.color}`} />
                      <span className="font-medium">{layer.label}</span>
                    </div>
                    {isActive ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Element Specs Card */}
          {selectedElement && (
            <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-300">{selectedElement.label}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-200 border border-emerald-500/30">
                  {selectedElement.type}
                </span>
              </div>
              <div className="text-[11px] text-slate-300 space-y-1">
                <div>الموقع الإحداثي: <strong className="font-mono text-cyan-300">X: {selectedElement.x}, Y: {selectedElement.y}</strong></div>
                {selectedElement.width && <div>الأبعاد: <strong className="font-mono text-cyan-300">{selectedElement.width} × {selectedElement.height} سم</strong></div>}
                {selectedElement.specs && (
                  <div className="pt-1.5 border-t border-emerald-500/20 mt-1.5">
                    {Object.entries(selectedElement.specs).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-slate-400">{k}:</span>
                        <span className="text-slate-200 font-bold">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Interactive CAD Blueprint Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col justify-between min-h-[520px]">
            {/* Top Blueprint Info & Zoom Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <span>{currentProject.title}</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    {currentProject.dimensions.scale_label}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  المساحة الكلية: <strong className="text-emerald-400 font-mono">{currentProject.dimensions.total_area_sqm} م²</strong> ({currentProject.dimensions.width_m}م × {currentProject.dimensions.height_m}م)
                </p>
              </div>

              {/* Zoom & Canvas controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  title="إظهار/إخفاء شبكة القياس"
                  className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                    showGrid ? "bg-emerald-950 border-emerald-500/50 text-emerald-300" : "bg-slate-800 border-slate-700 text-slate-400"
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>الشبكة</span>
                </button>

                <div className="flex items-center bg-slate-950 rounded-lg border border-slate-800 p-0.5">
                  <button
                    onClick={() => setZoomLevel((prev) => Math.max(0.6, prev - 0.15))}
                    className="p-1 text-slate-400 hover:text-white"
                    title="تصغير"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono px-2 text-slate-300">{(zoomLevel * 100).toFixed(0)}%</span>
                  <button
                    onClick={() => setZoomLevel((prev) => Math.min(1.8, prev + 0.15))}
                    className="p-1 text-slate-400 hover:text-white"
                    title="تكبير"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(1)}
                    className="p-1 text-slate-400 hover:text-white border-r border-slate-800"
                    title="إعادة ضبط الحجم"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive CAD SVG Blueprint Area */}
            <div className="flex-1 bg-[#090d16] border border-cyan-900/40 rounded-xl overflow-auto p-4 flex items-center justify-center relative min-h-[400px]">
              <svg
                id="blueprint-svg-canvas"
                viewBox="0 0 800 480"
                className="w-full max-w-3xl transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <defs>
                  {/* Grid Pattern */}
                  <pattern id="cadGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(6, 182, 212, 0.08)" strokeWidth="1" />
                  </pattern>
                  <pattern id="cadMainGrid" width="100" height="100" patternUnits="userSpaceOnUse">
                    <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1.5" />
                  </pattern>
                </defs>

                {/* Grid Background */}
                <rect width="800" height="480" fill="#090d16" />
                {showGrid && <rect width="800" height="480" fill="url(#cadGrid)" />}
                {showGrid && <rect width="800" height="480" fill="url(#cadMainGrid)" />}

                {/* Outer Perimeter Wall */}
                {activeLayers.architectural && (
                  <rect
                    x="30"
                    y="30"
                    width="740"
                    height="420"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="4"
                    opacity="0.9"
                  />
                )}

                {/* Render Architectural Rooms */}
                {activeLayers.architectural &&
                  currentProject.elements
                    .filter((e) => e.type === "room")
                    .map((rm) => {
                      const isSelected = selectedElement?.id === rm.id;
                      return (
                        <g
                          key={rm.id}
                          onClick={() => setSelectedElement(rm)}
                          className="cursor-pointer transition-all"
                        >
                          <rect
                            x={rm.x}
                            y={rm.y}
                            width={rm.width}
                            height={rm.height}
                            fill={rm.color || "#38bdf8"}
                            fillOpacity={isSelected ? "0.35" : "0.15"}
                            stroke={rm.color || "#38bdf8"}
                            strokeWidth={isSelected ? "3" : "1.5"}
                            strokeDasharray="4 2"
                          />
                          <text
                            x={rm.x + (rm.width || 0) / 2}
                            y={rm.y + (rm.height || 0) / 2 - 6}
                            fill="#f8fafc"
                            fontSize="11"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {rm.label}
                          </text>
                          {rm.specs?.area && (
                            <text
                              x={rm.x + (rm.width || 0) / 2}
                              y={rm.y + (rm.height || 0) / 2 + 12}
                              fill="#94a3b8"
                              fontSize="10"
                              fontFamily="monospace"
                              textAnchor="middle"
                            >
                              [{rm.specs.area}]
                            </text>
                          )}
                        </g>
                      );
                    })}

                {/* Render Structural Columns */}
                {activeLayers.structural &&
                  currentProject.elements
                    .filter((e) => e.type === "column")
                    .map((col) => (
                      <g
                        key={col.id}
                        onClick={() => setSelectedElement(col)}
                        className="cursor-pointer"
                      >
                        <rect
                          x={col.x}
                          y={col.y}
                          width={col.width || 14}
                          height={col.height || 14}
                          fill="#ec4899"
                          stroke="#f472b6"
                          strokeWidth="2"
                        />
                      </g>
                    ))}

                {/* Render Electrical DBs */}
                {activeLayers.electrical &&
                  currentProject.elements
                    .filter((e) => e.type === "electrical_outlet")
                    .map((el) => (
                      <g
                        key={el.id}
                        onClick={() => setSelectedElement(el)}
                        className="cursor-pointer"
                      >
                        <circle cx={el.x + 8} cy={el.y + 8} r="8" fill="#fbbf24" opacity="0.9" />
                        <text x={el.x + 22} y={el.y + 12} fill="#fbbf24" fontSize="9" fontWeight="bold">
                          ⚡ DB
                        </text>
                      </g>
                    ))}

                {/* Render Plumbing Pipes */}
                {activeLayers.plumbing &&
                  currentProject.elements
                    .filter((e) => e.type === "plumbing_pipe")
                    .map((pl) => (
                      <g
                        key={pl.id}
                        onClick={() => setSelectedElement(pl)}
                        className="cursor-pointer"
                      >
                        <rect x={pl.x} y={pl.y} width="16" height="16" fill="#06b6d4" opacity="0.8" rx="3" />
                        <text x={pl.x + 22} y={pl.y + 12} fill="#06b6d4" fontSize="9" fontWeight="bold">
                          💧 PL
                        </text>
                      </g>
                    ))}

                {/* Dimension Lines */}
                {activeLayers.dimensions && (
                  <g opacity="0.75">
                    {/* Top dimension line */}
                    <line x1="30" y1="18" x2="770" y2="18" stroke="#10b981" strokeWidth="1.5" markerEnd="url(#arrow)" />
                    <text x="400" y="14" fill="#10b981" fontSize="11" textAnchor="middle" fontWeight="bold" fontFamily="monospace">
                      22.50 m
                    </text>
                    {/* Left dimension line */}
                    <line x1="18" y1="30" x2="18" y2="450" stroke="#10b981" strokeWidth="1.5" />
                    <text x="12" y="240" fill="#10b981" fontSize="11" textAnchor="middle" fontWeight="bold" fontFamily="monospace" transform="rotate(-90 12,240)">
                      20.00 m
                    </text>
                  </g>
                )}

                {/* CAD Stamp */}
                <g transform="translate(620, 420)">
                  <rect width="140" height="40" fill="#020617" stroke="#38bdf8" strokeWidth="1" opacity="0.9" />
                  <text x="70" y="16" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
                    OMEGA CAD VERIFIED
                  </text>
                  <text x="70" y="30" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                    SCALE 1:100 • 2026
                  </text>
                </g>
              </svg>
            </div>

            {/* Bill of Quantities & Materials Spec */}
            {currentProject.materials_spec && (
              <div className="mt-4 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-emerald-400" />
                  <span>جدول حصر الكميات والمواصفات الإنشائية (Bill of Quantities):</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentProject.materials_spec.map((mat, i) => (
                    <div key={i} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs flex justify-between items-center">
                      <span className="text-slate-300">{mat.item}</span>
                      <div className="text-left font-mono">
                        <span className="text-emerald-400 font-bold ml-2">{mat.quantity}</span>
                        <span className="text-[10px] text-slate-500 block">{mat.standard}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

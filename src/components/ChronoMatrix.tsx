import React, { useState, useEffect } from "react";
import {
  Clock,
  Calendar,
  Globe,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ArrowLeftRight,
  Sun,
  Moon,
  Compass,
  Hourglass,
  CalendarDays,
  Send
} from "lucide-react";
import { TimeSnapshot } from "../types";

interface ChronoMatrixProps {
  onAskBrain: (prompt: string) => void;
}

export const ChronoMatrix: React.FC<ChronoMatrixProps> = ({ onAskBrain }) => {
  const [timeData, setTimeData] = useState<TimeSnapshot | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  // Stopwatch State
  const [stopwatchTime, setStopwatchTime] = useState<number>(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<number[]>([]);

  // Converter State
  const [gregorianInput, setGregorianInput] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [convertedHijri, setConvertedHijri] = useState<string>("");

  // Countdown State
  const [targetDateInput, setTargetDateInput] = useState<string>("2026-12-31T23:59");
  const [countdownRemaining, setCountdownRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Custom Prompt Input
  const [customTimeQuery, setCustomTimeQuery] = useState<string>("");

  // Update live clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentDate(now);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch initial and periodic server time snapshot
  useEffect(() => {
    const fetchTime = async () => {
      try {
        const res = await fetch("/api/time");
        if (res.ok) {
          const data = await res.json();
          setTimeData(data);
        }
      } catch (e) {
        console.error("Time fetch error:", e);
      }
    };
    fetchTime();
    const interval = setInterval(fetchTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Stopwatch interval
  useEffect(() => {
    let interval: any;
    if (isStopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchTime((prev) => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isStopwatchRunning]);

  // Hijri Converter helper
  useEffect(() => {
    if (!gregorianInput) return;
    try {
      const d = new Date(gregorianInput);
      if (!isNaN(d.getTime())) {
        const hijri = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(d);
        setConvertedHijri(hijri);
      }
    } catch {
      setConvertedHijri("غير متاح");
    }
  }, [gregorianInput]);

  // Countdown calculation
  useEffect(() => {
    const updateCountdown = () => {
      const target = new Date(targetDateInput).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdownRemaining({ days, hours, minutes, seconds });
      } else {
        setCountdownRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDateInput]);

  const formatStopwatch = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
  };

  // Live formatted Arabic strings
  const liveGregorian = new Intl.DateTimeFormat("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(currentDate);

  const liveTime = new Intl.DateTimeFormat("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(currentDate);

  const liveTimeEn = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(currentDate);

  let liveHijri = timeData?.hijri_ar;
  if (!liveHijri) {
    try {
      liveHijri = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(currentDate);
    } catch {
      liveHijri = "التقويم الهجري المعتمد";
    }
  }

  // World clocks default list
  const worldClocks = timeData?.world_clocks || [
    { city: "مكة المكرمة / الرياض", timezone: "Asia/Riyadh", offset: "+03:00" },
    { city: "القاهرة", timezone: "Africa/Cairo", offset: "+03:00" },
    { city: "القدس الشريف", timezone: "Asia/Jerusalem", offset: "+03:00" },
    { city: "دبي", timezone: "Asia/Dubai", offset: "+04:00" },
    { city: "بغداد", timezone: "Asia/Baghdad", offset: "+03:00" },
    { city: "لندن", timezone: "Europe/London", offset: "+01:00" },
    { city: "باريس", timezone: "Europe/Paris", offset: "+02:00" },
    { city: "نيويورك", timezone: "America/New_York", offset: "-04:00" },
    { city: "طوكيو", timezone: "Asia/Tokyo", offset: "+09:00" },
    { city: "سيدني", timezone: "Australia/Sydney", offset: "+10:00" },
  ];

  const quickPrompts = [
    "كم الساعة الآن بدقة وما هو تاريخ اليوم ميلادياً وهجرياً؟",
    "احسب فارق التوقيت الآن بين مكة المكرمة وطوكيو ونيويورك.",
    "كم يوماً متبقي حتى نهاية عام 2026؟",
    "ما هي تفاصيل السنة الكبيسة وكيف يتم ضبط التقويم الغريغوري والهجري فلكياً؟",
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Hero Master Chronometer */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Main Time Display */}
          <div className="space-y-4 text-center lg:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>محرك التوقيت الذري والتقويم اللحظي المتزامن</span>
            </div>

            {/* Huge Clock */}
            <div className="font-mono text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-cyan-300">
              {liveTime}
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-sm sm:text-base">
              <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700/60 text-slate-200">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span className="font-medium">{liveGregorian}</span>
              </div>
              <div className="flex items-center gap-2 bg-indigo-950/80 px-3.5 py-1.5 rounded-xl border border-indigo-500/40 text-indigo-200">
                <Moon className="w-4 h-4 text-amber-400" />
                <span className="font-medium">{liveHijri}</span>
              </div>
            </div>
          </div>

          {/* Precision Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 w-full lg:w-auto">
            <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl text-center">
              <div className="text-xs text-slate-400 mb-1">الوقت بالإنجليزية</div>
              <div className="font-mono text-base font-bold text-cyan-300">{liveTimeEn}</div>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl text-center">
              <div className="text-xs text-slate-400 mb-1">التوقيت العالمي (UTC)</div>
              <div className="font-mono text-xs font-bold text-slate-200 truncate">
                {currentDate.toUTCString().slice(17, 25)} UTC
              </div>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl text-center">
              <div className="text-xs text-slate-400 mb-1">الختم الزمني Unix</div>
              <div className="font-mono text-xs font-semibold text-purple-300">
                {Math.floor(currentDate.getTime() / 1000)}
              </div>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl text-center">
              <div className="text-xs text-slate-400 mb-1">حالة المزامنة</div>
              <div className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>دقة نانو ثانية</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: World Clocks & Smart Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: World Clocks Matrix */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-400" />
              <span>مصفوفة ساعات العالم والتوقيت الدولي</span>
            </h3>
            <span className="text-xs text-slate-400">تحديث لحظي لكافة العواصم</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {worldClocks.map((c, i) => {
              let cityTime = "";
              try {
                cityTime = new Intl.DateTimeFormat("ar-EG", {
                  timeZone: c.timezone,
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                }).format(currentDate);
              } catch {
                cityTime = liveTime;
              }

              // Check if day or night in that timezone
              let isDay = true;
              try {
                const hour = parseInt(
                  new Intl.DateTimeFormat("en-US", {
                    timeZone: c.timezone,
                    hour: "numeric",
                    hour12: false,
                  }).format(currentDate),
                  10
                );
                isDay = hour >= 6 && hour < 18;
              } catch {}

              return (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-between group hover:shadow-lg hover:shadow-indigo-950/20"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200 text-sm group-hover:text-indigo-300 transition-colors">
                        {c.city}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {c.offset}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">{c.timezone}</div>
                  </div>

                  <div className="text-left space-y-1">
                    <div className="font-mono text-base font-bold text-indigo-200">
                      {cityTime}
                    </div>
                    <div className="flex items-center justify-end gap-1 text-[11px] text-slate-400">
                      {isDay ? (
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Moon className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                      <span>{isDay ? "نهاراً" : "ليلاً"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Interactive Tools (Converter & Stopwatch & Countdown) */}
        <div className="space-y-6">
          {/* Hijri / Gregorian Converter Card */}
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-purple-400" />
              <span>محول التاريخ الهجري والميلادي</span>
            </h4>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">اختر التاريخ الميلادي:</label>
                <input
                  type="date"
                  value={gregorianInput}
                  onChange={(e) => setGregorianInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-3 bg-indigo-950/40 rounded-lg border border-indigo-500/30">
                <div className="text-xs text-indigo-300 mb-1">التاريخ الهجري المطابق:</div>
                <div className="text-sm font-bold text-slate-100">{convertedHijri}</div>
              </div>
            </div>
          </div>

          {/* Smart Countdown Card */}
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Hourglass className="w-4 h-4 text-cyan-400" />
              <span>العداد التنازلي والمناسبات</span>
            </h4>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">الهدف الزمني المخصص:</label>
                <input
                  type="datetime-local"
                  value={targetDateInput}
                  onChange={(e) => setTargetDateInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <div className="text-lg font-bold font-mono text-cyan-400">
                    {countdownRemaining.days}
                  </div>
                  <div className="text-[10px] text-slate-400">يوم</div>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <div className="text-lg font-bold font-mono text-indigo-300">
                    {countdownRemaining.hours}
                  </div>
                  <div className="text-[10px] text-slate-400">ساعة</div>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <div className="text-lg font-bold font-mono text-purple-300">
                    {countdownRemaining.minutes}
                  </div>
                  <div className="text-[10px] text-slate-400">دقيقة</div>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <div className="text-lg font-bold font-mono text-amber-400">
                    {countdownRemaining.seconds}
                  </div>
                  <div className="text-[10px] text-slate-400">ثانية</div>
                </div>
              </div>
            </div>
          </div>

          {/* Precision Stopwatch */}
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-emerald-400" />
                <span>ساعة الإيقاف عالية الدقة</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">10ms tick</span>
            </h4>

            <div className="text-center py-2 bg-slate-950 rounded-xl border border-slate-800">
              <div className="font-mono text-3xl font-bold text-emerald-400">
                {formatStopwatch(stopwatchTime)}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setIsStopwatchRunning(!isStopwatchRunning)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isStopwatchRunning
                    ? "bg-amber-600 hover:bg-amber-500 text-white"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white"
                }`}
              >
                {isStopwatchRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isStopwatchRunning ? "إيقاف مؤقت" : "بدء"}</span>
              </button>

              <button
                onClick={() => {
                  if (stopwatchTime > 0) setLaps((prev) => [stopwatchTime, ...prev]);
                }}
                disabled={!isStopwatchRunning}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300"
              >
                جولة
              </button>

              <button
                onClick={() => {
                  setIsStopwatchRunning(false);
                  setStopwatchTime(0);
                  setLaps([]);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>تصفير</span>
              </button>
            </div>

            {laps.length > 0 && (
              <div className="max-h-24 overflow-y-auto space-y-1 pr-1 text-xs font-mono">
                {laps.map((lap, idx) => (
                  <div key={idx} className="flex justify-between py-0.5 px-2 rounded bg-slate-950/60 text-slate-300">
                    <span>جولة #{laps.length - idx}</span>
                    <span className="text-indigo-300">{formatStopwatch(lap)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Time Integration Section */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/50 via-slate-900 to-purple-950/50 border border-indigo-500/30 space-y-4">
        <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>اسأل العقل التنفيذي Omega Brain عن التوقيت والفلك والتقويم</span>
        </div>

        {/* Quick prompt pills */}
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onAskBrain(prompt)}
              className="text-xs bg-slate-900/80 hover:bg-indigo-900/40 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-all text-right"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Custom Question input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={customTimeQuery}
            onChange={(e) => setCustomTimeQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && customTimeQuery.trim()) {
                onAskBrain(customTimeQuery.trim());
                setCustomTimeQuery("");
              }
            }}
            placeholder="اسأل مثلاً: كم الساعة الآن في سيدني؟ أو احسب لي عدد الساعات المتبقية لاجتماعي..."
            className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => {
              if (customTimeQuery.trim()) {
                onAskBrain(customTimeQuery.trim());
                setCustomTimeQuery("");
              }
            }}
            disabled={!customTimeQuery.trim()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>إرسال</span>
          </button>
        </div>
      </div>
    </div>
  );
};

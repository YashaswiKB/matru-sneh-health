import { useEffect, useMemo, useState } from "react";
import { Baby } from "lucide-react";
import PageShell from "@/components/PageShell";
import { lsGet, lsSet } from "@/lib/storage";
import { useLang } from "@/lib/useLang";
import { tr } from "@/lib/i18n";

const KEY = "kicks";
const DEBOUNCE_MS = 1500;

export default function KickCounter() {
  const [lang] = useLang();
  const [kicks, setKicks] = useState<number[]>(() => lsGet<number[]>(KEY, []));
  const [pop, setPop] = useState(false);
  const [lastTap, setLastTap] = useState(0);

  useEffect(() => {
    lsSet(KEY, kicks);
  }, [kicks]);

  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

  const todayKicks = kicks.filter((t) => t >= startOfDay).length;

  const weekly = useMemo(() => {
    // Per-hour counts for the past 7 days, grouped by day
    const days: { date: Date; perHour: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(startOfDay - i * 86400000);
      const start = d.getTime();
      const end = start + 86400000;
      const count = kicks.filter((t) => t >= start && t < end).length;
      // Per-hour over waking hours (assume 16h)
      const perHour = +(count / 16).toFixed(1);
      days.push({ date: d, perHour });
    }
    return days;
  }, [kicks, startOfDay]);

  const handleKick = () => {
    const now = Date.now();
    if (now - lastTap < DEBOUNCE_MS) return;
    setLastTap(now);
    setKicks((k) => [...k, now]);
    setPop(true);
    setTimeout(() => setPop(false), 350);
    if ("vibrate" in navigator) navigator.vibrate(40);
  };

  const dayName = (d: Date) =>
    lang === "kn"
      ? ["ಭಾನು", "ಸೋಮ", "ಮಂಗ", "ಬುಧ", "ಗುರು", "ಶುಕ್ರ", "ಶನಿ"][d.getDay()]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];

  return (
    <PageShell
      title={tr("kickCounter", lang)}
      subtitle={lang === "kn" ? "ಮಗು ಚಲಿಸಿದಾಗ ಒತ್ತಿರಿ" : "Tap whenever baby moves"}
    >
      <div className="flex flex-col items-center mt-2">
        <button
          onClick={handleKick}
          className={`relative w-64 h-64 rounded-full bg-primary-gradient text-primary-foreground shadow-soft active:scale-95 transition-transform ${pop ? "kick-pop" : ""}`}
          aria-label="Record kick"
        >
          <div className="flex flex-col items-center justify-center h-full">
            <Baby className="w-20 h-20 mb-2" strokeWidth={1.8} />
            <div className="text-7xl font-bold leading-none">{todayKicks}</div>
            <div className="text-sm opacity-90 mt-1">
              {lang === "kn" ? "ಇಂದಿನ ಒದೆತಗಳು" : "kicks today"}
            </div>
          </div>
        </button>
        <p className="text-sm text-muted-foreground mt-4">
          {lang === "kn" ? "ತಪ್ಪಾದ ಎಣಿಕೆ ತಡೆಯಲು 1.5 ಸೆಕೆಂಡ್ ವಿಳಂಬ" : "1.5s debounce prevents double taps"}
        </p>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-bold mb-3">
          {lang === "kn" ? "ವಾರದ ಕಿಕ್/ಗಂಟೆ" : "Weekly Kicks per Hour"}
        </h2>
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          <table className="w-full text-base">
            <thead className="bg-muted/60">
              <tr>
                <th className="text-left py-3 px-4 font-semibold">{lang === "kn" ? "ದಿನ" : "Day"}</th>
                <th className="text-right py-3 px-4 font-semibold">
                  {lang === "kn" ? "ಪ್ರತಿ ಗಂಟೆ" : "Per hour"}
                </th>
              </tr>
            </thead>
            <tbody>
              {weekly.map((d, i) => (
                <tr key={i} className="border-t border-border/60">
                  <td className="py-3 px-4">
                    {dayName(d.date)} <span className="text-muted-foreground text-sm">{d.date.getDate()}/{d.date.getMonth() + 1}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-primary">{d.perHour}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={() => { if (confirm("Reset all kick history?")) setKicks([]); }}
          className="mt-4 text-sm text-muted-foreground underline"
        >
          {lang === "kn" ? "ಇತಿಹಾಸ ಅಳಿಸಿ" : "Reset history"}
        </button>
      </section>
    </PageShell>
  );
}

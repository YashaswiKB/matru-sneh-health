import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import PageShell from "@/components/PageShell";
import { lsGet, lsSet } from "@/lib/storage";
import { useLang } from "@/lib/useLang";
import { tr } from "@/lib/i18n";

const ITEMS = [
  { id: "ragi", en: "Ragi", kn: "ರಾಗಿ", emoji: "🌾" },
  { id: "greens", en: "Greens", kn: "ಸೊಪ್ಪು", emoji: "🥬" },
  { id: "pulses", en: "Pulses", kn: "ಬೇಳೆ", emoji: "🫘" },
  { id: "milk", en: "Milk", kn: "ಹಾಲು", emoji: "🥛" },
  { id: "fruits", en: "Fruits", kn: "ಹಣ್ಣುಗಳು", emoji: "🍎" },
  { id: "water", en: "Water (8 glasses)", kn: "ನೀರು (8 ಲೋಟ)", emoji: "💧" },
];

const todayKey = () => {
  const d = new Date();
  return `nutrition:${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

export default function Nutrition() {
  const [lang] = useLang();
  const [done, setDone] = useState<Record<string, boolean>>(() => lsGet(todayKey(), {}));

  useEffect(() => { lsSet(todayKey(), done); }, [done]);

  const completed = useMemo(() => ITEMS.filter((i) => done[i.id]).length, [done]);
  const pct = Math.round((completed / ITEMS.length) * 100);

  const toggle = (id: string) => setDone((d) => ({ ...d, [id]: !d[id] }));

  return (
    <PageShell title={tr("nutrition", lang)} subtitle={lang === "kn" ? "ಇಂದಿನ ಆಹಾರ ಪಟ್ಟಿ" : "Today's food checklist"} accent="accent">
      <div className="bg-card rounded-3xl p-6 shadow-card mb-5">
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="text-sm text-muted-foreground">{lang === "kn" ? "ಇಂದಿನ ಪ್ರಗತಿ" : "Today's progress"}</div>
            <div className="text-3xl font-bold">{completed}/{ITEMS.length}</div>
          </div>
          <div className="text-4xl font-bold text-accent">{pct}%</div>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-accent transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        {pct === 100 && (
          <div className="mt-4 text-success font-semibold text-center">
            🎉 {lang === "kn" ? "ಇಂದು ಎಲ್ಲಾ ಪೂರ್ಣ!" : "All complete today!"}
          </div>
        )}
      </div>

      <ul className="space-y-3">
        {ITEMS.map((it) => {
          const isDone = !!done[it.id];
          return (
            <li key={it.id}>
              <button
                onClick={() => toggle(it.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all active:scale-[0.98] ${
                  isDone
                    ? "bg-accent-soft border-accent"
                    : "bg-card border-border"
                }`}
              >
                <span className="text-3xl">{it.emoji}</span>
                <span className={`flex-1 text-left text-lg font-semibold ${isDone ? "line-through opacity-70" : ""}`}>
                  {lang === "kn" ? it.kn : it.en}
                </span>
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isDone ? "bg-accent text-accent-foreground" : "bg-muted"
                  }`}
                >
                  {isDone && <Check className="w-5 h-5" strokeWidth={3} />}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </PageShell>
  );
}

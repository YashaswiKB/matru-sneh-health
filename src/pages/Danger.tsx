import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ShieldCheck, Phone } from "lucide-react";
import PageShell from "@/components/PageShell";
import { lsGet, lsSet } from "@/lib/storage";
import { useLang } from "@/lib/useLang";
import { tr } from "@/lib/i18n";

const SIGNS = [
  { id: "swelling", en: "High swelling (face, hands, feet)", kn: "ಮುಖ/ಕೈ/ಕಾಲು ಊತ" },
  { id: "bleeding", en: "Heavy bleeding", kn: "ಹೆಚ್ಚು ರಕ್ತಸ್ರಾವ" },
  { id: "headache", en: "Severe headache", kn: "ತೀವ್ರ ತಲೆನೋವು" },
  { id: "fever", en: "High fever", kn: "ಹೆಚ್ಚಿನ ಜ್ವರ" },
  { id: "movement", en: "Reduced baby movement", kn: "ಮಗುವಿನ ಚಲನೆ ಕಡಿಮೆ" },
  { id: "vision", en: "Blurred vision", kn: "ಮಸುಕಾದ ದೃಷ್ಟಿ" },
  { id: "pain", en: "Severe abdominal pain", kn: "ತೀವ್ರ ಹೊಟ್ಟೆ ನೋವು" },
];

const DANGER_KEYWORDS = [
  "bleed", "bleeding", "swell", "swelling", "headache", "fever", "pain",
  "blur", "vision", "movement", "dizzy", "faint", "vomit",
  "ರಕ್ತ", "ಊತ", "ತಲೆನೋವು", "ಜ್ವರ", "ನೋವು", "ಚಲನೆ",
];

interface Entry {
  ts: number;
  selected: string[];
  text: string;
  danger: boolean;
}

const HIST_KEY = "danger:history";

export default function Danger() {
  const [lang] = useLang();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [text, setText] = useState("");
  const [history, setHistory] = useState<Entry[]>(() => lsGet<Entry[]>(HIST_KEY, []));

  const lowerText = text.toLowerCase();
  const textHasDanger = useMemo(
    () => text.trim().length > 0 && DANGER_KEYWORDS.some((k) => lowerText.includes(k.toLowerCase())),
    [text, lowerText]
  );
  const danger = selected.size > 0 || textHasDanger;

  useEffect(() => {
    if (selected.size === 0 && text.trim().length === 0) return;
    const entry: Entry = { ts: Date.now(), selected: [...selected], text: text.trim(), danger };
    const next = [entry, ...history].slice(0, 30);
    setHistory(next);
    lsSet(HIST_KEY, next);
    // Save only when user changes input — debounced via small timeout
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [danger]);

  const toggle = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  return (
    <PageShell
      title={tr("danger", lang)}
      subtitle={lang === "kn" ? "ಲಕ್ಷಣಗಳನ್ನು ಪರಿಶೀಲಿಸಿ" : "Check your symptoms"}
      accent="destructive"
    >
      {danger ? (
        <div className="bg-destructive text-destructive-foreground rounded-3xl p-6 mb-6 shadow-danger danger-pulse">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-10 h-10 shrink-0" strokeWidth={2.5} />
            <div className="text-2xl font-bold leading-tight">
              {lang === "kn" ? "ಅಪಾಯ ಸೂಚನೆ ಪತ್ತೆ" : "Danger Sign Detected"}
            </div>
          </div>
          <p className="text-xl font-bold mt-2">
            {lang === "kn" ? "ತಕ್ಷಣ ಆಸ್ಪತ್ರೆಗೆ ಭೇಟಿ ನೀಡಿ!" : "Visit Hospital Immediately!"}
          </p>
          <a
            href="tel:108"
            className="mt-4 flex items-center justify-center gap-2 bg-destructive-foreground text-destructive py-3.5 rounded-2xl font-bold text-lg active:scale-[0.98]"
          >
            <Phone className="w-5 h-5" /> {lang === "kn" ? "ತುರ್ತು 108 ಕರೆ ಮಾಡಿ" : "Call Emergency 108"}
          </a>
        </div>
      ) : (
        <div className="bg-success/10 text-success rounded-3xl p-5 mb-6 flex items-center gap-3">
          <ShieldCheck className="w-7 h-7 shrink-0" />
          <div className="font-bold text-lg">
            {lang === "kn" ? "ಯಾವುದೇ ಅಪಾಯ ಸೂಚನೆ ಇಲ್ಲ" : "No danger signs detected"}
          </div>
        </div>
      )}

      <section className="mb-6">
        <h2 className="text-lg font-bold mb-3">
          {lang === "kn" ? "ಲಕ್ಷಣಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ" : "Select symptoms"}
        </h2>
        <ul className="space-y-2">
          {SIGNS.map((s) => {
            const on = selected.has(s.id);
            return (
              <li key={s.id}>
                <label className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-colors ${on ? "bg-destructive-soft border-destructive" : "bg-card border-border"}`}>
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggle(s.id)}
                    className="mt-1 w-5 h-5 accent-destructive"
                  />
                  <span className="font-medium">{lang === "kn" ? s.kn : s.en}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-bold mb-2">
          {lang === "kn" ? "ಅಥವಾ ಬರೆಯಿರಿ" : "Or describe"}
        </h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder={lang === "kn" ? "ನಿಮ್ಮ ಲಕ್ಷಣಗಳನ್ನು ಬರೆಯಿರಿ..." : "Type your symptoms..."}
          className="w-full p-4 rounded-2xl border-2 border-border bg-card text-base"
        />
      </section>

      {history.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3">{lang === "kn" ? "ಇತಿಹಾಸ" : "History"}</h2>
          <ul className="space-y-2">
            {history.slice(0, 8).map((h, i) => (
              <li key={i} className={`p-3 rounded-xl text-sm ${h.danger ? "bg-destructive-soft" : "bg-muted"}`}>
                <div className="font-semibold">
                  {new Date(h.ts).toLocaleString(lang === "kn" ? "kn-IN" : "en-IN", { dateStyle: "short", timeStyle: "short" })}
                  {h.danger && <span className="ml-2 text-destructive">⚠ {lang === "kn" ? "ಅಪಾಯ" : "Danger"}</span>}
                </div>
                {h.selected.length > 0 && <div className="text-muted-foreground">{h.selected.join(", ")}</div>}
                {h.text && <div className="text-muted-foreground italic">"{h.text}"</div>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageShell>
  );
}

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageShell from "@/components/PageShell";
import { useLang } from "@/lib/useLang";
import { tr } from "@/lib/i18n";

interface WeekInfo {
  size: { en: string; kn: string };
  baby: { en: string; kn: string };
  mother: { en: string; kn: string };
  tip: { en: string; kn: string };
}

// Concise, easy-reading guidance for first-time mothers, week 1–40.
const GUIDE: WeekInfo[] = Array.from({ length: 40 }, (_, i) => {
  const w = i + 1;
  // A small set of highlight weeks; others are gentle generic tips.
  const highlights: Record<number, WeekInfo> = {
    4: {
      size: { en: "Poppy seed", kn: "ಗಸಗಸೆ ಬೀಜ" },
      baby: { en: "Baby is just forming. The heart is starting to develop.", kn: "ಮಗು ರೂಪುಗೊಳ್ಳುತ್ತಿದೆ. ಹೃದಯ ಬೆಳವಣಿಗೆ ಆರಂಭ." },
      mother: { en: "You may feel tired. Eat small meals often.", kn: "ಆಯಾಸ ಆಗಬಹುದು. ಸಣ್ಣ ಊಟ ಪದೇ ಪದೇ ತಿನ್ನಿ." },
      tip: { en: "Start folic acid tablets. Visit ANM/PHC.", kn: "ಫೋಲಿಕ್ ಆಮ್ಲ ಮಾತ್ರೆ ಆರಂಭಿಸಿ. ಎಎನ್ಎಂ/ಪಿಎಚ್‌ಸಿಗೆ ಭೇಟಿ ನೀಡಿ." },
    },
    8: {
      size: { en: "Raspberry", kn: "ರಾಸ್ಪ್ಬೆರಿ" },
      baby: { en: "Tiny arms and legs are forming.", kn: "ಸಣ್ಣ ಕೈ ಕಾಲುಗಳು ರೂಪುಗೊಳ್ಳುತ್ತಿವೆ." },
      mother: { en: "Morning sickness may peak. Sip ginger water.", kn: "ಬೆಳಿಗ್ಗೆ ವಾಂತಿ ಹೆಚ್ಚಬಹುದು. ಶುಂಠಿ ನೀರು ಕುಡಿಯಿರಿ." },
      tip: { en: "Avoid raw papaya and heavy lifting.", kn: "ಹಸಿ ಪಪ್ಪಾಯಿ ಮತ್ತು ಭಾರ ಎತ್ತುವುದು ತಪ್ಪಿಸಿ." },
    },
    12: {
      size: { en: "Lime", kn: "ನಿಂಬೆ" },
      baby: { en: "Baby can move fingers. Reflexes begin.", kn: "ಮಗು ಬೆರಳುಗಳನ್ನು ಚಲಿಸಬಲ್ಲದು. ಪ್ರತಿಫಲನ ಆರಂಭ." },
      mother: { en: "Nausea often gets better now.", kn: "ವಾಕರಿಕೆ ಈಗ ಕಡಿಮೆ ಆಗಬಹುದು." },
      tip: { en: "First trimester scan is due. Book it.", kn: "ಮೊದಲ ತ್ರೈಮಾಸಿಕ ಸ್ಕ್ಯಾನ್ ಬಾಕಿ. ಬುಕ್ ಮಾಡಿ." },
    },
    16: {
      size: { en: "Avocado", kn: "ಬೆಣ್ಣೆ ಹಣ್ಣು" },
      baby: { en: "Baby can hear sounds. Talk and sing softly.", kn: "ಮಗು ಶಬ್ದ ಕೇಳಬಲ್ಲದು. ಮೃದುವಾಗಿ ಮಾತನಾಡಿ." },
      mother: { en: "Energy returns. Take short walks.", kn: "ಶಕ್ತಿ ಮರಳುತ್ತದೆ. ಸಣ್ಣ ನಡಿಗೆ ಮಾಡಿ." },
      tip: { en: "Eat ragi, greens, and pulses daily.", kn: "ಪ್ರತಿದಿನ ರಾಗಿ, ಸೊಪ್ಪು, ಬೇಳೆ ತಿನ್ನಿ." },
    },
    20: {
      size: { en: "Banana", kn: "ಬಾಳೆಹಣ್ಣು" },
      baby: { en: "You may feel first kicks!", kn: "ನೀವು ಮೊದಲ ಒದೆತಗಳನ್ನು ಅನುಭವಿಸಬಹುದು!" },
      mother: { en: "Belly is showing. Wear loose clothes.", kn: "ಹೊಟ್ಟೆ ಕಾಣುತ್ತದೆ. ಸಡಿಲ ಬಟ್ಟೆ ಧರಿಸಿ." },
      tip: { en: "Anomaly scan around this week.", kn: "ಈ ವಾರ ಅನಾಮಲಿ ಸ್ಕ್ಯಾನ್ ಮಾಡಿಸಿ." },
    },
    24: {
      size: { en: "Corn cob", kn: "ಜೋಳದ ಕಣಸು" },
      baby: { en: "Baby's lungs are developing.", kn: "ಮಗುವಿನ ಶ್ವಾಸಕೋಶ ಬೆಳೆಯುತ್ತಿದೆ." },
      mother: { en: "Watch for swelling. Rest legs up.", kn: "ಊತ ಗಮನಿಸಿ. ಕಾಲುಗಳನ್ನು ಮೇಲಕ್ಕೆತ್ತಿ ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ." },
      tip: { en: "Check sugar and BP at PHC.", kn: "ಸಕ್ಕರೆ ಮತ್ತು ಬಿಪಿ ಪರಿಶೀಲಿಸಿ." },
    },
    28: {
      size: { en: "Eggplant", kn: "ಬದನೆಕಾಯಿ" },
      baby: { en: "Baby opens eyes and dreams.", kn: "ಮಗು ಕಣ್ಣು ತೆರೆಯುತ್ತದೆ ಮತ್ತು ಕನಸು ಕಾಣುತ್ತದೆ." },
      mother: { en: "Third trimester begins. Sleep on left side.", kn: "ಮೂರನೇ ತ್ರೈಮಾಸಿಕ. ಎಡಗಡೆ ಮಲಗಿ." },
      tip: { en: "TT injection is due now.", kn: "ಟಿಟಿ ಚುಚ್ಚುಮದ್ದು ಬಾಕಿ." },
    },
    32: {
      size: { en: "Coconut", kn: "ತೆಂಗಿನಕಾಯಿ" },
      baby: { en: "Baby is gaining weight quickly.", kn: "ಮಗು ವೇಗವಾಗಿ ತೂಕ ಗಳಿಸುತ್ತಿದೆ." },
      mother: { en: "Count kicks daily. Rest more.", kn: "ಪ್ರತಿದಿನ ಒದೆತಗಳನ್ನು ಎಣಿಸಿ. ಹೆಚ್ಚು ವಿಶ್ರಾಂತಿ." },
      tip: { en: "Pack a hospital bag now.", kn: "ಆಸ್ಪತ್ರೆ ಚೀಲ ಸಿದ್ಧಪಡಿಸಿ." },
    },
    36: {
      size: { en: "Papaya", kn: "ಪಪ್ಪಾಯಿ" },
      baby: { en: "Baby is full term soon. Head moves down.", kn: "ಮಗು ಪೂರ್ಣ ಬೆಳೆದಿದೆ. ತಲೆ ಕೆಳಗೆ ಚಲಿಸುತ್ತದೆ." },
      mother: { en: "Practice slow breathing.", kn: "ನಿಧಾನ ಉಸಿರಾಟ ಅಭ್ಯಾಸ ಮಾಡಿ." },
      tip: { en: "Weekly check-ups now.", kn: "ಈಗ ಪ್ರತಿ ವಾರ ತಪಾಸಣೆ." },
    },
    40: {
      size: { en: "Pumpkin", kn: "ಸೋರೆಕಾಯಿ" },
      baby: { en: "Baby is ready to meet you!", kn: "ಮಗು ನಿಮ್ಮನ್ನು ಭೇಟಿಯಾಗಲು ಸಿದ್ಧ!" },
      mother: { en: "Watch for labour signs: pain, water break.", kn: "ಹೆರಿಗೆ ಲಕ್ಷಣ ಗಮನಿಸಿ: ನೋವು, ನೀರು ಒಡೆಯುವುದು." },
      tip: { en: "Go to hospital at first strong contractions.", kn: "ಮೊದಲ ಬಲವಾದ ನೋವಿಗೆ ಆಸ್ಪತ್ರೆಗೆ ಹೋಗಿ." },
    },
  };
  if (highlights[w]) return highlights[w];
  // Generic gentle weekly tip.
  return {
    size: { en: "Growing well", kn: "ಚೆನ್ನಾಗಿ ಬೆಳೆಯುತ್ತಿದೆ" },
    baby: {
      en: `Baby is developing steadily in week ${w}.`,
      kn: `${w}ನೇ ವಾರದಲ್ಲಿ ಮಗು ಚೆನ್ನಾಗಿ ಬೆಳೆಯುತ್ತಿದೆ.`,
    },
    mother: {
      en: "Eat warm home food. Rest 8 hours. Drink water.",
      kn: "ಮನೆ ಊಟ ತಿನ್ನಿ. 8 ಗಂಟೆ ವಿಶ್ರಾಂತಿ. ನೀರು ಕುಡಿಯಿರಿ.",
    },
    tip: {
      en: "Take iron and calcium tablets daily.",
      kn: "ಪ್ರತಿದಿನ ಕಬ್ಬಿಣ ಮತ್ತು ಕ್ಯಾಲ್ಸಿಯಂ ಮಾತ್ರೆ ತೆಗೆದುಕೊಳ್ಳಿ.",
    },
  };
});

const STORE_KEY = "guide:week";

export default function Guide() {
  const [lang] = useLang();
  const [week, setWeek] = useState<number>(() => {
    try { return Number(localStorage.getItem(STORE_KEY)) || 12; } catch { return 12; }
  });

  const set = (w: number) => {
    const c = Math.min(40, Math.max(1, w));
    setWeek(c);
    try { localStorage.setItem(STORE_KEY, String(c)); } catch {}
  };

  const info = GUIDE[week - 1];

  return (
    <PageShell title={tr("guide", lang)} subtitle={lang === "kn" ? "ವಾರವಾರು ಮಾರ್ಗದರ್ಶನ" : "Week-by-week guidance"}>
      <div className="bg-warm-gradient rounded-3xl p-6 mb-5 text-center">
        <div className="text-sm text-foreground/60 font-semibold uppercase tracking-wide">
          {lang === "kn" ? "ವಾರ" : "Week"}
        </div>
        <div className="flex items-center justify-center gap-6 mt-2">
          <button onClick={() => set(week - 1)} className="p-3 bg-card rounded-full shadow-card active:scale-90" aria-label="prev">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="text-7xl font-bold text-primary">{week}</div>
          <button onClick={() => set(week + 1)} className="p-3 bg-card rounded-full shadow-card active:scale-90" aria-label="next">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        <div className="mt-3 text-foreground/80 font-medium">
          {lang === "kn" ? "ಮಗುವಿನ ಗಾತ್ರ" : "Baby is the size of"}: <span className="font-bold">{lang === "kn" ? info.size.kn : info.size.en}</span>
        </div>
      </div>

      <div className="space-y-4">
        <Card title={lang === "kn" ? "ಮಗುವಿನ ಬೆಳವಣಿಗೆ" : "Baby's growth"} emoji="👶" body={lang === "kn" ? info.baby.kn : info.baby.en} tone="primary" />
        <Card title={lang === "kn" ? "ತಾಯಿಯ ಆರೈಕೆ" : "Mother's care"} emoji="🤱" body={lang === "kn" ? info.mother.kn : info.mother.en} tone="secondary" />
        <Card title={lang === "kn" ? "ಈ ವಾರದ ಸಲಹೆ" : "This week's tip"} emoji="💡" body={lang === "kn" ? info.tip.kn : info.tip.en} tone="accent" />
      </div>

      <div className="mt-6">
        <input
          type="range" min={1} max={40} value={week}
          onChange={(e) => set(Number(e.target.value))}
          className="w-full accent-primary"
          aria-label="Pick week"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>1</span><span>20</span><span>40</span>
        </div>
      </div>
    </PageShell>
  );
}

function Card({ title, emoji, body, tone }: { title: string; emoji: string; body: string; tone: "primary" | "secondary" | "accent" }) {
  const tones = {
    primary: "bg-primary-soft",
    secondary: "bg-secondary-soft",
    accent: "bg-accent-soft",
  };
  return (
    <div className={`${tones[tone]} rounded-2xl p-5`}>
      <div className="flex items-center gap-2 font-bold text-lg mb-1">
        <span className="text-2xl">{emoji}</span> {title}
      </div>
      <p className="text-foreground/80 leading-relaxed">{body}</p>
    </div>
  );
}

import { Link } from "react-router-dom";
import { Baby, CalendarHeart, Apple, AlertTriangle, BookHeart, Wifi, WifiOff, Heart, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import PageShell from "@/components/PageShell";
import { useLang } from "@/lib/useLang";
import { tr } from "@/lib/i18n";

const FEATURES = [
  { to: "/kicks", icon: Baby, key: "kickCounter", desc: "kickDesc", bg: "bg-primary-soft", fg: "text-primary", ring: "ring-primary/20" },
  { to: "/checkup", icon: CalendarHeart, key: "checkup", desc: "checkupDesc", bg: "bg-secondary-soft", fg: "text-secondary", ring: "ring-secondary/20" },
  { to: "/nutrition", icon: Apple, key: "nutrition", desc: "nutritionDesc", bg: "bg-accent-soft", fg: "text-accent", ring: "ring-accent/30" },
  { to: "/danger", icon: AlertTriangle, key: "danger", desc: "dangerDesc", bg: "bg-destructive-soft", fg: "text-destructive", ring: "ring-destructive/20" },
  { to: "/guide", icon: BookHeart, key: "guide", desc: "guideDesc", bg: "bg-primary-soft", fg: "text-primary", ring: "ring-primary/20" },
] as const;

export default function Index() {
  const [lang] = useLang();
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const u = () => setOnline(navigator.onLine);
    window.addEventListener("online", u);
    window.addEventListener("offline", u);
    return () => {
      window.removeEventListener("online", u);
      window.removeEventListener("offline", u);
    };
  }, []);

  return (
    <PageShell title={tr("appName", lang)} subtitle={tr("tagline", lang)}>
      <div className="flex items-center justify-between mb-6 -mt-2">
        <div
          className={`flex items-center gap-2 text-sm font-semibold px-3.5 py-2 rounded-full ${
            online ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
          }`}
        >
          {online ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          {online ? "Online" : tr("offline", lang)}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Heart className="w-3.5 h-3.5 text-primary fill-primary" />
          <span>{lang === "kn" ? "ಪ್ರೀತಿಯಿಂದ" : "Made with care"}</span>
        </div>
      </div>

      <div className="bg-warm-gradient rounded-3xl p-5 mb-6 shadow-soft relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 opacity-20">
          <Baby className="w-32 h-32 text-primary" strokeWidth={1.5} />
        </div>
        <p className="text-xs uppercase tracking-wider font-bold text-primary/80 mb-1">
          {lang === "kn" ? "ಸ್ವಾಗತ" : "Welcome"}
        </p>
        <h2 className="text-xl font-bold text-foreground leading-snug max-w-[85%]">
          {lang === "kn"
            ? "ನಿಮ್ಮ ಆರೋಗ್ಯಕರ ಗರ್ಭಾವಸ್ಥೆಯ ಪ್ರಯಾಣಕ್ಕೆ"
            : "Your healthy pregnancy journey starts here"}
        </h2>
      </div>

      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">
        {lang === "kn" ? "ಮುಖ್ಯ ಸೌಲಭ್ಯಗಳು" : "Main Features"}
      </h3>

      <div className="grid grid-cols-1 gap-3.5">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <Link
              key={f.to}
              to={f.to}
              className="feature-card flex items-center gap-4 hover:shadow-soft group"
            >
              <div className={`${f.bg} ${f.fg} w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ring-4 ${f.ring}`}>
                <Icon className="w-8 h-8" strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold text-foreground leading-tight">
                  {tr(f.key as never, lang)}
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {tr(f.desc as never, lang)}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground/50 shrink-0 group-active:translate-x-0.5 transition-transform" />
            </Link>
          );
        })}
      </div>

      <div className="mt-8 p-4 rounded-2xl bg-secondary-soft/50 border border-secondary/20 text-center">
        <p className="text-sm text-foreground/80 font-medium">
          📱 {lang === "kn"
            ? "ಪೂರ್ಣ ಆಫ್‌ಲೈನ್ ಪ್ರವೇಶಕ್ಕಾಗಿ ಮುಖಪುಟಕ್ಕೆ ಸೇರಿಸಿ"
            : "Add to Home Screen for full offline access"}
        </p>
      </div>
    </PageShell>
  );
}

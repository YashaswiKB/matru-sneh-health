import { Link } from "react-router-dom";
import { Baby, CalendarHeart, Apple, AlertTriangle, BookHeart, Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import PageShell from "@/components/PageShell";
import { useLang } from "@/lib/useLang";
import { tr } from "@/lib/i18n";

const FEATURES = [
  { to: "/kicks", icon: Baby, key: "kickCounter", desc: "kickDesc", bg: "bg-primary-soft", fg: "text-primary" },
  { to: "/checkup", icon: CalendarHeart, key: "checkup", desc: "checkupDesc", bg: "bg-secondary-soft", fg: "text-secondary" },
  { to: "/nutrition", icon: Apple, key: "nutrition", desc: "nutritionDesc", bg: "bg-accent-soft", fg: "text-accent" },
  { to: "/danger", icon: AlertTriangle, key: "danger", desc: "dangerDesc", bg: "bg-destructive-soft", fg: "text-destructive" },
  { to: "/guide", icon: BookHeart, key: "guide", desc: "guideDesc", bg: "bg-primary-soft", fg: "text-primary" },
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
      <div
        className={`mb-5 flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-full w-fit ${
          online ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
        }`}
      >
        {online ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
        {online ? "Online" : tr("offline", lang)}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <Link key={f.to} to={f.to} className="feature-card flex items-center gap-4 hover:shadow-soft">
              <div className={`${f.bg} ${f.fg} w-16 h-16 rounded-2xl flex items-center justify-center shrink-0`}>
                <Icon className="w-8 h-8" strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-foreground leading-tight">
                  {tr(f.key as never, lang)}
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {tr(f.desc as never, lang)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-10">
        Add to Home Screen for full offline access · ಮುಖಪುಟಕ್ಕೆ ಸೇರಿಸಿ
      </p>
    </PageShell>
  );
}

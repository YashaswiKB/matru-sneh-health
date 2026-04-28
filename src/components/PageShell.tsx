import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, Globe } from "lucide-react";
import { useLang } from "@/lib/useLang";
import { tr } from "@/lib/i18n";

interface Props {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  accent?: "primary" | "secondary" | "accent" | "destructive";
}

export default function PageShell({ children, title, subtitle, accent = "primary" }: Props) {
  const loc = useLocation();
  const [lang, setLang] = useLang();
  const isHome = loc.pathname === "/";

  const accentBg: Record<string, string> = {
    primary: "bg-primary-soft",
    secondary: "bg-secondary-soft",
    accent: "bg-accent-soft",
    destructive: "bg-destructive-soft",
  };

  return (
    <div className="min-h-screen bg-background">
      <header className={`${accentBg[accent]} px-5 pt-6 pb-8 rounded-b-[2.5rem]`}>
        <div className="flex items-center justify-between mb-4">
          {!isHome ? (
            <Link
              to="/"
              className="flex items-center gap-1 text-foreground/80 active:opacity-60 -ml-1 px-2 py-1"
              aria-label={tr("back", lang)}
            >
              <ChevronLeft className="w-6 h-6" />
              <span className="font-semibold">{tr("back", lang)}</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <img src="/icon-192.png" alt="" width={36} height={36} className="rounded-xl" />
              <span className="font-semibold text-foreground">Matru-Sneh</span>
            </div>
          )}
          <button
            onClick={() => setLang(lang === "en" ? "kn" : "en")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/70 backdrop-blur text-sm font-semibold text-foreground active:scale-95"
            aria-label="Switch language"
          >
            <Globe className="w-4 h-4" />
            {lang === "en" ? "ಕನ್ನಡ" : "English"}
          </button>
        </div>
        {title && <h1 className="text-3xl font-bold text-foreground leading-tight">{title}</h1>}
        {subtitle && <p className="mt-1.5 text-foreground/70 text-base">{subtitle}</p>}
      </header>
      <main className="px-5 pt-6 pb-28 max-w-2xl mx-auto">{children}</main>
    </div>
  );
}

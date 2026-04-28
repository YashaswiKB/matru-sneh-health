import { useEffect, useState } from "react";
import { CalendarHeart, Bell, Trash2 } from "lucide-react";
import PageShell from "@/components/PageShell";
import { reminders, ensureNotificationPermission, type Reminder } from "@/lib/reminders";
import { useLang } from "@/lib/useLang";
import { tr } from "@/lib/i18n";

export default function Checkup() {
  const [lang] = useLang();
  const [list, setList] = useState<Reminder[]>(() => reminders.list());
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(
    "Notification" in window ? Notification.permission : "unsupported"
  );

  const refresh = () => setList(reminders.list().sort((a, b) => +new Date(a.date) - +new Date(b.date)));

  useEffect(() => { refresh(); }, []);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    reminders.upsert({ id: crypto.randomUUID(), title: title.trim(), date: new Date(date).toISOString() });
    setTitle("");
    setDate("");
    refresh();
  };

  const remove = (id: string) => {
    reminders.remove(id);
    refresh();
  };

  const enableNotif = async () => {
    const ok = await ensureNotificationPermission();
    setPermission(ok ? "granted" : Notification.permission);
  };

  const daysLeft = (iso: string) => {
    const ms = new Date(iso).getTime() - Date.now();
    return Math.ceil(ms / 86400000);
  };

  const next = list.find((r) => new Date(r.date).getTime() > Date.now());

  return (
    <PageShell title={tr("checkup", lang)} subtitle={lang === "kn" ? "ಮುಂದಿನ ತಪಾಸಣೆ ಎಣಿಕೆ" : "Days until your next visit"} accent="secondary">
      {next ? (
        <div className="bg-sage-gradient rounded-3xl p-6 mb-6 shadow-soft">
          <div className="flex items-center gap-3 text-secondary-foreground/80 text-sm font-medium">
            <CalendarHeart className="w-5 h-5" />
            {lang === "kn" ? "ಮುಂದಿನ" : "Next up"}
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">{next.title}</div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-6xl font-bold text-secondary">{daysLeft(next.date)}</span>
            <span className="text-foreground/70 font-medium">{lang === "kn" ? "ದಿನಗಳು ಬಾಕಿ" : "days left"}</span>
          </div>
          <div className="text-sm text-foreground/60 mt-1">
            {new Date(next.date).toLocaleString(lang === "kn" ? "kn-IN" : "en-IN", { dateStyle: "full", timeStyle: "short" })}
          </div>
        </div>
      ) : (
        <div className="bg-muted rounded-3xl p-6 mb-6 text-center text-muted-foreground">
          {lang === "kn" ? "ಯಾವುದೇ ತಪಾಸಣೆ ಸೇರಿಸಿಲ್ಲ" : "No check-ups added yet"}
        </div>
      )}

      {permission !== "granted" && permission !== "unsupported" && (
        <button
          onClick={enableNotif}
          className="w-full mb-5 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-3 rounded-2xl font-semibold active:scale-[0.98]"
        >
          <Bell className="w-5 h-5" /> {lang === "kn" ? "ಜ್ಞಾಪನೆ ಸಕ್ರಿಯಗೊಳಿಸಿ" : "Enable reminders"}
        </button>
      )}

      <form onSubmit={add} className="bg-card rounded-2xl p-5 shadow-card space-y-3 mb-6">
        <h3 className="font-bold text-lg">{lang === "kn" ? "ಹೊಸ ತಪಾಸಣೆ" : "Add check-up"}</h3>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={lang === "kn" ? "ಉದಾ. ಸ್ಕ್ಯಾನ್, ಲಸಿಕೆ" : "e.g. Scan, Vaccination"}
          className="w-full px-4 py-3 rounded-xl border border-input bg-background text-base"
          required
        />
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-input bg-background text-base"
          required
        />
        <button className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold active:scale-[0.98]">
          {lang === "kn" ? "ಸೇರಿಸಿ" : "Add"}
        </button>
      </form>

      {list.length > 0 && (
        <section>
          <h3 className="font-bold text-lg mb-3">{lang === "kn" ? "ಎಲ್ಲಾ ತಪಾಸಣೆಗಳು" : "All check-ups"}</h3>
          <ul className="space-y-2">
            {list.map((r) => (
              <li key={r.id} className="flex items-center justify-between bg-card rounded-xl p-4 shadow-card">
                <div className="min-w-0">
                  <div className="font-semibold truncate">{r.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(r.date).toLocaleString(lang === "kn" ? "kn-IN" : "en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    {" · "}
                    {daysLeft(r.date) >= 0
                      ? `${daysLeft(r.date)} ${lang === "kn" ? "ದಿನ" : "d"} left`
                      : (lang === "kn" ? "ಮುಗಿದಿದೆ" : "past")}
                  </div>
                </div>
                <button onClick={() => remove(r.id)} aria-label="delete" className="p-2 text-destructive">
                  <Trash2 className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageShell>
  );
}

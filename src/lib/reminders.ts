export interface Reminder {
  id: string;
  title: string;
  date: string; // ISO — appointment time
  firedTimes?: number[]; // timestamps of slots already fired
  done?: boolean; // final reminder fired
}

const REM_KEY = "matrusneh:reminders";
const PRE_WINDOW_MS = 60 * 60 * 1000; // start reminders 60 min before
const SLOT_MS = 15 * 60 * 1000; // every 15 min
const TOLERANCE_MS = 90 * 1000; // fire if within 90s of slot

function loadAll(): Reminder[] {
  try {
    const raw = localStorage.getItem(REM_KEY);
    return raw ? (JSON.parse(raw) as Reminder[]) : [];
  } catch {
    return [];
  }
}
function saveAll(r: Reminder[]) {
  localStorage.setItem(REM_KEY, JSON.stringify(r));
}

export const reminders = {
  list: loadAll,
  upsert(r: Reminder) {
    const all = loadAll().filter((x) => x.id !== r.id);
    all.push(r);
    saveAll(all);
  },
  remove(id: string) {
    saveAll(loadAll().filter((x) => x.id !== id));
  },
};

export async function ensureNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const res = await Notification.requestPermission();
  return res === "granted";
}

/**
 * Reminder loop: every 30s, check pending reminders.
 * Fires repeated reminders every 15 minutes starting 60 min before
 * the appointment, plus a final reminder at appointment time.
 * Persists in localStorage so it survives restarts; on reopen, any
 * missed-but-still-relevant slot fires once.
 */
let started = false;
export function startReminderLoop() {
  if (started) return;
  started = true;

  const tick = () => {
    const now = Date.now();
    const all = loadAll();
    let changed = false;

    for (const r of all) {
      if (r.done) continue;
      const appt = new Date(r.date).getTime();
      if (isNaN(appt)) continue;

      r.firedTimes = r.firedTimes || [];

      // Build slot list: T-60, T-45, T-30, T-15, T (final)
      const slots: { time: number; final: boolean }[] = [];
      for (let offset = PRE_WINDOW_MS; offset > 0; offset -= SLOT_MS) {
        slots.push({ time: appt - offset, final: false });
      }
      slots.push({ time: appt, final: true });

      for (const s of slots) {
        const already = r.firedTimes.some((t) => Math.abs(t - s.time) < SLOT_MS / 2);
        if (already) continue;
        // Fire if slot time has passed (or is within tolerance) and not too old (< 30 min stale)
        if (s.time <= now + TOLERANCE_MS && now - s.time < 30 * 60 * 1000) {
          const minsLeft = Math.max(0, Math.round((appt - now) / 60000));
          const body = s.final
            ? `Your check-up "${r.title}" is now. Please go to the hospital.`
            : `Reminder: Your pregnancy check-up "${r.title}" is in ~${minsLeft} min. Please prepare for your hospital visit.`;
          notify(s.final ? "Check-up time" : "Check-up reminder", body);
          r.firedTimes.push(s.time);
          if (s.final) r.done = true;
          changed = true;
        }
      }
    }
    if (changed) saveAll(all);
  };

  tick();
  setInterval(tick, 30_000);
}

function notify(title: string, body: string) {
  try {
    if ("Notification" in window && Notification.permission === "granted") {
      // Prefer service worker notifications so they appear in the system tray
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready
          .then((reg) =>
            reg.showNotification(title, {
              body,
              icon: "/icon-192.png",
              badge: "/icon-192.png",
              tag: "matrusneh-checkup",
              requireInteraction: false,
            })
          )
          .catch(() => {
            new Notification(title, { body, icon: "/icon-192.png", badge: "/icon-192.png" });
          });
      } else {
        new Notification(title, { body, icon: "/icon-192.png", badge: "/icon-192.png" });
      }
      return;
    }
  } catch {}
  window.dispatchEvent(new CustomEvent("matrusneh:reminder", { detail: { title, body } }));
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { Toaster as Sonner, toast } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import KickCounter from "./pages/KickCounter.tsx";
import Checkup from "./pages/Checkup.tsx";
import Nutrition from "./pages/Nutrition.tsx";
import Danger from "./pages/Danger.tsx";
import Guide from "./pages/Guide.tsx";
import { startReminderLoop } from "./lib/reminders";

const queryClient = new QueryClient();

function ReminderBoot() {
  useEffect(() => {
    startReminderLoop();
    const handler = (e: Event) => {
      const d = (e as CustomEvent).detail as { title: string; body: string };
      toast(d.title, { description: d.body });
    };
    window.addEventListener("matrusneh:reminder", handler);
    return () => window.removeEventListener("matrusneh:reminder", handler);
  }, []);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ReminderBoot />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/kicks" element={<KickCounter />} />
          <Route path="/checkup" element={<Checkup />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/danger" element={<Danger />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

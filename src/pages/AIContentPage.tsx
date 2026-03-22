"use client";

import { lazy, Suspense } from "react";
import {
  AnimatedEntry,
  Skeleton,
} from "@gaqno-development/frontcore/components/ui";
import { Sparkles } from "lucide-react";

const AIBillingSummary = lazy(() =>
  import("@gaqno-development/frontcore/components/ai").then((m) => ({
    default: m.AIBillingSummary,
  }))
);
const AIAttributionDashboard = lazy(() =>
  import("@gaqno-development/frontcore/components/ai").then((m) => ({
    default: m.AIAttributionDashboard,
  }))
);

function AILoadingFallback() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  );
}

export default function AIContentPage() {
  return (
    <div className="space-y-6">
      <AnimatedEntry direction="fade" duration={0.2}>
        <div>
          <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-muted-foreground" />
            Conteúdo de IA
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Faturamento baseado em GMV e atribuição de conteúdo gerado por IA
          </p>
        </div>
      </AnimatedEntry>

      <Suspense fallback={<AILoadingFallback />}>
        <AnimatedEntry direction="up" delay={0.05}>
          <AIBillingSummary title="Faturamento baseado em GMV" />
        </AnimatedEntry>
      </Suspense>

      <Suspense fallback={<AILoadingFallback />}>
        <AnimatedEntry direction="up" delay={0.15}>
          <AIAttributionDashboard title="Atribuição e rastreamento de GMV" />
        </AnimatedEntry>
      </Suspense>
    </div>
  );
}

"use client";

import {
  AIBillingSummary,
  AIAttributionDashboard,
} from "@gaqno-development/frontcore/components/ai";

export default function AIContentPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Conteúdo de IA</h2>
      <AIBillingSummary title="Faturamento baseado em GMV" />
      <AIAttributionDashboard title="Atribuição e rastreamento de GMV" />
    </div>
  );
}

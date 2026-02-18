"use client";

import {
  AIBillingSummary,
  AIAttributionDashboard,
} from "@gaqno-development/frontcore/components/ai";

export default function AIContentPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">AI Content</h2>
      <AIBillingSummary title="GMV-based billing" />
      <AIAttributionDashboard title="GMV attribution & tracking" />
    </div>
  );
}

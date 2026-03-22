"use client";

import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  AnimatedEntry,
  Separator,
  Skeleton,
} from "@gaqno-development/frontcore/components/ui";
import { useErpOrders } from "@gaqno-development/frontcore/hooks/erp";
import { formatCurrency } from "@gaqno-development/frontcore/utils";
import type { ErpOrderStatus } from "@gaqno-development/types";
import {
  ChevronLeft,
  ShoppingCart,
  User,
  Mail,
  Calendar,
  Hash,
  Copy,
  Check,
  Clock,
  Package,
  CheckCircle2,
  Truck,
  XCircle,
  AlertCircle,
  Settings,
} from "lucide-react";
import { useState } from "react";

const STATUS_CONFIG: Record<ErpOrderStatus, { label: string; icon: typeof Clock; class: string }> = {
  pending: { label: "Pendente", icon: Clock, class: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  confirmed: { label: "Confirmado", icon: CheckCircle2, class: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  processing: { label: "Em processamento", icon: Settings, class: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20" },
  shipped: { label: "Enviado", icon: Truck, class: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20" },
  delivered: { label: "Entregue", icon: Package, class: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
  cancelled: { label: "Cancelado", icon: XCircle, class: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20" },
};

const STATUS_STEPS: ErpOrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered"];

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function CopyableId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
      {id.slice(0, 12)}…
      {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

function StatusTimeline({ currentStatus }: { currentStatus: ErpOrderStatus }) {
  if (currentStatus === "cancelled") {
    return (
      <div className="flex items-center gap-2 py-4">
        <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center">
          <XCircle className="h-4 w-4 text-red-500" />
        </div>
        <span className="text-sm font-medium text-red-600 dark:text-red-400">Pedido cancelado</span>
      </div>
    );
  }

  const currentIndex = STATUS_STEPS.indexOf(currentStatus);

  return (
    <div className="flex items-center gap-1 py-4 overflow-x-auto">
      {STATUS_STEPS.map((step, i) => {
        const config = STATUS_CONFIG[step];
        const Icon = config.icon;
        const isCompleted = i <= currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={step} className="flex items-center">
            {i > 0 && (
              <div className={`h-0.5 w-6 sm:w-10 mx-0.5 rounded-full transition-colors ${isCompleted ? "bg-primary" : "bg-muted"}`} />
            )}
            <div className="flex flex-col items-center gap-1.5">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                isCurrent
                  ? "bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/20"
                  : isCompleted
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
              }`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <span className={`text-[10px] font-medium whitespace-nowrap ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                {config.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }: { icon: typeof User; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <div className="mt-0.5 text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const ordersQuery = useErpOrders({ limit: 200 });
  const orders = ordersQuery.data ?? [];
  const order = id ? orders.find((o) => o.id === id) : undefined;

  if (ordersQuery.isLoading) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild className="group">
          <Link to="/erp/orders">
            <ChevronLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-0.5" />
            Voltar para pedidos
          </Link>
        </Button>
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <AnimatedEntry direction="fade" className="space-y-6">
        <Button variant="ghost" size="sm" asChild className="group">
          <Link to="/erp/orders">
            <ChevronLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-0.5" />
            Voltar para pedidos
          </Link>
        </Button>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
            <ShoppingCart className="h-12 w-12 text-muted-foreground/30" />
            <p className="text-muted-foreground" data-testid="order-not-found">Pedido não encontrado.</p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/erp/orders">Ver pedidos</Link>
            </Button>
          </CardContent>
        </Card>
      </AnimatedEntry>
    );
  }

  const statusConfig = STATUS_CONFIG[order.status as ErpOrderStatus] ?? STATUS_CONFIG.pending;
  const total = typeof order.total === "string" ? parseFloat(order.total) : order.total;

  return (
    <div className="space-y-6" data-testid="order-detail-page">
      <AnimatedEntry direction="fade" duration={0.2}>
        <Button variant="ghost" size="sm" asChild className="group">
          <Link to="/erp/orders">
            <ChevronLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-0.5" />
            Voltar para pedidos
          </Link>
        </Button>
      </AnimatedEntry>

      <div className="grid gap-6 lg:grid-cols-3">
        <AnimatedEntry direction="up" delay={0.05} className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-xl" data-testid="order-detail-title">
                    Pedido #{order.id.slice(0, 8)}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Criado em {formatDate(order.createdAt)}
                  </p>
                </div>
                <Badge className={`${statusConfig.class} border`}>{statusConfig.label}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <StatusTimeline currentStatus={order.status as ErpOrderStatus} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Resumo financeiro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Total do pedido</span>
                <span className="text-2xl font-bold tracking-tight tabular-nums">
                  {formatCurrency(Number.isNaN(total) ? 0 : total)}
                </span>
              </div>
              {order.notes && (
                <div className="pt-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Observações</p>
                  <p className="text-sm">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </AnimatedEntry>

        <AnimatedEntry direction="up" delay={0.15} className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Informações
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="divide-y divide-border/50">
                <DetailItem icon={Hash} label="ID" value={<CopyableId id={order.id} />} />
                {order.customerName && (
                  <DetailItem icon={User} label="Cliente" value={order.customerName} />
                )}
                {order.customerEmail && (
                  <DetailItem icon={Mail} label="Email" value={order.customerEmail} />
                )}
                <DetailItem icon={Calendar} label="Criado em" value={formatDate(order.createdAt)} />
                {order.updatedAt && (
                  <DetailItem icon={Calendar} label="Atualizado em" value={formatDate(order.updatedAt)} />
                )}
              </div>
            </CardContent>
          </Card>
        </AnimatedEntry>
      </div>
    </div>
  );
}

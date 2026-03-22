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
  Skeleton,
  CopyableId,
  DetailRow,
} from "@gaqno-development/frontcore/components/ui";
import { useErpOrders } from "@gaqno-development/frontcore/hooks/erp";
import { formatCurrency, formatDateTime } from "@gaqno-development/frontcore/utils";
import {
  ERP_ORDER_STATUS_LABEL,
  ERP_ORDER_STATUS_CLASS,
  ERP_ORDER_STATUS_STEPS,
} from "@gaqno-development/frontcore/config/erp-status";
import type { ErpOrderStatus } from "@gaqno-development/types";
import {
  ChevronLeft,
  ShoppingCart,
  User,
  Mail,
  Calendar,
  Hash,
  Clock,
  Package,
  CheckCircle2,
  Truck,
  XCircle,
  Settings,
} from "lucide-react";

const STATUS_ICON: Record<ErpOrderStatus, typeof Clock> = {
  pending: Clock,
  confirmed: CheckCircle2,
  processing: Settings,
  shipped: Truck,
  delivered: Package,
  cancelled: XCircle,
};

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

  const currentIndex = ERP_ORDER_STATUS_STEPS.indexOf(currentStatus);

  return (
    <div className="flex items-center gap-1 py-4 overflow-x-auto">
      {ERP_ORDER_STATUS_STEPS.map((step, i) => {
        const Icon = STATUS_ICON[step];
        const label = ERP_ORDER_STATUS_LABEL[step];
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
                {label}
              </span>
            </div>
          </div>
        );
      })}
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

  const statusLabel = ERP_ORDER_STATUS_LABEL[order.status as ErpOrderStatus] ?? ERP_ORDER_STATUS_LABEL.pending;
  const statusClass = ERP_ORDER_STATUS_CLASS[order.status as ErpOrderStatus] ?? ERP_ORDER_STATUS_CLASS.pending;
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
                    Criado em {formatDateTime(order.createdAt, { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <Badge className={`${statusClass} border`}>{statusLabel}</Badge>
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
                <DetailRow icon={Hash} label="ID" value={<CopyableId id={order.id} maxLength={12} />} />
                {order.customerName && (
                  <DetailRow icon={User} label="Cliente" value={order.customerName} />
                )}
                {order.customerEmail && (
                  <DetailRow icon={Mail} label="Email" value={order.customerEmail} />
                )}
                <DetailRow icon={Calendar} label="Criado em" value={formatDateTime(order.createdAt, { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })} />
                {order.updatedAt && (
                  <DetailRow icon={Calendar} label="Atualizado em" value={formatDateTime(order.updatedAt, { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })} />
                )}
              </div>
            </CardContent>
          </Card>
        </AnimatedEntry>
      </div>
    </div>
  );
}

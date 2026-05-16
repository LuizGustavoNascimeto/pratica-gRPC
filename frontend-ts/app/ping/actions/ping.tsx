/**
 * Descrição: Componente para verificar conectividade com o servidor gRPC
 * (envia um ping e mostra estado/latência).
 * Autor: Nome do Aluno
 * Data de criação: 2026-05-16
 * Última atualização: 2026-05-16
 */

"use client";

import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Radio, CheckCircle2, XCircle } from "lucide-react";
import { usePing } from "../hooks/usePing";

// ── stub functions – implement your gRPC logic here ──────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

const TIMEOUT_MS = 5_000;

export default function PingCard() {
  const { status, sendPing } = usePing();
  const [latency, setLatency] = useState<number | null>(null);

  /**
   * Executa um ping com timeout e mede a latência.
   */
  async function handlePing() {
    setLatency(null);
    const start = performance.now();

    const timeoutPromise = new Promise<boolean>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), TIMEOUT_MS),
    );

    try {
      const ok = await Promise.race([sendPing(), timeoutPromise]);
      setLatency(Math.round(performance.now() - start));
    } catch {
      setLatency(null);
    }
  }

  // ── derived UI values ──────────────────────────────────────────────────────
  const statusConfig = {
    idle: {
      label: "Disabled",
      variant: "secondary" as const,
      icon: null,
      color: "text-muted-foreground",
    },
    loading: {
      label: "Aguardando…",
      variant: "outline" as const,
      icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
      color: "text-muted-foreground",
    },
    success: {
      label: latency !== null ? `Resposta em ${latency} ms` : "OK",
      variant: "default" as const,
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    error: {
      label: "Sem resposta",
      variant: "destructive" as const,
      icon: <XCircle className="h-3.5 w-3.5" />,
      color: "text-destructive",
    },
  }[status];

  return (
    <Card className="w-full gap-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Radio className="h-4 w-4 text-muted-foreground" />
          gRPC Server
        </CardTitle>
        <CardDescription>
          Verifique a conectividade com o servidor :)
        </CardDescription>
        <CardAction>
          <Button
            size="lg"
            variant="default"
            onClick={handlePing}
            disabled={status === "loading"}
            className="px-4"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Enviando…
              </>
            ) : (
              "Ping"
            )}
          </Button>
        </CardAction>
      </CardHeader>

      <CardFooter className="flex items-center justify-between">
        <span className={`text-sm font-medium ${statusConfig.color}`}>
          Status
        </span>
        <Badge
          variant={statusConfig.variant}
          className="flex items-center gap-1.5"
        >
          {statusConfig.icon}
          {statusConfig.label}
        </Badge>
      </CardFooter>
    </Card>
  );
}

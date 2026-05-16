"use client";

import { useState } from "react";
import { pingClient } from "@/lib/network/client";
import type { PingRes } from "@/grpc/gen/ping_pb";
import { PingStatus } from "../types/status";

/**
 * Descrição: Hook para enviar ping ao servidor gRPC e gerenciar estado.
 * Autor: Nome do Aluno
 * Data de criação: 2026-05-16
 * Última atualização: 2026-05-16
 */
export function usePing() {
  // Estado do status do ping
  const [status, setStatus] = useState<PingStatus>("idle");

  /**
   * Envia um ping ao servidor gRPC.
   */
  const sendPing = async () => {
    try {
      setStatus("loading");
      const res: PingRes = await pingClient.ping({ message: "ping" });
      // (Opcional) analisar `res` se necessário
      setStatus("success");
    } catch (error) {
      console.error("Error calling ping service:", error);
      setStatus("error");
    }
  };

  return {
    sendPing,
    status,
    setStatus,
  };
}

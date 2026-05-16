"use client";

import { useState } from "react";
import { pingClient } from "@/lib/network/client";
import type { PingRes } from "@/grpc/gen/ping_pb";
import { PingStatus } from "../types/status";

export function usePing() {
  // State to hold the response message
  const [status, setStatus] = useState<PingStatus>("idle");

  // Function to call the ping service
  const sendPing = async () => {
    try {
      setStatus("loading");
      // Call the ping service and get the response
      const res: PingRes = await pingClient.ping({ message: "ping" });
      // Update the state with the response message
    } catch (error) {
      console.error("Error calling ping service:", error);
      setStatus("error");
    } finally {
      setStatus("success");
    }
  };

  return {
    sendPing,
    status,
    setStatus,
  };
}

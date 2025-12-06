"use client";
import React, { createContext, useEffect, useState, useMemo, useContext, useCallback } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "ws://localhost:9090";

type SocketCtx = {
  socket: Socket | null;
};

export const SocketCtx = createContext<SocketCtx | undefined>(undefined);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = io(SOCKET_URL, {
      path: "/io",
      transports: ["websocket"],
    });

    setSocket(s);

    const onConnect = () => console.log("[Socket] connected:", s.id);
    const onDisconnect = (reason: string) =>
      console.log("[Socket] disconnected:", reason);

    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);

    return () => {
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
      s.disconnect();
    };
  }, []);

  // useMemo prevents unnecessary rerenders
  const value = useMemo(() => ({ socket }), [socket]);

  return <SocketCtx.Provider value={value}>{children}</SocketCtx.Provider>;
};

type UseSocketOptions = {
  onEvent?: Record<string, (data: any) => void>;
};

export function useSocket(
  events: string[],
  opts: UseSocketOptions = {}
) {
  const ctx = useContext(SocketCtx);
  if (!ctx) throw new Error("useSocket must be used within a SocketProvider");

  const { socket } = ctx;

  const handleEvent = useCallback(
    (event: string, data: any) => {
      opts.onEvent?.[event]?.(data);
    },
    [opts.onEvent]
  );

  useEffect(() => {
    if (!socket) return;

    // Attach all event listeners
    const listeners = events.map((event) => {
      const handler = (data: any) => handleEvent(event, data);
      socket.on(event, handler);
      return { event, handler };
    });

    // Cleanup on unmount
    return () => {
      listeners.forEach(({ event, handler }) => {
        socket.off(event, handler);
      });
    };
  }, [socket, events, handleEvent]);

  // Emit helper
  const emit = useCallback(
    (event: string, payload: Record<string, any>) => {
      socket?.emit(event, payload);
    },
    [socket]
  );

  return { emit };
}

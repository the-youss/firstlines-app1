import { AppLayout } from "@/components/layouts/app-layout";
import { SocketProvider } from "@/hooks/use-socket";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SocketProvider>
      <AppLayout>{children}</AppLayout>
    </SocketProvider>
  )
}
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        <main className="py-8">{children}</main>
      </div>
    </ClerkProvider>
  );
}

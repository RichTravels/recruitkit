import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Header />
            <main className="py-8">
              {children}
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
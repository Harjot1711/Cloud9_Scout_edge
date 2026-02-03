import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { CommandPaletteProvider } from "@/components/command-palette";
import { KeyboardShortcutsProvider } from "@/components/keyboard-shortcuts";
import { ToastProvider } from "@/components/toast-provider";
import { RouteLoaderBar } from "@/components/loading-states";
import { DataSourceProvider } from "@/components/data-source-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ScoutEdge | Tactical Intelligence",
  description: "Automated scouting report generator for competitive esports. Generate data-backed tactical intelligence with evidence-first insights.",
  keywords: ["esports", "scouting", "valorant", "analytics", "tactical", "intelligence"],
  authors: [{ name: "ScoutEdge Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <DataSourceProvider>
            <CommandPaletteProvider>
              <KeyboardShortcutsProvider>
                <RouteLoaderBar />
                {children}
                <ToastProvider />
              </KeyboardShortcutsProvider>
            </CommandPaletteProvider>
          </DataSourceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


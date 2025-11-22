
import Navbar from "@/components/layout/NavBar";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";

export const metadata = {
  title: "Jumbo Dashboard",
  description: "User Management Assignment",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
        <ThemeProvider>
          <QueryProvider>
            <Navbar />
            <main className="p-6">{children}</main>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

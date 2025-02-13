import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProvider from "../../providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Impact Sense",
  description: "Generated by @osdk/create-app",
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div id="root-container">
          <div id="root">
            <ClientProvider>
            {children}
            </ClientProvider>
          </div>
        </div>
      </body>
    </html>
  );
}

export default RootLayout;

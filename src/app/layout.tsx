import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VINRelease — Title exception desk",
  description: "CALL-E-powered title exception resolution for auto dealerships.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

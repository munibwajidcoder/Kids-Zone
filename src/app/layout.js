import "./globals.css";
import AppLayout from "@/components/AppLayout";

export const metadata = {
  title: "Mini World - Learning Hub",
  description: "Learn ABC, Numbers, Rhymes, and Fun Activities! Exploring the world of knowledge one step at a time with fun and interactive activities.",
  robots: "index, follow",
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}

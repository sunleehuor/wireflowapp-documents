import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wireflow App – Visual Workflow Builder & Diagramming Tool",
  description:
    "Wireflow App helps you design, visualize, and manage workflows with intuitive flow diagrams. Simplify complex processes and turn your ideas into clear workflows.",
  keywords: [
    "Wireflow App",
    "React websocket",
    "React socket.io",
    "React socketio",
    "Vue socket.io",
    "Vue Websocket",
    "Vue socketio",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-white skip:dark:bg-gray-900`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

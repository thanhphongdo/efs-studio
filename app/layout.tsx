import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./fonts.css";
import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const theme = createTheme({});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Edge TTS",
  description: "The tool to make video",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MantineProvider defaultColorScheme="dark">
          <ModalsProvider>
            {children}
            <ToastContainer />
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}

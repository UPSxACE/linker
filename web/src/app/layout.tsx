import SingleThemeScript from "@/components/single-theme-script";
import QueryClientProvider from "@/contexts/query-client-provider";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { theme } from "../theme";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "AceHQ Central",
  description: "Check the status of all AceHQ apps",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-mantine-color-scheme="dark">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" forceColorScheme="dark" />
        <SingleThemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <QueryClientProvider>
          <MantineProvider
            theme={theme}
            defaultColorScheme="dark"
            forceColorScheme="dark"
          >
            {children}
          </MantineProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

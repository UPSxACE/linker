"use client";
import { Anchor, AppShellHeader as AppShellHeaderMantine } from "@mantine/core";
import clsx from "clsx";
import { Lexend } from "next/font/google";
import Link from "next/link";

const lexend = Lexend({
  weight: ["400"],
  subsets: ["latin"],
});

export default function AppShellHeader() {
  return (
    <AppShellHeaderMantine className="flex justify-center border-transparent">
      <div className="flex max-w-screen-md flex-1 items-center px-4">
        <div className="relative flex h-full flex-1 items-center overflow-hidden">
          <Anchor
            component={Link}
            href="/"
            className={clsx(
              "absolute flex flex-nowrap items-center text-4xl font-medium !no-underline",
              lexend.className,
            )}
          >
            AceHQ
          </Anchor>
        </div>
      </div>
    </AppShellHeaderMantine>
  );
}

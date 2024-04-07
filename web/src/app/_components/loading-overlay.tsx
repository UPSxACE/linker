"use client";
import { Lexend } from "next/font/google";

const lexend = Lexend({
  weight: ["400"],
  subsets: ["latin"],
});

import { Loader, Overlay } from "@mantine/core";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";

// @ts-ignore // NOTE problem with types from Mantine components
const MotionOverlay = motion(Overlay);
const MotionLoader = motion(Loader);

export default function LoadingOverlay({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        // @ts-ignore
        <MotionOverlay
          backgroundOpacity={1}
          fixed
          className={
            "flex flex-col items-center justify-center gap-2 bg-mantine-dark-8"
          }
        >
          <motion.h1
            className={clsx(
              "logo-font m-0 text-center font-sans text-[5rem] leading-none text-mantine-primary-3",
              lexend.className,
            )}
            exit={{
              translateY: -25,
              opacity: 0,
              transition: { duration: 0.35 },
            }}
          >
            AceHQ
          </motion.h1>

          <MotionLoader
            size="3.5rem"
            className="faster-spinner mt-3"
            color="dark.1"
            exit={{
              translateY: 25,
              opacity: 0,
              transition: { duration: 0.35 },
            }}
          />
        </MotionOverlay>
      )}
    </AnimatePresence>
  );
}

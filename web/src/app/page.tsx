"use client";
import { Button } from "@mantine/core";
import { animate, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import LoadingOverlay from "./_components/loading-overlay";

export default function HomePage() {
  const [visible, setVisible] = useState(true);
  const el = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
    }, 500);
    setTimeout(() => {
      animate(el.current, { opacity: 1 }, { duration: 5 });
    }, 1500);
  }, []);
  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-center">
      <LoadingOverlay visible={visible} />
      <motion.div
        ref={el}
        initial={{ opacity: 0, animationTimingFunction: "ease-out" }}
      >
        <h1>Hello World!</h1>
        <Button variant="outline" color="mainColor.4">
          Violet Button Hopefully
        </Button>
      </motion.div>
    </main>
  );
}

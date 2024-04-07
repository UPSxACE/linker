"use client";
import ColoredStatusBadge from "@/components/info-badges/colored-status-badge";
import VersionBadge from "@/components/info-badges/version-badge";
import Cell from "@/components/table/cell";
import HeaderCell from "@/components/table/header-cell";
import Row from "@/components/table/row";
import Table from "@/components/table/table";
import axios from "axios";
import clsx from "clsx";
import { animate, motion } from "framer-motion";
import { Lexend } from "next/font/google";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import AppShell from "./_components/app-shell";
import LoadingOverlay from "./_components/loading-overlay";

const lexend = Lexend({
  weight: ["400"],
  subsets: ["latin"],
});

export default function HomePage() {
  const [data, setData] = useState<null | any[]>(null);
  const [visible, setVisible] = useState(true);
  const el = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
    }, 500);
    setTimeout(() => {}, 1500);
  }, []);

  useEffect(() => {
    axios.get("http://localhost:1337/api/apps").then((res) => {
      setData(res.data.data);
      setVisible(false);
      setTimeout(() => {
        animate(el.current, { opacity: 1 }, { duration: 1 });
      }, 700);
    });
  }, []);

  return (
    <AppShell>
      <LoadingOverlay visible={visible} />
      <motion.div
        className="flex min-h-screen w-full flex-col items-center justify-center px-4"
        ref={el}
        initial={{ opacity: 0, animationTimingFunction: "ease-out" }}
      >
        {/* <AppShellHeader /> */}
        {/* <AppShellMain className="flex flex-col items-center"> */}
        <div className="flex w-full max-w-screen-md flex-1 flex-col items-center justify-center gap-6 px-4 py-4">
          <h1
            className={clsx(
              "m-0 text-5xl font-medium text-mantine-primary-4 !no-underline",
              lexend.className,
            )}
          >
            AceHQ
          </h1>
          <p className="m-0 text-center text-xl text-mantine-dark-1">
            Check the status of all the AceHQ apps.
          </p>
          <div className="flex w-full justify-center">
            <Table minWidth={650} maxWidth={800} className="mt-2">
              {/* Grow cells/rows IN HEIGHT(down) */}
              <Row>
                <HeaderCell className="flex-1">Name</HeaderCell>
                <HeaderCell className="flex-[1.5]">Version</HeaderCell>
                <HeaderCell className="flex-[2.5]">Url</HeaderCell>
                <HeaderCell className="flex-[1.5]">Status</HeaderCell>
              </Row>

              {data?.map((app, index) => {
                return (
                  <Row key={index}>
                    <Cell className="flex-1">
                      <span className="m-0">{app.attributes.name}</span>
                    </Cell>
                    <Cell className="flex-[1.5]">
                      <VersionBadge version={app.attributes.version} />
                    </Cell>
                    <Cell className="flex-[2.5]">
                      <Link
                        target="_blank"
                        href={app.attributes.url}
                        className="m-0 flex items-center gap-[0.35rem] text-white no-underline hover:underline"
                      >
                        {app.attributes.url
                          .replace("https://", "")
                          .replace("http://", "")}{" "}
                        <FiExternalLink className="rounded-md text-lg" />
                      </Link>
                    </Cell>
                    <Cell className="flex-[1.5]">
                      <ColoredStatusBadge status={app.attributes.status} />
                    </Cell>
                  </Row>
                );
              })}
            </Table>
          </div>
          <span>
            Coded by:{" "}
            <Link
              target="_blank"
              href="https://github.com/UPSxACE"
              className="text-white"
            >
              Ace
            </Link>
          </span>
        </div>
        {/* </AppShellMain> */}
      </motion.div>
    </AppShell>
  );
}

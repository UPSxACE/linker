"use client";

import { MantineColorsTuple, createTheme } from "@mantine/core";

// Violet
const mainColor: MantineColorsTuple = [
  "#f6ecff",
  "#e7d6fb",
  "#caabf1",
  "#ac7ce8",
  "#9354e0",
  "#833cdb",
  "#7b2eda",
  "#6921c2",
  "#5d1cae",
  "#501599"
];

export const theme = createTheme({
  /* Put your mantine theme override here */
  primaryColor: "mainColor",
  primaryShade: 4,
  colors: {
    mainColor,
  },
});

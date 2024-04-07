"use client";
import { AppShell as AppShellMantine } from "@mantine/core";
import {
  Context,
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

interface IAppShellContext {
  navbarCollapsed: boolean;
  setNavbarCollapsed: Dispatch<SetStateAction<boolean>>;
}

const defaultValue: IAppShellContext = {
  navbarCollapsed: false,
  setNavbarCollapsed: (action: SetStateAction<boolean>) => false,
};

export const AppShellContext: Context<IAppShellContext> =
  createContext(defaultValue);

export default function AppShell(props: { children: Readonly<ReactNode> }) {
  const [navbarCollapsed, setNavbarCollapsed] = useState(false);

  return (
    <AppShellContext.Provider
      value={{
        navbarCollapsed,
        setNavbarCollapsed,
      }}
    >
      <AppShellMantine
        header={{ height: 100 }}
        navbar={{
          width: 300,
          breakpoint: "xs",
          collapsed: { mobile: true, desktop: true },
        }}
        padding={0}
        className="bg-mantine-dark-8"
      >
        {props.children}
      </AppShellMantine>
    </AppShellContext.Provider>
  );
}

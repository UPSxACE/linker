import clsx from "clsx";

export default function VersionBadge({ version }: { version: string }) {
  function getColor() {
    if (version.includes("alpha")) {
      return "bg-[#b52e2e]";
    }

    if (version.includes("beta")) {
      return "bg-[#2e72b5]";
    }

    return "bg-[#308d47]";
  }

  return (
    <div
      className={clsx(
        "flex select-none items-center gap-1 rounded-lg px-3 py-1 text-center text-sm",
        getColor(),
      )}
    >
      {version}
    </div>
  );
}

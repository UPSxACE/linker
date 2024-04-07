import clsx from "clsx";

export default function ColoredStatusBadge({ status }: { status: number }) {
  function getStatus() {
    if (status === 1) {
      return { color: "bg-[#b52e2e]", text: "Offline" };
    }

    if (status === 2) {
      return { color: "bg-[#9b571b]", text: "Maintenance" };
    }

    if (status === 3) {
      return { color: "bg-[#308d47]", text: "Online" };
    }

    return { color: "bg-mantine-dark-6", text: "Unknown" };
  }
  const { color, text } = getStatus();

  return (
    <div
      className={clsx(
        "flex select-none items-center gap-1 rounded-lg px-2 py-1 pr-[0.80rem] text-sm",
        color,
      )}
    >
      {text}
    </div>
  );
}
